const playermodel = require('../../models/Player/player_model');    
const teammodel = require('../../models/Team/team_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');
const inningmodel = require('../../models/Inning/inning_detail_model');
const playerongroundmodel = require('../../models/Player/player_on_ground_models');

const playerOnGround = async (req, res) => {
    try {
        const accessToken = req.headers.authorization;
        if(!accessToken || !accessToken.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = accessToken.split(' ')[1];
        const userToken = await tokenmodel.findOne({ accessToken: token });
        if (!userToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const userEmail = userToken.user.username.toLowerCase();
        const user = await usermodel.findOne({ email: userEmail });
        if (!user) {
            return res.status(401).json({ message: 'Invalid user' });
        }
        const {striker_id, non_striker_id, inning_id, batsman_run_count, is_four, is_six, out_status, ball_count_faced_by_batsman, bowler_id, bowler_wicket_count, bowler_over_count, bowler_run_count, maiden_over_count, ball_count_faced_by_bowler} = req.body;
        
        const inningId = await inningmodel.findOne({inning_id: inning_id});
        console.log("InningId:::::::",inningId)
        if (!inningId) {
            return res.status(404).json({ message: 'Inning not Started' });
        }
        if (striker_id === non_striker_id) {
            return res.status(400).json({ message: 'Striker and non-striker cannot be same' });
        }
        if (striker_id === bowler_id) {
            return res.status(400).json({ message: 'Striker and bowler cannot be same' });
        }
        if (non_striker_id === bowler_id) {
            return res.status(400).json({ message: 'Non-striker and bowler cannot be same' });
        }
        const striker = await playermodel.findOne({ player_id: striker_id });
        if (!striker) {
            return res.status(404).json({ message: 'Striker not found' });
        }
        const nonStriker = await playermodel.findOne({ player_id: non_striker_id });
        if (!nonStriker) {
            return res.status(404).json({ message: 'Non-striker not found' });
        }
        if (!striker.team_id.equals(nonStriker.team_id)) {
            return res.status(400).json({ message: 'Striker and non-striker must be in same team1' });
        }
        if (striker.team_id.equals(bowler_id.team_id)) {
            return res.status(400).json({ message: 'Striker and bowler should not be in the same team' });
        }
        if (nonStriker.team_id.equals(bowler_id.team_id)) {
            return res.status(400).json({ message: 'Non-striker and bowler should not be in same team' });
        }
        const strikerFound = await playerongroundmodel.findOne({striker_id: striker_id});
        console.log("StrikerFound:::::::",strikerFound)
        const playerOnGroundData = new playerongroundmodel({
            striker_id: striker_id,
            nonStriker_id: non_striker_id,
            inning_id: inning_id,
            batsman_run_count: batsman_run_count,
            is_four: is_four,
            is_six: is_six,
            out_status: out_status,
            ball_count_faced_by_batsman: ball_count_faced_by_batsman,
            bowler_id: bowler_id,
            bowler_wicket_count: bowler_wicket_count,
            bowler_over_count: bowler_over_count,
            bowler_run_count: bowler_run_count,
            maiden_over_count: maiden_over_count,
            ball_count_faced_by_bowler: ball_count_faced_by_bowler
        });

        if (!strikerFound) {
            console.log("PlayerOnGroundData*******If Block:::",playerOnGroundData)
            const playerOnGround = await playerOnGroundData.save();
            console.log("PlayerOnGroundData:::",playerOnGround)
            if(!playerOnGround) {
                return res.status(400).json({ message: 'Player on ground not added' });
            }
            return res.status(201).json({ message: 'Player on ground added successfully', playerOnGround });
        }else {
            console.log("PlayerOnGroundData*******Else Block:::",playerOnGroundData)
            strikerFound.inning_id = playerOnGroundData.inning_id;
            strikerFound.batsman_run_count = playerOnGroundData.batsman_run_count;
            strikerFound.is_four = playerOnGroundData.is_four;
            strikerFound.is_six = playerOnGroundData.is_six;
            strikerFound.out_status = playerOnGroundData.out_status;
            strikerFound.ball_count_faced_by_batsman = playerOnGroundData.ball_count_faced_by_batsman,
            strikerFound.bowler_id = playerOnGroundData.bowler_id,
            strikerFound.bowler_wicket_count = playerOnGroundData.bowler_wicket_count,
            strikerFound.bowler_over_count = playerOnGroundData.bowler_over_count,
            strikerFound.bowler_run_count = playerOnGroundData.bowler_run_count,
            strikerFound.maiden_over_count = playerOnGroundData.maiden_over_count,
            strikerFound.ball_count_faced_by_bowler = playerOnGroundData.ball_count_faced_by_bowler
            console.log("StrikerFound:::::::",strikerFound)
            await strikerFound.save();
            if (out_status === true) {
                return res.status(400).json({ message: 'Striker is out please change player' })
            }else {
                return res.status(200).json({ message: 'Player on ground updated successfully', playerOnGroundData });
            }
            
        }
        
    }catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = playerOnGround


// const playerOnGround = async (req, res) => {
//     try {
//         const accessToken = req.headers.authorization;
//         if (!accessToken || !accessToken.startsWith('Bearer ')) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
        
//         const token = accessToken.split(' ')[1];
//         const userToken = await tokenmodel.findOne({ accessToken: token });
//         if (!userToken) {
//             return res.status(401).json({ message: 'Invalid token' });
//         }
        
//         const userEmail = userToken.user.username.toLowerCase();
//         const user = await usermodel.findOne({ email: userEmail });
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid user' });
//         }
        
//         const {
//             striker_id,
//             non_striker_id,
//             inning_id,
//             batsman_run_count,
//             is_four,
//             is_six,
//             out_status,
//             ball_count_faced_by_batsman,
//             bowler_id,
//             bowler_wicket_count,
//             bowler_over_count,
//             bowler_run_count,
//             maiden_over_count,
//             ball_count_faced_by_bowler
//         } = req.body;
        
//         const inning = await inningmodel.findOne({ inning_id });
//         if (!inning) {
//             return res.status(404).json({ message: 'Inning not found' });
//         }
        
//         if (striker_id === non_striker_id) {
//             return res.status(400).json({ message: 'Striker and non-striker cannot be the same' });
//         }
        
//         const [striker, nonStriker] = await Promise.all([
//             playermodel.findOne({ player_id: striker_id }),
//             playermodel.findOne({ player_id: non_striker_id })
//         ]);

//         if (!striker || !nonStriker) {
//             return res.status(404).json({ message: 'Player(s) not found' });
//         }
        
//         if (striker.team_id !== nonStriker.team_id || striker.team_id !== inning.team_id) {
//             return res.status(400).json({ message: 'Striker, non-striker, and inning must be related' });
//         }
        
//         if (out_status === true) {
//             return res.status(400).json({ message: 'Striker is out, please change player' });
//         }

//         let playerOnGroundData = await playerongroundmodel.findOne({ striker_id });

//         if (!playerOnGroundData) {
//             playerOnGroundData = new playerongroundmodel({
//                 striker_id,
//                 non_striker_id,
//                 inning_id,
//                 batsman_run_count,
//                 is_four,
//                 is_six,
//                 out_status,
//                 ball_count_faced_by_batsman,
//                 bowler_id,
//                 bowler_wicket_count,
//                 bowler_over_count,
//                 bowler_run_count,
//                 maiden_over_count,
//                 ball_count_faced_by_bowler
//             });

//             await playerOnGroundData.save();
//             return res.status(201).json({ message: 'Player on ground added successfully', playerOnGroundData });
//         } else {
//             playerOnGroundData.set({
//                 striker_id,
//                 non_striker_id,
//                 inning_id,
//                 batsman_run_count,
//                 is_four,
//                 is_six,
//                 out_status,
//                 ball_count_faced_by_batsman,
//                 bowler_id,
//                 bowler_wicket_count,
//                 bowler_over_count,
//                 bowler_run_count,
//                 maiden_over_count,
//                 ball_count_faced_by_bowler
//             });

//             await playerOnGroundData.save();
//             return res.status(200).json({ message: 'Player on ground updated successfully', playerOnGroundData });
//         }
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// };

// module.exports = playerOnGround;

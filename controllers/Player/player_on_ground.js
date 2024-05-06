const playermodel = require('../../models/Player/player_model');    
const teammodel = require('../../models/Team/team_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');
const matchmodel = require('../../models/Match/match_info_model');
const ongroundplayerofteammodel = require('../../models/Player/on_ground_player_of_team_model')
const scoremodel = require('../../models/Score/score_model');
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

        const {striker_id, non_striker_id, batsman_run_count, four_count, six_count, out_status, ball_count_faced_by_batsman, bowler_id, bowler_wicket_count, bowler_over_count, bowler_run_count, maiden_over_count, ball_count_faced_by_bowler, current_status, last_run, match_id, is_both_inning_completed, is_first_inning} = req.body;
        console.log("req.body***********: ", req.body);
        const strikerId = await ongroundplayerofteammodel.findOne({player_id: striker_id});
        const nonStrikerId = await ongroundplayerofteammodel.findOne({player_id: non_striker_id});
        const bowlerId = await ongroundplayerofteammodel.findOne({player_id: bowler_id});
        const matchId = await matchmodel.findOne({match_id: match_id});
        
        console.log("StrikerId: ",strikerId.team_id);
        console.log("NonStrikerId: ",nonStrikerId.team_id);
        // console.log("BowlerId: ",bowlerId);
        // console.log("MatchId: ",matchId);
        console.log("Check Condition of striker and non stiker team: ", !strikerId.team_id.equals(nonStrikerId.team_id))

        if(strikerId == nonStrikerId) {
            return res.status(400).json({ message: 'Striker and non-striker cannot be same' });
        }else if (strikerId == bowlerId) {
            return res.status(400).json({ message: 'Striker and bowler cannot be same' });
        }else if (nonStrikerId == bowlerId) {
            return res.status(400).json({ message: 'Non-striker and bowler cannot be same' });
        }else if(!strikerId || !nonStrikerId || !bowlerId) {
            return res.status(400).json({ message: 'Invalid player id' });
        }else if (!matchId) {
            return res.status(400).json({ message: 'Invalid match id' });
        }else if (!strikerId.team_id.equals(nonStrikerId.team_id)) {
            return res.status(400).json({ message: 'Striker and non-striker must be in same team' });
        }else if (strikerId.team_id === bowlerId.team_id) {
            return res.status(400).json({ message: 'Striker and bowler should not be in the same team' });
        }else if (nonStrikerId.team_id === bowlerId.team_id) {
            return res.status(400).json({ message: 'Non-striker and bowler should not be in same team' });
        }

        const groundScore = new playerongroundmodel({
            player_id: striker_id,
            non_striker_id: non_striker_id,
            batsman_run_count: batsman_run_count,
            four_count: four_count,
            six_count: six_count,
            out_status: out_status,
            ball_count_faced_by_batsman: ball_count_faced_by_batsman,
            bowler_id: bowler_id,
            bowler_wicket_count: bowler_wicket_count,
            bowler_over_count: bowler_over_count,
            bowler_run_count: bowler_run_count,
            maiden_over_count: maiden_over_count,
            ball_count_faced_by_bowler: ball_count_faced_by_bowler,
            current_status: current_status,
            last_run: last_run,
            match_id: match_id,
            is_both_inning_completed: is_both_inning_completed,
            is_first_inning: is_first_inning
        });

        const playerArray = [striker_id, non_striker_id, bowler_id];
        console.log("Player Array: ", playerArray);

        for (let i = 0; i < playerArray.length; i++) {
            const coreplayer = await playermodel.findOne({ player_id: playerArray[i] });
            let groundplayer = await ongroundplayerofteammodel.findOne({ player_id: playerArray[i] });
    
            console.log("core player: ", coreplayer);
            console.log("ground player: ", groundplayer);
    
            if (!coreplayer || !groundplayer) {
                return res.status(400).json({ message: 'Invalid player id' });
            } else if (!coreplayer.team_id.equals(groundplayer.team_id)) {
                return res.status(400).json({ message: 'Player must be in same team' });
            }

            let ScoreObjectExist = await scoremodel.findOne({ player_id: groundplayer.player_id });
            if (!ScoreObjectExist) {
                return res.status(400).json({ message: 'Score object not found' });
            }
    
            let playerRole = ""
            if (i == 0) {
                playerRole = "Striker"
                ScoreObjectExist.player_role = playerRole;
                ScoreObjectExist.batsman_run_count = batsman_run_count;
                ScoreObjectExist.four_count = four_count;
                ScoreObjectExist.six_count = six_count;
                ScoreObjectExist.ball_count_played_by_batsman = ball_count_faced_by_batsman;
            } else if (i == 1) {
                playerRole = "Non-Striker"
            } else if (i == 2) {
                playerRole = "Bowler"
                ScoreObjectExist.player_role = playerRole;
                ScoreObjectExist.bowler_wicket_count = bowler_wicket_count;
                ScoreObjectExist.bowler_over_count = bowler_over_count;
                ScoreObjectExist.bowler_run_count = bowler_run_count;
                ScoreObjectExist.maiden_over_count = maiden_over_count;
                ScoreObjectExist.ball_count_played_by_bowler = ball_count_faced_by_bowler;
            }
            console.log("Updated Score Object : ", ScoreObjectExist);
    
            // Save ScoreObjectExist
            await ScoreObjectExist.save();
    
            console.log('Score Object: ', ScoreObjectExist);
            console.log("Score Object id: ", ScoreObjectExist.score_id);
    
            groundplayer.score_obj_id = ScoreObjectExist.score_id;
            groundplayer.is_first_inning = is_first_inning;
            groundplayer.outStatus = out_status;
            groundplayer.is_both_inning_completed = is_both_inning_completed;
    
            console.log("Ground Player : ", groundplayer);
    
            await groundplayer.save();
            console.log("Hello")
    
            console.log("On Ground Player Of Team Obj: ", groundplayer);
        }
        await groundScore.save();
        return res.status(201).json({ message: 
        "Player updated successfully", groundScore });
    }catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = playerOnGround;

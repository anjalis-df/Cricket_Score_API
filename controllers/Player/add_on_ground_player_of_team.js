const teammodel = require('../../models/Team/team_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');
const playerOnGroundmodel = require('../../models/Player/on_ground_player_of_team_model');
const playermodel = require('../../models/Player/player_model');
const matchmodel = require('../../models/Match/match_info_model');
const scoremodel = require('../../models/Score/score_model');


const addOnGroundPlayerOfTeam = async (req, res) => {

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
        // console.log("HELLO****************")
        const{ batting, bowling, match_id } = req.body;
        console.log("req.body***********: ", req.body);
        // console.log("batting: ", batting);
        // console.log("bowling: ", bowling);
        if(!Array.isArray(batting) || !Array.isArray(bowling)) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const isBattingArrayEmpty = batting.length === 0;
        const isBowlingArrayEmpty = bowling.length === 0;

        if(isBattingArrayEmpty && isBowlingArrayEmpty) {
            return res.status(400).json({ message: 'Array should not be empty' });
        }

        const isBattingPlayerExist = await playermodel.find({ player_mobile_no: { $in: batting.map(player => player.player_mobile_no) } });
        const isBowlingPlayerExist = await playermodel.find({ player_mobile_no: { $in: bowling.map(player => player.player_mobile_no) } });

        // console.log("Given Batting Player Array: ", batting);
        // console.log("Given Bowling Player Array: ", bowling);
        // console.log("Given batting Player array length: ", isBattingPlayerExist.length);
        // console.log("Given bowling Player array length: ", isBowlingPlayerExist.length);

        if (isBattingPlayerExist.length !== batting.length || isBowlingPlayerExist.length !== bowling.length) {
            return res.status(400).json({ message: 'Invalid player mobile number' });
        }

        const checkBattingPlayerId = await playermodel.find({ player_id: { $in: batting.map(player => player.player_id) } });
        const checkBowlingPlayerId = await playermodel.find({ player_id: { $in: bowling.map(player => player.player_id) } });

        if (checkBattingPlayerId.length !== batting.length || checkBowlingPlayerId.length !== bowling.length) {
            return res.status(400).json({ message: 'Invalid player id' });
        }

        const isMatchExist = await matchmodel.findOne({ match_id: match_id });
        // console.log("Is Match Exist: ", isMatchExist);
        // console.log("Is Batting Player Exist 0: ", isBattingPlayerExist);
        // console.log("Is Bowling Player Exist 0: ", isBowlingPlayerExist);
        
        if (!isMatchExist) {
            return res.status(400).json({ message: 'Match does not exist' });
        }
        if (!isMatchExist.user_id === user.user_id) {
            return res.status(400).json({ message: 'You are not authorized to add player on ground' });
        }

        const battingTeamInMatch = isMatchExist.batting_team_id;
        const bowlingTeamInMatch = isMatchExist.bowling_team_id;

        const isBattingTeamExist = await teammodel.findOne({ team_id: battingTeamInMatch });
        const isBowlingTeamExist = await teammodel.findOne({ team_id: bowlingTeamInMatch });

        // console.log("Is Batting Player Exist 1: ", isBattingPlayerExist);
        // console.log("Is Bowling Player Exist 1: ", isBowlingPlayerExist);

        if (!isBattingTeamExist || !isBowlingTeamExist) {
            return res.status(400).json({ message: 'Team does not exist ' });
        }

        if (!isBattingTeamExist || !isBowlingTeamExist) {
            return res.status(400).json({ message: 'Team does not exist ' });
        }

        // console.log("####################")
        const names = new Set();
        const contactNumber = new Set();

        for(const player of batting) {
            if(names.has(player.player_name) || contactNumber.has(player.player_mobile_no)) {
                return res.status(400).json({ message: 'Name and contact number should be unique' });
            }
            names.add(player.player_name);
        }

        for(const player of bowling) {
            if(names.has(player.player_name) || contactNumber.has(player.player_mobile_no)) {
                return res.status(400).json({ message: 'Name and contact number should be unique' });
            }
            names.add(player.player_name);
        }

        const playerOnGroundObjects = [];
        const playerscoreObjects = [];


        for(const player of batting) {
            const team = await teammodel.findOne({ team_id: player.team_id });
            console.log("Batting team id: ", battingTeamInMatch);
            console.log("plyaer Team id: ", player.team_id);
            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            }else if (!battingTeamInMatch.equals(player.team_id)) {
                return res.status(400).json({ message: 'Batting team does not match' });    
            }else if (!team.user_id.equals(user.user_id)) {
                return res.status(401).json({ message: 'Unauthorized 1' });
            }
            const addPlayer = new playerOnGroundmodel({
                player_id: player.player_id,
                team_id: player.team_id,
                match_id: match_id,
            })
             if (!addPlayer.team_id.equals(team.team_id)) {
                return res.status(401).json({ message: 'Unauthorized 4' });
            }

            const scoreObject = new scoremodel({
                player_id: player.player_id,
                player_role: 'Non-Striker',
                batsman_run_count: 0,
                is_four: false,
                is_six: false,
                ball_count_played_by_batsman: 0,
                bowler_wicket_count: 0,
                bowler_over_count: 0,
                bowler_run_count: 0,
                maiden_over_count: 0,
                ball_count_played_by_bowler: 0
            });

            addPlayer.score_obj_id = scoreObject.score_id;
            addPlayer.is_first_inning = false;
            addPlayer.outStatus = false;
            addPlayer.is_both_inning_completed = false;

            playerscoreObjects.push(scoreObject);
            playerOnGroundObjects.push(addPlayer);
        }

        for(const player of bowling) {
            
            const team = await teammodel.findOne({ team_id: player.team_id });
            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            }else if (!bowlingTeamInMatch.equals(player.team_id)) {
                return res.status(400).json({ message: 'Bowling team does not match' });    
            }else if (!team.user_id.equals(user.user_id)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const addPlayer = new playerOnGroundmodel({
                player_id: player.player_id,
                team_id: player.team_id,
                match_id: match_id,
            })
            if (!addPlayer.team_id.equals(team.team_id)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const scoreObject = new scoremodel({
                player_id: player.player_id,
                player_role: 'Non-Striker',
                batsman_run_count: 0,
                is_four: false,
                is_six: false,
                ball_count_played_by_batsman: 0,
                bowler_wicket_count: 0,
                bowler_over_count: 0,
                bowler_run_count: 0,
                maiden_over_count: 0,
                ball_count_played_by_bowler: 0
            });

            addPlayer.score_obj_id = scoreObject.score_id;
            addPlayer.is_first_inning = false;
            addPlayer.outStatus = false;
            addPlayer.is_both_inning_completed = false;

            playerscoreObjects.push(scoreObject);
            playerOnGroundObjects.push(addPlayer);
        }
        // console.log("Player Score Objects: ", playerscoreObjects);
        // console.log("Player On Ground Objects: ", playerOnGroundObjects);

        const scoreModelResult = await scoremodel.insertMany(playerscoreObjects);
        const playerOnGroundawait = await playerOnGroundmodel.insertMany(playerOnGroundObjects);


        res.status(200).json({ message: 'Player added successfully', batting, bowling });

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }

}

module.exports = addOnGroundPlayerOfTeam;

        



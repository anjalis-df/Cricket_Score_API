const playermodel = require('../../models/Player/player_model');
const teammodel = require('../../models/Team/team_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');
const matchmodel = require('../../models/Match/match_info_model');
const matchresultmodel = require('../../models/Match/match_result_model')

const addMatchResult = async (req, res) => {

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
        
        const {match_id, match_result, team_1id, team_2id, match_date, winning_team_id, win_by_runs, win_by_wickets} = req.body;

        const match = await matchmodel.findOne({ match_id: match_id });
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        const team1 = await teammodel.findOne({ team_id: team_1id });
        if (!team1) {
            return res.status(404).json({ message: 'Team 1 not found' });
        }

        const team2 = await teammodel.findOne({ team_id: team_2id });
        if (!team2) {
            return res.status(404).json({ message: 'Team 2 not found' });
        }
        console.log("Winning Team ID: ", winning_team_id, "Team 1 ID: ", team_1id, "Team 2 ID: ", team_2id);

        if (winning_team_id !== team_1id && winning_team_id !== team_2id) {
            return res.status(400).json({ message: 'Invalid winning team' });
        }
        console.log("*******************")
        if (!team1.user_id.equals(user.user_id) || !team2.user_id.equals(user.user_id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        console.log("@@@@@@@@@@@@@@")
        const matchResult = new matchresultmodel({
            match_id: match_id,
            // match_result: match_result,
            user_id: user.user_id,
            team_1id: team_1id,
            team_2id: team_2id,
            // match_date: match_date,
            winning_team_id: winning_team_id,
            win_by_runs: win_by_runs,
            win_by_wickets: win_by_wickets
        })

        await matchResult.save();

        res.status(201).json(matchResult);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = addMatchResult
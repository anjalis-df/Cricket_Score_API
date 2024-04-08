const matchmodel = require('../../models/Match/match_info_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');
const teammodel = require('../../models/Team/team_model');
const playermodel = require('../../models/Player/player_model');

const addMatchDetail = async (req, res) => {
    try {
        console.log("Rquest Body: ", req.body);
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
        const team = await teammodel.find({ user_id: user.user_id });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        if (team.length < 2) {
            return res.status(400).json({ message: 'Not enough teams' });
        }
        
        const { toss_winning_team_id, winning_team_selection, total_over, batting_team_id, bowling_team_id, number_of_player_in_both_team } = req.body;
        const toss_winning_teamid = await teammodel.findOne({ team_id: toss_winning_team_id });
        const batting_teamid = await teammodel.findOne({ team_id: batting_team_id });
        const bowling_teamid = await teammodel.findOne({ team_id: bowling_team_id });

        const players_of_batting_team = await playermodel.find({ team_id: batting_team_id });
        const players_of_bowling_team = await playermodel.find({ team_id: bowling_team_id });

        if (players_of_batting_team.length < number_of_player_in_both_team || players_of_bowling_team.length < number_of_player_in_both_team) {
            return res.status(400).json({ message: 'Not enough players' });
        }
        if (!players) {
            return res.status(404).json({ message: 'Player not found' });
        }
        const match_info = new matchmodel({
            user_id: user.user_id,
            toss_winning_team_id: toss_winning_team_id,
            winning_team_selection: winning_team_selection,
            total_over: total_over,
            batting_team_id: batting_team_id,
            bowling_team_id: bowling_team_id,
            number_of_player_in_both_team: number_of_player_in_both_team
        })

        if(!toss_winning_teamid || !batting_teamid || !bowling_teamid) {
            return res.status(404).json({ message: 'Invalid team id' });
        }
        if (!toss_winning_teamid.user_id.equals(user.user_id) || !batting_teamid.user_id.equals(user.user_id) || !bowling_teamid.user_id.equals(user.user_id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const result = await match_info.save();
        res.status(200).json({ message: 'Match detail added successfully', match: result });

    } catch (err) {
        res.status(400).json(err);
    }

}

module.exports = addMatchDetail;
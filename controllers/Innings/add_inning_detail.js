const matchmodel = require('../../models/Match/match_info_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');
const teammodel = require('../../models/Team/team_model');
const inningsmodel = require('../../models/Inning/inning_detail_model');

const add_inning_detail = async (req, res) => {
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
        const {match_id, team_id, total_wickets, total_runs, total_overs, is_first_inning, is_both_inning_complete} = req.body;
        const match = await matchmodel.findOne({ match_id: match_id });
        const team = await teammodel.findOne({ team_id: team_id });
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        if (!team.user_id.equals(user.user_id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (total_wickets < 0 || total_runs < 0 || total_overs < 0) {
            return res.status(400).json({ message: 'Total wickets, runs and overs cannot be negative' });
        }
        if (total_wickets > match.number_of_player_in_both_team) {
            return res.status(400).json({ message: 'Total wickets cannot be more than number of players in both teams' });
        }
        console.log("Inning: ", is_first_inning &&is_both_inning_complete);
        if (!is_first_inning && is_both_inning_complete) {
            return res.status(400).json({ message: 'Both innings are already completed' });
        }
        const result = await inningsmodel.create({
            match_id: match_id,
            team_id: team_id,
            total_wickets: total_wickets,
            total_runs: total_runs,
            total_overs: total_overs,
            is_first_inning: is_first_inning,
            is_both_inning_complete: is_both_inning_complete
        })
        res.status(200).json({ message: 'Inning detail added successfully', result: result });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = add_inning_detail
const playermodel = require('../../models/Player/player_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');
const teammodel = require('../../models/Team/team_model');

const deletePlayerbyId = async (req, res) => {
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
        const { player_mobile_no, team_id } = req.body;
        const player = await playermodel.findOne({ player_mobile_no: player_mobile_no });
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        const team = await teammodel.findOne({ team_id: team_id });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        if (!team.user_id.equals(user.user_id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if(!player.team_id.equals(team.team_id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const result = await playermodel.deleteOne({ player_mobile_no: player_mobile_no });
        res.status(200).json({ message: 'Player deleted successfully', player: result });
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = deletePlayerbyId
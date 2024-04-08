const teamModel = require('../../models/Team/team_model');
const tokenModel = require('../../models/User/token_model');
const userRegistrationModel = require('../../models/User/user_info_model');
const playermodel = require('../../models/Player/player_model');

const deleteTeam = async (req, res) => {
    try {
        const accessToken = req.headers.authorization;
        if(!accessToken || !accessToken.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = accessToken.split(' ')[1];
        const userToken = await tokenModel.findOne({ accessToken: token });
        if (!userToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const userEmail = userToken.user.username.toLowerCase();
        const user = await userRegistrationModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(401).json({ message: 'Invalid user' });
        }
        const { team_id } = req.body;
        const team = await teamModel.findOne({ team_id: team_id });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        console.log("Check: ", team.user_id !==user.user_id)
        if (!team.user_id.equals(user.user_id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const player = await playermodel.findOne({ team_id: team_id });
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        await playermodel.deleteOne({ team_id: team_id });
        await teamModel.deleteOne({ team_id: team_id });
        res.status(200).json({ message: 'Team deleted successfully' });
}
catch (err) {
    res.status(400).json(err);
}
};

module.exports = deleteTeam;
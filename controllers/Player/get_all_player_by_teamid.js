const teammodel = require('../../models/Team/team_model');
const playermodel = require('../../models/Player/player_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');

const getAllPlayerByTeamId = async (req, res) => {
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
        // const { team_id } = req.body;
        const team_id = req.params.id;
        console.log("Request param: ", req.params.id);
        const team = await teammodel.findOne({ team_id: team_id });
        console.log("Team: ", team);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        if (!team.user_id.equals(user.user_id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const players = await playermodel.find({ team_id: team_id });
        res.status(200).json({ message: 'Players fetched successfully', players: players });
    } catch (err) {
        res.status(400).json(err);
    }

}

module.exports = getAllPlayerByTeamId
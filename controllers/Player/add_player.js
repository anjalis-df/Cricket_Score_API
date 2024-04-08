const teammodel = require('../../models/Team/team_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');
const playermodel = require('../../models/Player/player_model');

const addPlayer = async (req, res) => {
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
        const { team_id, player_name, player_mobile_no, player_role } = req.body;
        console.log("Request Body: ", req.body);
        const addPlayer = new playermodel({
            player_name: player_name,
            team_id: team_id,
            player_mobile_no: player_mobile_no,
            player_role: player_role
        })
        console.log("*****: ", addPlayer);
        const existingPlayer = await playermodel.findOne({ player_mobile_no: player_mobile_no });
        console.log("Existing Player: ", existingPlayer);
        if (existingPlayer) {
            return res.status(400).json({ message: 'Player already exists' });
        }

        const team = await teammodel.findOne({ team_id: team_id });
        console.log("Team: ", team);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        console.log("Check team : ", team.user_id.equals(user.user_id))
        if (!team.user_id.equals(user.user_id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        console.log("Check Player by ==: ", addPlayer.team_id === team.team_id);
        console.log("Check player: ", addPlayer.team_id.equals(user.user_id))
        if (!addPlayer.team_id.equals(team.team_id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const result = await addPlayer.save();
        res.status(200).json({ message: 'Player added successfully', player: result });
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = addPlayer;
const teamModel = require('../../models/Team/team_model');
const tokenModel = require('../../models/User/token_model');
const userRegistrationModel = require('../../models/User/user_info_model');

const addTeam = async (req, res) => {
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
        const { team_name, team_place } = req.body;
        const team = new teamModel({
            user_id: user.user_id,
            team_name: team_name,
            team_place: team_place

        })
        const existingTeam = await teamModel.findOne({ team_id: team.team_id }).lean().exec();
        if(existingTeam) {
            return res.status(400).json({ message: 'Team already exists' });
        }
        const existingTeamName = await teamModel.findOne({ team_name: team.team_name }).lean().exec();
        if(existingTeamName) {
            return res.status(400).json({ message: 'Team name already exists' });
        }
        const result = await team.save();
        res.status(201).json({message: 'Team created successfully', team: result});
}catch (err) {
    return res.status(400).json({ message: err.message });
}};
module.exports = addTeam;
const teammodel = require('../../models/Team/team_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');
const playermodel = require('../../models/Player/player_model');

const addPlayerArray = async (req, res) => {
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
        const { players } = req.body;
        if (!Array.isArray(players)) {
            return res.status(400).json({ message: 'Players should be an array' });
        }
        const checkPlayersArrayIsEmptyOrNot = players.length === 0;
        if (checkPlayersArrayIsEmptyOrNot) {
            return res.status(400).json({ message: 'Players array is empty, Please enter atleast one player' });
        }
        console.log("********: req body ", req.body)
        const isPlayerExist = await playermodel.find({ player_mobile_no: { $in: players.map(player => player.player_mobile_no) } });
        const names = new Set();
        const contactNumber = new Set();
        for(const player of players) {
            if(names.has(player.player_name) || contactNumber.has(player.player_mobile_no)) {
                return res.status(400).json({ message: 'Name and contact number should be unique' });
            }
            names.add(player.player_name);
            contactNumber.add(player.player_mobile_no);
        }
        if (isPlayerExist.length > 0) {
            return res.status(400).json({ message: 'Player already exists' });
        }
        const playerObjects = [];
        let count = 0;
        while (players.length > 0) {
            const player = players.shift();
            const addPlayer = new playermodel({
                player_name: player.player_name,
                team_id: player.team_id,
                player_mobile_no: player.player_mobile_no,
            })
            const team = await teammodel.findOne({ team_id: player.team_id });
            if (!team) {
                return res.status(404).json({ message: 'Team not found' });
            }else if (!team.user_id.equals(user.user_id)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }else if (!addPlayer.team_id.equals(team.team_id)) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            playerObjects.push(addPlayer);
            console.log("playerObjects*********: ", playerObjects);
            count += 1;
        }
        console.log("Outside the loop *********")
        const result = await playermodel.insertMany(playerObjects);
        res.status(200).json({ message: 'Player added successfully', player: result });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = addPlayerArray;
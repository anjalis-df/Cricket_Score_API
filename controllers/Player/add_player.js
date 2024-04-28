const teammodel = require('../../models/Team/team_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');
const playermodel = require('../../models/Player/player_model');

// const addPlayer = async (req, res) => {
//     try {
//         const accessToken = req.headers.authorization;
//         if(!accessToken || !accessToken.startsWith('Bearer ')) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//         const token = accessToken.split(' ')[1];
//         const userToken = await tokenmodel.findOne({ accessToken: token });
//         if (!userToken) {
//             return res.status(401).json({ message: 'Invalid token' });
//         }
//         const userEmail = userToken.user.username.toLowerCase();
//         const user = await usermodel.findOne({ email: userEmail });
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid user' });
//         }
//         const { team_id, player_name, player_mobile_no, player_role } = req.body;
//         console.log("Request Body: ", req.body);
//         const addPlayer = new playermodel({
//             player_name: player_name,
//             team_id: team_id,
//             player_mobile_no: player_mobile_no,
//             player_role: player_role
//         })
//         console.log("*****: ", addPlayer);
//         const existingPlayer = await playermodel.findOne({ player_mobile_no: player_mobile_no });
//         console.log("Existing Player: ", existingPlayer);
//         if (existingPlayer) {
//             return res.status(400).json({ message: 'Player already exists' });
//         }

//         const team = await teammodel.findOne({ team_id: team_id });
//         console.log("Team: ", team);
//         if (!team) {
//             return res.status(404).json({ message: 'Team not found' });
//         }
//         console.log("Check team : ", team.user_id.equals(user.user_id))
//         if (!team.user_id.equals(user.user_id)) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//         console.log("Check Player by ==: ", addPlayer.team_id === team.team_id);
//         console.log("Check player: ", addPlayer.team_id.equals(user.user_id))
//         if (!addPlayer.team_id.equals(team.team_id)) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//         const result = await addPlayer.save();
//         res.status(200).json({ message: 'Player added successfully', player: result });
//     } catch (err) {
//         res.status(400).json(err);
//     }
// }

// module.exports = addPlayer;

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
        const checkPlayersArrayIsEmptyOrNot = players.length === 0;
        if (checkPlayersArrayIsEmptyOrNot) {
            return res.status(400).json({ message: 'Players array is empty, Please enter atleast one player' });
        }
        console.log("********: req body ", req.body)
        const isPlayerExist = await playermodel.find({ player_mobile_no: { $in: players.map(player => player.player_mobile_no) } });
        const names = new Set();
        const contactNumber = new Set();
        for(const player of players) {
            // console.log("Player ************", player);
            if(names.has(player.player_name) || contactNumber.has(player.player_mobile_no)) {
                return res.status(400).json({ message: 'Name and contact number should be unique' });
            }
            names.add(player.player_name);
            contactNumber.add(player.player_mobile_no);
            // console.log("names SET: ", names);
            // console.log("contactNumber SET: ", contactNumber);
        }
        // console.log("isPlayerExist######: ", isPlayerExist);
        if (isPlayerExist.length > 0) {
            return res.status(400).json({ message: 'Player already exists' });
        }
        const playerObjects = [];
        let count = 0;
        while (players.length > 0) {
            // console.log("Inside Loop**************")
            // console.log("Players lenght ***********: ", players.length);
            // console.log("Count ***********: ", count);
            const player = players.shift();
            const addPlayer = new playermodel({
                player_name: player.player_name,
                team_id: player.team_id,
                player_mobile_no: player.player_mobile_no,
                // player_role: player.player_role
            })
            const team = await teammodel.findOne({ team_id: player.team_id });
            // console.log("Team **********: ", team);
            if (!team) {
                // console.log("111111111111111")
                return res.status(404).json({ message: 'Team not found' });
            }else if (!team.user_id.equals(user.user_id)) {
                // console.log("222222222222222")
                return res.status(401).json({ message: 'Unauthorized' });
            }else if (!addPlayer.team_id.equals(team.team_id)) {
                // console.log("3333333333333333")
                return res.status(401).json({ message: 'Unauthorized' });
            }
            // console.log("4444444444444444")
            // const playerObjects = playerObjects.push(addPlayer);
            playerObjects.push(addPlayer);
            console.log("playerObjects*********: ", playerObjects);
            count += 1;
            // result = await addPlayer.save();
        }
        console.log("Outside the loop *********")
        const result = await playermodel.insertMany(playerObjects);
        res.status(200).json({ message: 'Player added successfully', player: result });
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = addPlayerArray;
const ongroundplayerofteammodel = require('../../models/Player/on_ground_player_of_team_model');
const playermodel = require('../../models/Player/player_model');
const teammodel = require('../../models/Team/team_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');
const matchmodel = require('../../models/Match/match_info_model');
const getAllPlayerOfOnGroundTeam = async (req, res) => {
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

        const matchId = req.param.id;
        console.log("Request param: ", req.params.id);

        const match = await matchmodel.findOne({ matchId });
        console.log("Match: ", match)
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        if (!match.user_id === user.user_id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (match.match_status === "COMPLETED") {
            return res.status(400).json({ message: 'Match already completed' });
        }

        const battingTeamId = match.batting_team_id;
        const bowlingTeamId = match.bowling_team_id;

        console.log("Batting Team: ", battingTeamId);
        console.log("Bowling Team: ", bowlingTeamId);

        // const {battingTeamId, bowlingTeamId} = req.body;
        const battingTeam = await teammodel.findOne({ team_id: battingTeamId });
        const bowlingTeam = await teammodel.findOne({ team_id: bowlingTeamId });
        if (!battingTeam || !bowlingTeam) {
            return res.status(404).json({ message: 'Team not found' });
        }
        if (!battingTeam.user_id.equals(user.user_id) || !bowlingTeam.user_id.equals(user.user_id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const onGroundBattingPlayers = await ongroundplayerofteammodel.find({ team_id: battingTeamId });
        const onGroundBowlingPlayers = await ongroundplayerofteammodel.find({ team_id: bowlingTeamId });

        console.log("On Ground Batting Players: ", onGroundBattingPlayers);
        console.log("On Ground Bowling Players: ", onGroundBowlingPlayers);

        const players = onGroundBattingPlayers.concat(onGroundBowlingPlayers);

        res.status(200).json({ message: 'Players fetched successfully', battingTeam: battingTeam, bowlingTeam: bowlingTeam, battingTeamPlayer: onGroundBattingPlayers, bowlingTeamPlayer: onGroundBowlingPlayers});

    } catch (err) {
        res.status(400).json({ message: err.message });
    }  
}

module.exports = getAllPlayerOfOnGroundTeam
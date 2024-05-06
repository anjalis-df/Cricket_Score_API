const matchmodel = require('../../models/Match/match_info_model');
const tokenmodel = require('../../models/User/token_model');
const usermodel = require('../../models/User/user_info_model');
const teammodel = require('../../models/Team/team_model');
const inningsmodel = require('../../models/Inning/inning_detail_model');
const ongroundplayerofteammodel = require('../../models/Player/on_ground_player_of_team_model');
const matchresultmodel = require('../../models/Match/match_result_model');

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
        console.log("**** req.body: ", req.body);

        const {match_id, batting_team_id_in_1st_inning, total_wicket_in_1st_inning, total_run_in_1st_inning, played_over_in_1st_inning, is_first_inning, is_both_inning_completed, batting_team_id_in_2nd_inning, total_wicket_in_2nd_inning, total_run_in_2nd_inning, played_over_in_2nd_inning} = req.body;
        const match = await matchmodel.find({ match_id: match_id });
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        var InningObject = await inningsmodel.findOne({ match_id: match_id})

        if (InningObject) {
            console.log("InningObject: ", InningObject);
            console.log("Match Object", match)
            console.log("Batting Team Id ", match[0].batting_team_id)
            console.log("Bowling Team Id: ", match[0].bowling_team_id)

            const battingTeamId = match[0].batting_team_id
            const bowlingTeamId = match[0].bowling_team_id
            const battingTeam = await teammodel.find({ team_id: batting_team_id_in_2nd_inning });
            
            if (!battingTeam) {
                return res.status(404).json({ message: 'Team not found' });
            }
            if (!battingTeam.user_id === user.user_id) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            if (total_wicket_in_2nd_inning < 0 || total_run_in_2nd_inning < 0 || played_over_in_2nd_inning < 0) {
                return res.status(400).json({ message: 'Total wickets, runs and overs cannot be negative' });
            }

            InningObject.is_first_inning = is_first_inning,
            InningObject.is_both_inning_completed = is_both_inning_completed,
            InningObject.batting_team_id_in_2nd_inning = batting_team_id_in_2nd_inning,
            InningObject.total_run_in_2nd_inning = total_run_in_2nd_inning,
            InningObject.total_wicket_in_2nd_inning = total_wicket_in_2nd_inning,
            InningObject.played_over_in_2nd_inning = played_over_in_2nd_inning

            var winningTeamId = ""
            var winByRun = 0
            var winByWickets = 0
            var isMatchTie = false

            if (InningObject.total_run_in_1st_inning > InningObject.total_run_in_2nd_inning) {  
                winningTeamId = InningObject.batting_team_id_in_1st_inning
                winByRun = InningObject.total_run_in_1st_inning - InningObject.total_run_in_2nd_inning
            } else if (InningObject.total_run_in_1st_inning == InningObject.total_run_in_2nd_inning) {
                if(InningObject.total_wicket_in_1st_inning > InningObject.total_wicket_in_2nd_inning) {
                    winningTeamId = InningObject.batting_team_id_in_2nd_inning
                    winByWickets = InningObject.total_wicket_in_1st_inning - InningObject.total_wicket_in_2nd_inning
                } else if (InningObject.total_wicket_in_1st_inning < InningObject.total_wicket_in_2nd_inning) {
                        winningTeamId = InningObject.batting_team_id_in_1st_inning
                        winByWickets = InningObject.total_wicket_in_2nd_inning - InningObject.total_wicket_in_1st_inning
                }    
            }else if (InningObject.total_run_in_1st_inning < InningObject.total_run_in_2nd_inning) {
                winningTeamId = InningObject.batting_team_id_in_2nd_inning
                winByRun = InningObject.total_run_in_2nd_inning - InningObject.total_run_in_1st_inning
            }

            if (InningObject.total_wicket_in_1st_inning == InningObject.total_wicket_in_2nd_inning && InningObject.total_wicket_in_1st_inning == InningObject.total_wicket_in_2nd_inning) {
                isMatchTie = true
            }

            const matchResult = await matchresultmodel.create({
                match_id: match_id,
                user_id: user.user_id,
                team_1id: battingTeamId,
                team_2id: bowlingTeamId,
                winning_team_id: winningTeamId,
                win_by_runs: winByRun,
                win_by_wickets: winByWickets,
                inning_id: InningObject.inning_id
            })
            await InningObject.save()
            await matchResult.save()

            res.status(200).json({ message: 'Inning detail updated successfully', result: InningObject , MatchResult: matchResult});


            
        }else {
            const id = match[0].bowling_team_id
            const battingTeam = await teammodel.find({ team_id: batting_team_id_in_1st_inning });
            const bowlingTeam = await teammodel.find({ team_id: id });

            console.log("batting Team: ", battingTeam)
            // console.log("bowling Team: ", bowlingTeam)
            if (!battingTeam) {
                return res.status(404).json({ message: 'Team not found' });
            }
            if (!battingTeam.user_id === user.user_id) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            if (total_wicket_in_1st_inning < 0 || total_run_in_1st_inning < 0 || played_over_in_1st_inning < 0) {
                return res.status(400).json({ message: 'Total wickets, runs and overs cannot be negative' });
            }

            const battingId = battingTeam[0].team_id
            const bowlingId = bowlingTeam[0].team_id
            
            const battingTeamPlayer = await ongroundplayerofteammodel.find({ team_id: battingId, match_id: match[0].match_id});
            const bowlingTeamPlayer = await ongroundplayerofteammodel.find({ team_id: bowlingId, match_id: match[0].match_id});


            const result = await inningsmodel.create({
                match_id: match_id,
                batting_team_id_in_1st_inning: batting_team_id_in_1st_inning,
                total_run_in_1st_inning: total_run_in_1st_inning,
                total_wicket_in_1st_inning: total_wicket_in_1st_inning,
                played_over_in_1st_inning: played_over_in_1st_inning,
                is_first_inning: is_first_inning,
                is_both_inning_completed: is_both_inning_completed,
            })
            await result.save()
            res.status(200).json({ message: 'Inning detail added successfully', result: result, battingTeam: bowlingTeamPlayer, bowlingTeam: battingTeamPlayer });
        }

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = add_inning_detail
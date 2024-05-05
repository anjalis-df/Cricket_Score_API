const mongoose = require('mongoose')
const onGroundPlayerOfTeamSchema = new mongoose.Schema({
    player_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'player_schema', auto: true },
    player_name: { type: String, required: true },
    team_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team_schema' },
    match_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'match_info_schema' },
    score_obj_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'score_obj_schema' },
    is_first_inning: { type: Boolean, required: true },
    outStatus: { type: Boolean, required: true },
    is_both_inning_completed: { type: Boolean, required: true }
})

module.exports = onGroundPlayerOfTeamSchema
const mongoose = require('mongoose');

const inningDetailSchema = new mongoose.Schema({
    inning_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, auto: true },
    match_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'match_info_schema' },
    team_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team_schema' },
    total_wickets: { type: Number, required: true },
    total_runs: { type: Number, required: true },
    total_overs: { type: Number, required: true },
    is_first_inning: { type: Boolean, required: true },
    is_both_inning_complete: { type: Boolean, required: true }
})

module.exports = inningDetailSchema
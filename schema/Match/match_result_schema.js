const mongoose = require('mongoose');

const matchResultSchema = new mongoose.Schema({
    match_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, auto: true },
    match_result: { type: String},
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user_info_schema' },
    team_1id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team_schema' },
    team_2id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team_schema' },
    // match_date: { type: Date, required: true,timezone:"Asia/Kolkata" },
    winning_team_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team_schema' },
    win_by_runs: { type: Number, required: true },
    win_by_wickets: { type: Number, required: true },
})

module.exports = matchResultSchema
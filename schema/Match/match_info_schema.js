const mongoose = require('mongoose');

const matchInfoSchema = new mongoose.Schema({
    match_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, auto: true },
    user_id: { type: String, required: true, ref: 'user_info_schema' },
    // match_date: { type: Date,timezone:"Asia/Kolkata" },
    toss_winning_team_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team_schema' },
    winning_team_selection: { type: String, required: true },
    total_over: { type: Number, required: true },
    batting_team_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team_schema' },
    bowling_team_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team_schema' },
    number_of_player_in_both_team: { type: Number, required: true }
})

module.exports = matchInfoSchema
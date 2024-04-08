const mongoose = require('mongoose');

const playerOnGroundSchema = new mongoose.Schema({
    striker_id: { type: String, required: true, ref: 'player_schema' },
    nonStriker_id: { type: String, required: true, ref: 'player_schema' },
    inning_id: { type: String, required: true, ref: 'inning_detail_schema' },
    batsman_run_count: { type: Number, required: true },
    is_four: { type: Boolean, required: true },
    is_six: { type: Boolean, required: true },
    out_status: { type: Boolean, required: true },
    ball_count_faced_by_batsman: { type: Number, required: true },
    bowler_id: { type: String, required: true, ref: 'player_schema' },
    bowler_wicket_count: { type: Number, required: true },
    bowler_over_count: { type: Number, required: true },
    bowler_run_count: { type: Number, required: true },
    maiden_over_count: { type: Number, required: true },
    ball_count_faced_by_bowler: { type: Number, required: true },
})

module.exports = playerOnGroundSchema
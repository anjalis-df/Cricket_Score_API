const mongoose = require('mongoose')

const scoreDetailSchema = new mongoose.Schema({
    score_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, auto: true },
    player_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'player_schema' },
    player_role: { type: String, required: true },
    batsman_run_count: { type: Number, required: true },
    four_count: { type: Number, required: true },
    six_count: { type: Number, required: true },
    ball_count_played_by_batsman: { type: Number, required: true },
    bowler_wicket_count: { type: Number, required: true },
    bowler_over_count: { type: Number, required: true },
    bowler_run_count: { type: Number, required: true },
    maiden_over_count: { type: Number, required: true },
    ball_count_played_by_bowler: { type: Number, required: true }
})

module.exports = scoreDetailSchema

const mongoose = require('mongoose');

const playerOnGroundSchema = new mongoose.Schema({
    striker_id: { type: String, required: true, ref: 'On_ground_player_of_team_schema' },
    non_striker_id: { type: String, required: true, ref: 'On_ground_player_of_team_schema' },
    batsman_run_count: { type: Number, required: true },
    four_count: { type: Number, required: true },
    six_count: { type: Number, required: true },
    out_status: { type: Boolean, required: true },
    ball_count_faced_by_batsman: { type: Number, required: true },
    bowler_id: { type: String, required: true, ref: 'On_ground_player_of_team_schema' },
    bowler_wicket_count: { type: Number, required: true },
    bowler_over_count: { type: Number, required: true },
    bowler_run_count: { type: Number, required: true },
    maiden_over_count: { type: Number, required: true },
    ball_count_faced_by_bowler: { type: Number, required: true },
    current_status: { type: String, required: true },
    match_id: { type: String, required: true, ref: 'match_info_schema' },
    last_run: { type: Number, required: true },
    is_both_inning_completed: { type: Boolean, required: true },
    is_first_inning: { type: Boolean, required: true }
})

module.exports = playerOnGroundSchema
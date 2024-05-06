const mongoose = require('mongoose');

const inningDetailSchema = new mongoose.Schema({
    inning_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, auto: true },
    match_id: { type: mongoose.Schema.Types.ObjectId, required: true,ref: 'match_info_schema' },
    batting_team_id_in_1st_inning: { type: mongoose.Schema.Types.ObjectId,ref: 'team_schema' },
    total_run_in_1st_inning: { type: Number},
    total_wicket_in_1st_inning: { type: Number},
    played_over_in_1st_inning: { type: Number},
    is_first_inning: { type: Boolean, required: true },
    is_both_inning_completed: { type: Boolean, required: true },
    batting_team_id_in_2nd_inning: { type: mongoose.Schema.Types.ObjectId,ref: 'team_schema' },
    total_run_in_2nd_inning: { type: Number},
    total_wicket_in_2nd_inning: { type: Number},
    played_over_in_2nd_inning: { type: Number},
})

module.exports = inningDetailSchema
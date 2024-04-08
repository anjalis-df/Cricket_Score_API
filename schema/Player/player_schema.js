const mongoose = require('mongoose');

const player_schema = new mongoose.Schema({
    player_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, auto: true },
    player_name: { type: String, required: true },
    team_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'team_schema' },
    player_mobile_no: { type: String, required: true, unique: true },
    // player_role: { type: String},
})

module.exports = player_schema;
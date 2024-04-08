const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user_info_schema' },
    team_id: { type: mongoose.Schema.Types.ObjectId, required: true ,unique: true, auto: true },
    team_name: { type: String, required: true, unique: true },
    team_place: { type: String, required: true },
})

module.exports = teamSchema
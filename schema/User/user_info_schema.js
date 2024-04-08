const mongoose = require('mongoose');
const user_infoSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, auto: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    registration_date: { type: Date, default: Date.now,timezone:"Asia/Kolkata" },
    lastlogin_date: { type: Date, default: Date.now,timezone:"Asia/Kolkata" },
    acceptedPrivacy: { type: Boolean},
})

module.exports = user_infoSchema;
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
accessToken: { type: String, required: true },
refreshToken: { type: String, required: true },
accessTokenExpiresAt: { type: Date, required: true,timezone:"Asia/Kolkata" },
refreshTokenExpiresAt: { type: Date, required: true,timezone:"Asia/Kolkata" },
client:Object,
user:Object
});

module.exports = tokenSchema;
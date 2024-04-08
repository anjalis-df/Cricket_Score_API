const mongoose = require('mongoose');
const playerSchema = mongoose.model('Player', require('../../schema/Player/player_schema'));
module.exports = playerSchema
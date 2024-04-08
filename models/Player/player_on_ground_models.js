const mongoose = require('mongoose');
const playerOnGroundSchema = mongoose.model('PlayerOnGround', require('../../schema/Player/player_on_ground_schema'));
module.exports = playerOnGroundSchema
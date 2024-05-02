const mongoose = require('mongoose');
const scoreSchema = mongoose.model('Score', require('../../schema/Score/score_shcema'));
module.exports = scoreSchema
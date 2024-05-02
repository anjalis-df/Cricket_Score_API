const mongoose = require('mongoose');
const matchInfoSchema = mongoose.model('MatchInfo', require('../../schema/Match/match_info_schema'));
module.exports = matchInfoSchema;   
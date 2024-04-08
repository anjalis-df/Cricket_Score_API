const mongoose = require('mongoose');

const matchResultSchema = mongoose.model('MatchResult', require('../../schema/Match/match_result_schema'));
module.exports = matchResultSchema;
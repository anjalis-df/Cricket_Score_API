const mongoose = require('mongoose');
const inning_detail_schema = require('../../schema/Inning/inning_detail_schema');
const inning_model = mongoose.model('Inning',inning_detail_schema)
module.exports = inning_model
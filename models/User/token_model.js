const mongoose = require('mongoose');
const tokenSchema = require('../../schema/User/token_schema');

const tokenSchemaModel = mongoose.model('Token', tokenSchema);

module.exports = tokenSchemaModel;
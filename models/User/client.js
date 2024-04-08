const mongoose = require('mongoose');
const clientSchema = require('../../schema/User/client_schema');

const clientSchemaModel = mongoose.model('Client', clientSchema);

module.exports = clientSchemaModel; 
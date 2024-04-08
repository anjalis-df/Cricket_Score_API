const mongoose  = require('mongoose');

const clientSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, auto: true },
    clientID: { type: String, required: true },
    clientSecret: { type: String, required: true },
    grants: [{ type: String}],
    redirectUris: [{ type: String}],
});

module.exports = clientSchema;
const mongoose = require('mongoose');
const user_info = require('../../schema/User/user_info_schema');
const user_infoSchema = mongoose.model('UserInfo', user_info);
module.exports = user_infoSchema;
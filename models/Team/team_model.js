const mongoose = require('mongoose');
const teamSchema = mongoose.model('Team', require('../../schema/Team/team_schema'));
module.exports = teamSchema
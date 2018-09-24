const mongoose = require('mongoose');
const { TeamSchema } = require('./Team');

const UserSchema = new mongoose.Schema({
    name: String,
    teams: [TeamSchema]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
const mongoose = require('mongoose');
const { TeamSchema } = require('./Team');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name required, can not be empty or null']
    },
    teams: [TeamSchema]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
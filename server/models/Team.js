const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: String,
    country: String
});

module.exports = {
    TeamSchema
}
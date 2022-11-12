const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {type: String, default: null},
    last_name: {type: String, default: null},
    password: {type: String, unique: true},
    email: {type: String},
    token: {type: String}
})

module.exports = mongoose.model("user", userSchema);
/* Will extand this modle later after finish the front end and all user actions [not include the register user actions only] */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    platform: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('User', userSchema);
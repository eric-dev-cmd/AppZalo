const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    userName: String,
    gender: {
        type: String,
        default: 'male'
    },
    birthday: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: 'avatar-default.jpg'
    },
    role: {
        type: String,
        default: 'user'
    },
    local: {
        phone: {
            type: String,
            default: null
        },
        password: String
    },
    createAt: {
        type: Number,
        default: Date.now
    },
    updateAt: {
        type: Number,
        default: null
    },
    deleteAt: {
        type: Number,
        default: null
    }
});

module.exports = mongoose.model('user', User);
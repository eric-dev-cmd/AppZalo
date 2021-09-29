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
    createdAt: {
        type: Number,
        default: Date.now
    },
    updatedAt: {
        type: Number,
        default: null
    },
    deletedAt: {
        type: Number,
        default: null
    }
});

module.exports = mongoose.model('user', User);
const mongoose = require('mongoose'); 
const Schema=mongoose.Schema;

const Notification= new Schema({
    senderId: String,
    receiverId: String,
    type: String,
    content: {type: String, default: null},
    isRead: {type: Boolean, default: false},
    createAt: {type: Number, default: Date.now},
});

module.exports = mongoose.model('notification', Notification);

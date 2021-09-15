const mongoose = require('mongoose'); 
const Schema=mongoose.Schema;

const Notification= new Schema({
      sender: {
        id: String,
        userName: String, 
        avatar: String
    },
    receiver: {
        id: String,
        userName: String, 
        avatar: String
    },
    type: String,
    content: String,
    isRead: {type: Boolean, default: false},
    createAt: {type: Number, default: Date.now},
});

module.exports = mongoose.model('notification', Notification);

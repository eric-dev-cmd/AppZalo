const mongoose = require('mongoose'); 
const Schema=mongoose.Schema;

const Message= new Schema({
    senderId: String,
    receiverId: String,
    chatType: String,
    messageType: String,
    text: String,
    fileName: String,
    isRead: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: null}
});

module.exports = mongoose.model('message', Message);

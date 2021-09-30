const mongoose = require('mongoose'); 
const Schema=mongoose.Schema;

const Message= new Schema({
    senderId: String,
    receiverId: String,
    chatType: String,
    messageType: String,
    text: String,
    file: {data: Buffer, contentType: String, fileName: String},
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: null},
    deletedAt: {type: Number, default: null}
});

module.exports = mongoose.model('message', Message);

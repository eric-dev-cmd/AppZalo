const mongoose = require('mongoose'); 
const Schema=mongoose.Schema;

const ChatGroup= new Schema({
    name: String,
    userAmount: {type: Number, min: 3, max: 150},
    messageAmount: {type: Number, default: 0},
    userId: String,
    members: [
        {userId: String}
    ],
    createAt: {type: Number, default: Date.now},
    updateAt: {type: Number, default: null},
    deleteAt: {type: Number, default: null}
});

module.exports = mongoose.model('chat-group', ChatGroup);

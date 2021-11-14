const mongoose = require('mongoose'); 
const Schema=mongoose.Schema;

const ChatGroup= new Schema({
    name: String,
    userAmount: {type: Number, min: 2, max: 200},
    userId: String,
    members: [
        {userId: String}
    ],
    avatar: {
        type: String,
        default: "group-avatar.png",
      },
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: Date.now}
});

module.exports = mongoose.model('chat-group', ChatGroup);

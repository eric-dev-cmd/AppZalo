const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatGroup = new Schema(
    {
        name: String,
        userAmount: {
            type: Number,
            min: 3,
            max: 150,
        },
        userId: String,
        members: [
            {
                userId: String,
            },
        ],

        deleteAt: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('chat-group', ChatGroup);

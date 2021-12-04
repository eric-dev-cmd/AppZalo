const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema(
    {
        sender: {
            id: String,
            userName: String,
            avatar: String,
        },
        receiver: {
            id: String,
            userName: String,
            avatar: String,
        },
        text: String,
        file: {
            data: Buffer,
            contentType: String,
            fileName: String,
        },
        deleteAt: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('message', Message);

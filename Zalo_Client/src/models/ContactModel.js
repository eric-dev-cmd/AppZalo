const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Contact = new Schema(
    {
        userId: String,
        contactId: String,
        status: {
            type: Boolean,
            default: false,
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


module.exports = mongoose.model('contact', Contact);

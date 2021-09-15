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

ContactStatic = {
    createNew(item) {
        return this.create(item);
    },
};

module.exports = mongoose.model('contact', Contact);

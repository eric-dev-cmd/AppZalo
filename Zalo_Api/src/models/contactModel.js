
const mongoose = require('mongoose'); 
const Schema=mongoose.Schema;

const Contact= new Schema({
    senderId: String,
    receiverId: String,
    status: {type: Boolean, default: false},
    createdAt: {type: Number, default: Date.now},
    updatedAt: {type: Number, default: null},
});

ContactStatic = {
    createNew(item) {
        return this.create(item);
    }
};

module.exports = mongoose.model('contact', Contact);

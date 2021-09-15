
const mongoose = require('mongoose'); 
const Schema=mongoose.Schema;

const Contact= new Schema({
    userId: String,
    contactId: String,
    status: {type: Boolean, default: false},
    createAt: {type: Number, default: Date.now},
    updateAt: {type: Number, default: null},
    deleteAt: {type: Number, default: null}
});

ContactStatic = {
    createNew(item) {
        return this.create(item);
    }
};

module.exports = mongoose.model('contact', Contact);

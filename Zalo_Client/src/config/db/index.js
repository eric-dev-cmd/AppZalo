const mongoose = require('mongoose');
const URL_DB =
    //'mongodb+srv://admin:DHKTPM14@cluster0.lxnwb.mongodb.net/appzalo?retryWrites=true&w=majority';
    'mongodb+srv://admin:DHKTPM14@cluster0.lxnwb.mongodb.net/appzalo?retryWrites=true&w=majority';
async function connect() {
    try {
        await mongoose.connect(URL_DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });
        console.log('Connect DB Success 😍');
    } catch (error) {
        console.log('Connect Failure 😥');
    }
}
module.exports = {
    connect,
};
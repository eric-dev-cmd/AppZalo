const mongoose = require('mongoose');
async function connect() {
    try {
        //await mongoose.connect('mongodb+srv://admin:DHKTPM14@cluster0.lxnwb.mongodb.net/appzalo?retryWrites=true&w=majority');
        await mongoose.connect('mongodb://localhost:27017/appzalo');
        console.log("ket noi database thanh cong");
    } catch (error) {
        console.log("ket noi database khong thanh cong");
    }
}
module.exports = {
    connect
};
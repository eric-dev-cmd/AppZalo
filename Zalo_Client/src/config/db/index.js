const mongoose = require('mongoose');
const URL_DB =
  //'mongodb://localhost:27017/appzalo';
  'mongodb://localhost:27017/appzalo';
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

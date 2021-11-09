const axios = require('axios');
const http = require('../controllers/http');

class UserService {
  getAPIByPhone(phone) {
    return new Promise(async (resolve, reject) => {
      try {
        let userPhone = await axios.get(http + '/searchPhone/' + phone);
        resolve(userPhone.data);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new UserService();

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

  checkOnlineOffline(listUserIdOnline) {
    return new Promise(async (resolve, reject) => {
      try {
        listUserIdOnline.forEach(async id => {
          let user = await axios.get(http + '/users/' + id);
          user.data.user.isOnline = 'true';
          await axios.put(http + '/users/' + id, user.data.user);
          resolve(true);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new UserService();

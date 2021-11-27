const axios = require('axios');
const http = require('../controllers/http');

class AdminService {
  updateIsActiveAdmin(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await axios.get(http + '/users/' + userId);
        user.data.user.isActive = 'true';
        await axios.put(http + '/users/' + userId, user.data.user);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateIsBlockAdmin(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await axios.get(http + '/users/' + userId);
        user.data.user.isActive = 'false';
        await axios.put(http + '/users/' + userId, user.data.user);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new AdminService();

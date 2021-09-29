const axios = require('axios');
const http = require('../controllers/http');

class ChatGroupService {
    getChatGroups(senderId) {
        return new Promise(async (resolve, reject) => {
            try {
                let chatGroups = await axios.get(http + '/chatGroups/searchUserIdToArray/' + senderId);
                resolve(chatGroups.data);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new ChatGroupService;
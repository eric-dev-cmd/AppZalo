const axios = require('axios');
const http = require('../controllers/http');

class ChatGroupService {
    // lấy ds groups theo theo id của người đăng nhập (senderId) (searchUserIdToArray)
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
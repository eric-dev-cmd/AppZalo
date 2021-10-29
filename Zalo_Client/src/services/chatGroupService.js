const axios = require('axios');
const http = require('../controllers/http');

class ChatGroupService {
    // lấy ds groups theo id của người đăng nhập (senderId) (searchUserIdToArray)
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

    createGroup(groupName, listId, currentUserId) {
        return new Promise(async (resolve, reject) => {
            try {
                if (listId.length > 1) {
                    listId.push(currentUserId);
                    let getListId = [];
                    listId.map(id => {
                        getListId.push({userId : id})
                    });
                    try {
                        let newGroup = {
                            name: groupName,
                            userId: currentUserId,
                            members: getListId,
                            userAmount: getListId.length,
                            createdAt: Date.now()
                        }
                        let createGroup = await axios.post(http + '/chatGroups', newGroup);
                        resolve(createGroup.data);
                    } catch (error) {
                        reject(error);
                    }
                }
            } catch (error) {

            }

        });
    }
}

module.exports = new ChatGroupService;
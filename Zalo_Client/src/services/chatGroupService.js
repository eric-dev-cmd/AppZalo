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
                    let members = [];
                    listId.map(userId => {
                        members.push({
                            userId: userId
                        })
                    });
                        let newGroup = {
                            name: groupName,
                            userId: currentUserId,
                            members: members,
                            userAmount: members.length,
                            createdAt: Date.now()
                        }
                        let createGroup = await axios.post(http + '/chatGroups', newGroup);
                        resolve(createGroup.data);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    addUserToGroup(groupId, listId) {
        return new Promise(async (resolve, reject) => {
            try {
                let group = await axios.get(http + '/chatGroups/' + groupId);
                listId.map(userId => {
                    group.data.members.push({
                        userId: userId
                    })
                });
                let getGroup = await axios.put(http + '/chatGroups/' + groupId, group.data);
                resolve(getGroup.data);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new ChatGroupService;
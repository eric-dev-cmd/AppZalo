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
                if (typeof listId === 'string') {
                    let ids = [listId];
                    resolve(this.create(groupName, ids, currentUserId));
                } else {
                    resolve(this.create(groupName, listId, currentUserId));
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    addUserToGroup(groupId, listId) {
        return new Promise(async (resolve, reject) => {
            try {
                if (typeof listId === 'string') {
                    let ids = [listId];
                    resolve(this.addUser(groupId, ids));
                } else {
                    resolve(this.addUser(groupId, listId));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    async create(groupName, listId, currentUserId) {
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
        return createGroup.data;
    }

    async addUser(groupId, listId) {
        let group = await axios.get(http + '/chatGroups/' + groupId);
        listId.map(userId => {
            group.data.members.push({
                userId: userId
            })
        });
        let getGroup = await axios.put(http + '/chatGroups/' + groupId, group.data);
        return getGroup.data;
    }
}

module.exports = new ChatGroupService;
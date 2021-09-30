const contactService = require('../services/contactService');
const chatGroupService = require('../services/chatGroupService');
const sortJsonArray = require('sort-json-array');
const axios = require('axios');
const http = require('../controllers/http');

class MessageService {
    getListItemContacts(senderId){
        return new Promise(async (resolve, reject) => {
            try {
                // lấy danh sách bạn bè
                let users = await contactService.getContacts(senderId);
                //lấy ds groups
                let groups = await  chatGroupService.getChatGroups(senderId);
                //gom 2 mảng
                let getAll = users.getContacts.concat(groups);
                getAll = sortJsonArray(getAll, 'updatedAt', 'des');

                let getAllMessages = getAll.map(async (conversation) => {
                    // tìm kiếm messages theo senderId và (receiverId hoặc groupId)
                    let getMessages = await axios.get(http + '/messages/SearchBySenderIdAndReceiverId/' + senderId + '/' + conversation._id);
                    conversation.messages = getMessages.data;
                    return conversation;
                });
                resolve({
                    getAll: getAll,
                    users: users,
                    groups: groups,
                    getAllMessages: await Promise.all(getAllMessages)
                });
            } catch (error) {
                reject(error);
            }
        });
        
    }

}

module.exports = new MessageService;
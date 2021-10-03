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
                let userConversation = await contactService.getContacts(senderId);
                //lấy ds groups
                let groupConversation = await  chatGroupService.getChatGroups(senderId);
                //gom 2 mảng
                let allConversation = userConversation.getContacts.concat(groupConversation);
                allConversation = sortJsonArray(allConversation, 'updatedAt', 'des');

                let allConversationMessages = allConversation.map(async (conversation) => {
                    // tìm kiếm messages theo senderId và (receiverId hoặc groupId)
                   if(conversation.members){
                    let getMessages = await axios.get(http + '/messages/SearchByReceiverId/' + conversation._id);
                    conversation.messages = getMessages.data;
                   }else{
                    let getMessages = await axios.get(http + '/messages/SearchBySenderIdAndReceiverId/' + senderId + '/' + conversation._id);
                    conversation.messages = getMessages.data;
                   }
                    return conversation;
                });
                resolve({
                    allConversation: allConversation,
                    userConversation: userConversation,
                    groupConversation: groupConversation,
                    allConversationMessages: await Promise.all(allConversationMessages)
                });
            } catch (error) {
                reject(error);
            }
        });
        
    }

}

module.exports = new MessageService;
const contactService = require('../services/contactService');
const chatGroupService = require('../services/chatGroupService');
const sortJsonArray = require('sort-json-array');
const axios = require('axios');
const http = require('../controllers/http');
const messageUtil = require('../utils/message');

class MessageService {
    getListItemContacts(senderId) {
        return new Promise(async (resolve, reject) => {
            try {
                // lấy danh sách bạn bè
                let userConversation = await contactService.getContacts(senderId);
                //lấy ds groups
                let groupConversation = await chatGroupService.getChatGroups(senderId);
                //gom 2 mảng
                let allConversation = userConversation.getContacts.concat(groupConversation);
                allConversation = sortJsonArray(allConversation, 'updatedAt', 'des');
                let allConversationMessages = allConversation.map(async (conversation) => {
                    // tìm kiếm messages theo senderId và (receiverId hoặc groupId)
                    if (conversation.members) {
                        let getMessages = await axios.get(http + '/messages/SearchByReceiverId/' + conversation._id);
                        conversation.messages = getMessages.data;
                    } else {
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

    addNewTextAndEmoji(senderId, receiverId, messageVal, isChatGroup) {
        return new Promise(async (resolve, reject) => {
            try {
                if (isChatGroup === 'true' && messageVal.length > 0) {
                    let newMessageItem = {
                        text: messageVal,
                        senderId: senderId,
                        receiverId: receiverId,
                        chatType: messageUtil.MESSAGE_CHAT_TYPES.GROUP,
                        messageType: messageUtil.MESSAGE_TYPES.TEXT,
                        createdAt: Date.now()
                    };
                    //tạo tin nhắn mới
                    let newMessage = await axios.post(http + '/messages', newMessageItem);

                    // cập nhật thời gian và số lượng của nhóm
                    let getChatGroupReceiver = await axios.get(http + '/chatGroups/' + receiverId);
                    let chatGroup = getChatGroupReceiver.data;
                    chatGroup.updatedAt = Date.now();
                    chatGroup.messageAmount = chatGroup.messageAmount + 1;
                    await axios.put(http + '/chatGroups/' + receiverId, chatGroup);

                    return resolve(newMessage.data);
                } 
                if (isChatGroup === 'false' && messageVal.length > 0) {
                    let newMessageItem = {
                        text: messageVal,
                        senderId: senderId,
                        receiverId: receiverId,
                        chatType: messageUtil.MESSAGE_CHAT_TYPES.PERSONAL,
                        messageType: messageUtil.MESSAGE_TYPES.TEXT,
                        createdAt: Date.now()
                    };
                    let newMessage = await axios.post(http + '/messages', newMessageItem);
                    // cập nhật thời gian
                    let getSender = await axios.get(http + '/users/' + senderId);
                    let getReceiver = await axios.get(http + '/users/' + receiverId);
                    let sender = getSender.data.user;
                    let receiver = getReceiver.data.user
                    sender.updatedAt = Date.now();
                    receiver.updatedAt = Date.now();
                    await axios.put(http + '/users/' + senderId, sender);
                    await axios.put(http + '/users/' + receiverId, receiver);
                    return resolve(newMessage.data);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

}

module.exports = new MessageService;
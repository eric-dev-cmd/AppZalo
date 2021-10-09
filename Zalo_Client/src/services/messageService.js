const contactService = require('../services/contactService');
const chatGroupService = require('../services/chatGroupService');
const sortJsonArray = require('sort-json-array');
const axios = require('axios');
const http = require('../controllers/http');
const messageUtil = require('../utils/message');
const uploadFilesUtil = require('../utils/uploadFiles');
const moment = require('moment');
const {
  v4: uuidv4
} = require('uuid');

class MessageService {
  getListItemContacts(senderId) {
    return new Promise(async (resolve, reject) => {
      try {
        // lấy danh sách bạn bè
        let userConversation = await contactService.getContacts(senderId);
        //lấy ds groups
        let groupConversation = await chatGroupService.getChatGroups(senderId);
        //gom 2 mảng
        let allConversation =
          userConversation.getContacts.concat(groupConversation);
        allConversation = sortJsonArray(allConversation, 'updatedAt', 'des');
        let allConversationMessages = allConversation.map(
          async (conversation) => {
            // tìm kiếm messages theo senderId và (receiverId hoặc groupId)
            if (conversation.members) {
              let getMessages = await axios.get(
                http + '/messages/SearchByReceiverId/' + conversation._id
              );
              conversation.messages = getMessages.data;
              // Get item last
              try {
                let lastGroup = Object.keys(conversation.messages).pop();
                let lastMessGroup = conversation.messages[lastGroup];
                moment.locale('vi');
                let formatedTimeAgo = moment(lastMessGroup.createdAt).fromNow();
                // Set
                conversation.time = formatedTimeAgo;
                conversation.lastText = lastMessGroup.text;
                conversation.messageType = lastMessGroup.messageType;
              } catch (error) {
                console.log(error)
              }

            } else {
              let getMessages = await axios.get(
                http +
                '/messages/SearchBySenderIdAndReceiverId/' +
                senderId +
                '/' +
                conversation._id
              );
              conversation.messages = getMessages.data;
              try {
                let lastUser = Object.keys(conversation.messages).pop();
                let lastItemUser = conversation.messages[lastUser];
                let formatedTimeAgoUser = moment(lastItemUser.createdAt).fromNow();
                conversation.time = formatedTimeAgoUser;
                conversation.textUser = lastItemUser.text;
                conversation.messageType = lastItemUser.messageType;
              } catch (error) {
                console.log(error)
              }
            }
            return conversation;
          }
        );
        resolve({
          allConversation: allConversation,
          userConversation: userConversation,
          groupConversation: groupConversation,
          allConversationMessages: await Promise.all(allConversationMessages),
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
            createdAt: Date.now(),
          };
          //tạo tin nhắn mới
          let newMessage = await axios.post(http + '/messages', newMessageItem);
          //cập nhật thời gian và số lượng tin nhắn
          this.updateTimeForGroup(receiverId);
          return resolve(newMessage.data);
        }
        if (isChatGroup === 'false' && messageVal.length > 0) {
          let newMessageItem = {
            text: messageVal,
            senderId: senderId,
            receiverId: receiverId,
            chatType: messageUtil.MESSAGE_CHAT_TYPES.PERSONAL,
            messageType: messageUtil.MESSAGE_TYPES.TEXT,
            createdAt: Date.now(),
          };
          let newMessage = await axios.post(http + '/messages', newMessageItem);
          // cập nhật thời gian
          this.updateTimeForUser(senderId, receiverId);
          return resolve(newMessage.data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  uploadFiles(files, senderId, receiverId, isChatGroup) {
    return new Promise(async (resolve, reject) => {
      try {
        let uuid = uuidv4();
        //luu nhiều file vào message
        if (files.length > 1) {
          //nếu là nhóm
          if (isChatGroup === 'true') {
            let getNewMessages = files.map(async (file) => {
              //kiểm tra image hay file
              let mimeType = file.mimetype.split('/')[0];
              //nếu là image
              if (mimeType === 'image') {
                let newMessageItem = {
                  senderId: senderId,
                  receiverId: receiverId,
                  chatType: messageUtil.MESSAGE_CHAT_TYPES.GROUP,
                  messageType: messageUtil.MESSAGE_TYPES.IMAGE,
                  fileName: `${uuid}.${file.name}`,
                  createdAt: Date.now(),
                };
                let newMessage = await axios.post(http + '/messages', newMessageItem);
                //cập nhật thời gian
                this.updateTimeForGroup(receiverId);
                return newMessage.data;
              }
              //nếu là file 
              else {
                let newMessageItem = {
                  senderId: senderId,
                  receiverId: receiverId,
                  chatType: messageUtil.MESSAGE_CHAT_TYPES.GROUP,
                  messageType: messageUtil.MESSAGE_TYPES.FILE,
                  fileName: `${uuid}.${file.name}`,
                  createdAt: Date.now(),
                };
                let newMessage = await axios.post(http + '/messages', newMessageItem);
                //cập nhật thời gian
                this.updateTimeForGroup(receiverId);
                return newMessage.data;
              }
            });
            //upload S3
            let newFiles = await uploadFilesUtil.uploadFiles(files, uuid);
            return resolve({
              newMessages: await Promise.all(getNewMessages),
              newFiles: newFiles
            });
          }
          //nếu là cá nhân
          else {
            let getNewMessages = files.map(async (file) => {
              //kiểm tra image hay file
              let mimeType = file.mimetype.split('/')[0];
              //nếu là image
              if (mimeType === 'image') {
                let newMessageItem = {
                  senderId: senderId,
                  receiverId: receiverId,
                  chatType: messageUtil.MESSAGE_CHAT_TYPES.PERSONAL,
                  messageType: messageUtil.MESSAGE_TYPES.IMAGE,
                  fileName: `${uuid}.${file.name}`,
                  createdAt: Date.now(),
                };
                let newMessage = await axios.post(http + '/messages', newMessageItem);
                //cập nhật thời gian
                this.updateTimeForUser(senderId, receiverId);
                return newMessage.data;
              }
              //nếu là file
              else {
                let newMessageItem = {
                  senderId: senderId,
                  receiverId: receiverId,
                  chatType: messageUtil.MESSAGE_CHAT_TYPES.PERSONAL,
                  messageType: messageUtil.MESSAGE_TYPES.FILE,
                  fileName: `${uuid}.${file.name}`,
                  createdAt: Date.now(),
                };
                let newMessage = await axios.post(http + '/messages', newMessageItem);
                //cập nhật thời gian
                this.updateTimeForUser(senderId, receiverId);
                return newMessage.data;
              }
            });
            //upload S3
            let newFiles = await uploadFilesUtil.uploadFiles(files, uuid);
            return resolve({
              newMessages: await Promise.all(getNewMessages),
              newFiles: newFiles
            });
          }
        }
        //upload 1 file vào message
        else {
          //kiểm tra image hay file
          let mimeType = files.mimetype.split('/')[0];
          //nếu là nhóm
          if (isChatGroup === 'true') {
            //nếu là image
            if (mimeType === 'image') {
              //tạo tin nhắn mới
              let newMessageItem = {
                senderId: senderId,
                receiverId: receiverId,
                chatType: messageUtil.MESSAGE_CHAT_TYPES.GROUP,
                messageType: messageUtil.MESSAGE_TYPES.IMAGE,
                fileName: `${uuid}.${files.name}`,
                createdAt: Date.now(),
              };
              let newMessage = await axios.post(http + '/messages', newMessageItem);
              //cập nhật thời gian
              this.updateTimeForGroup(receiverId);
              //upload S3
              let newFiles = await uploadFilesUtil.uploadFiles(files, uuid);
              return resolve({
                newMessages: newMessage.data,
                newFiles: newFiles
              });
            }
            //nếu là file
            else {
              //tạo tin nhắn mới
              let newMessageItem = {
                senderId: senderId,
                receiverId: receiverId,
                chatType: messageUtil.MESSAGE_CHAT_TYPES.GROUP,
                messageType: messageUtil.MESSAGE_TYPES.FILE,
                fileName: `${uuid}.${files.name}`,
                createdAt: Date.now(),
              };
              let newMessage = await axios.post(http + '/messages', newMessageItem);
              //cập nhật thời gian
              this.updateTimeForGroup(receiverId);
              //upload S3
              let newFiles = await uploadFilesUtil.uploadFiles(files, uuid);
              return resolve({
                newMessages: newMessage.data,
                newFiles: newFiles
              });
            }
          }
          //nếu là cá nhân
          else {
            //nếu là image
            if (mimeType === 'image') {
              //tạo tin nhắn mới
              let newMessageItem = {
                senderId: senderId,
                receiverId: receiverId,
                chatType: messageUtil.MESSAGE_CHAT_TYPES.PERSONAL,
                messageType: messageUtil.MESSAGE_TYPES.IMAGE,
                fileName: `${uuid}.${files.name}`,
                createdAt: Date.now(),
              };
              let newMessage = await axios.post(http + '/messages', newMessageItem);
              //cập nhật thời gian
              this.updateTimeForUser(senderId, receiverId);
              //upload S3
              let newFiles = await uploadFilesUtil.uploadFiles(files, uuid);
              return resolve({
                newMessages: newMessage.data,
                newFiles: newFiles
              });
            }
            //nếu là file
            else {
              //tạo tin nhắn mới
              let newMessageItem = {
                senderId: senderId,
                receiverId: receiverId,
                chatType: messageUtil.MESSAGE_CHAT_TYPES.PERSONAL,
                messageType: messageUtil.MESSAGE_TYPES.FILE,
                fileName: `${uuid}.${files.name}`,
                createdAt: Date.now(),
              };
              let newMessage = await axios.post(http + '/messages', newMessageItem);
              //cập nhật thời gian
              this.updateTimeForUser(senderId, receiverId);
              //upload S3
              let newFiles = await uploadFilesUtil.uploadFiles(files, uuid);
              return resolve({
                newMessages: newMessage.data,
                newFiles: newFiles
              });
            }
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteTextAndEmoji(messageId) {
    return new Promise(async (resolve, reject) => {
      await axios.delete(http + '/messages/' + messageId)
        .then(resolve(true))
        .catch(reject(false));
    });
  }

  // cập nhật thời gian
  async updateTimeForUser(senderId, receiverId) {
    let getSender = await axios.get(http + '/users/' + senderId);
    let getReceiver = await axios.get(http + '/users/' + receiverId);
    let sender = getSender.data.user;
    let receiver = getReceiver.data.user;
    sender.updatedAt = Date.now();
    receiver.updatedAt = Date.now();
    await axios.put(http + '/users/' + senderId, sender);
    await axios.put(http + '/users/' + receiverId, receiver);
  }

  // cập nhật thời gian và số lượng tin nhắn của nhóm
  async updateTimeForGroup(receiverId) {
    let getChatGroupReceiver = await axios.get(http + '/chatGroups/' + receiverId);
    let chatGroup = getChatGroupReceiver.data;
    chatGroup.updatedAt = Date.now();
    chatGroup.messageAmount = chatGroup.messageAmount + 1;
    await axios.put(http + '/chatGroups/' + receiverId, chatGroup);
  }
}

module.exports = new MessageService();
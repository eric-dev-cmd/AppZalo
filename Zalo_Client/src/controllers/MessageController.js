const messageService = require('../services/messageService');

class MessageController {
    async addInfoMessage(req, res) {
        let senderId = req.user.data.user._id;
        let receiverId = req.body.uid;
        let messageVal = req.body.messageVal;
        let messageType = req.body.messageType;
        let newMessage = await messageService.addInfoMessage(senderId, receiverId, messageVal, messageType);
        return res.send(newMessage);
    }

    async addNewText(req, res) {
        let senderId = req.user.data.user._id; // id cua user dang nhap
        let receiverId = req.body.uid; // id cua user muon ket ban
        let messageVal = req.body.messageVal; //tin nhắn từ client gửi 
        let isChatGroup = req.body.isChatGroup; // ktra phải nhóm hay ko?
        let newMessage = await messageService.addNewText(senderId, receiverId, messageVal, isChatGroup);
        return res.send(newMessage);
    }

    async uploadFiles(req, res) {
        let files = req.files.files; //req.files: {files: [{..}]}
        let senderId = req.user.data.user._id;
        let receiverId = req.body.receiverId;
        let isChatGroup = req.body.isChatGroup
        let newMessages = await messageService.uploadFiles(files, senderId, receiverId, isChatGroup);
        return res.send({
            messages: newMessages,
            isChatGroup: isChatGroup
        });
    }

    async updateIsRead(req, res) {
        let message = req.body.message;
        let request = await messageService.updateIsRead(message);
        return res.send({
            success: !!request
        });
    }

    async deleteText(req, res) {
        let messageId = req.body.messageId;
        let deleteResquest = await messageService.deleteText(messageId);
        return res.send({
            success: !!deleteResquest
        });
    }

    async deleteFile(req, res) {
        let messageId = req.body.messageId;
        let deleteResquest = await messageService.deleteFile(messageId);
        return res.send({
            success: !!deleteResquest
        });
    }

    async deleteConversation(req, res) {
        let messages = req.body.messages;
        let deleteResquest = await messageService.deleteConversation(messages);
        return res.send({
            success: !!deleteResquest
        });
    }

    async updateReaction(req, res) {
        let messageId = req.body.messageId;
        let userId = req.body.userId;
        let icon = req.body.icon;
        let message = await messageService.updateReaction(messageId, userId, icon);
        return res.send({
            message: message
        });
    }
}
module.exports = new MessageController;
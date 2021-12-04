const contactService = require('../services/contactService');

class ContactController {
    async addNewFriend(req, res) {
        const senderId = req.user.data.user._id; // id cua user dang nhap
        const receiverId = req.body.userId; // id cua user muon ket ban
        const newContact = await contactService.addNewFriend(senderId, receiverId);
        return res.send({
            success: !!newContact
        });
    }

    async removeFriend(req, res) {
        const senderId = req.user.data.user._id;
        const receiverId = req.body.userId;
        const removeRequest = await contactService.remove(senderId, receiverId);
        return res.send({
            success: !!removeRequest
        });
    }

    async denyRequestFriend(req, res) {
        const receiverId = req.user.data.user._id;
        const senderId = req.body.userId;
        const removeRequest = await contactService.remove(senderId, receiverId);
        return res.send({
            success: !!removeRequest
        });
    }

    async acceptRequestFriend(req, res) {
        const receiverId = req.user.data.user._id;
        const senderId = req.body.userId;
        const acceptRequest = await contactService.acceptRequestFriend(senderId, receiverId);
        return res.send({
            success: !!acceptRequest
        });
    }

}

module.exports = new ContactController();
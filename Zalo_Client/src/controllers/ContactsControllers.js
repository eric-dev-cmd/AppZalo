const contactService = require('../services/contactService');

class ContactController {
    async addNew(req, res) {
        const senderId = req.user.data.user._id; // id cua user dang nhap
        const receiverId = req.body.uid; // id cua user muon ket ban
        const newContact = await contactService.addNew(senderId, receiverId);
        return res.send({
            success: !!newContact
        });
    }

    async remove(req, res) {
        const senderId = req.user.data.user._id;
        const receiverId = req.body.uid;
        const removeRequest = await contactService.remove(senderId, receiverId);
        return res.send({
            success: !!removeRequest
        });
    }

    async removeReceiver(req, res) {
        const receiverId = req.user.data.user._id;
        const senderId = req.body.uid;
        const removeRequest = await contactService.remove(senderId, receiverId);
        return res.send({
            success: !!removeRequest
        });
    }

    async accept(req, res) {
        const receiverId = req.user.data.user._id;
        const senderId = req.body.uid;
        const acceptRequest = await contactService.accept(senderId, receiverId);
        return res.send({
            success: !!acceptRequest
        });
    }

}

module.exports = new ContactController();
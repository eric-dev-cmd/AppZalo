const contactService = require('../services/contactService');

class ContactController {
    async addNew(req, res) {
        try {
            const senderId = req.user.data.user._id; // id cua user dang nhap
            const receiverId = req.body.uid; // id cua user muon ket ban
            const newContact = await contactService.addNew(senderId, receiverId);
            return res.status(200).send({ success: !!newContact });
        } catch (error) {
            return res.status(500).send(error);
        }

    }

    async remove(req, res) {
        try {
            const senderId = req.user.data.user._id;
            const receiverId = req.body.uid;
            const removeRequest = await contactService.remove(senderId, receiverId);
            return res.status(200).send({ success: !!removeRequest });
        } catch (error) {
            return res.status(500).send(error);
        }
    }

    async removeReceiver(req, res) {
        try {
            const receiverId = req.user.data.user._id;
            const senderId = req.body.uid;
            const removeRequest = await contactService.remove(senderId, receiverId);
            return res.status(200).send({ success: !!removeRequest });

        } catch (error) {
            return res.status(500).send(error);
        }
    }

    async accept(req, res) {
        try {
            const receiverId = req.user.data.user._id;
            const senderId = req.body.uid;
            const acceptRequest = await contactService.accept(senderId, receiverId);
            return res.status(200).send({ success: !!acceptRequest });

        } catch (error) {
            return res.status(500).send(error);
        }
    }

}

module.exports = new ContactController();

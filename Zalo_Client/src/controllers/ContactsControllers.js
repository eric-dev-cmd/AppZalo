const axios = require('axios');
const http = require('./http');

const contactService = require('../services/contactService');

class ContactController {
    async addNew(req, res) {
        try {
            const currentUserId = req.user.data.user._id; // id cua user dang nhap
            const contactId = req.body.uid; // id cua user muon ket ban

            const newContact = await contactService.addNew(currentUserId, contactId);
            return res.status(200).send({ success: !!newContact });
        } catch (error) {
            return res.status(500).send(error);
        }

    }

    async remove(req, res) {
        try {
            const currentUserId = req.user.data.user._id;
            const contactId = req.body.uid;
            const removeRequest = await contactService.remove(currentUserId, contactId);
            return res.status(200).send({ success: !!removeRequest });

        } catch (error) {
            return res.status(500).send(error);
        }
    }
}

module.exports = new ContactController();

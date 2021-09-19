const Contact = require('../models/contactModel');

class ContactsController {
    getAPI(req, res, next){
        Contact.find({})
            .then(contacts => {
                res.json({contacts})
            })
            .catch(next);
    }

    getAPIByUserId(req, res, next){
        Contact.findOne({'userId': req.params.userId})
            .then(contacts => {
                res.json({contacts})
            })
            .catch(next);
    }

    getAPIByContactId(req, res, next){
        Contact.findOne({'contactId': req.params.contactId})
            .then(contacts => {
                res.json({contacts})
            })
            .catch(next);
    }

    getAPIById(req, res, next) {
        Contact.findById(req.params.id)
            .then(contact => {
                res.json({contact});
            })
            .catch(next);
    }

    postAPI(req, res, next) {
        const contact = new Contact(req.body);
        contact.save()
            .then(contact => {
                res.json({contact});
            })
            .catch(next);
    }

    putAPI(req, res, next) {
        const data = req.body;
        Contact.findByIdAndUpdate(req.params.id, data)
            .then(contact => {
                res.json({contact});
            })
            .catch(next)
    }

    deleteAPI(req, res, next) {
        Contact.findByIdAndRemove(req.params.id)
            .then(contact => {
                res.json(contact);
            })
            .catch(next);
    }
}

module.exports = new ContactsController;
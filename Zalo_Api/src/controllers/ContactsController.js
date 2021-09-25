const Contact = require('../models/contactModel');

class ContactsController {
    getAPI(req, res, next) {
        Contact.find({})
            .then(contacts => {
                res.json({
                    contacts
                })
            })
            .catch(next);
    }

    getAPIByUserId(req, res, next) {
        Contact.find({
                'senderId': req.params.userId
            })
            .then(contacts => {
                res.json(contacts)
            })
            .catch(next);
    }

    getAPIByContact(req, res, next) {
        Contact.find({
                '$or': [{
                    'senderId': req.params.userId,
                    'status': true
                }, {
                    'receiverId': req.params.userId,
                    'status': true
                }]
            })
            .then(contacts => {
                res.json(contacts)
            })
            .catch(next);
    }

    getAPIByContactId(req, res, next) {
        Contact.find({
                'receiverId': req.params.contactId
            })
            .then(contacts => {
                res.json(contacts)
            })
            .catch(next);
    }

    getAPIByUserIdAndContactId(req, res, next) {
        Contact.findOne({
                '$or': [{
                        '$and': [{
                                'senderId': req.params.userid
                            },
                            {
                                'receiverId': req.params.contactid
                            }
                        ]
                    },
                    {
                        '$and': [{
                                'senderId': req.params.contactid
                            },
                            {
                                'receiverId': req.params.userid
                            }
                        ]
                    }
                ]
            })
            .then(contact => {
                res.status(200).json({
                    contact
                });
            })
            .catch(next);
    }

    getAPIById(req, res, next) {
        Contact.findById(req.params.id)
            .then(contact => {
                res.json({
                    contact
                });
            })
            .catch(next);
    }

    postAPI(req, res, next) {
        const contact = new Contact(req.body);
        contact.save()
            .then(contact => {
                res.json({
                    contact
                });
            })
            .catch(next);
    }

    putAPI(req, res, next) {
        const data = req.body;
        Contact.findByIdAndUpdate(req.params.id, data)
            .then(res.status(200).send(true))
            .catch(next)
    }

    deleteAPI(req, res, next) {
        Contact.findByIdAndRemove(req.params.id)
            .then(res.status(200).send(true))
            .catch(next);
    }
}

module.exports = new ContactsController;
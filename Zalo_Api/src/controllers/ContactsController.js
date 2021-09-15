const Contact = require('../models/contactModel');

class ContactsController {
    getAPI(req, res, next){
        Contact.find({})
            .then(apis => {
                res.json(apis)
            })
            .catch(next);
    }

    getAPIById(req, res, next) {
        Contact.findById(req.params.id)
            .then(api => {
                res.json({api});
            })
            .catch(next);
    }

    postAPI(req, res, next) {
        const contact = new Contact(req.body);
        contact.save()
            .then(api => {
                res.json({api});
            })
            .catch(next);
    }

    putAPI(req, res, next) {
        const data = req.body;
        Contact.findByIdAndUpdate(req.params.id, data)
            .then(api => {
                res.json({api});
            })
            .catch(next)
    }

    deleteAPI(req, res, next) {
        Contact.findByIdAndRemove(req.params.id)
            .then(api => {
                res.json(api);
            })
            .catch(next);
    }
}

module.exports = new ContactsController;
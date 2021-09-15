const Notification = require('../models/notificationModel');

class NotificationsController {
    getAPI(req, res, next){
        Notification.find({})
            .then(apis => {
                res.json(apis)
            })
            .catch(next);
    }

    getAPIById(req, res, next) {
        Notification.findById(req.params.id)
            .then(api => {
                res.json({api});
            })
            .catch(next);
    }

    postAPI(req, res, next) {
        const notification = new Notification(req.body);
        notification.save()
            .then(api => {
                res.json({api});
            })
            .catch(next);

    }

    putAPI(req, res, next) {
        const data = req.body;
        Notification.findByIdAndUpdate(req.params.id, data)
            .then(api => {
                res.json({api});
            })
            .catch(next)
    }

    deleteAPI(req, res, next) {
        Notification.findByIdAndRemove(req.params.id)
            .then(api => {
                res.json(api);
            })
            .catch(next);
    }
}

module.exports = new NotificationsController;
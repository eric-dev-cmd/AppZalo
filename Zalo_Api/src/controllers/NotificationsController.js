const Notification = require('../models/notificationModel');

class NotificationsController {
    getAPI(req, res, next){
        Notification.find({})
            .then(apis => {
                res.json(apis)
            })
            .catch(next);
    }

    getAPIBySenderIdAndReceiverIdAndType(req, res, next){
        Notification.findOne({
            '$and': [
                { 'senderId': req.params.senderId },
                { 'receiverId': req.params.receiverId },
                { 'type': req.params.type }
            ]})
            .then(notification => {
                res.json({notification})
            })
            .catch(next);
    }

    getAPIByReceiverIdAndLimit(req, res, next){
        Notification.find({'receiverId': req.params.receiverid})
            .sort({'createAt' : -1})
            .limit(req.params.limit).exec()
            .then(notifications => {
                res.json(notifications)
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
            .then(res.status(200).send(true))
            .catch(next);

    }

    putAPI(req, res, next) {
        const data = req.body;
        Notification.findByIdAndUpdate(req.params.id, data)
            .then(res.status(200).send(true))
            .catch(next)
    }

    deleteAPI(req, res, next) {
        Notification.findByIdAndRemove(req.params.id)
            .then(res.status(200).send(true))
            .catch(next);
    }
}

module.exports = new NotificationsController;
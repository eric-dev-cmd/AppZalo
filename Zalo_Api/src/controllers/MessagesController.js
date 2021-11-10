const Message = require('../models/messageModel');
const sortJsonArray = require('sort-json-array');

class MessagesController {
    getAPI(req, res, next) {
        Message.find({})
            .then(apis => {
                res.json(apis)
            })
            .catch(next);
    }

    getAPIById(req, res, next) {
        Message.findById(req.params.id)
            .then(api => {
                res.json(api);
            })
            .catch(next);
    }

    //get messageType 'personal'
    getAPIBySenderIdOrReceiverId(req, res, next) {
        Message.find({
                '$or': [{
                    'senderId': req.params.id,
                    'chatType': 'personal'
                }, {
                    'receiverId': req.params.id,
                    'chatType': 'personal'
                }]
            }).exec()
            .then(api => {
                res.json(api);
            })
            .catch(next);
    }

    getAPIByText(req, res, next) {
        Message.find({
                'text': req.params.text
            }).exec()
            .then(api => {
                res.json(api);
            })
            .catch(next);
    }

    getAPIByReceiverId(req, res, next) {
        let limit = 10;
        let startFrom = req.query.startFrom;
        let start = Number(startFrom);
        if (start > 0) {
            Message.find({
                    'receiverId': req.params.receiverid
                }).sort({
                    'createdAt': -1
                })
                .limit(limit).skip(start).exec()
                .then(api => {
                    res.json(sortJsonArray(api, 'createdAt', 'des'));
                })
                .catch(next);
        } else {
            Message.find({
                    'receiverId': req.params.receiverid
                }).sort({
                    'createdAt': -1
                })
                .limit(limit).skip(start).exec()
                .then(api => {
                    res.json(sortJsonArray(api, 'createdAt', 'asc'));
                })
                .catch(next);
        }
    }

    getAPIBySenderIdAndReceiverId(req, res, next) {
        Message.find({
                '$or': [{
                        '$and': [{
                                'senderId': req.params.senderid
                            },
                            {
                                'receiverId': req.params.receiverid
                            }
                        ]
                    },
                    {
                        '$and': [{
                                'senderId': req.params.receiverid
                            },
                            {
                                'receiverId': req.params.senderid
                            }
                        ]
                    }
                ]
            }).sort({
                'createdAt': 1
            }).exec()
            .then(api => {
                res.json(api);
            })
            .catch(next);
    }

    postAPI(req, res, next) {
        const message = new Message(req.body);
        message.save()
            .then(api => {
                res.json(api);
            })
            .catch(next);

    }

    putAPI(req, res, next) {
        const data = req.body;
        Message.findByIdAndUpdate(req.params.id, data)
            .then(api => {
                res.json(api);
            })
            .catch(next)
    }

    deleteAPI(req, res, next) {
        Message.findByIdAndRemove(req.params.id)
            .then(api => {
                res.json(api);
            })
            .catch(next);
    }
}

module.exports = new MessagesController;
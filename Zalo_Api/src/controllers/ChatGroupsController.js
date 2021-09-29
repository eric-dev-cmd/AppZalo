const ChatGroup = require('../models/chatGroupModel');

class ChatGroupsController {
    getAPI(req, res, next) {
        ChatGroup.find({})
            .then(apis => {
                res.json(apis)
            })
            .catch(next);
    }

    getAPIById(req, res, next) {
        ChatGroup.findById(req.params.id)
            .then(api => {
                res.json(api);
            })
            .catch(next);
    }

    getAPIByUserIdToArray(req, res, next) {
        ChatGroup.find({
                'members': {
                    '$elemMatch': {'userId': req.params.id}
                }
            })
            .then(api => {
                res.json(api);
            })
            .catch(next);
    }

    postAPI(req, res, next) {
        const chatGroup = new ChatGroup(req.body);
        chatGroup.save()
            .then(api => {
                res.json(api);
            })
            .catch(next);
    }

    putAPI(req, res, next) {
        const data = req.body;
        ChatGroup.findByIdAndUpdate(req.params.id, data)
            .then(res.status(200).send(true))
            .catch(next)
    }

    deleteAPI(req, res, next) {
        ChatGroup.findByIdAndRemove(req.params.id)
            .then(res.status(200).send(true))
            .catch(next);
    }
}

module.exports = new ChatGroupsController;
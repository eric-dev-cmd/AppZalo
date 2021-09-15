const ChatGroup = require('../models/chatGroupModel');

class ChatGroupsController {
    getAPI(req, res, next){
        ChatGroup.find({})
            .then(apis => {
                res.json(apis)
            })
            .catch(next);
    }

    getAPIById(req, res, next) {
        ChatGroup.findById(req.params.id)
            .then(api => {
                res.json({api});
            })
            .catch(next);
    }

    postAPI(req, res, next) {
        const chatGroup = new ChatGroup(req.body);
        chatGroup.save()
            .then(api => {
                res.json({api});
            })
            .catch(next);
    }

    putAPI(req, res, next) {
        const data = req.body;
        ChatGroup.findByIdAndUpdate(req.params.id, data)
            .then(api => {
                res.json({api});
            })
            .catch(next)
    }

    deleteAPI(req, res, next) {
        ChatGroup.findByIdAndRemove(req.params.id)
            .then(api => {
                res.json(api);
            })
            .catch(next);
    }
}

module.exports = new ChatGroupsController;
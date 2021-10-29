const chatGroupService = require('../services/chatGroupService');
class GroupController {
    async createGroup(req, res) {
        try {
            let groupName = req.body.groupName;
            let listId = req.body.idUser;
            let currentUserId = req.user.data.user._id;
            const newGroup = await chatGroupService.createGroup(groupName, listId, currentUserId);
            return res.status(200).send({
                group: newGroup
            });
        } catch (error) {
            return res.status(500).send(error);
        }


    }
}
module.exports = new GroupController();
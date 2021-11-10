const chatGroupService = require('../services/chatGroupService');
class GroupController {
    async createGroup(req, res) {
        let groupName = req.body.groupName;
        let listId = req.body.idUser;
        let currentUserId = req.user.data.user._id;
        const newGroup = await chatGroupService.createGroup(groupName, listId, currentUserId);
        return res.send({
            group: newGroup
        });
    }

    async addUserToGroup(req, res) {
        let listId = req.body.idUser;
        let groupId = req.body.groupId;
        const group = await chatGroupService.addUserToGroup(groupId, listId);
        return res.send({
            group: group
        });
    }

    async deleteGroup(req, res) {
        let groupId = req.body.groupId;
        let currentUserId = req.user.data.user._id;
        const group = await chatGroupService.deleteGroup(groupId, currentUserId);
        return res.send({
            group: group
        });
    }
}
module.exports = new GroupController();
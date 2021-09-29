const contactService = require('../services/contactService');
const chatGroupService = require('../services/chatGroupService');
const axios = require('axios');
const http = require('../controllers/http');

class MessageService {
    getListItemContacts(senderId){
        return new Promise(async (resolve, reject) => {
            try {
                let users = await contactService.getContacts(senderId);
                let groups = await  chatGroupService.getChatGroups(senderId);
                let getAll = users.concat(groups);
                resolve({
                    getAll: getAll,
                    users: users,
                    groups: groups
                });
            } catch (error) {
                reject(error);
            }
        });
        
    }

}

module.exports = new MessageService;
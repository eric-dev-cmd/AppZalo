const axios = require('axios');
const http = require('../controllers/http');
const NotificationUtil = require('../utils/notifications');

class ContactService {
    addNew(currentUserId, contactId) {
        return new Promise(async (resolve, reject) => {
            let contactExists = await this.checkExistsContact(currentUserId, contactId);
            if (contactExists !== null) {
                return reject(false);
            } else {
                //create contact
                let newContactItem = {
                    userId: currentUserId,
                    contactId: contactId
                };
                let newContact = await axios.post(http + '/contacts', newContactItem);

                //create notification
                let newNotificationItem = {
                    senderId: currentUserId,
                    receiverId: contactId,
                    type: NotificationUtil.NOTIFICATION_TYPES.ADD_CONTACT
                }
                await axios.post(http + '/notifications', newNotificationItem);
                return resolve(newContact);
            }
        })
    }

    remove(currentUserId, contactId) {
        return new Promise(async (resolve, reject) => {
            let findContact = await this.checkExistsContact(currentUserId, contactId);
            let findNotification = await this.checkExistsNotification(currentUserId, contactId, NotificationUtil.NOTIFICATION_TYPES.ADD_CONTACT)
            if(findContact !== null && findNotification !== null){
                await axios.delete(http + '/notifications/' + findNotification._id)
                await axios.delete(http + '/contacts/' + findContact._id)
                .then(resolve(true))
                .catch(reject(false));
            }
        })
    }

    async checkExistsContact(userId, contactId) {
        let checkExists = await axios.get(http + '/contacts/search/' + userId + '/' + contactId)
        return checkExists.data.contact;
    }

    async checkExistsNotification(userId, contactId, type) {
        let checkExists = await axios.get(http + '/notifications/search/' + userId + '/' + contactId + '/' + type);
        return checkExists.data.notification;
    }
}

module.exports = new ContactService;
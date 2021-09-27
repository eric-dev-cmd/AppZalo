const axios = require('axios');
const http = require('../controllers/http');
const NotificationUtil = require('../utils/notifications');

class ContactService {
    addNew(senderId, receiverId) {
        return new Promise(async (resolve, reject) => {
            let contactExists = await this.checkExistsContact(senderId, receiverId);
            if (contactExists !== null) {
                return reject(false);
            } else {
                //create contact
                let newContactItem = {
                    senderId: senderId,
                    receiverId: receiverId
                };
                let newContact = await axios.post(http + '/contacts', newContactItem);

                //create notification
                let newNotificationItem = {
                    senderId: senderId,
                    receiverId: receiverId,
                    type: NotificationUtil.NOTIFICATION_TYPES.ADD_CONTACT
                }
                await axios.post(http + '/notifications', newNotificationItem);
                return resolve(newContact);
            }
        })
    }

    remove(senderId, receiverId) {
        return new Promise(async (resolve, reject) => {
            let findContact = await this.checkExistsContact(senderId, receiverId);
            let findNotification = await this.checkExistsNotification(senderId, receiverId, NotificationUtil.NOTIFICATION_TYPES.ADD_CONTACT)
            if (findContact !== null && findNotification !== null) {
                await axios.delete(http + '/notifications/' + findNotification._id)
                await axios.delete(http + '/contacts/' + findContact._id)
                    .then(resolve(true))
                    .catch(reject(false));
            }
            if (findContact !== null && findContact.status === true) {

                await axios.delete(http + '/contacts/' + findContact._id)
                    .then(resolve(true))
                    .catch(reject(false));
            }
        })
    }

    accept(senderId, receiverId) {
        return new Promise(async (resolve, reject) => {
            let findContact = await this.checkExistsContact(senderId, receiverId);
            let contact = findContact;
            findContact.status = true;
            let findNotification = await this.checkExistsNotification(senderId, receiverId, NotificationUtil.NOTIFICATION_TYPES.ADD_CONTACT)
            if (findContact !== null && findNotification !== null) {
                await axios.delete(http + '/notifications/' + findNotification._id)
                await axios.put(http + '/contacts/' + contact._id, contact)
                    .then(resolve(true))
                    .catch(reject(false));
            }
        })
    }

    async checkExistsContact(senderId, receiverId) {
        let checkExists = await axios.get(http + '/contacts/search/' + senderId + '/' + receiverId)
        return checkExists.data.contact;
    }

    async checkExistsNotification(senderId, receiverId, type) {
        let checkExists = await axios.get(http + '/notifications/search/' + senderId + '/' + receiverId + '/' + type);
        return checkExists.data.notification;
    }

    getContacts(senderId) {
        return new Promise(async (resolve, reject) => {
            try {
                let contacts = await axios.get(http + '/contacts/searchContact/' + senderId);
                let getContacts = contacts.data.map(async (contact) => {
                    if (contact.receiverId !== senderId) {
                        let user = await axios.get(http + '/users/' + contact.receiverId);
                        return user.data.user;
                    } else {
                        let user = await axios.get(http + '/users/' + contact.senderId);
                        return user.data.user;
                    }
                });
                resolve(await Promise.all(getContacts))
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new ContactService;
const axios = require('axios');
const http = require('../controllers/http');
const NotificationUtil = require('../utils/notifications');

class ContactService {
    // gửi lời mời kết bạn
    addNew(senderId, receiverId) {
        return new Promise(async (resolve, reject) => {
            // kiểm tra tồn tại
            let contactExists = await this.checkExistsContact(senderId, receiverId);
            //nếu đã tồn tại thì không cho gửi
            if (contactExists !== null) {
                return reject(false);
            } else {
                //tạo mới contact
                let newContactItem = {
                    senderId: senderId,
                    receiverId: receiverId
                };
                let newContact = await axios.post(http + '/contacts', newContactItem);

                //tạo mới notification
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

    // hủy lời mời kết bạn và xóa bạn bè
    remove(senderId, receiverId) {
        return new Promise(async (resolve, reject) => {
            let findContact = await this.checkExistsContact(senderId, receiverId);
            let findNotification = await this.checkExistsNotification(senderId, receiverId, NotificationUtil.NOTIFICATION_TYPES.ADD_CONTACT)
            // nếu đã tồn tại contact và thông tin thì hủy lời mời kết bạn
            if (findContact !== null && findNotification !== null) {
                await axios.delete(http + '/notifications/' + findNotification._id)
                await axios.delete(http + '/contacts/' + findContact._id)
                    .then(resolve(true))
                    .catch(reject(false));
            }
            // nếu đã tồn tại contact và field status = true (là bạn bè) => xóa contact
            if (findContact !== null && findContact.status === true) {
                await axios.delete(http + '/contacts/' + findContact._id)
                    .then(resolve(true))
                    .catch(reject(false));
            }
        })
    }

    // đồng ý lời mời kết bạn
    accept(senderId, receiverId) {
        return new Promise(async (resolve, reject) => {
            let findContact = await this.checkExistsContact(senderId, receiverId);
            let contact = findContact;
            findContact.updatedAt = Date.now();
            // status = true là bạn bè
            findContact.status = true;
            let findNotification = await this.checkExistsNotification(senderId, receiverId, NotificationUtil.NOTIFICATION_TYPES.ADD_CONTACT)
            // nếu đã tồn tại contact và notification => delete notification và update contact
            if (findContact !== null && findNotification !== null) {
                await axios.delete(http + '/notifications/' + findNotification._id)
                await axios.put(http + '/contacts/' + contact._id, contact)
                    .then(resolve(true))
                    .catch(reject(false));
            }
        })
    }

    // kiểm tra tồn tại contact
    async checkExistsContact(senderId, receiverId) {
        let checkExists = await axios.get(http + '/contacts/search/' + senderId + '/' + receiverId)
        return checkExists.data.contact;
    }

    // kiểm tra tồn tại notification
    async checkExistsNotification(senderId, receiverId, type) {
        let checkExists = await axios.get(http + '/notifications/search/' + senderId + '/' + receiverId + '/' + type);
        return checkExists.data.notification;
    }

    //lấy danh sách bạn bè
    getContacts(senderId) {
        return new Promise(async (resolve, reject) => {
            try {
                // tìm bạn bè (status = true)
                let contacts = await axios.get(http + '/contacts/searchContact/' + senderId);
                let getContacts = contacts.data.map(async (contact) => {
                    // id của người nhận != id đang đăng nhập (senderid) thì tìm theo receiverId
                    if (contact.receiverId !== senderId) {
                        let user = await axios.get(http + '/users/' + contact.receiverId);
                        return user.data.user;
                    } else {
                        let user = await axios.get(http + '/users/' + contact.senderId);
                        return user.data.user;
                    }
                });
                let sumOfContact = 0;
                for (let i = 0; i < getContacts.length; i++) {
                    sumOfContact += 1;
                }
                resolve({
                    getContacts: await Promise.all(getContacts),
                    sumOfContact: sumOfContact
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    recentSearch(phone) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await axios.get(http + '/users/searchPhone/' + phone);
                if (user.data !== null) {
                    // set vao storelocal của recentSeach
                    searches.setRecentSearch(user.data.user._id, {
                        _id: user.data.user._id,
                        phone: user.data.user.local.phone,
                        avatar: user.data.user.avatar,
                        userName: user.data.user.userName
                    });
                }
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new ContactService;
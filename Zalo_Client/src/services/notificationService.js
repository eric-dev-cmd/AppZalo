const axios = require('axios');
const http = require('../controllers/http');
const NotificationUtil = require('../utils/notifications');

class Notification {
    getNotifications(currentId, limit = 10) {
        return new Promise(async (resolve, reject) => {
            try {
                let notifications = await axios.get(http + '/notifications/search/ReceiverIdAndLimit/' + currentId + '/' + limit);    
                let getNotiContents = notifications.data.map(async(notification) => {
                    let sender = await axios.get(http + '/users/' + notification.senderId);
                    return NotificationUtil.NotifitionUtil.getContent(notification.type, notification.isRead, sender.data.user._id, sender.data.user.userName, sender.data.user.avatar);
                });
                return resolve(await Promise.all(getNotiContents));
            } catch (error) {
                return reject(error)
            }
        });
    }
}
module.exports = new Notification;
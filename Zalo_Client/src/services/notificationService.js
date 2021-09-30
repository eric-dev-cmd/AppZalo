const axios = require('axios');
const http = require('../controllers/http');
const NotificationUtil = require('../utils/notifications');

class Notification {
    //lấy notification, limit = 10
    getNotifications(currentId, limit = 10) {
        return new Promise(async (resolve, reject) => {
            try {
                //tìm notifications theo người đang đăng nhập
                let notifications = await axios.get(http + '/notifications/search/ReceiverIdAndLimit/' + currentId + '/' + limit);  
                // map ds lấy đc và trả về cùng thông tin người gửi (sender)
                let getNotiContents = notifications.data.map(async(notification) => {
                    let sender = await axios.get(http + '/users/' + notification.senderId);
                    // lấy nội dung notification truyền vào thông tin của người gửi
                    return NotificationUtil.NotifitionUtil.getContent(notification.type, notification.isRead, sender.data.user._id, sender.data.user.userName, sender.data.user.avatar);
                });
                let sumOfNotification = 0;
                for (let i = 0; i < getNotiContents.length; i++) {
                    sumOfNotification += 1;
                }
                return resolve({
                    getNotiContents: await Promise.all(getNotiContents),
                    sumOfNotification: sumOfNotification
                });
            } catch (error) {
                return reject(error)
            }
        });
    }
}
module.exports = new Notification;
const {
    addSocketId,
    sendEvent,
    deleteSocketId
} = require('../utils/socket')
const userService = require('../services/userService')
class userSocket {
    checkOnlineOffline(io) {
        let clients = {};
        io.on('connection', (socket) => {
            //let senderId = socket.request.user.data.user._id;
            // let cookie = decodeURIComponent(socket.request.headers.cookie);
            // let sender = JSON.parse(cookie.split('userCookie=')[1]);
            socket.on('send-user', async (sender) => {
                clients = addSocketId(clients, sender._id, socket.id);
                let listUserIdOnline = Object.keys(clients);
                await userService.checkOnlineOffline(listUserIdOnline);
                socket.emit('check-online-offline', listUserIdOnline);

                //set user online mỗi khi đăng nhập. broadcast(gửi socket cho tất cả user trừ user hiện tại)
                socket.broadcast.emit('check-online-login', sender._id);

                socket.on('disconnect', () => {
                    clients = deleteSocketId(clients, sender._id, socket);
                    //set user offline mỗi khi đăng xuất
                    socket.broadcast.emit('check-offline-logout', sender._id);
                });
            });
        });
    }
}
module.exports = new userSocket;
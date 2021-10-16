const {
    pushSocketIdToArray,
    emitEventToArray,
    removeSocketIdFromArray
} = require('../utils/socket')
class userSocket {
    checkOnlineOffline(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let senderId = socket.request.user.data.user._id;
            clients = pushSocketIdToArray(clients, senderId, socket.id);
            let listUserIdOnline = Object.keys(clients);
            //gửi socket kiểm tra user online
            socket.emit('check-user-online-offline', listUserIdOnline);
            //set user online mỗi khi đăng nhập. broadcast(gửi socket cho tất cả user trừ user hiện tại)
            socket.broadcast.emit('check-user-online-when-login', senderId);

            socket.on('disconnect', () => {
                clients = removeSocketIdFromArray(clients, senderId, socket);
                //set user offline mỗi khi đăng xuất
                socket.broadcast.emit('check-user-offline-when-logout', senderId);
            });
        });
    }
}
module.exports = new userSocket;
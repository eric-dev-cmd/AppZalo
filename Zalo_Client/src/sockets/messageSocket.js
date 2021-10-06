const {
    pushSocketIdToArray,
    emitEventToArray,
    removeSocketIdFromArray
} = require('../utils/socket')
class MessageSocket {
    addNewTextAndEmoji(io) {
        /**
         * đối tượng clients gồm key và value
         * key: id của người dùng đang đăng nhập mỗi khi load trang
         * value: id của socket khi mỗi lần load trang
         * mỗi socketid là 1 trang đăng nhập, nhiều trang thì sẽ có nhiều socketid
         */
        let clients = {};
        io.on('connection', (socket) => {
            let sender = socket.request.user.data.user;
            //thêm socketid vào đối tượng clients vào người dùng đăng nhập
            clients = pushSocketIdToArray(clients, sender._id, socket.id);
            //thêm socketid vào đối tượng clients vào nhóm của người đăng nhập
            sender.chatGroupIds.forEach(groupId => {
                clients = pushSocketIdToArray(clients, groupId, socket.id);
            });
            //lắng nghe socket từ client gửi
            socket.on('add-new-text-emoji', (data) => {
                let respone = {
                    message: data.message,
                    isChatGroup: data.isChatGroup
                };
                //gửi socket đến cho client
                //nếu đang đăng nhập thì gửi đi cho gửi nhận tin nhắn
                if (clients[data.message.receiverId]) {
                    emitEventToArray(clients, data.message.receiverId, io, 'response-add-new-text-emoji', respone);
                };
            });
            //xóa id socket mỗi khi socket disconnect
            socket.on('disconnect', () => {
                clients = removeSocketIdFromArray(clients, sender._id, socket);
                sender.chatGroupIds.forEach(groupId => {
                    clients = removeSocketIdFromArray(clients, groupId, socket.id);
                });
            });
        });
    }
}
module.exports = new MessageSocket;
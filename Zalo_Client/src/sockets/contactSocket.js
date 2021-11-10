const {
    addSocketId,
    sendEvent,
    deleteSocketId
} = require('../utils/socket')
class ContactSocket {
    addNewContact(io) {
        /**
         * đối tượng gồm key và value
         * key: id của người dùng đang đăng nhập mỗi khi load trang
         * value: id của socket khi mỗi lần load trang
         * mỗi socketid là 1 trang đăng nhập, nhiều trang thì sẽ có nhiều socketid
         */
        let clients = {};
        io.on('connection', (socket) => {
            let senderId = socket.request.user.data.user._id;
            //push socket id vào đối tượng client có key là senderId: {'senderId' = [socketid]}
            clients = addSocketId(clients, senderId, socket.id);
            /**
             * nếu đang đăng nhập => có sắn id của người dùng thì sẽ push id socket vào
             * ngược lại, lần đầu tiên đăng nhập thì sẽ tạo phần tử đầu tiên là id socket
             */

            //nhận socket từ client
            socket.on('add-new-contact', (data) => {
                let currentUser = {
                    id: senderId,
                    userName: socket.request.user.data.user.userName,
                    avatar: socket.request.user.data.user.avatar
                };
                //gửi socket cho client
                if (clients[data.receiverId]) {
                    sendEvent(clients, data.receiverId, io, 'response-add-new-contact', currentUser);
                };
            });
             //xóa id socket mỗi khi socket disconnect
            socket.on('disconnect', () => {
                clients = deleteSocketId(clients,senderId, socket);
            });
        });
    }

    removeFriendRequest(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let senderId = socket.request.user.data.user._id;
            clients = addSocketId(clients, senderId, socket.id);
            socket.on('remove-request-contact', (data) => {
                let currentUser = {
                    id: senderId
                };
                if (clients[data.receiverId]) {
                    sendEvent(clients, data.receiverId, io, 'response-remove-request-contact', currentUser);
                };
            });
            socket.on('disconnect', () => {
                clients = deleteSocketId(clients,senderId, socket);
            });
        });
    }

    removeFriendRequestFromReceiver(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let receiverId = socket.request.user.data.user._id;
            clients = addSocketId(clients, receiverId, socket.id);
            socket.on('remove-request-contact-receiver', (data) => {
                let currentUser = {
                    id: receiverId
                }
                if (clients[data.senderId]) {
                    sendEvent(clients, data.senderId, io, 'response-remove-request-contact-receiver', currentUser);
                }
            });
            socket.on('disconnect', () => {
                clients = deleteSocketId(clients, receiverId, socket);
            })
        });
    }

    acceptContact(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let receiverId = socket.request.user.data.user._id;
            clients = addSocketId(clients, receiverId, socket.id);
            socket.on('accept-Friend-Request', (data) => {
                let currentUser = {
                    _id: receiverId,
                    userName: socket.request.user.data.user.userName,
                    avatar: socket.request.user.data.user.avatar 
                };
                if (clients[data.senderId]) {
                    sendEvent(clients, data.senderId, io, 'response-accept-Friend-Request', currentUser);
                };
            });
            socket.on('disconnect', () => {
                clients = deleteSocketId(clients, receiverId, socket);
            });
        });
    }

    deleteFriend(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let senderId = socket.request.user.data.user._id;
            clients = addSocketId(clients, senderId, socket.id);
            socket.on('delete-friend', (data) => {
                let currentUser = {
                    id: senderId
                };
                if (clients[data.receiverId]) {
                    sendEvent(clients, data.receiverId, io, 'response-delete-friend', currentUser);
                };
            });
            socket.on('disconnect', () => {
                clients = deleteSocketId(clients,senderId, socket);
            });
        });
    }

}
module.exports = new ContactSocket;
const {
    pushSocketIdToArray,
    emitEventToArray,
    removeSocketIdFromArray
} = require('../utils/socket')
class ContactSocket {
    addNewContact(io) {
        /**
         * đối tượng gồm key và value
         * key: id của người dùng đang đăng nhập
         * value: id của socket khi mỗi lần load trang
         */
        let clients = {};
        io.on('connection', (socket) => {
            let senderId = socket.request.user.data.user._id;
            clients = pushSocketIdToArray(clients, senderId, socket.id);
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
                    emitEventToArray(clients, data.receiverId, io, 'response-add-new-contact', currentUser);
                };
            });
             //xóa id socket mỗi khi socket disconnect
            socket.on('disconnect', () => {
                clients = removeSocketIdFromArray(clients,senderId, socket);
            });
        });
    }

    removeRequestContact(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let senderId = socket.request.user.data.user._id;
            clients = pushSocketIdToArray(clients, senderId, socket.id);
            socket.on('remove-request-contact', (data) => {
                let currentUser = {
                    id: senderId
                };
                if (clients[data.receiverId]) {
                    emitEventToArray(clients, data.receiverId, io, 'response-remove-request-contact', currentUser);
                };
            });
            socket.on('disconnect', () => {
                clients = removeSocketIdFromArray(clients,senderId, socket);
            });
        });
    }

    removeRequestContactReceiver(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let receiverId = socket.request.user.data.user._id;
            clients = pushSocketIdToArray(clients, receiverId, socket.id);
            socket.on('remove-request-contact-receiver', (data) => {
                let currentUser = {
                    id: receiverId
                }
                if (clients[data.senderId]) {
                    emitEventToArray(clients, data.senderId, io, 'response-remove-request-contact-receiver', currentUser);
                }
            });
            socket.on('disconnect', () => {
                clients = removeSocketIdFromArray(clients, receiverId, socket);
            })
        });
    }

    acceptContact(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let receiverId = socket.request.user.data.user._id;
            clients = pushSocketIdToArray(clients, receiverId, socket.id);
            socket.on('accept-contact', (data) => {
                let currentUser = {
                    id: receiverId,
                    userName: socket.request.user.data.user.userName,
                    avatar: socket.request.user.data.user.avatar 
                };
                if (clients[data.senderId]) {
                    emitEventToArray(clients, data.senderId, io, 'response-accept-contact', currentUser);
                };
            });
            socket.on('disconnect', () => {
                clients = removeSocketIdFromArray(clients, receiverId, socket);
            });
        });
    }

}
module.exports = new ContactSocket;
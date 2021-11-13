const {
    addSocketId,
    sendEvent,
    deleteSocketId
} = require('../utils/socket')
class ContactSocket {
    addNewContact(io) {
        let clients = {};
        io.on('connection', (socket) => {

            //let senderId = socket.request.user.data.user._id;
            // let cookie = decodeURIComponent(socket.request.headers.cookie);
            // let sender = JSON.parse(cookie.split('userCookie=')[1]);
            socket.on('send-user', (sender) => {
                clients = addSocketId(clients, sender._id, socket.id);
                socket.on('add-new-contact', (data) => {
                    let currentUser = {
                        id: sender._id,
                        userName: sender.userName,
                        avatar: sender.avatar
                    };
                    if (clients[data.receiverId]) {
                        sendEvent(clients, data.receiverId, io, 'response-add-new-contact', currentUser);
                    };
                });
                //xóa id socket mỗi khi socket disconnect
                socket.on('disconnect', () => {
                    clients = deleteSocketId(clients, sender._id, socket);
                });
            });
        });
    }

    removeFriendRequest(io) {
        let clients = {};
        io.on('connection', (socket) => {
            //let senderId = socket.request.user.data.user._id;
            // let cookie = decodeURIComponent(socket.request.headers.cookie);
            // let receiver = JSON.parse(cookie.split('userCookie=')[1]);
            socket.on('send-user', (receiver) => {
                clients = addSocketId(clients, receiver._id, socket.id);
                socket.on('remove-request-contact', (data) => {
                    let currentUser = {
                        id: receiver._id
                    };
                    if (clients[data.receiverId]) {
                        sendEvent(clients, data.receiverId, io, 'response-remove-request-contact', currentUser);
                    };
                });
                socket.on('disconnect', () => {
                    clients = deleteSocketId(clients, receiver._id, socket);
                });
            });

        });
    }

    removeFriendRequestFromReceiver(io) {
        let clients = {};
        io.on('connection', (socket) => {
            //let receiverId = socket.request.user.data.user._id;
            // let cookie = decodeURIComponent(socket.request.headers.cookie);
            // let receiver = JSON.parse(cookie.split('userCookie=')[1]);
            socket.on('send-user', (receiver) => {
                clients = addSocketId(clients, receiver._id, socket.id);
                socket.on('remove-request-contact-receiver', (data) => {
                    let currentUser = {
                        id: receiver._id
                    }
                    if (clients[data.senderId]) {
                        sendEvent(clients, data.senderId, io, 'response-remove-request-contact-receiver', currentUser);
                    }
                });
                socket.on('disconnect', () => {
                    clients = deleteSocketId(clients, receiver._id, socket);
                })
            });
        });
    }

    acceptContact(io) {
        let clients = {};
        io.on('connection', (socket) => {
            // let receiverId = socket.request.user.data.user._id;
            // let cookie = decodeURIComponent(socket.request.headers.cookie);
            // let receiver = JSON.parse(cookie.split('userCookie=')[1]);
            socket.on('send-user', (receiver) => {
                clients = addSocketId(clients, receiver._id, socket.id);
                socket.on('accept-Friend-Request', (data) => {
                    let currentUser = {
                        _id: receiver._id,
                        userName: receiver.userName,
                        avatar: receiver.avatar
                    };
                    if (clients[data.senderId]) {
                        sendEvent(clients, data.senderId, io, 'response-accept-Friend-Request', currentUser);
                    };
                });
                socket.on('disconnect', () => {
                    clients = deleteSocketId(clients, receiver._id, socket);
                });
            });
        });
    }

    deleteFriend(io) {
        let clients = {};
        io.on('connection', (socket) => {
            //let senderId = socket.request.user.data.user._id;
            // let cookie = decodeURIComponent(socket.request.headers.cookie);
            // let sender = JSON.parse(cookie.split('userCookie=')[1]);
            socket.on('send-user', (sender) => {
                clients = addSocketId(clients, sender._id, socket.id);
                socket.on('delete-friend', (data) => {
                    let currentUser = {
                        id: sender._id
                    };
                    if (clients[data.receiverId]) {
                        sendEvent(clients, data.receiverId, io, 'response-delete-friend', currentUser);
                    };
                });
                socket.on('disconnect', () => {
                    clients = deleteSocketId(clients, sender._id, socket);
                });
            });
        });
    }

}
module.exports = new ContactSocket;
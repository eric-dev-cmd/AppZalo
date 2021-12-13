const {
    addSocketId,
    sendEvent,
    deleteSocketId
} = require('../utils/socket')
class ContactSocket {
    addNewContact(io) {
        let listUsers = {};
        io.on('connection', (socket) => {

            //let senderId = socket.request.user.data.user._id;
            // let cookie = decodeURIComponent(socket.request.headers.cookie);
            // let sender = JSON.parse(cookie.split('userCookie=')[1]);
            socket.on('send-user', (sender) => {
                listUsers = addSocketId(listUsers, sender._id, socket.id);
                socket.on('add-new-contact', (data) => {
                    let currentUser = {
                        id: sender._id,
                        userName: sender.userName,
                        avatar: sender.avatar
                    };
                    if (listUsers[data.receiverId]) {
                        sendEvent(listUsers, data.receiverId, io, 'response-add-new-contact', currentUser);
                    };
                });
                //xóa id socket mỗi khi socket disconnect
                socket.on('disconnect', () => {
                    listUsers = deleteSocketId(listUsers, sender._id, socket);
                });
            });
        });
    }

    removeFriendRequest(io) {
        let listUsers = {};
        io.on('connection', (socket) => {
            //let senderId = socket.request.user.data.user._id;
            // let cookie = decodeURIComponent(socket.request.headers.cookie);
            // let receiver = JSON.parse(cookie.split('userCookie=')[1]);
            socket.on('send-user', (receiver) => {
                listUsers = addSocketId(listUsers, receiver._id, socket.id);
                socket.on('remove-request-contact', (data) => {
                    let currentUser = {
                        id: receiver._id
                    };
                    if (listUsers[data.receiverId]) {
                        sendEvent(listUsers, data.receiverId, io, 'response-remove-request-contact', currentUser);
                    };
                });
                socket.on('disconnect', () => {
                    listUsers = deleteSocketId(listUsers, receiver._id, socket);
                });
            });

        });
    }

    denyFriendRequest(io) {
        let listUsers = {};
        io.on('connection', (socket) => {
            //let receiverId = socket.request.user.data.user._id;
            // let cookie = decodeURIComponent(socket.request.headers.cookie);
            // let receiver = JSON.parse(cookie.split('userCookie=')[1]);
            socket.on('send-user', (receiver) => {
                listUsers = addSocketId(listUsers, receiver._id, socket.id);
                socket.on('deny-friend-request', (data) => {
                    let currentUser = {
                        id: receiver._id
                    }
                    if (listUsers[data.senderId]) {
                        sendEvent(listUsers, data.senderId, io, 'response-deny-friend-request', currentUser);
                    }
                });
                socket.on('disconnect', () => {
                    listUsers = deleteSocketId(listUsers, receiver._id, socket);
                })
            });
        });
    }

    acceptFriendRequest(io) {
        let listUsers = {};
        io.on('connection', (socket) => {
            // let receiverId = socket.request.user.data.user._id;
            // let cookie = decodeURIComponent(socket.request.headers.cookie);
            // let receiver = JSON.parse(cookie.split('userCookie=')[1]);
            socket.on('send-user', (receiver) => {
                listUsers = addSocketId(listUsers, receiver._id, socket.id);
                socket.on('accept-Friend-Request', (data) => {
                    let currentUser = {
                        _id: receiver._id,
                        userName: receiver.userName,
                        avatar: receiver.avatar
                    };
                    //emit cho người gửi, gửi data của người nhận
                    if (listUsers[data.senderId]) {
                        sendEvent(listUsers, data.senderId, io, 'response-accept-Friend-Request', currentUser);
                    };
                });
                socket.on('disconnect', () => {
                    listUsers = deleteSocketId(listUsers, receiver._id, socket);
                });
            });
        });
    }

    deleteFriend(io) {
        let listUsers = {};
        io.on('connection', (socket) => {
            //let senderId = socket.request.user.data.user._id;
            // let cookie = decodeURIComponent(socket.request.headers.cookie);
            // let sender = JSON.parse(cookie.split('userCookie=')[1]);
            socket.on('send-user', (sender) => {
                listUsers = addSocketId(listUsers, sender._id, socket.id);
                socket.on('delete-friend', (data) => {
                    let currentUser = {
                        id: sender._id
                    };
                    if (listUsers[data.receiverId]) {
                        sendEvent(listUsers, data.receiverId, io, 'response-delete-friend', currentUser);
                    };
                });
                socket.on('disconnect', () => {
                    listUsers = deleteSocketId(listUsers, sender._id, socket);
                });
            });
        });
    }

}
module.exports = new ContactSocket;
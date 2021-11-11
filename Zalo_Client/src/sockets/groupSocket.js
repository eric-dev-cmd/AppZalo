const {
    addSocketId,
    sendEvent,
    deleteSocketId
} = require('../utils/socket')
class groupSocket {
    createGroup(io) {
        let clients = {};
        io.on('connection', (socket) => {
            // let sender = socket.request.user.data.user;
            let cookie = decodeURIComponent(socket.request.headers.cookie);
            let sender = JSON.parse(cookie.split('userCookie=')[1]);
            clients = addSocketId(clients, sender._id, socket.id);
            //thêm socketid vào đối tượng clients vào nhóm của người đăng nhập
            sender.chatGroupIds.forEach((groupId) => {
                clients = addSocketId(clients, groupId, socket.id);
            });
            //lắng nghe socket từ client gửi
            socket.on('create-group', (data) => {
                clients = addSocketId(clients, data.group._id, socket.id);
                let response = {
                    group: data.group
                };
                let members = data.group.members.filter(member => member.userId != sender._id);
                members.forEach(members => {
                    //gửi socket đến cho client
                    if (clients[members.userId]) {
                        sendEvent(clients, members.userId, io, 'response-create-group', response);
                    }
                });
            });

            //lắng nghe socket từ client gửi
            socket.on('members-get-socketId', (data) => {
                clients = addSocketId(clients, data.group._id, socket.id);
            });

            //xóa id socket mỗi khi socket disconnect
            socket.on('disconnect', () => {
                clients = deleteSocketId(clients, sender._id, socket);
                sender.chatGroupIds.forEach((groupId) => {
                    clients = deleteSocketId(clients, groupId, socket);
                });
            });
        });
    }

    addUserToGroup(io) {
        let clients = {};
        io.on('connection', (socket) => {
            //let sender = socket.request.user.data.user;
            let cookie = decodeURIComponent(socket.request.headers.cookie);
            let sender = JSON.parse(cookie.split('userCookie=')[1]);
            clients = addSocketId(clients, sender._id, socket.id);
            //thêm socketid vào đối tượng clients vào nhóm của người đăng nhập
            sender.chatGroupIds.forEach((groupId) => {
                clients = addSocketId(clients, groupId, socket.id);
            });
            //lắng nghe socket từ client gửi
            socket.on('add-user-to-group', (data) => {
                clients = addSocketId(clients, data.group._id, socket.id);
                let response = {
                    group: data.group,
                    membersPre: data.membersPre
                };
                let members = data.group.members.filter(member => member.userId != sender._id);
                members.forEach(member => {
                    //gửi socket đến cho client
                    if (clients[member.userId]) {
                        sendEvent(clients, member.userId, io, 'response-add-user-to-group', response);
                    }
                });
            });
            //xóa id socket mỗi khi socket disconnect
            socket.on('disconnect', () => {
                clients = deleteSocketId(clients, sender._id, socket);
                sender.chatGroupIds.forEach((groupId) => {
                    clients = deleteSocketId(clients, groupId, socket);
                });
            });
        });
    }

    deleteGroup(io) {
        let clients = {};
        io.on('connection', (socket) => {
            //let sender = socket.request.user.data.user;
            let cookie = decodeURIComponent(socket.request.headers.cookie);
            let sender = JSON.parse(cookie.split('userCookie=')[1]);
            clients = addSocketId(clients, sender._id, socket.id);
            //thêm socketid vào đối tượng clients vào nhóm của người đăng nhập
            sender.chatGroupIds.forEach((groupId) => {
                clients = addSocketId(clients, groupId, socket.id);
            });

            //khi tạo nhóm mới => thêm socketid của nhóm
            socket.on('create-group', (data) => {
                clients = addSocketId(clients, data.group._id, socket.id);
            });

            socket.on('members-get-socketId', (data) => {
                clients = addSocketId(clients, data.group._id, socket.id);
            });

            //lắng nghe socket từ client gửi
            socket.on('delete-group', (data) => {
                let response = {
                    groupId: data.groupId,
                };
                if (clients[data.groupId]) {
                    sendEvent(clients, data.groupId, io, 'response-delete-group', response);
                }
            });
            //xóa id socket mỗi khi socket disconnect
            socket.on('disconnect', () => {
                clients = deleteSocketId(clients, sender._id, socket);
                sender.chatGroupIds.forEach((groupId) => {
                    clients = deleteSocketId(clients, groupId, socket);
                });
            });
        });
    }

    leaveGroup(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let cookie = decodeURIComponent(socket.request.headers.cookie);
            let sender = JSON.parse(cookie.split('userCookie=')[1]);
            clients = addSocketId(clients, sender._id, socket.id);
            //thêm socketid vào đối tượng clients vào nhóm của người đăng nhập
            sender.chatGroupIds.forEach((groupId) => {
                clients = addSocketId(clients, groupId, socket.id);
            });
            //lắng nghe socket từ client gửi
            socket.on('leave-group', (data) => {
                let response = {
                    group: data.group
                };
                let members = data.group.members.filter(member => member.userId != sender._id);
                members.forEach(members => {
                    if (clients[members.userId]) {
                        sendEvent(clients, members.userId, io, 'response-leave-group', response);
                    }
                });
            });
            //xóa id socket mỗi khi socket disconnect
            socket.on('disconnect', () => {
                clients = deleteSocketId(clients, sender._id, socket);
                sender.chatGroupIds.forEach((groupId) => {
                    clients = deleteSocketId(clients, groupId, socket);
                });
            });
        });
    }
}
module.exports = new groupSocket;
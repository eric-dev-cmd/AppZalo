const {
    pushSocketIdToArray,
    emitEventToArray,
    removeSocketIdFromArray
} = require('../utils/socket')
class groupSocket {
    createGroup(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let sender = socket.request.user.data.user;
            //thêm socketid vào đối tượng clients vào người dùng đăng nhập
            clients = pushSocketIdToArray(clients, sender._id, socket.id);
            //thêm socketid vào đối tượng clients vào nhóm của người đăng nhập
            sender.chatGroupIds.forEach((groupId) => {
                clients = pushSocketIdToArray(clients, groupId, socket.id);
            });
            //lắng nghe socket từ client gửi
            socket.on('create-group', (data) => {
                let response = {
                    group: data.group,
                };
                data.group.members.forEach(members => {
                    //gửi socket đến cho client
                    if (clients[members.userId]) {
                        emitEventToArray(clients, members.userId, io, 'response-create-group', response);
                    }
                });
            });
            //xóa id socket mỗi khi socket disconnect
            socket.on('disconnect', () => {
                clients = removeSocketIdFromArray(clients, sender._id, socket);
                sender.chatGroupIds.forEach((groupId) => {
                    clients = removeSocketIdFromArray(clients, groupId, socket);
                });
            });
        });
    }

    deleteGroup(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let sender = socket.request.user.data.user;
            //thêm socketid vào đối tượng clients vào người dùng đăng nhập
            clients = pushSocketIdToArray(clients, sender._id, socket.id);
            //thêm socketid vào đối tượng clients vào nhóm của người đăng nhập
            sender.chatGroupIds.forEach((groupId) => {
                clients = pushSocketIdToArray(clients, groupId, socket.id);
            });
            //lắng nghe socket từ client gửi
            socket.on('delete-group', (data) => {
                let response = {
                    groupId: data.groupId,
                };
                if (clients[data.groupId]) {
                    emitEventToArray(clients, data.groupId, io, 'response-delete-group', response);
                }
            });
            //xóa id socket mỗi khi socket disconnect
            socket.on('disconnect', () => {
                clients = removeSocketIdFromArray(clients, sender._id, socket);
                sender.chatGroupIds.forEach((groupId) => {
                    clients = removeSocketIdFromArray(clients, groupId, socket);
                });
            });
        });
    }

    leaveGroup(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let sender = socket.request.user.data.user;
            //thêm socketid vào đối tượng clients vào người dùng đăng nhập
            clients = pushSocketIdToArray(clients, sender._id, socket.id);
            //thêm socketid vào đối tượng clients vào nhóm của người đăng nhập
            sender.chatGroupIds.forEach((groupId) => {
                clients = pushSocketIdToArray(clients, groupId, socket.id);
            });
            //lắng nghe socket từ client gửi
            socket.on('leave-group', (data) => {
                let response = {
                    groupId: data.groupId,
                };
                if (clients[data.groupId]) {
                    emitEventToArray(clients, data.groupId, io, 'response-leave-group', response);
                }

            });
            //xóa id socket mỗi khi socket disconnect
            socket.on('disconnect', () => {
                clients = removeSocketIdFromArray(clients, sender._id, socket);
                sender.chatGroupIds.forEach((groupId) => {
                    clients = removeSocketIdFromArray(clients, groupId, socket);
                });
            });
        });
    }
}
module.exports = new groupSocket;
const {
    pushSocketIdToArray,
    emitEventToArray,
    removeSocketIdFromArray
} = require('../utils/socket')
class videoCallSocket {
    videoCall(io) {
        let clients = {};
        io.on('connection', (socket) => {
            let senderId = socket.request.user.data.user._id;
            clients = pushSocketIdToArray(clients, senderId, socket.id);
            socket.on('caller-check-listener-online', (data) => {
                //online
                if (clients[data.listenerId]) {
                    let response = {
                        callerId: senderId,
                        listenerId: data.listenerId,
                        callerName: data.callerName
                    }
                    emitEventToArray(clients, data.listenerId, io, 'server-request-peer-id-of-listener', response);
                }
                //offline 
                else {
                    socket.emit('server-send-listener-is-offline');
                }
            });

            socket.on('listener-emit-peer-id-to-server', (data) => {
                let response = {
                    callerId: data.callerId,
                    listenerId: data.listenerId,
                    callerName: data.callerName,
                    listenerName: data.listenerName,
                    listenerPeerId: data.listenerPeerId
                }
                if (clients[data.callerId]) {
                    emitEventToArray(clients, data.callerId, io, 'server-send-peer-id-of-listener-to-caller', response);
                }
            });

            socket.on('caller-request-call-to-server', (data) => {
                let response = {
                    callerId: data.callerId,
                    listenerId: data.listenerId,
                    callerName: data.callerName,
                    listenerName: data.listenerName,
                    listenerPeerId: data.listenerPeerId
                }
                if (clients[data.listenerId]) {
                    emitEventToArray(clients, data.listenerId, io, 'server-send-request-call-to-listener', response);
                }
            });

            socket.on('caller-cancel-request-call-to-server', (data) => {
                let response = {
                    callerId: data.callerId,
                    listenerId: data.listenerId,
                    callerName: data.callerName,
                    listenerName: data.listenerName,
                    listenerPeerId: data.listenerPeerId
                }
                if (clients[data.listenerId]) {
                    emitEventToArray(clients, data.listenerId, io, 'server-send-cancel-request-call-to-listener', response);
                }
            });

            socket.on('listener-reject-request-call-to-server', (data) => {
                let response = {
                    callerId: data.callerId,
                    listenerId: data.listenerId,
                    callerName: data.callerName,
                    listenerName: data.listenerName,
                    listenerPeerId: data.listenerPeerId
                }
                if (clients[data.callerId]) {
                    emitEventToArray(clients, data.callerId, io, 'server-send-reject-call-to-caller', response);
                }
            });

            socket.on('listener-accept-request-call-to-server', (data) => {
                let response = {
                    callerId: data.callerId,
                    listenerId: data.listenerId,
                    callerName: data.callerName,
                    listenerName: data.listenerName,
                    listenerPeerId: data.listenerPeerId
                }
                if (clients[data.callerId]) {
                    emitEventToArray(clients, data.callerId, io, 'server-send-accept-call-to-caller', response);
                }
                if (clients[data.listenerId]) {
                    emitEventToArray(clients, data.listenerId, io, 'server-send-accept-call-to-listener', response);
                }
            });


            //xóa id socket mỗi khi socket disconnect
            socket.on('disconnect', () => {
                clients = removeSocketIdFromArray(clients, senderId, socket);
            });
        });
    }
}
module.exports = new videoCallSocket;
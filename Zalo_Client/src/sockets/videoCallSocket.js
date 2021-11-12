const {
    addSocketId,
    sendEvent,
    deleteSocketId
} = require('../utils/socket')
class videoCallSocket {
    videoCall(io) {
        let clients = {};
        io.on('connection', (socket) => {
            //let senderId = socket.request.user.data.user._id;
            // let cookie = decodeURIComponent(socket.request.headers.cookie);
            // let sender = JSON.parse(cookie.split('userCookie=')[1]);
            socket.on('send-user', (sender) => {
                clients = addSocketId(clients, sender._id, socket.id);

                socket.on('caller-check-listener-online', (data) => {
                    //online
                    if (clients[data.listenerId]) {
                        let response = {
                            callerId: sender._id,
                            listenerId: data.listenerId,
                            callerName: data.callerName
                        }
                        sendEvent(clients, data.listenerId, io, 'server-request-peerId-to-listener', response);
                    }
                    //offline 
                    else {
                        socket.emit('server-send-listener-is-offline');
                    }
                });

                socket.on('listener-emit-peerId-to-server', (data) => {
                    let response = {
                        callerId: data.callerId,
                        listenerId: data.listenerId,
                        callerName: data.callerName,
                        listenerName: data.listenerName,
                        listenerPeerId: data.listenerPeerId
                    }
                    if (clients[data.callerId]) {
                        sendEvent(clients, data.callerId, io, 'server-send-peerId-of-listener-to-caller', response);
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
                        sendEvent(clients, data.listenerId, io, 'server-send-request-call-to-listener', response);
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
                        sendEvent(clients, data.listenerId, io, 'server-send-cancel-request-call-to-listener', response);
                    }
                });

                socket.on('listener-deny-request-call-to-server', (data) => {
                    let response = {
                        callerId: data.callerId,
                        listenerId: data.listenerId,
                        callerName: data.callerName,
                        listenerName: data.listenerName,
                        listenerPeerId: data.listenerPeerId
                    }
                    if (clients[data.callerId]) {
                        sendEvent(clients, data.callerId, io, 'server-send-deny-call-to-caller', response);
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
                        sendEvent(clients, data.callerId, io, 'server-send-accept-call-to-caller', response);
                    }
                    if (clients[data.listenerId]) {
                        sendEvent(clients, data.listenerId, io, 'server-send-accept-call-to-listener', response);
                    }
                });


                //xóa id socket mỗi khi socket disconnect
                socket.on('disconnect', () => {
                    clients = deleteSocketId(clients, sender._id, socket);
                });
            });
        });
    }
}
module.exports = new videoCallSocket;
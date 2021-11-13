const contactSocket = require('./contactSocket');
const messageSocket = require('./messageSocket');
const videoCallSocket = require('./videoCallSocket');
const userSocket = require('./userSocket');
const groupSocket = require('./groupSocket');

function initSockets(io) {

    // function onUser(io) {
    //     return new Promise((resolve, reject) => {
    //         io.on('connection', (socket) => {
    //             console.log(socket.id);
    //             socket.on('send-user', (user) => {
    //                 if (user) {
    //                     return resolve(user);
    //                 }
    //             })
    //         });
    //     });
    // }

    contactSocket.addNewContact(io);
    contactSocket.removeFriendRequest(io);
    contactSocket.removeFriendRequestFromReceiver(io);
    contactSocket.acceptContact(io);
    contactSocket.deleteFriend(io);

    messageSocket.addNewText(io);
    messageSocket.addNewFile(io);
    messageSocket.updateTime(io);
    messageSocket.deleteText(io);
    messageSocket.typing(io);
    videoCallSocket.call(io);

    videoCallSocket.videoCall(io);
    userSocket.checkOnlineOffline(io);
    groupSocket.createGroup(io);
    groupSocket.addUserToGroup(io)
    groupSocket.deleteGroup(io);
    groupSocket.leaveGroup(io);

}

module.exports = initSockets;
const contactSocket = require('./contactSocket');
const messageSocket = require('./messageSocket');
const videoCallSocket = require('./videoCallSocket');
const userSocket = require('./userSocket');
const groupSocket = require('./groupSocket');

function initSockets(io) {

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
    messageSocket.reaction(io);
    videoCallSocket.call(io);

    videoCallSocket.videoCall(io);
    userSocket.checkOnlineOffline(io);
    groupSocket.createGroup(io);
    groupSocket.addUserToGroup(io)
    groupSocket.deleteGroup(io);
    groupSocket.leaveGroup(io);

}

module.exports = initSockets;
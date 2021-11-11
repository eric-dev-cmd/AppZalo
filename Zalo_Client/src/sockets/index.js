const contactSocket = require('./contactSocket');
const messageSocket = require('./messageSocket');
const videoCallSocket = require('./videoCallSocket');
const userSocket = require('./userSocket');
const groupSocket = require('./groupSocket');

function initSockets(io, user) {
    contactSocket.addNewContact(io, user);
    contactSocket.removeFriendRequest(io, user);
    contactSocket.removeFriendRequestFromReceiver(io, user);
    contactSocket.acceptContact(io, user);
    contactSocket.deleteFriend(io, user);

    messageSocket.addNewText(io, user);
    messageSocket.addNewFile(io, user);
    messageSocket.updateTime(io, user);
    messageSocket.deleteText(io, user);
    messageSocket.typing(io, user);

    videoCallSocket.videoCall(io, user);
    userSocket.checkOnlineOffline(io, user);
    groupSocket.createGroup(io, user);
    groupSocket.addUserToGroup(io, user)
    groupSocket.deleteGroup(io, user);
    groupSocket.leaveGroup(io, user)

}

module.exports = initSockets;
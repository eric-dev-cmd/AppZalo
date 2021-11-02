const contactSocket = require('./contactSocket');
const messageSocket = require('./messageSocket');
const videoCallSocket = require('./videoCallSocket');
const userSocket = require('./userSocket');
const groupSocket = require('./groupSocket');

function initSockets(io) {
    contactSocket.addNewContact(io);
    contactSocket.removeRequestContact(io);
    contactSocket.removeRequestContactReceiver(io);
    contactSocket.acceptContact(io);
    contactSocket.removeFriend(io);

    messageSocket.addNewTextAndEmoji(io);
    messageSocket.addNewFile(io);
    messageSocket.updateTime(io);
    messageSocket.deleteTextAndEmoji(io);
    messageSocket.typing(io);

    videoCallSocket.videoCall(io);
    userSocket.checkOnlineOffline(io);
    groupSocket.createGroup(io);
}

module.exports = initSockets;
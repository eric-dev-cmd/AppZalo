const contactSocket = require('./contactSocket');

function initSockets(io) {
    contactSocket.addNewContact(io);
    contactSocket.removeRequestContact(io);
    contactSocket.removeRequestContactReceiver(io);
    contactSocket.acceptContact(io);
    contactSocket.removeFriend(io);

}

module.exports = initSockets;
const contactSocket = require('./contactSocket');

function initSockets(io) {
    contactSocket.addNewContact(io);
    contactSocket.removeRequestContact(io);
}

module.exports = initSockets;
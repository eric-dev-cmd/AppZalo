const contactSocket = require('./contactSocket');

function initSockets(io) {
    contactSocket.addNewContact(io);
}

module.exports = initSockets;
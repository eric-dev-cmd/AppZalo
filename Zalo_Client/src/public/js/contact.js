//add contanct
function addContact() {
    socket.emit('add-new-contact', {contactId: 1})
}
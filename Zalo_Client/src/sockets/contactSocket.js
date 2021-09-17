class ContactSocket{
    addNewContact(io) {
        io.on('connection', (socket) => {
            socket.on('home', (data) => {
               console.log(data);
                console.log(socket.request.user);
            });
        });
    }
    
}
module.exports = new ContactSocket;
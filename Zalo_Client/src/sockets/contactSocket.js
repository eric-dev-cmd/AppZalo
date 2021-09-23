class ContactSocket{
     addNewContact(io) {
         /**
          * đối tượng gồm key và value
          * key: id của người dùng đang đăng nhập
          * value: id của socket khi mỗi lần load trang
          */
         let clients = {};
        io.on('connection', (socket) => {
            let currentUserId = socket.request.user.data.user._id;
            /**
             * nếu đang đăng nhập => có sắn id của người dùng thì sẽ push id socket vào
             * ngược lại, lần đầu tiên đăng nhập thì sẽ tạo phần tử đầu tiên là id socket
             */
            if(clients[currentUserId]){
                clients[currentUserId].push(socket.id);
            }else{
                clients[currentUserId] = [socket.id];
            }
            //nhận socket từ client
            socket.on('add-new-contact', (data) => {
                let currentUser = {
                    id: currentUserId,
                    userName: socket.request.user.data.user.userName,
                    avatar: socket.request.user.data.user.avatar
                }
               if(clients[data.contactId]){
                   console.log(data.contactId);
                clients[data.contactId].forEach(socketId => {
                    io.to(socketId).emit('response-add-new-contact', currentUser);
                });
              }             
            });
            /**
             * xóa id socket mỗi khi socket disconnect
             */
            socket.on('disconnect', () => {
                clients[currentUserId] = clients[currentUserId].filter((socketId) => {
                    return socketId !== socket.id;
                })
                if(!clients[currentUserId].length){
                    delete clients[currentUserId];
                }
            })
        });
    }

    removeRequestContact(io) {
        /**
         * đối tượng gồm key và value
         * key: id của người dùng đang đăng nhập
         * value: id của socket khi mỗi lần load trang
         */
        let clients = {};
       io.on('connection', (socket) => {
           let currentUserId = socket.request.user.data.user._id;
           /**
            * nếu đang đăng nhập => có sắn id của người dùng thì sẽ push id socket vào
            * ngược lại, lần đầu tiên đăng nhập thì sẽ tạo phần tử đầu tiên là id socket
            */
           if(clients[currentUserId]){
               clients[currentUserId].push(socket.id);
           }else{
               clients[currentUserId] = [socket.id];
           }
           //lắng nghe socket remove-request-contact từ client
           socket.on('remove-request-contact', (data) => {
               let currentUser = {
                   id: currentUserId
               }
               //gửi socket response-remove-request-contact cho client
              if(clients[data.contactId]){
               clients[data.contactId].forEach(socketId => {
                   io.to(socketId).emit('response-remove-request-contact', currentUser);
               });
             }             
           });
           /**
            * xóa id socket mỗi khi socket disconnect
            */
           socket.on('disconnect', () => {
               clients[currentUserId] = clients[currentUserId].filter((socketId) => {
                   return socketId !== socket.id;
               })
               if(!clients[currentUserId].length){
                   delete clients[currentUserId];
               }
           })
       });
   }
    
}
module.exports = new ContactSocket;
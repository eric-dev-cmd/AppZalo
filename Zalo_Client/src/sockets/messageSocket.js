const {
  addSocketId,
  sendEvent,
  deleteSocketId,
} = require('../utils/socket');
const messageService = require('../services/messageService');
const message = require('../utils/message');
const axios = require('axios');
const http = require('../controllers/http');

class MessageSocket {
  addNewText(io) {
    /**
     * đối tượng clients gồm key và value
     * key: id của người dùng đang đăng nhập mỗi khi load trang
     * value: id của socket khi mỗi lần load trang
     * mỗi socketid là 1 trang đăng nhập, nhiều trang thì sẽ có nhiều socketid
     */
    let clients = {};
    io.on('connection', (socket) => {
      //let sender = socket.request.user.data.user;
      // let cookie = decodeURIComponent(socket.request.headers.cookie);
      // let sender = JSON.parse(cookie.split('userCookie=')[1]);
      socket.on('send-user', (sender) => {
        clients = addSocketId(clients, sender._id, socket.id);

        //thêm socketid vào đối tượng clients vào nhóm của người đăng nhập
        sender.chatGroupIds.forEach((groupId) => {
          clients = addSocketId(clients, groupId, socket.id);
        });

        //khi tạo nhóm mới => thêm socketid của nhóm
        socket.on('create-group', (data) => {
          clients = addSocketId(clients, data.group._id, socket.id);
        });

        socket.on('members-get-socketId', (data) => {
          clients = addSocketId(clients, data.group._id, socket.id);
        });

        //lắng nghe socket từ client gửi
        socket.on('add-new-text', (data) => {
          let respone = {
            message: data.message,
            isChatGroup: data.isChatGroup,
          };
          //gửi socket đến cho client
          //nếu user nhận tin nhắn đang đăng nhập thì sẽ gửi đi
          if (clients[data.message.receiverId]) {
            sendEvent(clients, data.message.receiverId, io, 'response-add-new-text', respone);
          }
        });
        //xóa id socket mỗi khi socket disconnect
        socket.on('disconnect', () => {
          clients = deleteSocketId(clients, sender._id, socket);
          sender.chatGroupIds.forEach((groupId) => {
            clients = deleteSocketId(clients, groupId, socket);
          });
        });
      });
    });
  }

  addNewFile(io) {
    /**
     * đối tượng clients gồm key và value
     * key: id của người dùng đang đăng nhập mỗi khi load trang
     * value: id của socket khi mỗi lần load trang
     * mỗi socketid là 1 trang đăng nhập, nhiều trang thì sẽ có nhiều socketid
     */
    let clients = {};
    io.on('connection', (socket) => {
      //let sender = socket.request.user.data.user;
      // let cookie = decodeURIComponent(socket.request.headers.cookie);
      // let sender = JSON.parse(cookie.split('userCookie=')[1]);
      socket.on('send-user', (sender) => {
        clients = addSocketId(clients, sender._id, socket.id);
        //thêm socketid vào đối tượng clients vào nhóm của người đăng nhập
        sender.chatGroupIds.forEach((groupId) => {
          clients = addSocketId(clients, groupId, socket.id);
        });

        socket.on('create-group', (data) => {
          clients = addSocketId(clients, data.group._id, socket.id);
        });

        socket.on('members-get-socketId', (data) => {
          clients = addSocketId(clients, data.group._id, socket.id);
        });

        //lắng nghe socket từ client gửi
        socket.on('add-new-file', (data) => {
          let response = {
            messages: data.messages,
            isChatGroup: data.isChatGroup,
          };
          //gửi socket đến cho client
          //nếu user nhận tin nhắn đang đăng nhập thì sẽ gửi đi
          if (clients[data.messages[0].receiverId]) {
            sendEvent(clients, data.messages[0].receiverId, io, 'response-add-new-file', response);
          }
        });
        //xóa id socket mỗi khi socket disconnect
        socket.on('disconnect', () => {
          clients = deleteSocketId(clients, sender._id, socket);
          sender.chatGroupIds.forEach((groupId) => {
            clients = deleteSocketId(clients, groupId, socket);
          });
        });
      });
    });
  }

  deleteText(io) {
    let clients = {};
    io.on('connection', (socket) => {
      // let sender = socket.request.user.data.user;

      // let cookie = decodeURIComponent(socket.request.headers.cookie);
      // let sender = JSON.parse(cookie.split('userCookie=')[1]);
      socket.on('send-user', (sender) => {
        clients = addSocketId(clients, sender._id, socket.id);

        sender.chatGroupIds.forEach((groupId) => {
          clients = addSocketId(clients, groupId, socket.id);
        });
        socket.on('create-group', (data) => {
          clients = addSocketId(clients, data.group._id, socket.id);
        });

        socket.on('members-get-socketId', (data) => {
          clients = addSocketId(clients, data.group._id, socket.id);
        });
        //lắng nghe socket từ client gửi
        socket.on('delete-text', (data) => {
          let respone = {
            message: data.message,
          };
          //gửi socket đến cho client
          //nếu user nhận tin nhắn đang đăng nhập thì sẽ gửi đi
          if (clients[data.message.receiverId]) {
            sendEvent(
              clients,
              data.message.receiverId,
              io,
              'response-delete-text',
              respone
            );
          }
        });
        //xóa id socket mỗi khi socket disconnect
        socket.on('disconnect', () => {
          clients = deleteSocketId(clients, sender._id, socket);
          sender.chatGroupIds.forEach((groupId) => {
            clients = deleteSocketId(clients, groupId, socket.id);
          });
        });
      });
    });
  }

  typing(io) {
    let clients = {};
    io.on('connection', async (socket) => {
      //let sender = socket.request.user.data.user;
      //thêm socketid vào đối tượng clients vào người dùng đăng nhập

      // let cookie = decodeURIComponent(socket.request.headers.cookie);
      // let sender = JSON.parse(cookie.split('userCookie=')[1]);
      // clients = addSocketId(clients, sender._id, socket.id);

      socket.on('send-user', (sender) => {
        clients = addSocketId(clients, sender._id, socket.id);
        socket.on('typing', (data) => {
          let response = {
            receiverId: sender._id,
            typing: data.typing,
          };
          if (clients[data.receiverId]) {
            sendEvent(clients, data.receiverId, io, 'response-typing', response);
          }
        });
        //xóa id socket mỗi khi socket disconnect
        socket.on('disconnect', () => {
          clients = deleteSocketId(clients, sender._id, socket);
        });
      });
    });
  }

  updateTime(io) {
    let clients = {};
    io.on('connection', (socket) => {
      //let sender = socket.request.user.data.user;

      // let cookie = decodeURIComponent(socket.request.headers.cookie);
      // let sender = JSON.parse(cookie.split('userCookie=')[1]);
      socket.on('send-user', (sender) => {
        clients = addSocketId(clients, sender._id, socket.id);

        socket.on('create-group', (data) => {
          clients = addSocketId(clients, data.group._id, socket.id);
        });

        socket.on('members-get-socketId', (data) => {
          clients = addSocketId(clients, data.group._id, socket.id);
        });

        setInterval(async function () {
          let getAllConversation = await messageService.getListItemContacts(sender._id);
          let allConversation = getAllConversation.allConversationMessages;
          if (clients[sender._id]) {
            sendEvent(clients, sender._id, io, 'response-update-time', allConversation);
          }
        }, 50000);

        //xóa id socket mỗi khi socket disconnect
        socket.on('disconnect', () => {
          clients = deleteSocketId(clients, sender._id, socket);
        });
      });
    });
  }


}
module.exports = new MessageSocket();
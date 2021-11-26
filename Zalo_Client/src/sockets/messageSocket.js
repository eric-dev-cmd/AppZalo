const { addSocketId, sendEvent, deleteSocketId } = require('../utils/socket');
const messageService = require('../services/messageService');

class MessageSocket {
  addNewText(io) {
    let listUsers = {};
    io.on('connection', (socket) => {
      //let sender = socket.request.user.data.user;
      // let cookie = decodeURIComponent(socket.request.headers.cookie);
      // let sender = JSON.parse(cookie.split('userCookie=')[1]);
      socket.on('send-user', (sender) => {
        listUsers = addSocketId(listUsers, sender._id, socket.id);

        //thêm socketid của group vào đối tượng listUsers
        sender.chatGroupIds.forEach((groupId) => {
          listUsers = addSocketId(listUsers, groupId, socket.id);
        });

        //khi tạo nhóm mới => thêm socketid của nhóm
        socket.on('create-group', (data) => {
          listUsers = addSocketId(listUsers, data.group._id, socket.id);
        });

        socket.on('members-get-socketId', (data) => {
          listUsers = addSocketId(listUsers, data.group._id, socket.id);
        });

        //lắng nghe socket từ client gửi
        socket.on('add-new-text', (data) => {
          let respone = {
            message: data.message,
            isChatGroup: data.isChatGroup,
          };
          //gửi socket đến cho client
          //nếu user nhận tin nhắn đang đăng nhập thì sẽ gửi đi
          if (listUsers[data.message.receiverId]) {
            sendEvent(
              listUsers,
              data.message.receiverId,
              io,
              'response-add-new-text',
              respone
            );
          }
        });
        socket.on('trungvinh-emit', (data) => {
          console.log(sender._id);
          console.log(data);
        });
        //xóa id socket mỗi khi socket disconnect
        socket.on('disconnect', () => {
          listUsers = deleteSocketId(listUsers, sender._id, socket);
          sender.chatGroupIds.forEach((groupId) => {
            listUsers = deleteSocketId(listUsers, groupId, socket);
          });
        });
      });
    });
  }

  addNewFile(io) {
    /**
     * đối tượng listUsers gồm key và value
     * key: id của người dùng đang đăng nhập mỗi khi load trang
     * value: id của socket khi mỗi lần load trang
     * mỗi socketid là 1 trang đăng nhập, nhiều trang thì sẽ có nhiều socketid
     */
    let listUsers = {};
    io.on('connection', (socket) => {
      //let sender = socket.request.user.data.user;
      // let cookie = decodeURIComponent(socket.request.headers.cookie);
      // let sender = JSON.parse(cookie.split('userCookie=')[1]);
      socket.on('send-user', (sender) => {
        listUsers = addSocketId(listUsers, sender._id, socket.id);
        //thêm socketid vào đối tượng listUsers vào nhóm của người đăng nhập
        sender.chatGroupIds.forEach((groupId) => {
          listUsers = addSocketId(listUsers, groupId, socket.id);
        });

        socket.on('create-group', (data) => {
          listUsers = addSocketId(listUsers, data.group._id, socket.id);
        });

        socket.on('members-get-socketId', (data) => {
          listUsers = addSocketId(listUsers, data.group._id, socket.id);
        });

        //lắng nghe socket từ client gửi
        socket.on('add-new-file', (data) => {
          // console.log(data);
          let response = {
            messages: data.messages,
            isChatGroup: data.isChatGroup,
          };
          //gửi socket đến cho client
          //nếu user nhận tin nhắn đang đăng nhập thì sẽ gửi đi
          if (listUsers[data.messages[0].receiverId]) {
            sendEvent(
              listUsers,
              data.messages[0].receiverId,
              io,
              'response-add-new-file',
              response
            );
          }
        });
        //xóa id socket mỗi khi socket disconnect
        socket.on('disconnect', () => {
          listUsers = deleteSocketId(listUsers, sender._id, socket);
          sender.chatGroupIds.forEach((groupId) => {
            listUsers = deleteSocketId(listUsers, groupId, socket);
          });
        });
      });
    });
  }

  deleteText(io) {
    let listUsers = {};
    io.on('connection', (socket) => {
      // let sender = socket.request.user.data.user;

      // let cookie = decodeURIComponent(socket.request.headers.cookie);
      // let sender = JSON.parse(cookie.split('userCookie=')[1]);
      socket.on('send-user', (sender) => {
        listUsers = addSocketId(listUsers, sender._id, socket.id);

        sender.chatGroupIds.forEach((groupId) => {
          listUsers = addSocketId(listUsers, groupId, socket.id);
        });
        socket.on('create-group', (data) => {
          listUsers = addSocketId(listUsers, data.group._id, socket.id);
        });

        socket.on('members-get-socketId', (data) => {
          listUsers = addSocketId(listUsers, data.group._id, socket.id);
        });
        //lắng nghe socket từ client gửi
        socket.on('delete-text', (data) => {
          let respone = {
            message: data.message,
          };
          //gửi socket đến cho client
          //nếu user nhận tin nhắn đang đăng nhập thì sẽ gửi đi
          if (listUsers[data.message.receiverId]) {
            sendEvent(
              listUsers,
              data.message.receiverId,
              io,
              'response-delete-text',
              respone
            );
          }
        });
        //xóa id socket mỗi khi socket disconnect
        socket.on('disconnect', () => {
          listUsers = deleteSocketId(listUsers, sender._id, socket);
          sender.chatGroupIds.forEach((groupId) => {
            listUsers = deleteSocketId(listUsers, groupId, socket.id);
          });
        });
      });
    });
  }

  typing(io) {
    let listUsers = {};
    io.on('connection', async (socket) => {
      //let sender = socket.request.user.data.user;
      //thêm socketid vào đối tượng listUsers vào người dùng đăng nhập

      // let cookie = decodeURIComponent(socket.request.headers.cookie);
      // let sender = JSON.parse(cookie.split('userCookie=')[1]);
      // listUsers = addSocketId(listUsers, sender._id, socket.id);

      socket.on('send-user', (sender) => {
        listUsers = addSocketId(listUsers, sender._id, socket.id);
        socket.on('typing', (data) => {
          let response = {
            receiverId: sender._id,
            typing: data.typing,
          };
          if (listUsers[data.receiverId]) {
            sendEvent(
              listUsers,
              data.receiverId,
              io,
              'response-typing',
              response
            );
          }
        });
        //xóa id socket mỗi khi socket disconnect
        socket.on('disconnect', () => {
          listUsers = deleteSocketId(listUsers, sender._id, socket);
        });
      });
    });
  }

  reaction(io) {
    let listUsers = {};
    io.on('connection', async (socket) => {
      socket.on('send-user', (sender) => {
        listUsers = addSocketId(listUsers, sender._id, socket.id);
        socket.on('reaction', (data) => {
          let response = {
            message: data.message,
          };
          socket.broadcast.emit('response-reaction', response);
        });
        //xóa id socket mỗi khi socket disconnect
        socket.on('disconnect', () => {
          listUsers = deleteSocketId(listUsers, sender._id, socket);
        });
      });
    });
  }

  removeReaction(io) {
    let listUsers = {};
    io.on('connection', async (socket) => {
      socket.on('send-user', (sender) => {
        listUsers = addSocketId(listUsers, sender._id, socket.id);
        socket.on('remove-reaction', (data) => {
          let response = {
            message: data.message,
          };
          socket.broadcast.emit('response-remove-reaction', response);
        });
        //xóa id socket mỗi khi socket disconnect
        socket.on('disconnect', () => {
          listUsers = deleteSocketId(listUsers, sender._id, socket);
        });
      });
    });
  }

  updateTime(io) {
    let listUsers = {};
    io.on('connection', (socket) => {
      //let sender = socket.request.user.data.user;

      // let cookie = decodeURIComponent(socket.request.headers.cookie);
      // let sender = JSON.parse(cookie.split('userCookie=')[1]);
      socket.on('send-user', (sender) => {
        listUsers = addSocketId(listUsers, sender._id, socket.id);

        socket.on('create-group', (data) => {
          listUsers = addSocketId(listUsers, data.group._id, socket.id);
        });

        socket.on('members-get-socketId', (data) => {
          listUsers = addSocketId(listUsers, data.group._id, socket.id);
        });

        setInterval(async function () {
          let getAllConversation = await messageService.getListItemContacts(
            sender._id
          );
          let allConversation = getAllConversation.allConversationMessages;
          if (listUsers[sender._id]) {
            sendEvent(
              listUsers,
              sender._id,
              io,
              'response-update-time',
              allConversation
            );
          }
        }, 50000);

        //xóa id socket mỗi khi socket disconnect
        socket.on('disconnect', () => {
          listUsers = deleteSocketId(listUsers, sender._id, socket);
        });
      });
    });
  }
}
module.exports = new MessageSocket();

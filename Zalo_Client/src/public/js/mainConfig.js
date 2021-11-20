const socket = io();
const http = `http://ec2-13-213-71-132.ap-southeast-1.compute.amazonaws.com:4000`;
//các cuộc trò truyện
let conversations;
const s3 =
  'https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public';

socket.emit('send-user', userJson);

// let currentUserId = document.getElementById('id').value;
// allConversationMessagesJson.forEach(conversation => {
//   if (conversation.lastIsRead === false && conversation.lastMessage.senderId === currentUserId) {
//     $(`#unread-${conversation.lastMessage.senderId}`).hide();
//   }
// });

// cập nhật thời gian tin nhắn đã gửi của ds cuộc trò truyện
socket.on('response-update-time', function (data) {
  let allConversation = data;
  allConversation.map((conversation) => {
    if (conversation.time) {
      //lấy id của cuộc trò truyện
      let conversationId = $(`#updated-time-${conversation._id}`).attr(
        'data-uid'
      );
      if (conversationId === conversation._id) {
        $(`#updated-time-${conversation._id}`).html(`${conversation.time}`);
      }
    }
  });
});

function getAllConversation() {
  $('#conversation-list').each(function () {
    var li = $(this).find('li');
    conversations = li;
    let firstLiId = li.first().attr('id');
    let firstLi = li.first();
    firstLi.addClass('active');
    $(`#${firstLiId}`).click();
  });
}

function showChat() {
  if (allConversationMessagesJson.length == 0) {
    $('.user-chat-topbar').hide();
    $('#input-chat').hide();
  } else {
    $('.user-chat-topbar').show();
    $('#input-chat').show();
  }
}

$(document).ready(function () {
  searchPhone();
  removeFriendRequestFromReceiver();
  acceptFriendRequest();
  getAllConversation();
  showChat();
});

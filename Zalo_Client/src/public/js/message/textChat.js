function enableEmoji(id, isChatGroup) {
  $(`#text-chat-${id}`).emojioneArea({
    standalone: false,
    placeholder: 'Nhập tin nhắn...',
    search: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    inline: true,
    events: {
      keyup: function () {
        $(`#text-chat-${id}`).val(this.getText());
      },
      click: function () {
        textChat(id, isChatGroup);
      },
    },
  });
}

function textChat(id, isChatGroup) {
  $('.emojionearea')
    .unbind('keyup')
    .on('keyup', function (element) {
      let messageVal = $(`#text-chat-${id}`).val();
      let currentUserId = document.getElementById('id').value;
      if (messageVal.length > 0) {
        socket.emit('typing', {
          receiverId: id,
          senderId: currentUserId,
          typing: true,
        });
      }
      if (messageVal.length == 0) {
        socket.emit('typing', {
          receiverId: id,
          typing: false,
        });
      }

      if (element.which === 13) {
        $(`#search-conversation`).val('');
        let dataTextAndEmoji = {
          uid: id,
          messageVal: messageVal,
          isChatGroup: isChatGroup,
        };
        addNewText(dataTextAndEmoji, isChatGroup);
      }
    });
}

socket.on('response-typing', async function (data) {
  let receiver = await $.get(http + `/users/${data.receiverId}`);
  if (data.typing == true) {
    $(`#conversation-${data.receiverId}`).find('#typing').remove();
    $(`#conversation-${data.receiverId}`).append(typing(receiver));
  } else {
    $(`#conversation-${data.receiverId}`).find('#typing').remove();
  }
});

function typing(receiver) {
  return `<li id="typing">
  <div class="conversation-list">
      <div class="chat-avatar">
          <img src="${s3}/${receiver.user.avatar}"
              alt="">
      </div>

      <div class="user-chat-content">
          <div class="ctext-wrap">
              <div class="ctext-wrap-content">
                  <p class="mb-0">
                      typing
                      <span class="animate-typing">
                          <span class="dot"></span>
                          <span class="dot"></span>
                          <span class="dot"></span>
                      </span>
                  </p>
              </div>
          </div>

          <div class="conversation-name">${receiver.user.userName}</div>
      </div>

  </div>
</li>`;
}

//tạo mới tin nhắn của tài khoản người gửi
function addNewText(dataTextAndEmoji, isChatGroup) {
  $.post('/message/addNewText', dataTextAndEmoji, function (data) {
    let message = data;
    //lấy người gửi
    $.get(http + `/users/${message.senderId}`, function (data) {
      let sender = data;
      //phía gửi: thêm tin nhắn vừa gửi
      $(`#conversation-${message.receiverId}`).append(
        rightConversationText(sender, message)
      );
      //thẻ input = rỗng
      $(`#text-chat-${message.receiverId}`).val('');
      $('.emojionearea-editor').text('');
      //tìm kiếm cuộc trò cũ và xóa
      $('#conversation-list')
        .find(`li[id=receiver-${message.receiverId}]`)
        .remove();
      //tạo mới cuộc trò truyện trong danh sách trò truyện
      addConversation(message.receiverId, isChatGroup).then(function (result) {
        $('#conversation-list').prepend(result);
      });
      scrollMessageUserEnd();
      //gửi socket từ client đến server
      socket.emit('add-new-text', {
        message: message,
        isChatGroup: isChatGroup,
      });
    });
  }).fail(function (res) {
    console.log(res);
  });
}

//lắng nghe socket từ server đến client
socket.on('response-add-new-text', async function (data) {
  let message = data.message;
  // lấy id người dùng hiện tại
  let currentUserId = document.getElementById('id').value;
  //lấy người nhận
  let receiver = await $.get(http + `/users/${message.senderId}`);
  // nếu là nhóm
  if (data.isChatGroup == true || data.isChatGroup == 'true') {
    if (message.senderId !== currentUserId) {
      //thêm tin nhắn vừa gửi cho nhóm nhận
      $(`#conversation-${message.receiverId}`).append(
        leftConversationText(receiver, message)
      );
      scrollMessageUserEnd();
      $('#conversation-list')
        .find(`li[id=receiver-${message.receiverId}]`)
        .remove();
      //tạo mới cuộc trò truyện trong danh sách trò truyện
      addConversation(message.receiverId, data.isChatGroup).then(function (
        result
      ) {
        $('#conversation-list').prepend(result);
        // if (message.isRead === false) {
        //   $('.unread-message').html('');
        //   $(`<span class="badge badge-soft-danger rounded-pill"></span>`).appendTo(
        //     $('.unread-message')
        //   );
        // }
        $('#conversation-list')
          .find(`li[id = receiver-${message.receiverId}]`)
          .css('font-weight', 'bold');
      });
    }
  }
  if (data.isChatGroup == false || data.isChatGroup == 'false') {
    //thêm tin nhắn vừa gửi cho người nhận
    $(`#conversation-${message.senderId}`).append(
      leftConversationText(receiver, message)
    );
    $(`#conversation-${message.senderId}`).find('#typing').remove();
    $('#conversation-list')
      .find(`li[id=receiver-${message.senderId}]`)
      .remove();
    //tạo mới cuộc trò truyện trong danh sách trò truyện
    addConversation(message.senderId, data.isChatGroup).then(function (result) {
      $('#conversation-list').prepend(result);
      scrollMessageUserEnd();
      //  $('#conversation-list').find(`li[id = receiver-${message.senderId}]`).css('color', 'red');
    });
  }
});

//tạo cuộc trò truyện mới
async function addConversation(receiverId, isChatGroup) {
  let currentUserId = document.getElementById('id').value;
  if (isChatGroup === false || isChatGroup === 'false') {
    let receiver = await $.get(http + `/users/${receiverId}`);
    let messages = await $.get(
      http +
        `/messages/SearchSenderIdAndReceiverId/${currentUserId}/${receiver.user._id}`
    );
    return `<li class="cursor-point chat-user-list-item" onclick="showConversationUser('${
      receiver.user._id
    }')" id="receiver-${receiver.user._id}" 
    data-updated="${receiver.user.updatedAt}" data-name="${
      receiver.user.userName
    }">
        <a>
            <div class="d-flex">
                <div
                    class="chat-user-img online align-self-center me-3 ms-0">
                    <img src="${s3}/${receiver.user.avatar}"
                        class="rounded-circle avatar-xs" alt="">
                    <span class=""></span>
                </div>
    
                <div class="flex-1 overflow-hidden">
                    <h5 class="text-truncate font-size-15 mb-1">
                        ${receiver.user.userName}</h5>
                    <p class="chat-user-message text-truncate mb-0" id="last-message-conversation">
                        ${getLastEndMessageInConversation(messages)}</p>
                </div>
                <div class="font-size-11" id="updated-time-${
                  receiver.user._id
                }" data-uid="${receiver.user._id}">${renderTimeAgo(
      messages
    )}</div>
            </div>
        </a>
    </li>`;
  }
  if (isChatGroup === true || isChatGroup === 'true') {
    let groupReceiver = await $.get(http + `/chatGroups/${receiverId}`);
    // lấy tin nhắn theo id nhóm
    let messages = await $.get(
      http + `/messages/SearchByReceiverId/${groupReceiver._id}?startFrom=0`
    );
    return `<li class="cursor-point chat-user-list-item" onclick="showConversationGroup('${
      groupReceiver._id
    }')" 
    id="receiver-${groupReceiver._id}" data-updated="${
      groupReceiver.updatedAt
    }" 
    data-name="${groupReceiver.name}">
        <a>
            <div class="d-flex">
                <div
                    class="chat-user-img online align-self-center me-3 ms-0 position-relative">
                    <img src="${s3}/${groupReceiver.avatar}"
                        class="rounded-circle avatar-xs" alt="">
                    <span class=""></span>
                </div>
    
                <div class="flex-1 overflow-hidden">
                    <h5 class="text-truncate font-size-15 mb-1">
                        ${groupReceiver.name}</h5>
                    <p class="chat-user-message text-truncate mb-0" id="last-message-conversation">
                        ${getLastEndMessageInConversation(messages)}</p>
                </div>
                <div class="font-size-11" id="updated-time-${
                  groupReceiver._id
                }" data-uid="${groupReceiver._id}">${renderTimeAgoGroup(
      messages
    )}</div>
            </div>
        </a>
    </li>`;
  }
}

function renderTimeAgo(messages) {
  if (messages.length == 0) {
    return '';
  } else {
    let last = Object.keys(messages).pop();
    let lastMessage = messages[last];
    let formatedTimeAgo = moment(lastMessage.createdAt)
      .locale('vi')
      .startOf('seconds')
      .fromNow();
    return formatedTimeAgo;
  }
}

function getLastEndMessageInConversation(messages) {
  if (messages.length == 0) {
    return '';
  } else {
    let last = Object.keys(messages).pop();
    let lastMessage = messages[last];
    if (lastMessage.messageType === 'image') {
      return '[Hình ảnh]';
    }
    if (lastMessage.messageType === 'file') {
      return '[Tệp tin]';
    }
    if (lastMessage.messageType === 'text') {
      return lastMessage.text;
    }
  }
}

function renderTimeAgoGroup(messages) {
  if (messages.length == 0) {
    return '';
  } else {
    let last = Object.keys(messages).pop();
    let lastMessage = messages[last];
    let formatedTimeAgo = moment(lastMessage.createdAt)
      .locale('vi')
      .startOf('seconds')
      .fromNow();
    return formatedTimeAgo;
  }
}

function scrollMessageUserEnd() {
  const listHeight = document.querySelector(
    '.conversation-height'
  ).clientHeight;
  const mainLayoutBody = document.querySelector('.simplebar-content-height');
  mainLayoutBody.scroll({
    top: listHeight,
  });
}

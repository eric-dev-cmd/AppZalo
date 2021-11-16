function scrollMessageUserEnd() {
  const listHeight = document.querySelector(
    '.conversation-height'
  ).clientHeight;
  const mainLayoutBody = document.querySelector('.simplebar-content-height');
  mainLayoutBody.scroll({
    top: listHeight,
  });
}

function scrollMessageGroupEnd() {
  let listHeight = document.querySelector(
    '.conversation-height-group'
  ).clientHeight;
  const mainLayoutBody = document.querySelector('.simplebar-content-height');
  mainLayoutBody.scroll({
    top: listHeight,
    behavior: 'smooth',
  });
}
//hiển thị tin nhắn nhóm
async function showConversationGroup(id) {
  let group = await $.get(http + `/chatGroups/${id}`);
  let currentUserId = document.getElementById('id').value;
  let sender = await $.get(http + `/users/${currentUserId}`);
  // lấy tin nhắn theo id nhóm
  let messages = await $.get(
    http + `/messages/SearchByReceiverId/${id}?startFrom=0`
  );
  //hiển thị avatar
  $('#avatar-detail').attr('src', `${s3}/${group.avatar}`);
  $('#avatar-conversation').attr('src', `${s3}/${group.avatar}`);
  //hiển thị tên nhóm
  $('#name').html(`${group.name}`);
  $('#name-conversation').html(`${group.name}`);
  //phía gửi: gán giá trị data-id = id hiện tại
  $('#right-conversation').attr('data-id', `${currentUserId}`);
  //phía gửi: lấy id đã gán
  let rightId = $('#right-conversation').attr('data-id');
  //set id cho danh sách tin nhắn của cuộc trò truyện
  $('.message-list').attr('id', `conversation-${id}`);
  $(`#conversation-${id}`).html('');
  messages.map(async (message) => {
    //tìm người gửi cho user hiện tại
    let receiver = await $.get(http + `/users/${message.senderId}`);
    //phía nhận: tạo nội dung nhận = null
    $(`#conversation-${id}`).append(
      leftConversationText(receiver, {
        text: null,
      })
    );
    $(`#conversation-${id}`).append(
      rightConversationText(receiver, {
        text: null,
      })
    );
    if (message.messageType === 'info') {
      addInfo(group, message);
    }
    if (message.messageType === 'text') {
      if (message.senderId === rightId) {
        $(`#conversation-${id}`).append(rightConversationText(sender, message));
      }
      if (
        message.senderId ===
        $(`#left-conversation-${receiver.user._id}`).attr('data-id') &&
        message.senderId !== currentUserId
      ) {
        $(`#conversation-${id}`).append(
          leftConversationText(receiver, message)
        );
      }
    }
    if (message.messageType === 'image') {
      if (message.senderId === rightId) {
        $(`#conversation-${id}`).append(
          rightConversationImage(sender, message)
        );
      }

      if (
        message.senderId ===
        $(`#left-conversation-${receiver.user._id}`).attr('data-id') &&
        message.senderId !== currentUserId
      ) {
        $(`#conversation-${id}`).append(
          leftConversationImage(receiver, message)
        );
      }
    }
    if (message.messageType === 'file') {
      if (message.senderId === rightId) {
        $(`#conversation-${id}`).append(rightConversationFile(sender, message));
      }
      if (
        message.senderId ===
        $(`#left-conversation-${receiver.user._id}`).attr('data-id') &&
        message.senderId !== currentUserId
      ) {
        $(`#conversation-${id}`).append(
          leftConversationFile(receiver, message)
        );
      }
    }
    $(`#conversation-${id}`).find(`li[data-content = null]`).remove();
    scrollMessageUserEnd();
  });
  detailConversation(messages);
  //$('#conversation-list').find(`li[id = receiver-${id}]`).css('background-color', '#3e4a56');
  insertInput(id, true);
  insertInputFile(id, true);
  insertIdForVideoCall(id);
  insertIdUserOnline(group);
  showSearchMessage(id, true);
  showIconAddUserToGroup(id);
  showBtnDeleteOrLeaveGroup(id);
  showActiveMessage();
  var startFrom = 0;
  loadMessageForGroup(id, startFrom);
  insertListMember(group, sender);
}

function addInfo(group, message) {
  // group.members.forEach(async member => {
  //   let user = await $.get(http + `/users/${member.userId}`);
  $(`#conversation-${group._id}`).append(`
        <li>
          <div class="chat-day-title">
            <span class="title">${message.text}</span>
          </div>
        </li>`);
  //});
}

function showIconAddUserToGroup(id) {
  $('#list-tools').find(`li[id=icon-add-user-to-group]`).remove();
  let icon = `<li class="list-inline-item" id="icon-add-user-to-group" data-gid="${id}">
                <div class="dropdown">
                    <button class="btn nav-btn dropdown-toggle" type="button" data-bs-toggle="modal"
                        data-bs-target="#addUserToGroup-exampleModal">
                        <i class="fa fa-users"></i>
                    </button>
                </div>
            </li>`;
  $('#list-tools').prepend(icon);
  showUser(id);
}

//hiển thị tin nhắn cá nhân
async function showConversationUser(id) {
  // $('#conversation-list').find(`li[id = receiver-${id}]`).css('color', '#abb4d2');
  let currentUserId = document.getElementById('id').value;
  let receiver = await $.get(http + `/users/${id}`);
  let sender = await $.get(http + `/users/${currentUserId}`);
  let messages = await $.get(http + `/messages/SearchBySenderIdAndReceiverId/${currentUserId}/${id}?startFrom=0`);
  //hiển thị avatar
  $('#avatar-detail').attr('src', `${s3}/${receiver.user.avatar}`);
  $('#avatar-conversation').attr('src', `${s3}/${receiver.user.avatar}`);
  //hiển thị tên
  $('#name').html(`${receiver.user.userName}`);
  $('#name-conversation').html(`${receiver.user.userName}`);
  $('#right-conversation').attr('data-id', `${currentUserId}`);
  $('.message-list').attr('id', `conversation-${id}`);
  $(`#conversation-${id}`).append(
    leftConversationText(receiver, {
      text: '',
    })
  );
  $(`#conversation-${id}`).append(
    rightConversationText(receiver, {
      text: '',
    })
  );
  let rightId = $('#right-conversation').attr('data-id');
  let leftId = $(`#left-conversation-${receiver.user._id}`).attr('data-id');
  $(`#conversation-${id}`).html('');
  messages.forEach((message) => {
    //cập nhật đã đọc
    if (message.messageType === 'text') {
      if (message.senderId === rightId) {
        $(`#conversation-${id}`).append(rightConversationText(sender, message));
      }
      if (message.senderId === leftId) {
        $(`#conversation-${id}`).append(
          leftConversationText(receiver, message)
        );
      }
    }
    if (message.messageType === 'image') {
      if (message.senderId === rightId) {
        $(`#conversation-${id}`).append(
          rightConversationImage(sender, message)
        );
      }
      if (message.senderId === leftId) {
        $(`#conversation-${id}`).append(
          leftConversationImage(receiver, message)
        );
      }
    }
    if (message.messageType === 'file') {
      if (message.senderId === rightId) {
        $(`#conversation-${id}`).append(rightConversationFile(sender, message));
      }
      if (message.senderId === leftId) {
        $(`#conversation-${id}`).append(
          leftConversationFile(receiver, message)
        );
      }
    }
    // reaction(message);
  });
  detailConversation(messages);
  // $('#conversation-list').find(`li[id = receiver-${id}]`).css('background-color', '#3e4a56');
  insertInput(id, false);
  insertInputFile(id, false);
  insertIdForVideoCall(id);
  insertIdUserOnline(receiver);
  scrollMessageUserEnd();
  showSearchMessage(id, false);
  $('#list-tools').find(`li[id=icon-add-user-to-group]`).remove();
  showActiveMessage();
  deleteConversation(id);
  var startFrom = 0;
  loadMessageForPresonal(id, startFrom);
  removeListMemberOnUser();
  let test = $('.emoji-message-user');
}
function removeListMemberOnUser() {
  $('#myprofileMember').html('');
  $('#myprofile-member').css('display', 'none');
}
function showSearchMessage(id, isChatGroup) {
  $('#search-message-in-conversation').html('');
  $(`<input type="text" class="form-control bg-light border-0"
    placeholder="Tìm kiếm.." id="search-message">`).appendTo(
    $('#search-message-in-conversation')
  );
  searchMessage(id, isChatGroup);
}

//thêm id cho user online
// Number of member
function insertIdUserOnline(receiver) {
  if (receiver.members) {
    $('#info-conversation').html('');
    $(`<h5 class="font-size-16 mb-0 text-truncate" id="info-conversation">
          <a id="name-conversation" class="text-reset user-profile-show">${receiver.name}</a>  
          <i id="online-conversation-${receiver._id}"></i></h5>
          <span style="padding-top: 3px" id="time-online" class="number-of-member-click cursor-point" data-sum-member="${receiver.members.length}"><i class="fa fa-user" aria-hidden="true"></i> ${receiver.members.length} thành viên</span>`).appendTo(
      $('#info-conversation')
    );
  } else {
    $('#info-conversation').html('');
    $(`<h5 class="font-size-16 mb-0 text-truncate" id="info-conversation">
          <a id="name-conversation" class="text-reset user-profile-show">${receiver.user.userName}</a>  
          <i id="online-conversation-${receiver.user._id}"></i></h5>
          <span style="padding-top: 3px" id="time-online-${receiver.user._id}"></span>`).appendTo(
      $('#info-conversation')
    );
  }
}
//Thêm id cho video Call
function insertIdForVideoCall(id) {
  $('#video-call').html('');
  $(` <i class="fal fa-video" id="video-${id}"></i>`).appendTo(
    $('#video-call')
  );
  videoCall(id);
}

//Thêm thẻ input nhập tin nhắn
function insertInput(id, isChatGroup) {
  $('#text-chat').html('');
  $(`<input type="text" style="display: none" id="text-chat-${id}">`).appendTo(
    $('#text-chat')
  );
  enableEmoji(id, isChatGroup);
}

//Thêm thẻ input file
function insertInputFile(id, isChatGroup) {
  $('#file-Chat').html('');
  $(
    `<input id="fileChat-${id}" data-id="${id}" type="file" name="files" multiple>`
  ).appendTo($('#file-Chat'));
  fileChat(id, isChatGroup);
}

function renderTime(message) {
  // let formatedTime = moment(message.createdAt).format('LT');
  let formatedTime = moment(message.createdAt).format('h:mm A DD-MM-YYYY');
  return formatedTime;
}

//tạo tin nhắn text gửi đi
function rightConversationText(user, message) {
  return `<li class="right" id="right-conversation" data-content="${message.text
    }" data-id="${user.user._id}" data-messageId="${message._id}">
    <div class="conversation-list">
        <div class="chat-avatar">
            <img src="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${user.user.avatar
    }" alt="">
        </div>

        <div class="user-chat-content position-relative">
            <div class="ctext-wrap">
                <div class="ctext-wrap-content">
                    <p class="mb-0" id="chat-content" >
                        ${message.text} 
                    </p>
                    <p class="chat-time mb-0"><i
                            class="fal fa-clock align-middle"></i> <span
                            class="align-middle">${renderTime(
      message
    )}</span></p>
                </div>

                <div class="dropdown align-self-start">
                    <a class="dropdown-toggle" href="javascript:void(0)"
                        role="button" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <i class="fal fa-ellipsis-v"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item"
                            href="javascript:void(0)">Sao chép
                            <i
                                class="fal fa-copy float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Lưu
                            <i
                                class="fal fa-save float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Chuyển tiếp
                            <i
                                class="fal fa-share float-end text-muted"></i></a>
                        <a class="dropdown-item" onclick="deleteText('${message._id}')"
                            href="javascript:void(0)">Thu hồi
                            <i
                                class="fal fa-trash-alt float-end text-muted"></i></a>
                    </div>
                </div>
            </div>
            <div class="emoji-message-user">
              <div class="conversation-emoji">
                  <div style="border-radius: 50%;" id="reaction" data-mid="${message._id}" onmouseover="reaction('${message._id}')">
                    <span style="font-size: 14px;padding: 1px;">👍</span>
                  </div>
                  <div class="list-emoji-hover list-emoji-hover-left rounded-pill" >
                    <div class="emoji-hover d-flex justify-content-around" id="item-reaction-like-${message._id}">
                    👍
                    </div>
                    <div class="emoji-hover d-flex justify-content-around" id="item-reaction-love-${message._id}">
                    😍
                    </div>
                    <div class="emoji-hover d-flex justify-content-around" id="item-reaction-smile-${message._id}">
                    😂
                    </div>
                    <div class="emoji-hover d-flex justify-content-around" id="item-reaction-wow-${message._id}">
                    😱
                    </div>
                    <div class="emoji-hover d-flex justify-content-around" id="item-reaction-cry-${message._id}">
                    😭
                    </div>
                    <div class="emoji-hover d-flex justify-content-around" id="item-reaction-angry-${message._id}">
                    😡
                    </div>
                  </div>
              </div>
            </div>
            <div class="conversation-name">Tôi</div>
        </div>
    </div>
</li>`;
}

//tạo tin nhắn text nhận
function leftConversationText(user, message) {
  return `<li id="left-conversation-${user.user._id}" data-id="${user.user._id
    }"  data-content="${message.text}" data-messageId="${message._id}">
    <div class="conversation-list">
        <div class="chat-avatar">
            <img src="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${user.user.avatar
    }"
                alt="">
        </div>

        <div class="user-chat-content">
            <div class="ctext-wrap">
                <div class="ctext-wrap-content">
                    <p class="mb-0" id="chat-content" >
                    ${message.text}
                    </p>
                    <p class="chat-time mb-0"><i
                            class="fal fa-clock align-middle"></i> <span
                            class="align-middle">${renderTime(
      message
    )}</span></p>
                </div>
                <div class="dropdown align-self-start">
                    <a class="dropdown-toggle" href="javascript:void(0)"
                        role="button" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <i class="fal fa-ellipsis-v"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item"
                            href="javascript:void(0)">Sao chép
                            <i
                                class="fal fa-copy float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Lưu
                            <i
                                class="fal fa-save float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Chuyển tiếp
                            <i
                                class="fal fa-share float-end text-muted"></i></a>
                    </div>
                </div>
            </div>
            <div class="emoji-message-user-left">
              <div class="conversation-emoji">
                  <div style="border-radius: 50%;">
                    <span style="font-size: 14px;padding: 1px;"><i class="fal fa-thumbs-up"></i></span>
                  </div>
                  <div class="list-emoji-hover list-emoji-hover-left rounded-pill">
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-thumbs-up text-warning"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-heart text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-grin-squint-tears text-warning"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-surprise text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-sad-cry text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-angry" style="color: #c72d26"></i>
                    </div>
                  </div>
              </div>
            </div>
            <div class="conversation-name">${user.user.userName}</div>
        </div>
    </div>
</li>`;
}

//tạo tin nhắn image gửi đi
function rightConversationImage(user, message) {
  return `<li class="right" id="right-conversation" data-id="${user.user._id
    }"  data-messageId="${message._id}">
    <div class="conversation-list">
        <div class="chat-avatar">
            <img src="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${user.user.avatar
    }"
                alt="">
        </div>

        <div class="user-chat-content">
            <div class="ctext-wrap">
                <div class="ctext-wrap-content">
                    <ul class="list-inline message-img  mb-0">
                        <li class="list-inline-item message-img-list me-2 ms-0">
                            <div>
                                <a class="popup-img d-inline-block m-1"
                                    href="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${message.fileName
    }"
                                    title="Project 1">
                                    <img src="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${message.fileName
    }" alt=""
                                        class="rounded border">
                                </a>
                            </div>
                            <div class="message-img-link">
                                <ul class="list-inline mb-0">
                                    <li class="list-inline-item">
                                        <a href="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${message.fileName
    }">
                                            <i class="fal fa-download"></i>
                                        </a>
                                    </li>
                                    <li class="list-inline-item dropdown">
                                        <a class="dropdown-toggle"
                                            href="javascript:void(0)"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false">
                                            <i
                                                class="fal fa-ellipsis-h"></i>
                                        </a>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item"
                                                href="javascript:void(0)">Sao
                                                chép
                                                <i
                                                    class="fal fa-copy float-end text-muted"></i></a>
                                            <a class="dropdown-item"
                                                href="javascript:void(0)">Lưu
                                                <i
                                                    class="fal fa-save float-end text-muted"></i></a>
                                            <a class="dropdown-item"
                                                href="javascript:void(0)">Chuyển
                                                tiếp
                                                <i
                                                    class="fal fa-share float-end text-muted"></i></a>
                                            <a class="dropdown-item"
                                                href="javascript:void(0)">Xoá
                                                <i
                                                    class="fal fa-trash-alt float-end text-muted"></i></a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>

                    </ul>
                    <p class="chat-time mb-0"><i
                            class="fal fa-clock align-middle"></i> <span
                            class="align-middle">${renderTime(
      message
    )}</span></p>
                </div>

                <div class="dropdown align-self-start">
                    <a class="dropdown-toggle" href="javascript:void(0)"
                        role="button" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <i class="fal fa-ellipsis-v"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item"
                            href="javascript:void(0)">Sao chép
                            <i
                                class="fal fa-copy float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Lưu
                            <i
                                class="fal fa-save float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Chuyển tiếp
                            <i
                                class="fal fa-share float-end text-muted"></i></a>
                        <a class="dropdown-item" onclick="deleteFile('${message._id
    }')"
                            href="javascript:void(0)">Xoá 
                            <i
                                class="fal fa-trash-alt float-end text-muted"></i></a>
                    </div>
                </div>

            </div>
          <div class="emoji-message-user emoji-message-user-image">
              <div class="conversation-emoji">
                  <div style="border-radius: 50%;">
                    <span style="font-size: 14px;padding: 1px;"><i class="fal fa-thumbs-up"></i></span>
                  </div>
                  <div class="list-emoji-hover list-emoji-hover-left rounded-pill">
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-thumbs-up text-warning"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-heart text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-grin-squint-tears text-warning"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-surprise text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-sad-cry text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-angry" style="color: #c72d26"></i>
                    </div>
                  </div>
              </div>
            </div>               
            <div class="conversation-name">Tôi</div>
        </div>

    </div>
</li>`;
}

//tạo tin nhắn image nhận
function leftConversationImage(user, message) {
  return `<li id="left-conversation-${user.user._id}" data-id="${user.user._id
    }" data-content="${message.text}" data-messageId="${message._id}">
     <div class="conversation-list">
         <div class="chat-avatar">
             <img src="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${user.user.avatar
    }"
                 alt="">
         </div>

         <div class="user-chat-content">
             <div class="ctext-wrap">
                 <div class="ctext-wrap-content">
                     <ul class="list-inline message-img  mb-0">
                         <li class="list-inline-item message-img-list">
                             <div>
                                 <a class="popup-img d-inline-block m-1"
                                     href="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${message.fileName
    }"
                                     title="Project 2">
                                     <img src="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${message.fileName
    }" alt=""
                                         class="rounded border">
                                 </a>
                             </div>
                             <div class="message-img-link">
                                 <ul class="list-inline mb-0">
                                     <li class="list-inline-item">
                                         <a href="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${message.fileName
    }">
                                             <i class="fal fa-download"></i>
                                         </a>
                                     </li>
                                     <li class="list-inline-item dropdown">
                                         <a class="dropdown-toggle"
                                             href="javascript:void(0)"
                                             role="button"
                                             data-bs-toggle="dropdown"
                                             aria-haspopup="true"
                                             aria-expanded="false">
                                             <i
                                                 class="fal fa-ellipsis-h"></i>
                                         </a>
                                         <div
                                             class="dropdown-menu dropdown-menu-end">
                                             <a class="dropdown-item"
                                                 href="javascript:void(0)">Sao
                                                 chép
                                                 <i
                                                     class="fal fa-copy float-end text-muted"></i></a>
                                             <a class="dropdown-item"
                                                 href="javascript:void(0)">Lưu
                                                 <i
                                                     class="fal fa-save float-end text-muted"></i></a>
                                             <a class="dropdown-item"
                                                 href="javascript:void(0)">Chuyển
                                                 tiếp
                                                 <i
                                                     class="fal fa-share float-end text-muted"></i></a>
                                             <a class="dropdown-item"
                                                 href="javascript:void(0)">Xoá
                                                 <i
                                                     class="fal fa-trash-alt float-end text-muted"></i></a>
                                         </div>
                                     </li>
                                 </ul>
                             </div>
                         </li>
                     </ul>
                     <p class="chat-time mb-0"><i
                             class="fal fa-clock align-middle"></i> <span
                             class="align-middle">${renderTime(
      message
    )}</span></p>
                 </div>

                 <div class="dropdown align-self-start">
                     <a class="dropdown-toggle" href="javascript:void(0)"
                         role="button" data-bs-toggle="dropdown"
                         aria-haspopup="true" aria-expanded="false">
                         <i class="fal fa-ellipsis-v"></i>
                     </a>
                     <div class="dropdown-menu">
                         <a class="dropdown-item"
                             href="javascript:void(0)">Sao chép
                             <i
                                 class="fal fa-copy float-end text-muted"></i></a>
                         <a class="dropdown-item"
                             href="javascript:void(0)">Lưu
                             <i
                                 class="fal fa-save float-end text-muted"></i></a>
                         <a class="dropdown-item"
                             href="javascript:void(0)">Chuyển tiếp
                             <i
                                 class="fal fa-share float-end text-muted"></i></a>
                         <a class="dropdown-item"
                             href="javascript:void(0)">Xoá
                             <i
                                 class="fal fa-trash-alt float-end text-muted"></i></a>
                     </div>
                 </div>

             </div>
             <div class="emoji-message-user emoji-message-user-right emoji-message-user-image">
              <div class="conversation-emoji">
                  <div style="border-radius: 50%;">
                    <span style="font-size: 14px;padding: 1px;"><i class="fal fa-thumbs-up"></i></span>
                  </div>
                  <div class="list-emoji-hover list-emoji-hover-left rounded-pill">
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-thumbs-up text-warning"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-heart text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-grin-squint-tears text-warning"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-surprise text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-sad-cry text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-angry" style="color: #c72d26"></i>
                    </div>
                  </div>
              </div>
            </div>                    
             <div class="conversation-name">${user.user.userName}</div>
         </div>

     </div>
 </li>`;
}

//tạo tin nhắn file gửi đi
function rightConversationFile(user, message) {
  let fileName = message.fileName.split('.');
  return `<li class="right"  id="right-conversation" data-id="${user.user._id
    }"  data-messageId="${message._id}">
    <div class="conversation-list">
        <div class="chat-avatar">
            <img src="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${user.user.avatar
    }" alt="">
        </div>

        <div class="user-chat-content">
            <div class="ctext-wrap">

                <div class="ctext-wrap-content">
                    <div class="card p-2 mb-2">
                        <div
                            class="d-flex flex-wrap align-items-center attached-file">
                            <div
                                class="avatar-sm me-3 ms-0 attached-file-avatar">
                                <div
                                    class="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                    <i class="fal fa-file-alt"></i>
                                </div>
                            </div>
                            <div class="flex-1 overflow-hidden">
                                <div class="text-start">
                                    <h5
                                        class="font-size-14 text-truncate mb-1">
                                        ${fileName[1] + '.' + fileName[2]}</h5>
                                    <p
                                        class="text-muted text-truncate font-size-13 mb-0">
                                        12.5 MB</p>
                                </div>
                            </div>
                            <div class="ms-4 me-0">
                                <div
                                    class="d-flex gap-2 font-size-20 d-flex align-items-start">
                                    <div>
                                        <a href="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${message.fileName
    }"
                                            class="text-muted">
                                            <i class="fal
                                                    fa-download"></i>
                                        </a>
                                    </div>
                                    <div class="dropdown">
                                        <a class="dropdown-toggle text-muted"
                                            href="javascript:void(0)"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false">
                                            <i
                                                class="fal fa-ellipsis-h"></i>
                                        </a>
                                        <div
                                            class="dropdown-menu dropdown-menu-end">
                                            <a class="dropdown-item"
                                                href="javascript:void(0)">Chia
                                                sẻ
                                                <i
                                                    class="fal fa-share-alt float-end text-muted"></i></a>
                                            <a class="dropdown-item"
                                                href="javascript:void(0)">Xoá
                                                <i
                                                    class="fal fa-trash-alt float-end text-muted"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p class="chat-time mb-0"><i
                            class="fal fa-clock align-middle"></i> <span
                            class="align-middle">${renderTime(
      message
    )}</span></p>
                </div>

                <div class="dropdown align-self-start">
                    <a class="dropdown-toggle" href="javascript:void(0)"
                        role="button" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <i class="fal fa-ellipsis-v"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item"
                            href="javascript:void(0)">Sao chép
                            <i
                                class="fal fa-copy float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Lưu
                            <i
                                class="fal fa-save float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Chuyển tiếp
                            <i
                                class="fal fa-share float-end text-muted"></i></a>
                        <a class="dropdown-item" onclick="deleteFile('${message._id
    }')"
                            href="javascript:void(0)">Xoá
                            <i
                                class="fal fa-trash-alt float-end text-muted"></i></a>
                    </div>
                </div>

            </div>
<div class="emoji-message-user emoji-message-user-file">
              <div class="conversation-emoji">
                  <div style="border-radius: 50%;">
                    <span style="font-size: 14px;padding: 1px;"><i class="fal fa-thumbs-up"></i></span>
                  </div>
                  <div class="list-emoji-hover list-emoji-hover-left rounded-pill">
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-thumbs-up text-warning"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-heart text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-grin-squint-tears text-warning"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-surprise text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-sad-cry text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-angry" style="color: #c72d26"></i>
                    </div>
                  </div>
              </div>
            </div>   
            <div class="conversation-name">Tôi</div>
        </div>

    </div>
</li>`;
}

//tạo tin nhắn file nhận
function leftConversationFile(user, message) {
  let fileName = message.fileName.split('.');
  return `<li id="left-conversation-${user.user._id}" data-id="${user.user._id
    }" data-content="${message.text}" data-messageId="${message._id}">
    <div class="conversation-list">
        <div class="chat-avatar">
            <img src="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${user.user.avatar
    }" alt="">
        </div>

        <div class="user-chat-content">
            <div class="ctext-wrap">

                <div class="ctext-wrap-content">
                    <div class="card p-2 mb-2">
                        <div
                            class="d-flex flex-wrap align-items-center attached-file">
                            <div
                                class="avatar-sm me-3 ms-0 attached-file-avatar">
                                <div
                                    class="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                    <i class="fal fa-file-alt"></i>
                                </div>
                            </div>
                            <div class="flex-1 overflow-hidden">
                                <div class="text-start">
                                    <h5
                                        class="font-size-14 text-truncate mb-1">
                                        ${fileName[1] + '.' + fileName[2]}</h5>
                                    <p
                                        class="text-muted text-truncate font-size-13 mb-0">
                                        12.5 MB</p>
                                </div>
                            </div>
                            <div class="ms-4 me-0">
                                <div
                                    class="d-flex gap-2 font-size-20 d-flex align-items-start">
                                    <div>
                                        <a href="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${message.fileName
    }"
                                            class="text-muted">
                                            <i class="fal
                                                    fa-download"></i>
                                        </a>
                                    </div>
                                    <div class="dropdown">
                                        <a class="dropdown-toggle text-muted"
                                            href="javascript:void(0)"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false">
                                            <i
                                                class="fal fa-ellipsis-h"></i>
                                        </a>
                                        <div
                                            class="dropdown-menu dropdown-menu-end">
                                            <a class="dropdown-item"
                                                href="javascript:void(0)">Chia
                                                sẻ
                                                <i
                                                    class="fal fa-share-alt float-end text-muted"></i></a>
                                            <a class="dropdown-item"
                                                href="javascript:void(0)">Xoá
                                                <i
                                                    class="fal fa-trash-alt float-end text-muted"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p class="chat-time mb-0"><i
                            class="fal fa-clock align-middle"></i> <span
                            class="align-middle">${renderTime(
      message
    )}</span></p>
                </div>

                <div class="dropdown align-self-start">
                    <a class="dropdown-toggle" href="javascript:void(0)"
                        role="button" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <i class="fal fa-ellipsis-v"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item"
                            href="javascript:void(0)">Sao chép
                            <i
                                class="fal fa-copy float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Lưu
                            <i
                                class="fal fa-save float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Chuyển tiếp
                            <i
                                class="fal fa-share float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Xoá
                            <i
                                class="fal fa-trash-alt float-end text-muted"></i></a>
                    </div>
                </div>

            </div>
<div class="emoji-message-user emoji-message-user-image">
              <div class="conversation-emoji">
                  <div style="border-radius: 50%;">
                    <span style="font-size: 14px;padding: 1px;"><i class="fal fa-thumbs-up"></i></span>
                  </div>
                  <div class="list-emoji-hover list-emoji-hover-left rounded-pill">
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-thumbs-up text-warning"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-heart text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-grin-squint-tears text-warning"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-surprise text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-sad-cry text-danger"></i>
                    </div>
                    <div class="emoji-hover d-flex justify-content-around">
                        <i class="fas fa-angry" style="color: #c72d26"></i>
                    </div>
                  </div>
              </div>
            </div>   
            <div class="conversation-name">${user.user.userName}</div>
        </div>

    </div>
</li>`;
}

function showActiveMessage() {
  const getChatUserItem = document.querySelectorAll('.chat-user-list-item');
  // console.log(getChatUserItem);
  getChatUserItem.forEach((message, index) => {
    // console.log(message);
    message.addEventListener('click', () => {
      $('.chat-user-list-item.active').removeClass('active');
      message.classList.add('active');
    });
  });
}

function showActiveMessageGroup() {
  const getChatUserItem = document.querySelectorAll('.chat-user-list-item');
  getChatUserItem.forEach((message, index) => {
    message.addEventListener('click', () => {
      $('.chat-user-list-item.active').removeClass('active');
      message.classList.add('active');
    });
  });
}

function isRead(message) {
  if (message.isRead === false) {
    $.ajax({
      url: '/message/updateIsRead',
      type: 'put',
      data: {
        message: message,
      },
      success: function (data) {
        if (data.success) {
        }
      },
    });
  }
}

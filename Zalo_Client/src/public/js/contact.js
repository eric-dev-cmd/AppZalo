const http = `http://localhost:4000`;

$(document).ready(function () {
  $('#searchPhone').on('keyup', function () {
    //khi nhap vao o tim kiem
    search(this.value);
    $('#btn-add-cancel-friend').find('#btn-add-friend').hide();
  });
});

//tim kiem theo url
function search(phone) {
  const phoneCurrent = document.getElementById('phone').placeholder;
  if (phoneCurrent !== phone) {
    const url = http + `/users/searchPhone/${phone}`;
    $.get(url, function (data, status) {
      if (status === 'success') {
        const {
          local,
          userName,
          avatar,
          _id
        } = data.user;
        $('#name-search').html('');
        $('#phone-search').html('');
        $('#image-search').html('');
        $('<strong>' + userName + '</strong>').appendTo($('#name-search')),
          $('<strong>' + local.phone + '</strong>').appendTo(
            $('#phone-search')
          ),
          $('<img src="images/' + avatar + '">').appendTo($('#image-search')),
          $('#btn-add-friend').attr('data-uid', `${_id}`);
        $('#btn-cancel-friend').attr('data-uid', `${_id}`);
        btnAddRemoveContact(_id);
      }
    });
  }
}

//xu ly btn-add-remove-friend
function btnAddRemoveContact(receiverId) {
  const userId = document.getElementById('id').value;
  $.get(http + `/contacts/search/${userId}/${receiverId}`, function (data) {
    if (data.contact !== null) {
      $('#btn-add-cancel-friend')
        .find('#btn-cancel-friend')
        .css('display', 'inline-block');
      removeRequestContact(receiverId);
    } else {
      $('#btn-add-cancel-friend')
        .find('#btn-add-friend')
        .css('display', 'inline-block');
      addNewContact(receiverId);
    }
  });
}

//xu ly yeu cau ket ban
function addNewContact(receiverId) {
  $('#btn-add-friend').one('click', function (e) {
    var me = $(this);
    e.preventDefault();
    if (me.data('requestRunning')) {
      return;
    }
    me.data('requestRunning', true);
    //var receiverId = $('#btn-add-friend').attr('data-uid');
    $.ajax({
      type: "POST",
      url: "/contact/add-new",
      data: {
        uid: receiverId
      },
      success: function (data) {
        if (data.success) {
          $('#btn-add-cancel-friend').find('#btn-add-friend').hide();
          $('#btn-add-cancel-friend').find('#btn-cancel-friend').css('display', 'inline-block');
          removeRequestContact(receiverId);
          socket.emit('add-new-contact', {
            receiverId: receiverId
          });
        }
      },
      complete: function () {
        me.data('requestRunning', false);
      }
    });
  });
}

function addNewContact(receiverId) {
  $('#btn-add-friend').one('click', function (e) {
    var me = $(this);
    e.preventDefault();
    if (me.data('requestRunning')) {
      return;
    }
    me.data('requestRunning', true);
    $.ajax({
      type: 'POST',
      url: '/contact/add-new',
      data: {
        uid: receiverId,
      },
      success: function (data) {
        if (data.success) {
          $('#btn-add-cancel-friend').find('#btn-add-friend').hide();
          $('#btn-add-cancel-friend')
            .find('#btn-cancel-friend')
            .css('display', 'inline-block');
          removeRequestContact(receiverId);
          socket.emit('add-new-contact', {
            receiverId: receiverId,
          });
        }
      },
      complete: function () {
        me.data('requestRunning', false);
      },
    });
  });
}

//xu ly huy yeu cau ket ban
function removeRequestContact(receiverId) {
  $('#btn-cancel-friend').one('click', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/contact/remove',
      type: 'delete',
      data: {
        uid: receiverId,
      },
      success: function (data) {
        if (data.success) {
          $('#btn-add-cancel-friend').find('#btn-cancel-friend').hide(),
            $('#btn-add-cancel-friend')
            .find('#btn-add-friend')
            .css('display', 'inline-block');
          addNewContact(receiverId);
          socket.emit('remove-request-contact', {
            receiverId: receiverId,
          });
        }
      },
    });
  });
}

//lắng nghe socket response-add-new-contact từ server
socket.on('response-add-new-contact', function (user) {
  let notification = `<li class="position-relative" data-uid = '${user.id}'>
        <a  style="width: 90%;">
            <div class="d-flex">
                <div
                    class="chat-user-img away align-self-center me-3 ms-0">
                    <img src="images/${user.avatar}"
                        class="rounded-circle avatar-xs" alt="">
                    <span class="user-status"></span>
                </div>
                <div class="flex-1 overflow-hidden">
                    <h5 class="text-truncate font-size-15 mb-1">
                    ${user.userName}</h5>
                    <p class="chat-user-message text-truncate mb-0">
                        Muốn kết bạn. "Xin chào, tôi là <span>Bảo Anh.
                    </p>
    
    
                </div>
            </div>
        </a>
        <div style="float: right;position: absolute;
    top: 14px;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    width: 14%;">
            <div class="fs-13 pb-1">
                <a  id="btn-cancel-friend-receiver" data-uid = '${user.id}'
                    class="text-decoration-none cursor-point" style="    position: static;
    padding: 0;
    display: inline-block;" >Bỏ qua</a>
            </div>
            <div class="fs-13">
                <a  id="btn-accept-friend" data-uid = '${user.id}'
                    class="text-decoration-none cursor-point" style="    position: static;
    padding: 0;
    display: inline-block;">Đồng ý</a>
            </div>
        </div>
    </li>`;
  $('#notification-contact').prepend(notification);
  removeRequestContactReceiver();
  acceptRequestContact();
});

//lắng nghe socket response-remove-request-contact từ server
socket.on('response-remove-request-contact', function (user) {
  $('#notification-contact').find(`li[data-uid = ${user.id}]`).remove();
});

$(document).ready(function () {
  removeRequestContactReceiver();
});

//xu ly huy yeu cau khi nhan 1 loi moi ket ban
function removeRequestContactReceiver() {
  $('#btn-cancel-friend-receiver').on('click', function (e) {
    e.preventDefault();
    let senderId = $(this).data('uid');
    $.ajax({
      url: '/contact/removeReceiver',
      type: 'delete',
      data: {
        uid: senderId,
      },
      success: function (data) {
        if (data.success) {
          $('#notification-contact')
            .find(`li[data-uid = ${senderId}]`)
            .remove();

          socket.emit('remove-request-contact-receiver', {
            senderId: senderId,
          });
        }
      },
    });
  });
}

socket.on('response-remove-request-contact-receiver', function (user) {
  $('#btn-add-cancel-friend')
    .find(`div#btn-cancel-friend[data-uid = ${user.id}]`)
    .hide(),
    $('#btn-add-cancel-friend')
    .find(`div#btn-add-friend[data-uid = ${user.id}]`)
    .css('display', 'inline-block'),
    addNewContact(user.id);
});

$(document).ready(function () {
  acceptRequestContact();
});
//xu ly accept ket ban
function acceptRequestContact() {
  $('#btn-accept-friend').on('click', function (e) {
    e.preventDefault();
    let senderId = $(this).data('uid');
    $.ajax({
      url: '/contact/accept',
      type: 'put',
      data: {
        uid: senderId,
      },
      success: function (data) {
        if (data.success) {
          $('#notification-contact')
            .find(`li[data-uid = ${senderId}]`)
            .remove();
          $.get(http + `/users/${senderId}`, function (data, status) {
            if (status === 'success') {
              var sum = $('#sumOfContact').attr('data-sum');
              sum++;
              $('#sumOfContact').html('');
              $('<span>Bạn bè(' + sum + ')</span>').appendTo(
                  $('#sumOfContact')
                ),
                $('#contact-list').prepend(contact(data.user));
            }
          });
          socket.emit('accept-contact', {
            senderId: senderId,
          });
        }
      },
    });
  });
}

function contact(user) {
  let contact = `<li>
                                                      <div class="d-flex align-items-center">
                                                            <div class="flex-1">
                                                                <h5 class="font-size-14 m-0">${user.userName}</h5>
                                                            </div>
                                                            <div class="dropdown">
                                                                <a href="javascript:void(0)"
                                                                    class="text-muted dropdown-toggle"
                                                                    data-bs-toggle="dropdown" aria-haspopup="true"
                                                                    aria-expanded="false">
                                                                    <i class="fal fa-ellipsis-v"
                                                                        style="font-size: 20px; padding: 0 12px;"></i>
                                                                </a>
                                                                <div class="dropdown-menu dropdown-menu-end">
                                                                    <div>
                                                                        <a onclick="toggle()"
                                                                            class="dropdown-item d-flex align-items-center justify-content-between"><span>Profile</span>
                                                                            <i
                                                                                class="fal fa-user-circle float-end text-muted"></i>
                                                                        </a>
                                                                    </div>

                                                                    <a class="dropdown-item"
                                                                        href="javascript:void(0)">Block
                                                                        <i
                                                                            class="fal fa-ban float-end text-muted"></i></a>
                                                                    <a class="dropdown-item"
                                                                        href="/contact/remove">Remove
                                                                        <i
                                                                            class="fal fa-trash-alt float-end text-muted"></i></a>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </li>`;
  return contact;
}

socket.on('response-accept-contact', function (user) {
  var sum = $('#sumOfContact').attr('data-sum');
  sum++;
  $('#sumOfContact').html('');
  $('<span>Bạn bè(' + sum + ')</span>').appendTo($('#sumOfContact')),
    $('#contact-list').prepend(contact(user));
});
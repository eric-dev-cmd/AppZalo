//xu ly huy yeu cau ket ban
function removeFriendRequest() {
  $('#btn-cancel-friend').one('click', function (e) {
    var me = $(this);
    e.preventDefault();
    if (me.data('requestRunning')) {
      return;
    }
    me.data('requestRunning', true);
    var receiverId = $('#btn-add-friend').attr('data-uid');
    $.ajax({
      url: '/contact/removeFriend',
      type: 'delete',
      data: {
        uid: receiverId,
      },
      success: function (data) {
        if (data.success) {
          $('#btn-add-cancel-friend').find('#btn-cancel-friend').hide(),
            $('#btn-add-cancel-friend').find('#btn-add-friend').css('display', 'inline-block');
          addNewContact();
          socket.emit('remove-request-contact', {
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

//lắng nghe socket từ server
socket.on('response-remove-request-contact', function (user) {
  $('#notification-contact').find(`li[data-uid = ${user.id}]`).remove();
  sumOfNotificationDes();
});


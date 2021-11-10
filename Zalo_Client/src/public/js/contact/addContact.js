//xu ly yeu cau ket ban
function addNewContact() {
  $('#btn-add-friend').off('click').on('click', function (e) {
    let receiverId = $('#btn-add-friend').attr('data-uid');
    let id = {userId: receiverId};
    $.post('/contact/addNewContact', id, function (data) {
      if (data.success) {
        $('#btn-add-cancel-friend').find('#btn-add-friend').hide();
        $('#btn-add-cancel-friend').find('#btn-cancel-friend').css('display', 'inline-block');
        removeFriendRequest(receiverId);
        socket.emit('add-new-contact', {
          receiverId: receiverId,
        });
      }
    });
  });
}

//lắng nghe socket response-add-new-contact từ server
socket.on('response-add-new-contact', function (user) {
  let notification = `<li class="position-relative" data-uid = '${user.id}'>
    <a  style="width: 100%;">
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
                Muốn kết bạn. 
                    "Xin chào, tôi là <span>${user.userName}"
                </p>
  
  
            </div>
        </div>
    </a>
    <div class="d-flex justify-content-around">
    <a class="cursor-point"  id="btn-cancel-friend-receiver"  data-uid = '${user.id}' >Bỏ qua</a>
    <a class="cursor-point" id="btn-accept-friend" data-uid = '${user.id}' >Đồng ý</a>
  </div>
  </li>`;
  $('#notification-contact').prepend(notification);
  sumOfNotificationInc();
  removeFriendRequestFromReceiver();
  acceptFriendRequest();
});

function sumOfNotificationInc() {
  let sum = $('#sumOfNotification').attr('data-sum');
  sum++;
  $('#sumOfNotification').attr('data-sum', sum);
  $('#sumOfNotification').html('');
  $('<span>(' + sum + ')</span>').appendTo($('#sumOfNotification'));
}
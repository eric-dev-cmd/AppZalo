socket.on('check-online-offline', function (listUserIdOnline) {
    listUserIdOnline.forEach(async id => {
        //thêm class online
        setInterval(() => {
            $(`#receiver-${id}`).find('span').addClass('user-status');
            $(`#online-conversation-${id}`).addClass('fas fa-circle font-size-10 text-success d-inline-block ms-1');
            $(`#time-online-${id}`).html('Đang hoạt động');
        },500)
    });
});

socket.on('check-online-login', function (userId) {
    //thêm class online
    $(`#receiver-${userId}`).find('span').addClass('user-status');
    $(`#online-conversation-${userId}`).addClass('fas fa-circle font-size-10 text-success d-inline-block ms-1');
    $(`#time-online-${userId}`).html('Đang hoạt động');
})
socket.on('check-offline-logout', function (userId) {
    //xóa class online
    $(`#receiver-${userId}`).find('span').removeClass('user-status');
    $(`#online-conversation-${userId}`).removeClass('fas fa-circle font-size-10 text-success d-inline-block ms-1')
    $(`#time-online-${userId}`).html('');
})
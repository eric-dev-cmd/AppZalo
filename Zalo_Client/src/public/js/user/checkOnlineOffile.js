socket.on('check-user-online-offline', function (listUserIdOnline) {
    listUserIdOnline.forEach(async id => {
        //thêm class online
        $(`#receiver-${id}`).find('span').addClass('user-status');
        setInterval(() => {
            $(`#online-conversation-${id}`).addClass('fas fa-circle font-size-10 text-success d-inline-block ms-1');
            $(`#time-online-${id}`).html('Đang hoạt động');
        })
    });
});

socket.on('check-user-online-when-login', function (userId) {
    //thêm class online
    $(`#receiver-${userId}`).find('span').addClass('user-status');
    $(`#online-conversation-${userId}`).addClass('fas fa-circle font-size-10 text-success d-inline-block ms-1');
    $(`#time-online-${userId}`).html('Đang hoạt động');
})
let timeOnline = null;
socket.on('check-user-offline-when-logout', function (userId) {
    //xóa class online
    $(`#receiver-${userId}`).find('span').removeClass('user-status');
    $(`#online-conversation-${userId}`).removeClass('fas fa-circle font-size-10 text-success d-inline-block ms-1')
    timeOnline = Date.now();
    $(`#time-online-${userId}`).html(renderTimeOnline());
})

function renderTimeOnline() {
    let formatedTimeAgo = moment(timeOnline).locale('vi').startOf('seconds').fromNow();
    return formatedTimeAgo;
}
let currentUserId = document.getElementById('id').value;
socket.on('check-online-offline', function (listUserIdOnline) {
    listUserIdOnline.forEach(async id => {
        if (id !== currentUserId) {
            //thêm class online
            let getUser = await $.get(http + `/users/${id}`);
            if (getUser.user.isOnline === 'true') {
                $(`#receiver-${id}`).find('span').html('').removeClass().addClass('user-status');
                $(`#online-conversation-${id}`).removeClass().addClass('fas fa-circle font-size-10 text-success d-inline-block ms-1');
                $(`#time-online-${id}`).html('Đang hoạt động');
            }
            if (getUser.user.isOnline === 'busy') {
                // $(`#receiver-${id}`).find('span').removeClass().addClass('user-status');
                $(`#receiver-${id}`).find('span').html(`<i class = "fas fa-circle font-size-10 text-warning me-1 ms-0" >`)
                $(`#online-conversation-${id}`).removeClass().addClass('fas fa-circle font-size-10 text-warning d-inline-block ms-1');
                $(`#time-online-${id}`).html('Đang bận');
            }
        }
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


$(`#btn-busy-${currentUserId}`).off('click').on('click', async function () {
    let user = await $.get(http + `/users/${currentUserId}`);
    $.ajax({
        url: '/user/updateBusy',
        type: 'put',
        data: {
            user: user.user,
        },
        success: function (data) {
            if (data.success) {
                $('#busy').removeClass().addClass('fas fa-circle font-size-10 text-warning me-1 ms-0');
                socket.emit('busy', user);
            }
        },
    });
})

$(`#btn-online-${currentUserId}`).off('click').on('click', async function () {
    let user = await $.get(http + `/users/${currentUserId}`);
    $.ajax({
        url: '/user/updateOnline',
        type: 'put',
        data: {
            user: user.user,
        },
        success: function (data) {
            if (data.success) {
                $('#busy').removeClass().addClass('fas fa-circle font-size-10 text-success me-1 ms-0');
                // socket.emit('busy', user);
            }
        },
    });
})
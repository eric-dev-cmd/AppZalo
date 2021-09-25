//xu ly huy yeu cau ket ban
function removeRequestContactReceived() {
    $('#btn-cancel-friend-receiver').one('click', function (e) {
        let senderId = $(this).data('uid');
        console.log(senderId);
        e.preventDefault();
        $.ajax({
            url: '/contact/remove',
            type: 'delete',
            data: {
                uid: senderId
            },
            success: function (data) {
                if (data.success) {
                    $('#btn-add-cancel-friend').find('#btn-cancel-friend').hide(),
                    $('#btn-add-cancel-friend').find('#btn-add-friend').css('display', 'inline-block')
                    socket.emit('remove-request-contact-receiver', {
                        senderId: senderId
                    });
                }
            }
        })
    });
}


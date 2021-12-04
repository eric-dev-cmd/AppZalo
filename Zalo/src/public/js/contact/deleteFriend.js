//xóa bạn bè( từ html)
function deleteFriend(id) {
    $.ajax({
        url: '/contact/removeFriend',
        type: 'delete',
        data: {
            userId: id
        },
        success: function (data) {
            if (data.success) {
                $('#conversation-list').find(`li[id=receiver-${id}]`).remove();
                $('#contact-list').find(`li[data-uid = ${id}]`).remove();
                sumOfContactDes();
                socket.emit('delete-friend', {
                    receiverId: id,
                });
            }
        },
    });
}

socket.on('response-delete-friend', function (user) {
    $('#conversation-list').find(`li[id=receiver-${user.id}]`).remove();
    $('#contact-list').find(`li[data-uid = ${user.id}]`).remove();
    sumOfContactDes();
});

function sumOfContactDes() {
    var sum = $('#sumOfContact').attr('data-sum');
    sum = sum - 1;
    $('#sumOfContact').attr('data-sum', sum);
    $('#sumOfContact').html('');
    $('<span>Bạn bè(' + sum + ')</span>').appendTo($('#sumOfContact'));
}

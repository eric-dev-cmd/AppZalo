//xu ly tu choi ket ban
function removeFriend(id) {
    $.ajax({
        url: '/contact/remove',
        type: 'delete',
        data: {
            uid: id
        },
        success: function (data) {
            if (data.success) {
                $('#contact-list').find(`li[data-uid = ${id}]`).remove();
                sumOfContactDes();
                socket.emit('remove-friend', {
                    receiverId: id,
                });
            }
        },
    });
}

socket.on('response-remove-friend', function (user) {
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

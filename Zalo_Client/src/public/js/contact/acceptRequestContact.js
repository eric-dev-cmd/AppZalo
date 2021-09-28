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
                    showBtnAddAndRemove(senderId);
                    $.get(http + `/users/${senderId}`, function (data, status) {
                        if (status === 'success') {
                            sumOfContactInc();
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

socket.on('response-accept-contact', function (user) {
    sumOfContactInc();
    $('#contact-list').prepend(contact(user));
    showBtnAddAndRemove(user.id);
});

function sumOfContactInc() {
    let sum = $('#sumOfContact').attr('data-sum');
    sum++;
    $('#sumOfContact').attr('data-sum', sum);
    $('#sumOfContact').html('');
    $('<span>Bạn bè(' + sum + ')</span>').appendTo($('#sumOfContact'));
}

function contact(user) {
    let contact = `<li data-uid = '${user._id}'
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
                    <a 
                        class="dropdown-item d-flex align-items-center justify-content-between"
                        data-bs-toggle="modal"
                        data-bs-target="#modal_${user._id}"><span>Profile</span>
                        <i
                            class="fal fa-user-circle float-end text-muted"></i>
                    </a>
                </div>
                <a class="dropdown-item"
                    href="javascript:void(0)">Block
                    <i
                        class="fal fa-ban float-end text-muted"></i></a>
                <a class="dropdown-item" onclick="removeFriend('${user._id}')">Remove
                    <i
                        class="fal fa-trash-alt float-end text-muted"></i></a>
            </div>

        </div>
    </div>
</li>`;
    return contact;
}

$(document).ready(function () {
    acceptRequestContact();
});
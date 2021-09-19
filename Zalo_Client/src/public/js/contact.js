
const http = `http://localhost:4000`;


(function ($) {
    $(document).ready(function () {
        $('#show-modal').on('click', function () {
            $('#btn-add-cancel-friend').find('#btn-cancel-friend').hide()
        });
    });
})(jQuery);

(function ($) {
    $(document).ready(function () {
        $("#searchPhone").on("keyup", function () {    //khi nhap vao o tim kiem	
            search(this.value);
            $('#btn-add-cancel-friend').find('#btn-add-friend').hide()
        });
    });
})(jQuery);

//tim kiem theo url
function search(phone) {
    const phoneCurrent = document.getElementById('phone').placeholder;
    if (phoneCurrent !== phone) {
        const url = http + `/users/searchPhone/${phone}`;
        (function ($) {
            $.get(url, function (user, status) {
                if (status === 'success') {
                    render(user);
                }
            })
        })(jQuery);
    }
}

//render du lieu 
function render(user) {
    (function ($) {
        $('#name-search').html('');
        $('#phone-search').html('');
        $('#image-search').html('');

        $.each(user, (i, user) => {
            const { local, userName, avatar, _id } = user;
            $('<strong>' + userName + '</strong>').appendTo($('#name-search')),
                $('<strong>' + local.phone + '</strong>').appendTo($('#phone-search')),
                $('<img src="images/' + avatar + '">').appendTo($('#image-search')),

                $.get(http + `/contacts/searchContactId/${_id}`, function (data) {
                    console.log(data);
                    if (data.contacts !== null) {
                        $('#btn-add-cancel-friend').find('#btn-cancel-friend').css('display', 'inline-block')
                    } else {
                        $('#btn-add-cancel-friend').find('#btn-add-friend').css('display', 'inline-block')
                    }
                })


            //xu ly yeu cau ket ban
            $('#btn-add-friend').on('click', function () {
                $.post('/contact/add-new', { uid: _id }, function (data) {
                    if (data.success) {
                        $('#btn-add-cancel-friend').find('#btn-add-friend').hide();
                        $('#btn-add-cancel-friend').find('#btn-cancel-friend').css('display', 'inline-block');
                        socket.emit('add-new-contact', { contactId: _id });
                    }
                })
            });
            //xu ly huy yeu cau ket ban
            $('#btn-cancel-friend').on('click', function () {
                $.ajax({
                    url: '/contact/remove',
                    type: 'delete',
                    data: { uid: _id },
                    success: function (data) {
                        if (data.success) {
                            $('#btn-add-cancel-friend').find('#btn-cancel-friend').hide(),
                                $('#btn-add-cancel-friend').find('#btn-add-friend').css('display', 'inline-block')
                            socket.emit('remove-request-contact', { contactId: _id });
                        }
                    }
                })
            });
        });
    })(jQuery);
}

//lắng nghe socket response-add-new-contact từ server
socket.on('response-add-new-contact', function (user) {
    let notification = `<li class="position-relative" data-uid = '${user.id}'>
    <a href="javascript:void(0)" style="width: 90%;">
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
            <a href="javascript:void(0)"
                class="text-decoration-none cursor-point" style="    position: static;
padding: 0;
display: inline-block;">Bỏ qua</a>
        </div>
        <div class="fs-13">
            <a href="javascript:void(0)"
                class="text-decoration-none cursor-point" style="    position: static;
padding: 0;
display: inline-block;">Đồng ý</a>
        </div>
    </div>
</li>`;
    $('#notification-contact').prepend(notification);
})

//lắng nghe socket response-remove-request-contact từ server
socket.on('response-remove-request-contact', function (user) {
    $('#notification-contact').find(`li[data-uid = ${user.id}]`).remove();
})
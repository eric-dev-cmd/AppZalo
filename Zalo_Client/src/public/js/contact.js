const http = `http://localhost:4000`;

$(document).ready(function () {
    $("#searchPhone").on("keyup", function () { //khi nhap vao o tim kiem	
        search(this.value);
        $('#btn-add-cancel-friend').find('#btn-add-friend').hide()
    });
});


//tim kiem theo url
function search(phone) {
    const phoneCurrent = document.getElementById('phone').placeholder;
    if (phoneCurrent !== phone) {
        const url = http + `/users/searchPhone/${phone}`;
            $.get(url, function (data, status) {
                if (status === 'success') {
                    const {local, userName, avatar, _id} = data.user;
                    $('#name-search').html('');
                    $('#phone-search').html('');
                    $('#image-search').html('');
                    $('<strong>' + userName + '</strong>').appendTo($('#name-search')),
                    $('<strong>' + local.phone + '</strong>').appendTo($('#phone-search')),
                    $('<img src="images/' + avatar + '">').appendTo($('#image-search'))
                    btnAddRemoveContact(_id);
                }
            })
    }
}

//xu ly btn-add-remove-friend
function btnAddRemoveContact(contactId) {
    const userId = document.getElementById('id').value;
    $.get(http + `/contacts/search/${userId}/${contactId}`, function (data) {
        if (data.contact !== null) {
            $('#btn-add-cancel-friend').find('#btn-cancel-friend').css('display', 'inline-block');
            removeRequestContact(contactId);
        } else {
            $('#btn-add-cancel-friend').find('#btn-add-friend').css('display', 'inline-block');
            addNewContact(contactId);
        }
    })
}

 //xu ly yeu cau ket ban
 function addNewContact(contactId) {
    $('#btn-add-friend').on('click', function () {
        $.post('/contact/add-new', {
            uid: contactId
        }, function (data) {
            if (data.success) {
                $('#btn-add-cancel-friend').find('#btn-add-friend').hide();
                $('#btn-add-cancel-friend').find('#btn-cancel-friend').css('display', 'inline-block');
                removeRequestContact(contactId);
                socket.emit('add-new-contact', {
                    contactId: contactId
                });
            }
        })
    });
 }

 //xu ly huy yeu cau ket ban
function removeRequestContact(contactId) {
    $('#btn-cancel-friend').on('click', function () {
        $.ajax({
            url: '/contact/remove',
            type: 'delete',
            data: {
                uid: contactId
            },
            success: function (data) {
                if (data.success) {
                    $('#btn-add-cancel-friend').find('#btn-cancel-friend').hide(),
                        $('#btn-add-cancel-friend').find('#btn-add-friend').css('display', 'inline-block')
                    socket.emit('remove-request-contact', {
                        contactId: contactId
                    });
                }
            }
        })
    });
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
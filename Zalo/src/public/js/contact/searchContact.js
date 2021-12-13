$('#search-contact').off('keyup').on('keyup', async function () {
    let content = $('#search-contact').val();
    $('#contact-list').html('');
    contactsJson.forEach(user => {
        if (user.userName.toLowerCase().includes(content) == true) {
            $('#contact-list').append(userItem(user));
        }
    });
});

function userItem(user) {
    return `<li id="contact-list-item" class="contact-list-item-cl"
    data-uid='${user._id}'
    onclick="showConversationUser('${user._id}')">
    <div class="d-flex align-items-center">
        <div class="flex-1 d-flex align-items-center contact-item">
            <img src="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${user.avatar}"
                class="rounded-circle avatar-xs me-3"
                alt="${user.userName}">
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
                    <a onclick="showDetailsProfile('${user._id}')"
                        class="dropdown-item d-flex align-items-center justify-content-between"
                        data-bs-toggle="modal"
                        data-bs-target="#modal-show-profile"><span>Hồ
                            sơ</span>
                        <i
                            class="fal fa-user-circle float-end text-muted"></i>
                    </a>
                </div>
                <a class="dropdown-item"
                    href="javascript:void(0)">Chặn
                    <i
                        class="fal fa-ban float-end text-muted"></i></a>
                <a class="dropdown-item"
                    onclick="deleteFriend('${user._id}')">Xoá
                    <i
                        class="fal fa-trash-alt float-end text-muted"></i></a>
            </div>

        </div>
    </div>
</li>`
}
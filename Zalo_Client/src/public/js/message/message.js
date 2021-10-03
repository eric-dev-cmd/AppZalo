//hiển thị tin nhắn nhóm
async function showConversationGroup(id) {
    let group = await $.get(http + `/chatGroups/${id}`);
    let currentUserId = document.getElementById('id').value;
    let sender = await $.get(http + `/users/${currentUserId}`);
    // lấy tin nhắn theo id nhóm
    let messages = await $.get(http + `/messages/SearchByReceiverId/${id}`);
    // lấy thành viên trong nhóm
    let receivers = await getMembers(group);
    //hiển thị tên nhóm
    $('#name-conversation').html(`${group.name}`);
    //phía gửi: gán giá trị data-id = id hiện tại
    $('#right-conversation').attr('data-id', `${currentUserId}`);
    //phía gửi: lấy id đã gán
    let rightId = $('#right-conversation').attr('data-id');
    $('#right-conversation').html('');
    $('#left-conversation').html('');
    //chạy vòng lặp các thành viên trong nhóm
    receivers.forEach((receiver) => {
        // nếu id của thành viên trong nhóm !== với id hiện tại => thành viên nhận tin nhắn
        if (receiver.user._id !== currentUserId) {
            //tạo 1 tin nhắn có text rỗng
            $('#left-conversation').append(leftConversation(receiver, {
                text: ''
            }));
            //gán giá trị data-id cho tin nhắn vừa tạo
            $(`#left-content-${receiver.user._id}`).attr('data-id', `${receiver.user._id}`);
            //làm rỗng tin nhắn đã tạo
            $(`#left-content-${receiver.user._id}`).html('');
            //chạy vòng lặp
            messages.forEach(message => {
                //nếu tin nhắn gửi người gửi = data-id của người nhận
                if (message.senderId === $(`#left-content-${receiver.user._id}`).attr('data-id')) {
                    //thêm tin nhắn vào phía nhận
                    $('#left-conversation').append(leftConversation(receiver, message));
                }
            });
        }
    });

    messages.forEach(message => {
        if (message.senderId === rightId) {
            $('#right-conversation').append(rightConversation(sender, message));
        }
    });
}

// lấy thành viên trong chat-groups
async function getMembers(group) {
    let receivers = group.members.map(async (member) => {
        let receiver = await $.get(http + `/users/${member.userId}`);
        return receiver;
    });
    return await Promise.all(receivers);
}

//hiển thị tin nhắn cá nhân
async function showConversationUser(id) {
    let currentUserId = document.getElementById('id').value;
    let receiver = await $.get(http + `/users/${id}`);
    let sender = await $.get(http + `/users/${currentUserId}`);
    let messages = await $.get(http + `/messages/SearchBySenderIdAndReceiverId/${currentUserId}/${id}`);
    $('#name-conversation').html(`${receiver.user.userName}`);
    $('#right-conversation').attr('data-id', `${currentUserId}`);
    $('#left-conversation').attr('data-id', `${id}`);
    let rightId = $('#right-conversation').attr('data-id');
    let leftId = $('#left-conversation').attr('data-id');
    $('#right-conversation').html('');
    $('#left-conversation').html('');
    messages.forEach(message => {
        if (message.senderId === rightId) {
            $('#right-conversation').append(rightConversation(sender, message));
        }
        if (message.senderId === leftId) {
            $('#left-conversation').append(leftConversation(receiver, message));
        }
    });
}

//tạo tin nhắn gửi đi
function rightConversation(user, message) {
    return `<li class="right" id="right-content" data-id="${user.user._id}">
    <div class="conversation-list">
        <div class="chat-avatar">
            <img src="images/${user.user.avatar}" alt="">
        </div>

        <div class="user-chat-content">
            <div class="ctext-wrap">
                <div class="ctext-wrap-content">
                    <p class="mb-0" id="content-conversation">
                        ${message.text}
                    </p>
                    <p class="chat-time mb-0"><i
                            class="fal fa-clock align-middle"></i> <span
                            class="align-middle">10:02</span></p>
                </div>

                <div class="dropdown align-self-start">
                    <a class="dropdown-toggle" href="javascript:void(0)"
                        role="button" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <i class="fal fa-ellipsis-v"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item"
                            href="javascript:void(0)">Sao chép
                            <i
                                class="fal fa-copy float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Lưu
                            <i
                                class="fal fa-save float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Chuyển tiếp
                            <i
                                class="fal fa-share float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Xoá
                            <i
                                class="fal fa-trash-alt float-end text-muted"></i></a>
                    </div>
                </div>
            </div>

            <div class="conversation-name">${user.user.userName}</div>
        </div>
    </div>
</li>`;
}

//tạo tin nhắn nhận
function leftConversation(user, message) {
    return `<li id="left-content-${user.user._id}" data-id="${user.user._id}">
    <div class="conversation-list">
        <div class="chat-avatar">
            <img src="images/${user.user.avatar}"
                alt="">
        </div>

        <div class="user-chat-content">
            <div class="ctext-wrap">
                <div class="ctext-wrap-content">
                    <p class="mb-0" id="content-conversation">
                    ${message.text}
                    </p>
                    <p class="chat-time mb-0"><i
                            class="fal fa-clock align-middle"></i> <span
                            class="align-middle">10:00</span></p>
                </div>
                <div class="dropdown align-self-start">
                    <a class="dropdown-toggle" href="javascript:void(0)"
                        role="button" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <i class="fal fa-ellipsis-v"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item"
                            href="javascript:void(0)">Sao chép
                            <i
                                class="fal fa-copy float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Lưu
                            <i
                                class="fal fa-save float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Chuyển tiếp
                            <i
                                class="fal fa-share float-end text-muted"></i></a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Xoá
                            <i
                                class="fal fa-trash-alt float-end text-muted"></i></a>
                    </div>
                </div>
            </div>
            <div class="conversation-name">${user.user.userName}</div>
        </div>
    </div>
</li>`;
}
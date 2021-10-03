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
        } else {
            $('#left-conversation').append(leftConversation(receiver, message));
        }
    });
}

async function showConversationGroup(id) {
    let group = await $.get(http + `/chatGroups/${id}`);
    let currentUserId = document.getElementById('id').value;
    let sender = await $.get(http + `/users/${currentUserId}`);
    let messages = await $.get(http + `/messages/SearchBySenderIdAndReceiverId/${currentUserId}/${id}`);
    let receivers = await getMembersId(group);
    $('#name-conversation').html(`${group.name}`);
    $('#right-conversation').attr('data-id', `${currentUserId}`);
    $('#left-conversation').attr('data-id', `${id}`);
    let rightId = $('#right-conversation').attr('data-id');
    let leftId = $('#left-conversation').attr('data-id');
    $('#right-conversation').html('');
    $('#left-conversation').html('');
    receivers.forEach((user)=>{
        return user.user._id;
    })
    messages.forEach(message => {
        if (message.senderId === rightId) {
            $('#right-conversation').append(rightConversation(sender, message));          
        } else {
            $('#left-conversation').append(leftConversation(receiver, message));
        }
    });


}

 async function getMembersId(group) {
    let receivers = group.members.map(async (member) => {
        let receiver = await $.get(http + `/users/${member.userId}`);
        return receiver;
    });
    return await Promise.all(receivers);
}


function rightConversation(user, message) {
    return `<li class="right" id="right-conversation" data-id="">
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

function leftConversation(user, message) {
    return `<li id="left-conversation" data-id="">
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
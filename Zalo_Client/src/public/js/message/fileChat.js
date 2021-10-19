//upload file
function fileChat(id, isChatGroup) {
    $('#send-file').off('click').on('click', function () {
        let formData = new FormData();
        let myFiles = document.getElementById(`fileChat-${id}`);
        for (var i = 0; i < myFiles.files.length; i++) {
            formData.append('files', myFiles.files[i]);
        }
        //thêm dữu liệu vào formData
        formData.append('receiverId', id);
        formData.append('isChatGroup', isChatGroup);
        $.ajax({
            url: '/message/uploadFiles',
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                // { data : 
                //     messages: 
                //     {
                //         { newFiles: [] },
                //         { newMessages: [] }
                //     }, 
                //     isChatGroup: '' 
                // }
                $(`#fileChat-${id}`).val('')
                let messages = data.messages.newMessages;
                let isChatGroup = data.isChatGroup;
                if (messages.length > 1) {
                    addNewFileChat(messages, isChatGroup);
                } else {
                    let message = [messages];
                    addNewFileChat(message, isChatGroup);
                }
            },
        });
    });
}

//phía gửi:tạo mới file
async function addNewFileChat(messages, isChatGroup) {
    let currentUserId = document.getElementById('id').value;
    let sender = await $.get(http + `/users/${currentUserId}`);
    await messages.map((message) => {
        //nếu là ảnh
        if (message.messageType === 'image') {
            //phía gửi: thêm tin nhắn vừa gửi
            $(`#conversation-${message.receiverId}`).append(rightConversationImage(sender, message));
            scrollMessageUserEnd();
        }
        if (message.messageType === 'file') {
            //phía gửi: thêm tin nhắn vừa gửi
            $(`#conversation-${message.receiverId}`).append(rightConversationFile(sender, message));
            scrollMessageUserEnd();
        }
    });
    if (messages[0].chatType === 'personal') {
        //tạo mới cuộc trò truyện trong danh sách trò truyện
        addConversation(messages[0].receiverId, isChatGroup)
            .then(function (result) {
                $('#conversation-list').prepend(result);
            });

        // lấy data-updated từ danh sách cuộc trò truyện
        let receiverUpdated = $(`#receiver-${messages[0].receiverId}`).attr('data-updated');
        //tìm kiếm cuộc trò cũ và xóa
        $('#conversation-list').find(`li[data-updated = ${receiverUpdated}]`).remove();
    }
    //gửi socket từ client đến server
    socket.emit('add-new-file', {
        messages: messages,
        isChatGroup: isChatGroup,
    });
}

//lắng nghe socket từ server đến client
socket.on('response-add-new-file', async function (data) {
    let messages = data.messages;
    let isChatGroup = data.isChatGroup;
    // lấy id người dùng hiện tại
    let currentUserId = document.getElementById('id').value;
    //lấy người nhận
    let receiver = await $.get(http + `/users/${messages[0].senderId}`);

    // nếu cuộc trò chuyện nhóm
    if (isChatGroup == true || isChatGroup == 'true') {
        messages.map((message) => {
            if (message.senderId !== currentUserId) {
                if (message.messageType === 'file') {
                    //thêm tin nhắn vừa gửi cho nhóm nhận nếu là file
                    $(`#conversation-${message.receiverId}`).append(leftConversationFile(receiver, message));
                    scrollMessageUserEnd();
                }
                if (message.messageType === 'image') {
                    //thêm tin nhắn vừa gửi cho nhóm nhận nếu là ảnh
                    $(`#conversation-${message.receiverId}`).append(leftConversationImage(receiver, message));
                    scrollMessageUserEnd();
                }
            }
        });
        //tạo mới cuộc trò truyện trong danh sách trò truyện
        addConversation(messages[0].receiverId, isChatGroup)
            .then(function (result) {
                $('#conversation-list').prepend(result);
            });
        // lấy data-updated từ danh sách cuộc trò truyện
        let receiverUpdated = $(`#receiver-${messages[0].receiverId}`).attr('data-updated');
        //tìm kiếm cuộc trò cũ và xóa
        $('#conversation-list').find(`li[data-updated = ${receiverUpdated}]`).remove();
    }
    //nếu cuộc trò chuyện cá nhân
    if (isChatGroup == false || isChatGroup == 'false') {
        messages.map((message) => {
            if (message.senderId !== currentUserId) {
                if (message.messageType === 'file') {
                    //thêm tin nhắn vừa gửi cho nhóm nhận nếu là file
                    $(`#conversation-${message.senderId}`).append(leftConversationFile(receiver, message));
                    scrollMessageUserEnd();
                }
                if (message.messageType === 'image') {
                    //thêm tin nhắn vừa gửi cho nhóm nhận nếu là ảnh
                    $(`#conversation-${message.senderId}`).append(leftConversationImage(receiver, message));
                    scrollMessageUserEnd();
                }
            }
        });
        //tạo mới cuộc trò truyện trong danh sách trò truyện
        addConversation(messages[0].senderId, isChatGroup)
            .then(function (result) {
                $('#conversation-list').prepend(result);
            });
        // lấy data-updated từ danh sách cuộc trò truyện
        let receiverUpdated = $(`#receiver-${messages[0].senderId}`).attr('data-updated');
        //tìm kiếm cuộc trò cũ và xóa
        $('#conversation-list').find(`li[data-updated = ${receiverUpdated}]`).remove();
    }
});
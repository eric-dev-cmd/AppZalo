//từ html
async function deleteText(id) {
    let message = await $.get(http + `/messages/${id}`);
    $.ajax({
        url: '/message/deleteText',
        type: 'delete',
        data: {
            messageId: id
        },
        success: function (data) {
            if (data.success) {
                //xóa tin nhắn của người gửi theo cuộc trò truyện
                $(`#conversation-${message.receiverId}`).find(`li[data-messageId = ${message._id}]`).remove();
                //cập nhật lại tin nhắn cuối cùng trong cuộc trò truyện
                if (message.chatType === 'group') {
                    $.get(http + `/messages/SearchByReceiverId/${message.receiverId}`)
                        .then(function (messages) {
                            $(`#receiver-${message.receiverId}`).find('#last-message-conversation').text(getLastEndMessageInConversation(messages));
                        });
                } else {
                    $.get(http + `/messages/SearchBySenderIdAndReceiverId/${message.senderId}/${message.receiverId}`)
                        .then(function (messages) {
                            $(`#receiver-${message.receiverId}`).find('#last-message-conversation').text(getLastEndMessageInConversation(messages));
                        });
                }

                socket.emit('delete-text-emoji', {
                    message: message,
                });
            }
        },
    });
}

socket.on('response-delete-text-emoji', async function (data) {
    let message = data.message;
    let currentUserId = document.getElementById('id').value;
    if (message.chatType === 'group' && currentUserId !== message.senderId) {
        //xóa li của người gửi theo cuộc trò truyện
        $(`#conversation-${message.receiverId}`).find(`li[data-messageId = ${message._id}]`).remove();
        //cập nhật lại tin nhắn cuối cùng trong cuộc trò truyện
        let messages = await $.get(http + `/messages/SearchByReceiverId/${message.receiverId}`);
        $(`#receiver-${message.receiverId}`).find('#last-message-conversation').text(getLastEndMessageInConversation(messages));
    }
    if (message.chatType === 'personal') {
        $(`#conversation-${message.senderId}`).find(`li[data-messageId = ${message._id}]`).remove();
        let messages = await $.get(http + `/messages/SearchBySenderIdAndReceiverId/${message.senderId}/${message.receiverId}`)
        $(`#receiver-${message.senderId}`).find('#last-message-conversation').text(getLastEndMessageInConversation(messages));
    }
});
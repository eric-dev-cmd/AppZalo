function loadMessageForGroup(id) {
    $('.simplebar-content-height').scroll(async function () {
        if ($(this).scrollTop() === 0) {
            var limit = 10;
            startFrom = startFrom + limit;
            let getMessages = await $.get(http + `/messages/SearchByReceiverId/${id}?startFrom=${startFrom}`);
            let currentUserId = document.getElementById('id').value;
            let sender = await $.get(http + `/users/${currentUserId}`);
            let rightId = $('#right-conversation').attr('data-id');
            getMessages.forEach(async message => {
                let receiver = await $.get(http + `/users/${message.senderId}`);
                if (message.messageType === 'text') {
                    if (message.senderId === rightId) {
                        $(`#conversation-${id}`).prepend(rightConversationText(sender, message));
                    }
                    if (
                        message.senderId ===
                        $(`#left-conversation-${receiver.user._id}`).attr('data-id') &&
                        message.senderId !== currentUserId
                    ) {
                        $(`#conversation-${id}`).prepend(
                            leftConversationText(receiver, message)
                        );
                    }
                }
                if (message.messageType === 'image') {
                    if (message.senderId === rightId) {
                        $(`#conversation-${id}`).prepend(
                            rightConversationImage(sender, message)
                        );
                    }
                    if (
                        message.senderId ===
                        $(`#left-conversation-${receiver.user._id}`).attr('data-id') &&
                        message.senderId !== currentUserId
                    ) {
                        $(`#conversation-${id}`).prepend(
                            leftConversationImage(receiver, message)
                        );
                    }
                }
                if (message.messageType === 'file') {
                    if (message.senderId === rightId) {
                        $(`#conversation-${id}`).prepend(rightConversationFile(sender, message));
                    }
                    if (message.senderId === $(`#left-conversation-${receiver.user._id}`).attr('data-id') && message.senderId !== currentUserId) {
                        $(`#conversation-${id}`).prepend(
                            leftConversationFile(receiver, message)
                        );
                    }
                }
            });
        }
    })
}
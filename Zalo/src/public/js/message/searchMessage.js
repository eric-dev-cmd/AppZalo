function searchMessage(id, isChatGroup) {
    $('#search-message').off('keyup').on('keyup', async function () {
        let content = $('#search-message').val();
        if (isChatGroup == true) {
            let messages = await $.get(http + `/messages/SearchByReceiverId/${id}?startFrom=0`);
            searchMessageConversation(id, messages, content);
        } else {
            let currentUserId = document.getElementById('id').value;
            let messages = await $.get(http + `/messages/SearchBySenderIdAndReceiverId/${currentUserId}/${id}?startFrom=0`);
            searchMessageConversation(id, messages, content);
        }
    });
}

//tìm kiếm tin nhắn của các cuộc trò truyện
function searchMessageConversation(id, messages, content) {
    messages.forEach(message => {
        if (message.text) {
            var text = message.text;
            if (text.toLowerCase().includes(content) == true) {
                $(`#conversation-${id}`).find(`li[data-content='${text}']`)
                    .find('#chat-content').css('background-color', 'rgba(255,255,0,.4)');
            }
            if (text.toLowerCase().includes(content) == false) {
                $(`#conversation-${id}`).find(`li[data-content='${text}']`)
                    .find('#chat-content').attr('style', 'none')
            }
            if (content == '') {
                $(`#conversation-${id}`).find(`li[data-content='${text}']`)
                    .find('#chat-content').attr('style', 'none')
            }
        }
    });
}
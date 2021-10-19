function searchMessage(id) {
    $('#search-message').off('keyup').on('keyup', async function(){
        let message = $('#search-message').val();
        let messages = await $.get(http + `/messages/SearchByText/${message}`);
        $.each(messages, (i, message) => {
            $(`#conversation-${id}`).find(`li[data-content=${message.text}]`)
            .find('#chat-content').css('background-color','rgba(255,255,0,.4)');
            eventKeydown(id);
        })
    });
}

function eventKeydown(id) {
    $('#search-message').off('keydown').on('keydown', async function(){
        showConversationUser(id);
        showConversationGroup(id);
    });
}
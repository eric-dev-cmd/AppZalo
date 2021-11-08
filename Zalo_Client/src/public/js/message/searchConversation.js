$('#search-conversation').unbind('keyup').on('keyup', function (e) {
    let content = $('#search-conversation').val();
    let listConversation = searchNameConversation(content);
    //tìm kiếm cuộc trò truyện
    listConversation.true.forEach(name => {
        conversations.each(function () {
            let li = $(`li[data-name='${name}']`);
            $('#conversation-list').append(li);
        })
    });
    //xóa các cuộc trò truyện không tìm
    listConversation.false.forEach(name => {
        conversations.each(function () {
            $('#conversation-list').find(`li[data-name='${name}']`).remove();
        })
    });
})


//tìm kiếm tên của các cuộc trò truyện
function searchNameConversation(content) {
    let listConversation = {};
    let listNameConversation = [];
    let unListNameConversation = [];
    conversations.each(function () {
        let name = $(this).attr('data-name');
        //nếu chuỗi đc tìm
        if (name.toLowerCase().includes(content) == true) {
            listNameConversation.push(name);
            listConversation.true = listNameConversation;
        } else {
            unListNameConversation.push(name);
            listConversation.false = unListNameConversation;
        }
    });
    return listConversation;
}

//khi xóa nội dung tìm kiếm
$('#search-conversation').off('keydown').on('keydown', function (e) {
    if (e.which === 8) {
        socket.emit('get-conversations');
        socket.on('response-conversations', function (data) {
            $('#conversation-list').html('');
            let conversations = data;
            conversations.forEach(conversation => {
                if (conversation.members) {
                    addConversation(conversation._id, true)
                        .then(function (result) {
                            $('#conversation-list').append(result);
                        });
                } else {
                    addConversation(conversation._id, false)
                        .then(function (result) {
                            $('#conversation-list').append(result);
                        });
                }
            });
        });
    }
});
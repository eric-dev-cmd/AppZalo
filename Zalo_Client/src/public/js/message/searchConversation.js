$('#search-conversation').off('keyup').on('keyup', function (element) {
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
    eventKeydown();
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
function eventKeydown() {
    $('#search-conversation').off('keydown').on('keydown', function () {
        $('#conversation-list').prepend(conversations);
    });
}
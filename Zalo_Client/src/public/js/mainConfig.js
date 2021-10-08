const socket = io();

// cập nhật thời gian tin nhắn đã gửi của ds cuộc trò truyện
socket.on('response-update-time', function (data) {
    let allConversation = data;
    allConversation.map((conversation) => {
        //lấy id của các cuộc trò truyện
        let conversationId = $(`#updated-time-${conversation._id}`).attr('data-uid');
        if (conversationId === conversation._id) {
            $(`#updated-time-${conversation._id}`).html(`${conversation.time}`);
        }
    })
})

function getAllConversation() {
    $('#conversation-list').each(function () {
        var li = $(this).find('li')
        let firstLiId = li.first().attr('id');
        $(`#${firstLiId}`).click();
    })
}

$(document).ready(function () {
    searchPhone();
    getAllConversation()
});
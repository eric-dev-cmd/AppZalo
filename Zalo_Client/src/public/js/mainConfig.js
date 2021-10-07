const socket = io();

// cập nhật thời gian tin nhắn đã gửi của ds cuộc trò truyện
socket.on('response-update-time', function (data) {
    let allConversation = data;
    allConversation.map((conversation) => {
        //lấy id của các cuộc trò truyện
        let conversationId = $(`#updated-time-${conversation._id}`).attr('data-uid');
        if(conversationId === conversation._id){
            $(`#updated-time-${conversation._id}`).html(`${conversation.time}`);
            console.log(conversation.time);
        }
    })
})


$(document).ready(function () {
    searchPhone();

});
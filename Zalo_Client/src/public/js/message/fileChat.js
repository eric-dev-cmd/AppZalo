//upload file
function fileChat(id, isChatGroup) {
    $('#send-file').unbind('click').on('click', function () {
        let formData = new FormData();
        let myFiles = document.getElementById(`fileChat-${id}`);
        for (var i = 0; i < myFiles.files.length; i++) {
            formData.append('files', myFiles.files[i]);
         }
        $.ajax({
            url: '/message/uploadFiles',
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function(data){
                addNewFileChat(data)
            },
        });
    });
}

//phía gửi:tạo mới file
function addNewFileChat(files) {
    let currentUserId = document.getElementById('id').value;
    //phía gửi: thêm file vừa gửi
    $(`#conversation-${message.receiverId}`).append(rightConversationText(sender, message));

}
function textAndEmojiChat() {
    $('.emojionearea').unbind('keyup').on('keyup', function (element) {
        if(element.which === 13){
            let messageVal = $('#write-chat').val();
            console.log(messageVal);
        }
    })
}
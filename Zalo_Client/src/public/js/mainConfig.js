const socket = io();

function enableEmojioneArea() {
    $("#write-chat").emojioneArea({
        events: {
            keyup: function (editor, event) {
                $('#write-chat').val(this.getText());
            },
            click: function () {
                textAndEmojiChat();
            }
        }
    })
}

$(document).ready(function () {
    searchPhone();
    enableEmojioneArea();
});




const socket = io();

$(document).ready(function () {
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
});

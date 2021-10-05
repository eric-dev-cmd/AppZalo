function enableEmojioneArea(id, isChatGroup) {
    $(`#write-chat-${id}`).emojioneArea({
        standalone: false,
        placeholder: "Nhập tin nhắn",
        search: false,
        pickerPosition: "top",
        filtersPosition: "bottom",
        events: {
            keyup: function (editor, event) {
                $(`#write-chat-${id}`).val(this.getText());
            },
            click: function () {
                textAndEmojiChat(id, isChatGroup);
            }
        }
    })
}

function textAndEmojiChat(id ,isChatGroup) {
    $('.emojionearea').unbind('keyup').on('keyup', function (element) {
        if(element.which === 13){
            let messageVal = $(`#write-chat-${id}`).val();
            let dataTextAndEmoji = {
                uid: id,
                messageVal: messageVal,
                isChatGroup: isChatGroup
            };
            $.post('/message/addNewTextAndEmoji', dataTextAndEmoji, function (data) {
                console.log(data)
            }).fail(function (res) {
                console.log(res)
            });
        }
    });
}


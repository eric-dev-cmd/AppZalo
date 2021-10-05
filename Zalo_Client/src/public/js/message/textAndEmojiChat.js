function enableEmojioneArea(id, isChatGroup) {
    $(`#write-chat-${id}`).emojioneArea({
        standalone: false,
        placeholder: "Nhập tin nhắn",
        search: false,
        pickerPosition: "top",
        filtersPosition: "bottom",
        inline: true,
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

function textAndEmojiChat(id, isChatGroup) {
    $('.emojionearea').unbind('keyup').on('keyup', function (element) {
        if (element.which === 13) {
            let messageVal = $(`#write-chat-${id}`).val();
            let dataTextAndEmoji = {
                uid: id,
                messageVal: messageVal,
                isChatGroup: isChatGroup
            };
            addNewTextAndEmoji(dataTextAndEmoji, isChatGroup);
        }
    });
}

//tạo mới tin nhắn
function addNewTextAndEmoji(dataTextAndEmoji, isChatGroup) {
    $.post('/message/addNewTextAndEmoji', dataTextAndEmoji, function (data) {
        let message = data;
        //lấy người gửi
        $.get(http + `/users/${message.senderId}`, function (data) {
            let sender = data;
            //phía gửi: thêm tin nhắn vừa gửi
            $('#conversation').append(rightConversationText(sender, message));
            //thẻ input = rỗng 
            $(`#write-chat-${message.receiverId}`).val('');
            $('.emojionearea-editor').text('');
            //tạo mới cuộc trò truyện cá nhân
            addConversation(message.receiverId, isChatGroup)
                .then(function (result) {
                    $('#conversation-list').prepend(result);
                });
            // lấy data-updated từ danh sách cuộc trò truyện
            let receiverUpdated = $(`#receiver-${message.receiverId}`).attr('data-updated');
            //tìm kiếm cuộc trò cũ và xóa
            $('#conversation-list').find(`li[data-updated = ${receiverUpdated}]`).remove();
        });
    }).fail(function (res) {
        console.log(res)
    });
}

//tạo cuộc trò truyện mới
async function addConversation(receiverId, isChatGroup) {
    if (isChatGroup === false) {
        let receiver = await $.get(http + `/users/${receiverId}`);
        return `<li onclick="showConversationUser('${receiver.user._id}')" id="receiver-${receiver.user._id}" data-updated="${receiver.user.updatedAt}">
        <a>
            <div class="d-flex">
                <div
                    class="chat-user-img online align-self-center me-3 ms-0">
                    <img src="/images/${receiver.user.avatar}"
                        class="rounded-circle avatar-xs" alt="">
                    <span class="user-status"></span>
                </div>
    
                <div class="flex-1 overflow-hidden">
                    <h5 class="text-truncate font-size-15 mb-1">
                        ${receiver.user.userName}</h5>
                    <p class="chat-user-message text-truncate mb-0">
                        Hey! there I'm available</p>
                </div>
                <div class="font-size-11">05 min</div>
            </div>
        </a>
    </li>`;
    } else {
        let groupReceiver = await $.get(http + `/chatGroups/${receiverId}`);
        return `<li onclick="showConversationUser('${groupReceiver._id}')" id="receiver-${groupReceiver._id}" data-updated="${groupReceiver.updatedAt}">
        <a>
            <div class="d-flex">
                <div
                    class="chat-user-img online align-self-center me-3 ms-0">
                    <img src="/images/${groupReceiver.avatar}"
                        class="rounded-circle avatar-xs" alt="">
                    <span class="user-status"></span>
                </div>
    
                <div class="flex-1 overflow-hidden">
                    <h5 class="text-truncate font-size-15 mb-1">
                        ${groupReceiver.name}</h5>
                    <p class="chat-user-message text-truncate mb-0">
                        Hey! there I'm available</p>
                </div>
                <div class="font-size-11">05 min</div>
            </div>
        </a>
    </li>`;
    }
}
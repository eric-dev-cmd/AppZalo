$('#choose-user').click();
$('#btn-create-group').unbind('click').on('click', function () {
    var formData = new FormData(document.getElementById('create-group'))
    $.ajax({
        url: '/group/createGroup',
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            let group = data.group;
            $('#addgroup-exampleModal').modal('hide');
            socket.emit('create-group', {
                group: group
            });
        },
    });
});

socket.on('response-create-group', function (data) {
    let group = data.group;
    let isChatGroup = true;
    addConversationGroup(group._id, isChatGroup)
        .then(function (result) {
            $('#conversation-list').prepend(result);
            getAllConversation();
        });

});

//tạo cuộc trò truyện mới
async function addConversationGroup(receiverId, isChatGroup) {
    if (isChatGroup === true || isChatGroup === 'true') {
        let groupReceiver = await $.get(http + `/chatGroups/${receiverId}`);
        // lấy tin nhắn theo id nhóm
        let messages = await $.get(http + `/messages/SearchByReceiverId/${groupReceiver._id}`);
        return `<li onclick="showConversationGroup('${
        groupReceiver._id
      }')" id="receiver-${groupReceiver._id}" data-updated="${
        groupReceiver.updatedAt
      }" data-name="${groupReceiver.name}">
          <a>
              <div class="d-flex">
                  <div
                      class="chat-user-img online align-self-center me-3 ms-0">
                      <img src="/images/avatar-group.png"
                          class="rounded-circle avatar-xs" alt="">
                      <span class=""></span>
                  </div>
      
                  <div class="flex-1 overflow-hidden">
                      <h5 class="text-truncate font-size-15 mb-1">
                          ${groupReceiver.name}</h5>
                      <p class="chat-user-message text-truncate mb-0" id="last-message-conversation">
                          </p>
                  </div>
                  <div class="font-size-11" id="updated-time-${groupReceiver._id}" data-uid="${groupReceiver._id}"></div>
              </div>
          </a>
      </li>`;
    }
}

$('#seach-user-add-group').off('keyup').on('keyup', async function (e) {
    if (e.which == 13) {
        let content = $('#seach-user-add-group').val();
        const phoneCurrent = $('#phone').attr('placeholder');
        if (phoneCurrent !== content) {
            try {
                let user = await $.get(http + `/users/searchPhone/${content}`);
                $('#list-contact-add-group').find(`li[id=${user.user._id}]`).remove();
                $('#list-contact-add-group').prepend(getUser(user));
            } catch (error) {
                console.log(error)
            }
            try {
                let listConversation = searchNameConversation(content);
                listConversation.true.forEach(async name => {
                    let user = await $.get(http + `/users/searchUserName/${name}`);
                    conversations.each(function () {
                        $('#list-contact-add-group').find(`li[id=${user.user._id}]`).remove();
                        $('#list-contact-add-group').prepend(getUser(user));
                    })
                });
            } catch (error) {
                console.log(error)
            }
        }
    }
});

function getUser(user) {
    return `
    <li id="${user.user._id}">
        <div
            class="form-check">
            <input
                type="checkbox"
                class="form-check-input"
                id="${user.user._id}" value="${user.user._id}" name="idUser">
                <img src="/images/${user.user.avatar}" class="rounded-circle avatar-xs" alt="">
            <label
                class="form-check-label"
                for="${user.user._id}">${user.user.userName}</label>
        </div>
    </li>`
}
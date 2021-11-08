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
            let isChatGroup = true;
            $('#addgroup-exampleModal').modal('hide');
            $('.chat-user-list-item.active').removeClass('active');
            $('#conversation-list').find(`li[id=receiver-${group._id}]`).remove();
            addConversation(group._id, isChatGroup)
            .then(function (result) {
                $('#conversation-list').prepend(result);
                getAllConversation();
            });
            socket.emit('create-group', {
                group: group
            });
        },
    });
});

socket.on('response-create-group', function (data) {
    let group = data.group;
    let isChatGroup = true;
    addConversation(group._id, isChatGroup)
        .then(function (result) {
            $('#conversation-list').prepend(result);
        });
    
});

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
                <br>
            <label  class="form-check-label font-size-12" 
                id="joined-group" for="${user.user._id}" >Đã tham gia</label>
        </div>
    </li>`
}


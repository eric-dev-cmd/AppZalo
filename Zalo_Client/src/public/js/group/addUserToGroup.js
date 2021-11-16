$('#btn-add-user-to-group').unbind('click').on('click', async function () {
    let groupId = $('#icon-add-user-to-group').attr('data-gid');
    var formData = new FormData(document.getElementById('add-user-to-group'));
    formData.append('groupId', groupId);
    if (formData.get('idUser') !== null) {
        $.ajax({
            url: '/group/addUserToGroup',
            type: 'put',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                //sau khi thêm
                let group = data.group;
                let isChatGroup = true;
                $('#addUserToGroup-exampleModal').modal('hide');
                $('#conversation-list').find(`li[id=receiver-${group._id}]`).remove();
                $('.chat-user-list-item.active').removeClass('active');
                addConversation(group._id, isChatGroup)
                    .then(function (result) {
                        $('#conversation-list').prepend(result);
                        getAllConversation();
                    });
                messageAddUserToGroup(group, membersPre);
                socket.emit('add-user-to-group', {
                    group: group,
                    membersPre: membersPre
                });
            },
        });
    }
});

socket.on('response-add-user-to-group', function (data) {
    let group = data.group;
    let isChatGroup = true;
    addConversation(group._id, isChatGroup)
        .then(function (result) {
            $('#conversation-list').prepend(result);
        });
})

$('#search-user').off('keyup').on('keyup', async function (e) {
    let groupId = $('#icon-add-user-to-group').attr('data-gid');
    let content = $('#search-user').val();
    const phoneCurrent = $('#phone').attr('placeholder');
    if (phoneCurrent !== content) {
        try {
            let user = await $.get(http + `/users/searchPhone/${content}`);
            $('#list-user-add-to-group').find(`li[id=${user.user._id}]`).remove();
            $('#list-user-add-to-group').prepend(getUser(user));
        } catch (error) {
            console.log(error)
        }
        try {
            let listConversation = searchNameConversation(content);
            listConversation.true.forEach(async name => {
                let user = await $.get(http + `/users/searchUserName/${name}`);
                conversations.each(function () {
                    $('#list-user-add-to-group').find(`li[id=${user.user._id}]`).remove();
                    $('#list-user-add-to-group').prepend(getUser(user));
                })
            });
        } catch (error) {
            console.log(error)
        }
    }
    showUser(groupId);
});

async function showUser(groupId) {
    let group = await $.get(http + `/chatGroups/${groupId}`);
    $('[id=joined-group]').css('display', 'none');
    $('#list-user-add-to-group').find(':input').removeAttr('disabled');
    $('#list-user-add-to-group').find(':input').attr('checked', false);
    group.members.forEach(user => {
        $('#list-user-add-to-group').find(`li[id=${user.userId}]`).find('#joined-group').css('display', 'inline-block');
        $('#list-user-add-to-group').find(`li[id=${user.userId}]`).find(`#${user.userId}`).attr('disabled', 'disabled');
    });
}
$('#btn-add-user-to-group').unbind('click').on('click', function () {
    let groupId = $('#icon-add-user-to-group').attr('data-gid');
    var formData = new FormData(document.getElementById('add-user-to-group'));
    formData.append('groupId', groupId);
    $.ajax({
        url: '/group/addUserToGroup',
        type: 'put',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            $('#addUserToGroup-exampleModal').modal('hide');
            // let group = data.group;
            // $('#addgroup-exampleModal').modal('hide');
            // socket.emit('create-group', {
            //     group: group
            // });
        },
    });
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
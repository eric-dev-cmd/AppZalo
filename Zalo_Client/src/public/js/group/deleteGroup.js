async function showBtnDeleteOrLeaveGroup(id) {
    let currentUserId = document.getElementById('id').value;
    let group = await $.get(http + `/chatGroups/${id}`);
    if (group.userId === currentUserId) {
        $('#delete-group').show();
        $('#leave-group').hide();
        $('#delete-conversation').hide();
        $('#delete-group').off('click').on('click', function () {
            $.ajax({
                url: '/group/deleteGroup',
                type: 'delete',
                data: {
                    groupId: id
                },
                success: function (data) {
                    if (data.success) {
                        socket.emit('delete-group', {
                            groupId: id
                        });
                    }
                }
            });
        });
    } else {
        $('#leave-group').show();
        $('#delete-group').hide();
        $('#delete-conversation').hide();
        $('#leave-group').off('click').on('click', function () {
            $.ajax({
                url: '/group/deleteGroup',
                type: 'delete',
                data: {
                    groupId: id
                },
                success: function (data) {
                    if (data.success) {
                        $('#conversation-list').find(`li[id=receiver-${id}]`).remove();
                        getAllConversation();
                        socket.emit('leave-group', {
                            group: group
                        });
                    }
                }
            });
        });
    }
}

socket.on('response-delete-group', function (data) {
    let groupId = data.groupId;
    $('#conversation-list').find(`li[id=receiver-${groupId}]`).remove();
    getAllConversation();
    
})

socket.on('response-leave-group', function (data) {
    let groupId = data.groupId;
    let isChatGroup = true;
    $('#conversation-list').find(`li[id=receiver-${groupId}]`).remove();
    addConversation(groupId, isChatGroup)
        .then(function (result) {
            $('#conversation-list').prepend(result);
        });
});
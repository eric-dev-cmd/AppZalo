async function showBtnDeleteOrLeaveGroup(id) {
    let currentUserId = document.getElementById('id').value;
    let group = await $.get(http + `/chatGroups/${id}`);
    if (group.userId === currentUserId) {
        $('#leave-group').hide();
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
        $('#delete-group').hide();
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
                        socket.emit('leave-group', {
                            groupId: id
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
    getAllConversation();
})
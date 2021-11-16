function reaction() {
    var formData = new FormData(document.getElementById('create-group'));
    let currentUserId = document.getElementById('id').value;
    $.ajax({
        url: '/message/reaction',
        type: 'put',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            let group = data.group;
            let isChatGroup = true;
            socket.emit('create-group', {
                group: group
            });
        },
    });
}

function renderReaction(message) {
    if (message.reaction.length > 0) {
        message.reaction.forEach(reaction => {
            if(reaction.react == 'thich'){
                $(`#reaction-${message._id}`).append('👍');
            }
            if(reaction.react == 'yeu'){
                $(`#reaction-${message._id}`).append('😍');
            }
            if(reaction.react == 'cuoi'){
                $(`#reaction-${message._id}`).append('😂');
            }
            if(reaction.react == 'wow'){
                $(`#reaction-${message._id}`).append('😱');
            }
            if(reaction.react == 'khoc'){
                $(`#reaction-${message._id}`).append('😭');
            }
            if(reaction.react == 'gian'){
                $(`#reaction-${message._id}`).append('😡');
            }
        });
    }

}
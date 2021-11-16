

function reaction(id) {
    let currentUserId = document.getElementById('id').value;
    $(`#item-reaction-like-${id}`).off('click').on('click', function () {
        updateReaction(id, currentUserId, 'thich')
    });
    $(`#item-reaction-love-${id}`).off('click').on('click', function () {
        updateReaction(id, currentUserId, 'yeu')
    });
    $(`#item-reaction-smile-${id}`).off('click').on('click', function () {
        updateReaction(id, currentUserId, 'cuoi')
    });
    $(`#item-reaction-wow-${id}`).off('click').on('click', function () {
        updateReaction(id, currentUserId, 'wow')
    });
    $(`#item-reaction-cry-${id}`).off('click').on('click', function () {
        updateReaction(id, currentUserId, 'khoc')
    });
    $(`#item-reaction-angry-${id}`).off('click').on('click', function () {
        updateReaction(id, currentUserId, 'gian')
    });
}

function updateReaction(messageId, currentUserId, icon) {
    let data = {
        messageId: messageId,
        userId: currentUserId,
        icon: icon
    }
    $.ajax({
        url: '/message/updateReaction',
        type: 'put',
        data: data,
        success: function (data) {
            let message = data.message;
            
            console.log(message)
        },
    });
}




function renderReaction(message) {
    if (message.reaction.length > 0) {
        message.reaction.forEach(reaction => {
            if (reaction.react == 'thich') {
                $(`#reaction-${message._id}`).append('👍');
            }
            if (reaction.react == 'yeu') {
                $(`#reaction-${message._id}`).append('😍');
            }
            if (reaction.react == 'cuoi') {
                $(`#reaction-${message._id}`).append('😂');
            }
            if (reaction.react == 'wow') {
                $(`#reaction-${message._id}`).append('😱');
            }
            if (reaction.react == 'khoc') {
                $(`#reaction-${message._id}`).append('😭');
            }
            if (reaction.react == 'gian') {
                $(`#reaction-${message._id}`).append('😡');
            }
        });
    }

}
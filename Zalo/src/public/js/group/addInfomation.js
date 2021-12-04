function messageCreateGroup(group) {
    group.members.forEach(async member => {
        let user = await $.get(http + `/users/${member.userId}`);
        let text = `${user.user.userName} đã được thêm vào nhóm.`;
        let message = {
            uid: group._id,
            messageVal: text,
            messageType: 'info',
            isChatGroup: true,
        };
        // $.post('/message/addInfoMessage', message, function (data) {
        //     let message = data;
        // });
    })
}

function messageAddUserToGroup(group, membersPre) {
    console.log(membersPre);
    console.log(group.members);
}
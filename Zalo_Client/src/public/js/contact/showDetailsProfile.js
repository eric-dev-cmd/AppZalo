function showDetailsProfile(id) {
    $.get(http + `/users/${id}`, function(data, status) {
        const {local, userName, _id, avatar, gender, birthday} = data.user;
        if (status === 'success') {
			$("#modal-show-profile #avatar_profile").attr("src","/images/" + avatar);
			$("#modal-show-profile #userName_profile").html(`<div>${userName}</div>`);
			$("#modal-show-profile #phone_profile").html(`<div>${local.phone}</div>`);
			$("#modal-show-profile #gender_profile").html(`<div>${gender}</div>`);
			$("#modal-show-profile #birthday_profile").html(`<div>${birthday}</div>`);
			$("#modal-show-profile #remove-friend").attr('onclick', `deleteFriend('${_id}')`);
			
		}
    });
}


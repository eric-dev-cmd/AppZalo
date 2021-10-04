const http = `http://localhost:4000`;

function searchPhone() {
  $('#seachByPhone').on('click', function () {
    var phone = $('#searchPhone').val();
    search(phone);
    $('#btn-add-cancel-friend').find('#btn-add-friend').hide();
  });
}

//tim kiem theo url
function search(phone) {
  const phoneCurrent = $('#phone').attr('placeholder')
  if (phoneCurrent !== phone) {
    const url = http + `/users/searchPhone/${phone}`;
    $.get(url, function (data, status) {
      if (status === 'success') {
        const {
          local,
          userName,
          avatar,
          _id
        } = data.user;
        $('#name-search').html('');
        $('#phone-search').html('');
        $('#image-search').html('');
        $('<strong>' + userName + '</strong>').appendTo($('#name-search'));
        $('<strong>' + local.phone + '</strong>').appendTo($('#phone-search'));
        $('<img src="images/' + avatar + '">').appendTo($('#image-search'));
        $('#btn-add-friend').attr('data-uid', `${_id}`);
        $('#btn-cancel-friend').attr('data-uid', `${_id}`);
        showBtnAddAndRemove(_id);
      }
    });
  }
}

//xu ly btn-add-remove-friend
function showBtnAddAndRemove(receiverId) {
  const userId = document.getElementById('id').value;
  $.get(http + `/contacts/search/${userId}/${receiverId}`, function (data) {
    if (data.contact !== null && data.contact.status === true) {
      $('#btn-add-cancel-friend').find('#btn-cancel-friend').hide();
      $('#btn-add-cancel-friend').find('#btn-add-friend').hide();
    }
    if (data.contact !== null && data.contact.status === false) {
      $('#btn-add-cancel-friend').find('#btn-add-friend').hide();
      $('#btn-add-cancel-friend').find('#btn-cancel-friend').css('display', 'inline-block');
      removeRequestContact();
    }
    if (data.contact === null) {
      $('#btn-add-cancel-friend').find('#btn-cancel-friend').hide();
      $('#btn-add-cancel-friend').find('#btn-add-friend').css('display', 'inline-block');
      addNewContact();
    }
  });
}



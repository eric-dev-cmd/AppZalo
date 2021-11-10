$('#btn-send-message').on('click', function () {
  $('#modal-show-profile').modal('hide');
  hideContactToShowChat();

  let contactId = $('#btn-send-message').attr('data-contact-id');
  showConversationUser(contactId);
});
function hideContactToShowChat() {
  //   $('#pills-contacts-tab').removeClass('active');
  //   $('#pills-chat-tab').addClass('active');
  //   $('#pills-contacts').removeClass('active');
  //   $('#pills-chat').addClass('active');
  //   $('#pills-chat').addClass('show');
}

$('#btn-send-message').on('click', function () {
  $('#modal-show-profile').modal('hide');
  //   hideContactToShowChat();
  let contactId = $('#btn-send-message').attr('data-contact-id');
  showConversationUser(contactId);
});
$('.contact-list-item-cl').click(() => {
  console.log('Active class');
  showActiveMessageContact();
});
function showActiveMessageContact() {
  const getChatUserItemContact = document.querySelectorAll(
    '.contact-list-item-cl'
  );
  getChatUserItemContact.forEach((contact, index) => {
    // console.log(contact);
    contact.addEventListener('click', () => {
      $('.contact-list-item-cl.active').removeClass('active');
      contact.classList.add('active');
    });
  });
}
function hideContactToShowChat() {
  $('#pills-contacts-tab').removeClass('active');
  $('#pills-chat-tab').addClass('active');
  $('#pills-contacts').removeClass('active');
  $('#pills-chat').addClass('active');
  $('#pills-chat').addClass('show');
}

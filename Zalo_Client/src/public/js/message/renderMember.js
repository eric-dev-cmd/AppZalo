$('#info-conversation').on('click', function () {
  console.log('Render Member');
  $('.user-profile-sidebar').css('display', 'block');
  $('#info-conversation').css('font-size', '13px');
  $('#attachprofileMember').addClass('show');
});
$('#user-profile-hide').on('click', function () {
  $('#info-conversation').css('font-size', '16px');
});
$('.user-profile-show').on('click', function () {
  $('#info-conversation').css('font-size', '13px');
});

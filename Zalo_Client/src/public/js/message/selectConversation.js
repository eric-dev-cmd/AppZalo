console.log('Select Trung Vinh');
const allConversation = document.querySelector('#allConversation');
const personalConversation = document.querySelector('#personalConversation');
const groupConversation = document.querySelector('#groupConversation');

const allConversationIcon = document.querySelector('#allConversation .fal');
const personalConversationIcon = document.querySelector(
  '#personalConversation .fal'
);
const groupConversationIcon = document.querySelector('#groupConversation .fal');
const conversationParent = document.querySelector('#conversation-list');
const showTextSelected = document.querySelector('#showTextSelected');

let getAllConversationJSON = allConversationMessagesJson;
let html = '';
let htmls = getAllConversationJSON.map((_this) => {
  if (_this.members) {
    console.log('Group');
    groupConversation.addEventListener('click', () => {
      console.log('Group');
      selectGroupActiveIcon();
      conversationParent.style.display = 'none';
      showTextSelectedMessage('Trò chuyện nhóm');
      console.log(_this);
    });
  } else {
    personalConversation.addEventListener('click', () => {
      console.log('Personal');
      selectPersonalActiveIcon();
      conversationParent.style.display = 'none';
      showTextSelectedMessage('Trò chuyện cá nhân');
      console.log(_this);
    });
  }
});

allConversation.addEventListener('click', () => {
  console.log('ALL');
  conversationParent.style.display = 'block';

  selectAllActiveIcon();

  showTextSelectedMessage('Toàn bộ trò chuyện');

  console.log(getAllConversationJSON);
});
function selectGroupActiveIcon() {
  allConversationIcon.classList.remove('fa-check');
  personalConversationIcon.classList.remove('fa-check');
  groupConversationIcon.classList.add('fa-check');
}
function selectPersonalActiveIcon() {
  allConversationIcon.classList.remove('fa-check');
  groupConversationIcon.classList.remove('fa-check');
  personalConversationIcon.classList.add('fa-check');
}
function selectAllActiveIcon() {
  allConversationIcon.classList.add('fa-check');
  personalConversationIcon.classList.remove('fa-check');
  groupConversationIcon.classList.remove('fa-check');
}
function showTextSelectedMessage(txtMessage) {
  console.log(txtMessage);
  showTextSelected.innerHTML = txtMessage;
}

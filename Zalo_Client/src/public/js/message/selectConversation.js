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

let groupConversationJSON = getAllConversationJSON.filter((value) => {
  return value.members;
});
let personalConversationJSON = getAllConversationJSON.filter((value) => {
  return !value.members;
});
groupConversation.addEventListener('click', () => {
  console.log('Group');
  selectGroupActiveIcon();
  showTextSelectedMessage('Trò chuyện nhóm');
  let htmls = groupConversationJSON.map(
    (__this) =>
      `
    <li class="cursor-point chat-user-list-item"
        onclick="showConversationGroup('${__this._id}')"
        id="receiver-${__this._id}" data-updated="${__this.updatedAt}"
        data-name="${__this.name}">
        <a>
            <div class="d-flex">
                <div
                    class="chat-user-img online align-self-center me-3 ms-0">
                    <img src="/images/avatar-group.png"
                        class="rounded-circle avatar-xs" alt="">
                    <span class=""></span>
                </div>

                <div class="flex-1 overflow-hidden">
                    <h5 class="text-truncate font-size-15 mb-1">
                        ${__this.name}</h5>                  
                    <p class="chat-user-message chat-user-message-group text-truncate mb-0"
                        id="last-message-conversation">
                        ${__this.lastText}
                    </p>
                </div>
                <div class="font-size-11 chat-user-time-group"
                    id="updated-time-${__this._id}"
                    data-uid="${__this._id}">
                    ${__this.time}
                </div>
            </div>
        </a>
    </li>
        `
  );
  var html = htmls.join('');
  conversationParent.style.display = 'block';
  conversationParent.innerHTML = html;
});
personalConversation.addEventListener('click', () => {
  console.log('Personal');
  selectPersonalActiveIcon();
  //   conversationParent.style.display = 'none';
  showTextSelectedMessage('Trò chuyện cá nhân');
  let htmls = personalConversationJSON.map(
    (__this) =>
      `
    <li class="cursor-point chat-user-list-item"
        onclick="showConversationUser('${__this._id}')"
        id="receiver-${__this._id}" data-updated="${__this.updatedAt}"
        data-name="${__this.userName}">
        <a>
            <div class="d-flex">
                <div
                    class="chat-user-img online align-self-center me-3 ms-0">
                    <img src="/images/${__this.avatar}"
                        class="rounded-circle avatar-xs" alt="">
                    <span class=""></span>
                </div>
                <div class="flex-1 overflow-hidden">
                 <h5 class="text-truncate font-size-15 mb-1">
                    ${__this.userName}</h5>
                    <p class="chat-user-message text-truncate mb-0"
                            id="last-message-conversation">
                           ${__this.textUser}
                        </p>
                </div>
                <div class="font-size-11" id="updated-time-${__this._id}"
                    data-uid="${__this._id}">${__this.time}</div>
            </div>
        </a>
    </li>
        `
  );
  var html = htmls.join('');
  conversationParent.style.display = 'block';
  conversationParent.innerHTML = html;
});
allConversation.addEventListener('click', () => {
  console.log('ALL');
  selectAllActiveIcon();
  showTextSelectedMessage('Toàn bộ trò chuyện');
  let htmls = getAllConversationJSON.map((__this) => {
    if (__this.members) {
      return `
                <li class="cursor-point chat-user-list-item"
        onclick="showConversationGroup('${__this._id}')"
        id="receiver-${__this._id}" data-updated="${__this.updatedAt}"
        data-name="${__this.name}">
        <a>
            <div class="d-flex">
                <div
                    class="chat-user-img online align-self-center me-3 ms-0">
                    <img src="/images/avatar-group.png"
                        class="rounded-circle avatar-xs" alt="">
                    <span class=""></span>
                </div>

                <div class="flex-1 overflow-hidden">
                    <h5 class="text-truncate font-size-15 mb-1">
                        ${__this.name}</h5>                  
                    <p class="chat-user-message chat-user-message-group text-truncate mb-0"
                        id="last-message-conversation">
                        ${__this.lastText}
                    </p>
                </div>
                <div class="font-size-11 chat-user-time-group"
                    id="updated-time-${__this._id}"
                    data-uid="${__this._id}">
                    ${__this.time}
                </div>
            </div>
        </a>
    </li>
            `;
    } else {
      return `
        <li class="cursor-point chat-user-list-item"
        onclick="showConversationUser('${__this._id}')"
        id="receiver-${__this._id}" data-updated="${__this.updatedAt}"
        data-name="${__this.userName}">
        <a>
            <div class="d-flex">
                <div
                    class="chat-user-img online align-self-center me-3 ms-0">
                    <img src="/images/${__this.avatar}"
                        class="rounded-circle avatar-xs" alt="">
                    <span class=""></span>
                </div>
                <div class="flex-1 overflow-hidden">
                 <h5 class="text-truncate font-size-15 mb-1">
                    ${__this.userName}</h5>
                    <p class="chat-user-message text-truncate mb-0"
                            id="last-message-conversation">
                           ${__this.textUser}
                        </p>
                </div>
                <div class="font-size-11" id="updated-time-${__this._id}"
                    data-uid="${__this._id}">${__this.time}</div>
            </div>
        </a>
    </li>
        `;
    }
  });
  var html = htmls.join('');
  conversationParent.style.display = 'block';
  conversationParent.innerHTML = html;
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

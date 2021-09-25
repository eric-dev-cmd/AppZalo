const NOTIFICATION_TYPES = {
    ADD_CONTACT: 'add_contact'
}

class NotificationUtil {
     getContent(notification_type, isRead, userId, userName, userAvatar) {
        var html = '';
        if (notification_type === NOTIFICATION_TYPES.ADD_CONTACT) {

            html += `<li class="position-relative" data-uid = '${userId}'>
            <a  style="width: 90%;">
                <div class="d-flex">
                    <div
                        class="chat-user-img away align-self-center me-3 ms-0">
                        <img src="images/${userAvatar}"
                            class="rounded-circle avatar-xs" alt="">
                        <span class="user-status"></span>
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <h5 class="text-truncate font-size-15 mb-1">
                        ${userName}</h5>
                        <p class="chat-user-message text-truncate mb-0">
                            Muốn kết bạn. "Xin chào, tôi là <span>Bảo Anh.
                        </p>
        
        
                    </div>
                </div>
            </a>
            <div style="float: right;position: absolute;
        top: 14px;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        width: 14%;">
                <div class="fs-13 pb-1">
                    <a  id="btn-cancel-friend-receiver"  data-uid = '${userId}'
                        class="text-decoration-none cursor-point" style="    position: static;
        padding: 0;
        display: inline-block;">Bỏ qua</a>
                </div>
                <div class="fs-13">
                    <a  id="btn-accept-friend" data-uid = '${userId}'
                        class="text-decoration-none cursor-point" style="    position: static;
        padding: 0;
        display: inline-block;">Đồng ý</a>
                </div>
            </div>
        </li>`;
            
            return  html;
        }
        // html.split('"').join(' ')
    };
}
module.exports = {
    NOTIFICATION_TYPES: NOTIFICATION_TYPES,
    NotifitionUtil: new NotificationUtil
}
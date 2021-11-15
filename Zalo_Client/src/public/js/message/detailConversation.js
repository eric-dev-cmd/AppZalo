function detailConversation(messages) {

    $.each(messages, (i, message) => {
        if (message.messageType === 'file') {
            $('#list-file-conversation').prepend(renderListFile(message));
        }
        if (message.messageType === 'image') {
            $('#list-image-conversation').prepend(renderListImage(message));
        }
    });
}

function renderListFile(message) {
    let fileName = message.fileName.split('.');
    return `<div class="card p-2 border mb-2">
    <div class="d-flex align-items-center">
        <div class="avatar-sm me-3 ms-0">
            <div
                class="avatar-title bg-soft-primary text-primary rounded font-size-20">
                <i class="fal fa-file-alt"></i>
            </div>
        </div>
        <div class="flex-1">
            <div class="text-start">
                <h5 class="font-size-14 mb-1">${fileName[1] + '.' + fileName[2]}
                </h5>
                <p class="text-muted font-size-13 mb-0">12.5
                    MB</p>
            </div>
        </div>

        <div class="ms-4 me-0">
            <ul class="list-inline mb-0 font-size-18">
                <li class="list-inline-item">
                    <a href="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${message.fileName
        }"
                        class="text-muted px-1">
                        <i class="fal fa-download"></i>
                    </a>
                </li>
                <li class="list-inline-item dropdown">
                    <a class="dropdown-toggle text-muted px-1"
                        href="javascript:void(0)"
                        role="button" data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                        <i class="fal fa-ellipsis-h"></i>
                    </a>
                    <div
                        class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item"
                            href="javascript:void(0)">Action</a>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Hành
                            động khác
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item"
                            href="javascript:void(0)">Xoá</a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>`;
}

function renderListImage(message) {
    return `<ul class="list-inline message-img  mb-0">
    <li class="list-inline-item message-img-list position-relative">
        <div>
            <a class="popup-img d-inline-block m-1" href="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${message.fileName}" target="_blank" title="Project 2">
                <img src="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${message.fileName}" width="150" class="rounded border file-image-hover" style="width: 87px ; height: 87px ;">
            </a>
        </div>
        <div class="message-img-link" style="position: absolute; top: 9px ; color: white !important; right: 15px ;">
            <ul class="list-inline mb-0 list-inline-image-hover">
                <li class="list-inline-item">
                    <a href="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${message.fileName}" target="_blank">
                        <i class="fal fa-download"></i>
                    </a>
                </li>
                <li class="list-inline-item dropdown">
                    <a class="dropdown-toggle" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fal fa-ellipsis-h"></i>
                    </a>
                    <div style="left: -115px !important" class="dropdown-menu dropdown-menu-left-115 ">
                        <a class="dropdown-item" href="javascript:void(0)">Sao
                            chép
                            <i class="fal fa-copy float-end text-muted"></i></a>
                        <a class="dropdown-item" href="javascript:void(0)">Lưu
                            <i class="fal fa-save float-end text-muted"></i></a>
                        <a class="dropdown-item" href="javascript:void(0)">Chuyển
                            tiếp
                            <i class="fal fa-share float-end text-muted"></i></a>
                        <a class="dropdown-item" href="javascript:void(0)">Xoá
                            <i class="fal fa-trash-alt float-end text-muted"></i></a>
                    </div>
                </li>
            </ul>
        </div>
        
    </li>
</ul>`;
}

async function insertListMember(group, sender) {
    let sum = $('.number-of-member-click').attr('data-sum-member');
    if (group.userAmount) {
        $('#myprofileMember').html(`
            <div class="accordion-item card border" id="myprofile-member">
              <div class="accordion-header" id="attachfile3">
                  <button class="accordion-button collapsed" type="button"
                      data-bs-toggle="collapse" data-bs-target="#attachprofileMember"
                      aria-expanded="false" aria-controls="attachprofileMember">
                      <h5 class="font-size-14 m-0">
                          <i
                              class="fal fa-paperclip me-2 ms-0 align-middle d-inline-block"></i>
                          Thành viên (${sum})
                      </h5>
                  </button>
              </div>
              <div id="attachprofileMember" class="accordion-collapse collapse"
                  aria-labelledby="attachfile3" data-bs-parent="#myprofile">
                  <div class="accordion-body" id="list-member-conversation">
                      <div id="list-member-conversation-sum">
                  </div>
              </div> 
        `);
    }

    group.members.forEach(async member => {
        if (group.userId == member.userId) {
            let user = await $.get(http + `/users/${member.userId}`);
            $('#list-member-conversation-sum').prepend(renderLeader(user))
        } else {
            let user = await $.get(http + `/users/${member.userId}`);
            $('#list-member-conversation-sum').append(renderMembers(user))
        }

    })
}


function renderLeader(member) {
    return `<div class="card p-2 border mb-2">
    <div class="d-flex align-items-center">
      <div class="avatar-sm me-3 ms-0">
          <div
              class="avatar-title text-primary rounded font-size-20 rounded-circle position-relative">
              <img src="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${member.user.avatar}"
                  alt="" class="profile-user rounded-circle"
                  style="width: 100%; height: 100%">
              <div style="position: absolute; bottom: -2px ; right: -3px ; color: white; background: black; border-radius: 50%; width: 18 px ; height: 18px ; font-size: 11px;">
                <i class="fal fa-users-cog" style="padding: 3px;"></i>
              </div>
          </div>
      </div>
      <div class="flex-1">
          <div class="text-start">
              <h5 class="font-size-14 mb-1">${member.user.userName}
              </h5>
          </div>
      </div>
      <div class="ms-4 me-0">
          <ul class="list-inline mb-0 font-size-18">
              <li class="list-inline-item dropdown">
                  <a class="dropdown-toggle text-muted px-1"
                      href="javascript:void(0)" role="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false">
                      <i class="fal fa-ellipsis-h"></i>
                  </a>
                  <div class="dropdown-menu">
                      <a class="dropdown-item"
                          href="javascript:void(0)">Rời
                          nhóm</a>
                  </div>
              </li>
          </ul>
      </div>
  </div>
</div>
              </div>`
}

function renderMembers(member) {
    return `<div class="card p-2 border mb-2">
    <div class="d-flex align-items-center">
      <div class="avatar-sm me-3 ms-0">
          <div
              class="avatar-title text-primary rounded font-size-20 rounded-circle position-relative">
              <img src="https://stores3appchatmobile152130-dev.s3.ap-southeast-1.amazonaws.com/public/${member.user.avatar}"
                  alt="" class="profile-user rounded-circle"
                  style="width: 100%; height: 100%">
          </div>
      </div>
      <div class="flex-1">
          <div class="text-start">
              <h5 class="font-size-14 mb-1">${member.user.userName}
              </h5>
          </div>
      </div>
      <div class="ms-4 me-0">
          <ul class="list-inline mb-0 font-size-18">
              <li class="list-inline-item dropdown">
                  <a class="dropdown-toggle text-muted px-1"
                      href="javascript:void(0)" role="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false">
                      <i class="fal fa-ellipsis-h"></i>
                  </a>
                  <div class="dropdown-menu">
                      <a class="dropdown-item"
                          href="javascript:void(0)">Rời
                          nhóm</a>
                  </div>
              </li>
          </ul>
      </div>
  </div>
</div>
              </div>`
}
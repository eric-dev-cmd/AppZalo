function detailConversation(messages) {
    $('#list-file-conversation').html('')
    $('#list-image-conversation').html('')
    $.each(messages, (i, message) => {
        if(message.messageType === 'file'){
            $('#list-file-conversation').prepend(renderListFile(message))
        }
        if(message.messageType === 'image'){
            $('#list-image-conversation').prepend(renderListImage(message))
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
                    <a href="https://themesbrand.com/chatvia/layouts/dark.html#"
                        class="text-muted px-1">
                        <i class="fal fa-download"></i>
                    </a>
                </li>
                <li class="list-inline-item dropdown">
                    <a class="dropdown-toggle text-muted px-1"
                        href="https://themesbrand.com/chatvia/layouts/dark.html#"
                        role="button" data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                        <i class="fal fa-ellipsis-h"></i>
                    </a>
                    <div
                        class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item"
                            href="https://themesbrand.com/chatvia/layouts/dark.html#">Action</a>
                        <a class="dropdown-item"
                            href="https://themesbrand.com/chatvia/layouts/dark.html#">Hành
                            động khác
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item"
                            href="https://themesbrand.com/chatvia/layouts/dark.html#">Xoá</a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>`
}

function renderListImage(message) {
    return `<ul class="list-inline message-img  mb-0">
    <li class="list-inline-item message-img-list">
        <div>
            <a class="popup-img d-inline-block m-1" href="./assets/img-2.jpg" title="Project 2">
                <img src="https://appchat-2021.s3.ap-southeast-1.amazonaws.com/${message.fileName}" width="150" class="rounded border">
            </a>
        </div>
        <div class="message-img-link">
            <ul class="list-inline mb-0">
                <li class="list-inline-item">
                    <a href="https://appchat-2021.s3.ap-southeast-1.amazonaws.com/${message.fileName}">
                        <i class="fal fa-download"></i>
                    </a>
                </li>
                <li class="list-inline-item dropdown">
                    <a class="dropdown-toggle" href="javascript:void(0)" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fal fa-ellipsis-h"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end">
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
</ul>`
}
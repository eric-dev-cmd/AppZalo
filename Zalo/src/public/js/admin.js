let btnOpenModalAddMember = document.querySelector('.main-admin-btn-add-');
let contentModalAddMember = document.querySelector('.admin-backdrop');
let btnOpenModalBlockMember = document.querySelector('.admin-backdrop-block');
let contentListModalBlockMember = document.querySelectorAll('.action-block-icon');
let closeModalAddMember = document.querySelector('.action-btn-close');
let closeModalBlockMember = document.querySelector('.action-btn-close-block');
let wrapperModalAddMember = document.querySelector('.admin-modal-btn-add');
let closeModalIcon = document.querySelector('.admin-header-close');
let closeModalIconBlock = document.querySelector('.admin-header-close-block');
let btnCloseLayout = document.querySelector('#btn-close-layout');
let headerAdminActive = document.querySelector('.header-admin');
let navAdminActive = document.querySelector('.nav-admin');
let mainAdminActive = document.querySelector('.main-admin');

btnOpenModalAddMember.addEventListener('click', () => {
  contentModalAddMember.style.display = 'block';
  closeModalAddMember.addEventListener('click', () => {
    contentModalAddMember.style.display = 'none';
  });
  closeModalIcon.addEventListener('click', () => {
    contentModalAddMember.style.display = 'none';
  });
});

async function showModalBlock(userId) {
  $('.admin-backdrop-block').show();
  $('.action-btn-block').attr('id', userId);
  let getUser = await $.get(http + `/users/${userId}`);
  if (getUser.user.isActive == 'false') {
    $(`#${userId}`).html('Active');
    $(`#${userId}`).css('color', 'white');
    $(`#${userId}`).css('background', '#7467ef');
    $(`#${userId}`)
      .off('click')
      .on('click', () => {
        $.ajax({
          url: '/admin/updateIsActiveAdmin',
          type: 'put',
          data: {
            userId: userId,
          },
          success: function (data) {
            if (data.success) {
              $('.admin-backdrop-block').hide();
              $(`#isBlock-${userId}`)
                .attr('id', `isActive-${userId}`)
                .html('Active');
              $(`#isActive-${userId}`).css('color', 'white');
              $(`#isActive-${userId}`).css('background', '#7467ef');
            }
          },
        });
      });
  }
  if (getUser.user.isActive == 'true') {
    $(`#${userId}`).html('Block');
    $(`#${userId}`).css('color', 'rgb(209, 6, 6)');
    $(`#${userId}`).css('background', '#ffc6cd');
    $(`#${userId}`)
      .off('click')
      .on('click', () => {
        $.ajax({
          url: '/admin/updateIsBlockAdmin',
          type: 'put',
          data: {
            userId: userId,
          },
          success: function (data) {
            if (data.success) {
              $('.admin-backdrop-block').hide();
              $(`#isActive-${userId}`)
                .attr('id', `isBlock-${userId}`)
                .html('Block');
              $(`#isBlock-${userId}`).css('color', 'rgb(209, 6, 6)');
              $(`#isBlock-${userId}`).css('background', '#ffc6cd');
            }
          },
        });
      });
  }
}

contentListModalBlockMember.forEach((item) => {
  item.addEventListener('click', () => {
    console.log('Trung Vinh Block');
    btnOpenModalBlockMember.style.display = 'block';
    closeModalBlockMember.style.color = '#000';
    closeModalBlockMember.style.backgroundColor = 'rgba(0, 0, 0, 0.08)';
    closeModalBlockMember.addEventListener('click', () => {
      btnOpenModalBlockMember.style.display = 'none';
    });
    closeModalIconBlock.addEventListener('click', () => {
      btnOpenModalBlockMember.style.display = 'none';
    });
  });
});

$('#example-1').pagination({
  total: userSize,
  current: 1,
  length: 4,
  size: 2,
  click: function (options, $target) {
    $('.show').attr('current', options.current),
      $.ajax({
        url: `http://localhost:4000/users/page?startFrom=${
          (options.current - 1) * 4
        }`,
      })
        .done(function (rs) {
          $('.main-admin-table-tbody').html('');
          rs.data.users.forEach((user) => {
            $('.main-admin-table-tbody').append(renderUsers(user));
          });
        })
        .fail(function (error) {});
  },
});

function renderUsers(user) {
  if (user.isActive == 'true') {
    return `
    <tr>
       <td>${user.userName}</td>
       <td>${user.local.phone}</td>
       <td>${user.gender}</td>
       <td>
           <div style="display: block; float: left;">
               <p class="status status-active" id="isActive-${user._id}">Active</p>
           </div>
       </td>
       <td style="display: flex; float: left">
           <p class="action action-update action-block">
               <i class="fas fa-user-slash action-block-icon"
                   onclick="showModalBlock('${user._id}')"></i>
           </p>
       </td>
    </tr>
    `;
  } else {
    return `
  <tr>
     <td>${user.userName}</td>
     <td>${user.local.phone}</td>
     <td>${user.gender}</td>
     <td>
         <div style="display: block; float: left;">
             <p class="status status-inactive" id="isBlock-${user._id}">Block</p>
         </div>
     </td>
     <td style="display: flex; float: left">
         <p class="action action-update action-block">
             <i class="fas fa-user-slash action-block-icon"
                 onclick="showModalBlock('${user._id}')"></i>
         </p>
     </td>
  </tr>
  `;
  }
}

// console.log('Reset Password Trung Vinh');
// // Start Reset Password
// // const form = document.getElementById('formInfoResetPassword');
// const passwordReset1 = document.getElementById('passwordInforReset');
// const passwordReset2 = document.getElementById('passwordInforConfirmReset');
// const showReset = document.getElementById('showNotificationResetPassword');
// const btnPasswordReset = document.getElementById('btnPasswordReset');
// console.log(passwordReset1);
// let error = '';
// btnPasswordReset.disabled = true;
// btnPasswordReset.style.cursor = 'not-allowed';

// passwordReset1.addEventListener('blur', () => {
//   console.log('HAHA');
//   console.log(passwordReset1.value);
//   let str = passwordReset1.value;
//   if (str == '') {
//     isShowError('Vui lòng nhập password<br>');
//   } else if (str.length < 2 || str.length > 45) {
//     isShowError('Tên người dùng phải có 2-45 ký tự<br>');
//   } else {
//     error = '';
//     showReset.classList.remove('alert-danger');
//     showReset.style.display = 'none';
//     showReset.innerHTML = error;
//   }
//   return error;
// });
// function isShowSuccess(messageError) {
//   error = messageError;
//   showReset.classList.remove('alert-danger');
//   showReset.style.display = 'block';
//   showReset.classList.add('alert-success');
//   showReset.innerHTML = error;
//   btnPasswordReset.disabled = false;
//   btnPasswordReset.style.cursor = 'pointer';
// }
// function isShowError(messageError) {
//   error = messageError;
//   showReset.classList.remove('alert-success');
//   showReset.style.display = 'block';
//   showReset.classList.add('alert-danger');
//   showReset.innerHTML = error;
//   btnPasswordReset.disabled = true;
//   btnPasswordReset.style.cursor = 'not-allowed';
// }
// function validatePasswordReset() {
//   if (passwordReset1.value != passwordReset2.value) {
//     console.log('MK khong khop');
//     isShowError('Mật khẩu không khớp');
//   } else {
//     console.log('Dung mk');
//     isShowSuccess('Mật khẩu khớp');
//   }
// }
// passwordReset1.onchange = validatePasswordReset;
// passwordReset2.onkeyup = validatePasswordReset;
// // End Reset Password

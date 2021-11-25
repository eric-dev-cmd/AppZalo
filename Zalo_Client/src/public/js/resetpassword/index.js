console.log('Reset password');
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCMiQ8trT8oDqdY7nTjvintYY_V7h8WF5M',
  authDomain: 'test-authentication-js-e273b.firebaseapp.com',
  projectId: 'test-authentication-js-e273b',
  storageBucket: 'test-authentication-js-e273b.appspot.com',
  messagingSenderId: '678248299679',
  appId: '1:678248299679:web:f28c11bc86d170e08bf6aa',
  measurementId: 'G-YP67FPLW9H',
});
const auth = getAuth(firebaseApp);
console.log(auth);
const setUpRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(
    'recaptcha-container',
    {
      size: 'invisible',
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onResetPassword();
      },
    },
    auth
  );
};
const onResetPassword = (e) => {
  e.preventDefault();
  setUpRecaptcha();
  // Giá trị của input khong khoang trang 2 dau. Nhung van co khoang tran o giua
  let phoneNumberInput = document
    .querySelector('#phoneNumberReset')
    .value.trim();
  // Loai bo khoang trang all
  let phoneNumberT = phoneNumberInput.replace(/\s+/g, '');
  console.log(phoneNumberInput);
  console.log(phoneNumberT);
  let submitOTPReset = document.querySelector('#submitOTPReset');
  // console.log(phoneNumberT);
  // console.log(submitOTP);
  const appVerifier = window.recaptchaVerifier;
  const phoneSplit = phoneNumberT.slice(phoneNumberT.length - 9);
  console.log(phoneSplit.trim());
  const phoneEntered = '0' + phoneSplit.trim();
  console.log(phoneEntered.trim());

  fetch('http://localhost:4000/users/searchPhone/' + phoneEntered)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const show = document.getElementById('showNotificationReset');

      // Tai khoan nay co the dang ky
      if (data.user == null) {
        console.log(phoneEntered);
        console.log(phoneNumberT);
        show.classList.remove('alert-danger');
        show.classList.add('alert-success');
        show.innerHTML = 'Đang gửi mã xác nhận...';
        console.log('Not account. Lets register');
        // Gửi OTP
      } else {
        console.log(data.user);
        // Tai khoan da ton tai, khong cho dang ky
        show.classList.remove('alert-success');
        show.classList.add('alert-danger');
        show.innerHTML =
          'Tài khoản đã tồn tại. Vui lòng nhập số điện thoại khác!';
        console.log('Account already exists');
      }
    });
};

document
  .querySelector('#btnResetPassword')
  .addEventListener('click', onResetPassword);
console.log(document.querySelector('#btnResetPassword'));

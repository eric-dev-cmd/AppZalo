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
  console.log('SDT da dang ky');
  const phoneSplit = phoneNumberT.slice(phoneNumberT.length - 9);
  console.log(phoneSplit.trim());
  const phoneEntered = '0' + phoneSplit.trim();
  console.log(phoneEntered.trim());
  console.log('Reset');
  fetch(`${http}/users/searchPhone/` + phoneEntered)
    .then((response) => {
      console.log(response);
      response.json();
    })
    .then((data) => {
      // Tai khoan nay co the dang ky
      if (data.user == null) {
        console.log(phoneEntered);
        console.log(phoneNumberT);
        console.log('Khong ton tai tai khoan');
        // Gửi OTP
      } else {
        console.log(data.user);
        // Tai khoan da ton tai, khong cho dang ky
        console.log('Tai khoan da ton tai!');
      }
    });
};

document
  .querySelector('#btnResetPassword')
  .addEventListener('click', onResetPassword);
console.log(document.querySelector('#btnResetPassword'));

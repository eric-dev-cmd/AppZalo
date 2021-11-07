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
console.log('Firebase OTP');
// let phoneNumberT = document.querySelector('#getPhoneNumber');
// Lấy Form Verify
let form = document.querySelector('[name="verify"]');
// Lấy Input
let inputs = form.querySelectorAll('.inputs input');
// Xác minh robot
const setUpRecaptcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier(
    'recaptcha-container',
    {
      size: 'invisible',
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
      },
    },
    auth
  );
};
let phoneNumberT;
handleValidationPhone();
const onSignInSubmit = (e) => {
  e.preventDefault();
  setUpRecaptcha();
  let phoneNumberInput = document.querySelector('#phoneNumber').value.trim();
  let phoneNumberT = phoneNumberInput.replace(/\s+/g, '');
  console.log('Sai strim(): ' + phoneNumberT);
  console.log(phoneNumberT);
  let submitOTP = document.querySelector('#submitOTP');
  // console.log(phoneNumberT);
  // console.log(submitOTP);
  const appVerifier = window.recaptchaVerifier;
  console.log('SDT da dang ky');
  const phoneSplit = phoneNumberT.slice(phoneNumberT.length - 9);
  console.log(phoneSplit.trim());
  const phoneEntered = '0' + phoneSplit.trim();
  console.log(phoneEntered.trim());
  fetch('http://localhost:4000/users/searchPhone/' + phoneEntered)
    .then((response) => response.json())
    .then((data) => {
      // Tai khoan nay co the dang ky
      console.log(data.user);
      if (data.user == null) {
        console.log('Khong ton tai tai khoan');
        $('.secondBox').show();
        $('.firstBox').hide();
        // Gửi OTP
        signInWithPhoneNumber(auth, phoneNumberT, appVerifier)
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            // ...
            console.log(phoneNumberT);
            console.log('Sent OTP Success');
            const lastPhone = phoneNumberT.slice(phoneNumberT.length - 4);

            const setPhoneForVerify = document.getElementById('lastPhone');
            setPhoneForVerify.innerHTML = lastPhone;
            submitOTP.addEventListener('click', function (e) {
              e.preventDefault();
              let arr = [];
              let otp;
              inputs.forEach((input, i) => {
                arr.push(input.value);
                // console.log(arr.join());
                otp = arr.join('');
                // console.log(input.value);
              });
              console.log(otp);
              console.log('Click xác minh OTP');
              const code = otp;
              confirmationResult
                .confirm(code)
                .then((result) => {
                  // User signed in successfully.
                  const user = result.user;
                  console.log('Success 😍');
                  // const timestamp = new Date().getTime();
                  // const exp = timestamp + 60 * 60 * 24 * 1000 * 1;
                  // document.cookie = 'phoneNumber=' + phoneNumberT + 'expires=' + exp;
                  window.location.href = `/accounts/password/update?phone=${phoneNumberT}`;
                  // ...
                })
                .catch((error) => {
                  // User couldn't sign in (bad verification code?)
                  // ...
                  console.log(error.message);
                  console.log(error);
                });
            });
          })
          .catch((error) => {
            // Error; SMS not sent
            // ...
            console.log(error);
            console.log(error.message);

            console.log('Not send OTP');
          });
        function handleInput(e) {
          // Check data đã được nhập và nếu có dữ liệu đầu vào thì đi tiếp
          const input = e.target;
          console.log(input.value);
          if (input.nextElementSibling && input.value) {
            input.nextElementSibling.focus();
          }
        }
        function handlePaste(e) {
          const paste = e.clipboardData.getData('text');
          // Lặp lại từng đầu vào và điền vào chỉ mục của chuỗi đó
          inputs.forEach((input, i) => {
            input.value = paste[i] || '';
          });
        }
        inputs[0].addEventListener('paste', handlePaste);
        form.addEventListener('input', handleInput);
      } else {
        // Tai khoan da ton tai, khong cho dang ky
        console.log('Tai khoan da ton tai!');
        const show = document.getElementById('showNotification');
        show.style.visibility = 'visible';
        show.classList.add('active');
        show.innerHTML =
          'Tài khoản đã tồn tại. Vui lòng nhập số điện thoại khác!';
      }
    });
};

document
  .querySelector('#btnRegister')
  .addEventListener('click', onSignInSubmit);
// Next input on form OTP
document.addEventListener('DOMContentLoaded', function (event) {
  function OTPInput() {
    const inputs = document.querySelectorAll('#otp > *[id]');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('keydown', function (event) {
        if (event.key === 'Backspace') {
          inputs[i].value = '';
          if (i !== 0) inputs[i - 1].focus();
        } else {
          if (i === inputs.length - 1 && inputs[i].value !== '') {
            return true;
          } else if (event.keyCode > 47 && event.keyCode < 58) {
            inputs[i].value = event.key;
            if (i !== inputs.length - 1) inputs[i + 1].focus();
            event.preventDefault();
          } else if (event.keyCode > 64 && event.keyCode < 91) {
            inputs[i].value = String.fromCharCode(event.keyCode);
            if (i !== inputs.length - 1) inputs[i + 1].focus();
            event.preventDefault();
          }
        }
      });
    }
  }
  OTPInput();
});
// Validation when click
let btnVerify = document.getElementById('btnRegister');

function handleValidationPhone() {
  console.log('Validation Phone Number');
  const phoneNumber = document.querySelector('#phoneNumber');
  let btnVerify = document.getElementById('btnRegister');
  console.log(phoneNumber);
  btnVerify.disabled = true;
  btnVerify.style.cursor = 'no-drop';

  phoneNumber.addEventListener('blur', () => {
    handleValidation();
  });
  phoneNumber.addEventListener('submit', () => {
    handleValidation();
  });
}
function handleValidation() {
  const phoneNumberExist = phoneNumber.value;
  if (phoneNumberExist !== null) {
    const show = document.getElementById('showNotification');
    if (isVietnamesePhoneNumber(phoneNumberExist) === true) {
      btnVerify.disabled = false;
      btnVerify.style.cursor = 'pointer';
      show.style.visibility = 'visible';
      show.classList.add('active');
      show.innerHTML = 'Số điện thoại hợp lệ';
    } else {
      btnVerify.disabled = true;
      btnVerify.style.cursor = 'no-drop';
      show.classList.remove('active');
      show.style.visibility = 'visible';
      show.classList.add('unactive');
      show.innerHTML = 'SĐT là số và có 10 chữ số. Có +84(0)!';
    }
  } else {
    btnVerify.disabled = true;
    btnVerify.style.cursor = 'no-drop';
    show.classList.remove('active');
    show.style.visibility = 'visible';
    show.classList.add('unactive');
    show.innerHTML = 'SĐT không được để trống!';
  }
}
function isVietnamesePhoneNumber(number) {
  return /(^[+84]+(3|5|7|8|9|1)([0-9]{8})\b)$/g.test(number);
}

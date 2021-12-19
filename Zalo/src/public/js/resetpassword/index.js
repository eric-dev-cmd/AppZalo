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
let formReset = document.querySelector('[name="resetPassword"]');
let inputsReset = formReset.querySelectorAll('.inputsReset input');
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
function handleCountDown() {
  const expireEle = document.querySelector('.expire-reset');
  // OTP
  let expire = 60;
  let countdown;
  countdown = setInterval(() => {
    expire--;
    if (expire === 0) {
      clearInterval(countdown);
    }
    expireEle.textContent = expire < 10 ? '0' + expire + 's' : expire + 's';
  }, 1000);
}
const onResetPassword = (e) => {
  e.preventDefault();
  setUpRecaptcha();
  // Giá trị của input khong khoang trang 2 dau. Nhung van co khoang tran o giua
  let submitOTPReset = document.querySelector('#submitOTPReset');

  let phoneNumberInput = document
    .querySelector('#phoneNumberReset')
    .value.trim();
  // Loai bo khoang trang all
  let phoneNumberT = phoneNumberInput.replace(/\s+/g, '');
  console.log(phoneNumberInput);
  console.log(phoneNumberT);
  // console.log(phoneNumberT);
  // console.log(submitOTP);
  const appVerifier = window.recaptchaVerifier;
  const phoneSplit = phoneNumberT.slice(phoneNumberT.length - 9);
  console.log(phoneSplit.trim());
  const phoneEntered = '0' + phoneSplit.trim();
  console.log(phoneEntered.trim());

  fetch(
    'http://ec2-54-251-168-170.ap-southeast-1.compute.amazonaws.com:4000/users/searchPhone/' +
      phoneEntered
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const show = document.getElementById('showNotificationReset');

      // Tai khoan nay co the dang ky
      if (data.user == null) {
        console.log(data.user);
        // Tai khoan da ton tai, khong cho dang ky
        show.classList.remove('alert-success');
        show.classList.add('alert-danger');
        show.innerHTML = 'Tài khoản này không tồn tại!';
        console.log('Account already exists');
      } else {
        show.classList.remove('alert-danger');
        show.classList.add('alert-success');
        show.innerHTML = 'Đang gửi mã xác nhận...';
        setTimeout(() => {
          $('.reset-box-1').hide();
        }, 1000);
        setTimeout(() => {
          $('.reset-box-2').show();
        }, 1500);
        console.log('Not account. Lets register');
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
            const setPhoneForVerify =
              document.getElementById('lastPhone-reset');
            setPhoneForVerify.innerHTML = lastPhone;
            handleCountDown();
            submitOTPReset.addEventListener('click', function (e) {
              e.preventDefault();
              let arr = [];
              let otp;
              inputsReset.forEach((input, i) => {
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
                  const user = result.user;
                  console.log(user);
                  // ...
                  setTimeout(() => {
                    window.location.href = `/accounts/password/reset/new_password?phone=${phoneNumberT}`;
                  }, 500);
                })
                .catch((error) => {
                  showNotificationFail();
                  console.log(error);
                });
            });
          })
          .catch((error) => {
            console.log(error);
            console.log(error.message);
            console.log('Not send OTP');
          });

        function handleInput(e) {
          // Check data đã được nhập và nếu có dữ liệu đầu vào thì đi tiếp
          const input = e.target;
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
        inputsReset[0].addEventListener('paste', handlePaste);
        formReset.addEventListener('input', handleInput);
      }
    });
};

document
  .querySelector('#btnResetPassword')
  .addEventListener('click', onResetPassword);

function showNotificationFail() {
  console.log('Code wrong');
  let modalClose = document.querySelector('.header-close-verify');
  let modalVerifyReset = document.querySelector('.modal-btn-verify');
  let overlayDark = document.querySelector('.overlay-reset');
  let modalBtnNotificationFail = document.querySelector('.action-btn-verify');

  overlayDark.style.display = 'block';
  modalVerifyReset.style.display = 'block';

  modalClose.addEventListener('click', () => {
    overlayDark.style.display = 'none';
    modalVerifyReset.style.display = 'none';
  });
  modalBtnNotificationFail.addEventListener('click', () => {
    overlayDark.style.display = 'none';
    modalVerifyReset.style.display = 'none';
  });
}

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
let phoneParent = document.querySelector('#phoneParent');
let yourInputNumber = '';
let btnVerify = document.getElementById('btnRegister');

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
  fetch('http://ec2-18-142-51-89.ap-southeast-1.compute.amazonaws.com:4000/users/searchPhone/' + phoneEntered)
    .then((response) => response.json())
    .then((data) => {
      // Tai khoan nay co the dang ky
      console.log(data.user);
      if (data.user == null) {
        console.log(phoneEntered);
        console.log(phoneNumberT);
        console.log('Khong ton tai tai khoan');
        setTimeout(() => {
          $('.firstBox').hide();
        }, 1000);
        setTimeout(() => {
          $('.secondBox').show();
        }, 1500);
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
            handleCountDown();

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
              const boxVerify = document.querySelector('.box-verify');
              const icon = boxVerify.querySelector('.fas');
              console.log(boxVerify);
              console.log(icon);
              confirmationResult
                .confirm(code)
                .then((result) => {
                  const user = result.user;

                  setTimeout(() => {
                    icon.classList.add('fa-check-circle');
                    icon.classList.add('text-success');
                    icon.classList.remove('fa-times-circle');
                    boxVerify.querySelector(
                      'p'
                    ).innerHTML = `Tài khoản của bạn đã được<br/>xác minh thành công<br/><span class='text-success'>Vui lòng đợi trong khi chuyển hướng</span>`;
                  }, 500);
                  setTimeout(() => {
                    window.location.href = `/accounts/password/update?phone=${phoneNumberT}`;
                  }, 1500);
                  // ...
                })
                .catch((error) => {
                  icon.classList.remove('fa-check-circle');
                  icon.classList.add('fa-times-circle');
                  icon.classList.add('text-danger');

                  boxVerify.querySelector(
                    'p'
                  ).innerHTML = `<span class="text-danger">Xác minh thất bại.</span><br/><span style="color: #000">Vui lòng&nbsp;<span class='btn-return' style="color: red;">Thử lại</span></span>`;
                  let btnReturnOTP = document.querySelector('.btn-return');
                  btnReturnOTP.addEventListener('click', () => {
                    icon.classList.remove('text-danger');
                    icon.classList.remove('fa-times-circle');
                    boxVerify.querySelector('p').innerHTML = '';
                    icon.classList.add('fa-check-circle');
                    boxVerify.classList.remove('active');
                  });
                  resetReCaptcha();
                });
              boxVerify.classList.add('active');
            });
          })
          .catch((error) => {
            window.recaptchaVerifier.render().then(function (widgetId) {
              grecaptcha.reset(widgetId);
            });
            // Error; SMS not sent
            // ...
            console.log(error);
            console.log(error.message);
            resetReCaptcha();
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
        inputs[0].addEventListener('paste', handlePaste);
        form.addEventListener('input', handleInput);
      } else {
        // Tai khoan da ton tai, khong cho dang ky
        console.log('Tai khoan da ton tai!');
        const show = document.getElementById('showNotification');
        show.classList.remove('active');
        show.style.visibility = 'visible';
        phoneParent.style.borderColor = '#721c24';
        show.classList.add('unactive');
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

function handleValidationPhone() {
  console.log('Validation Phone Number');
  const phoneNumber = document.querySelector('#phoneNumber');
  let btnVerify = document.getElementById('btnRegister');
  console.log(phoneNumber);
  phoneNumber.addEventListener('blur', () => {
    handleValidation();
  });
  phoneNumber.addEventListener('click', () => {
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
      phoneParent.style.borderColor = '#b8daff';
      show.classList.add('active');
      show.innerHTML = 'Số điện thoại hợp lệ';
    } else {
      btnVerify.disabled = true;
      btnVerify.style.cursor = 'no-drop';
      show.classList.remove('active');
      show.style.visibility = 'visible';
      phoneParent.style.borderColor = '#721c24';
      show.classList.add('unactive');
      show.innerHTML =
        'Là số - chứa 10 số. Bắt đầu với +84(0) vd: +84987059059';
    }
  } else {
    btnVerify.disabled = true;
    btnVerify.style.cursor = 'no-drop';
    show.classList.remove('active');
    show.style.visibility = 'visible';
    phoneParent.style.borderColor = '#721c24';
    show.classList.add('unactive');
    show.innerHTML = 'SĐT không được để trống!';
  }
}
function isVietnamesePhoneNumber(number) {
  return /(^[+84]+(3|5|7|8|9|1)([0-9]{8})\b)$/g.test(number);
}
let btnRegisted = document.querySelector('#phoneNumber');
handleOnInput(btnRegisted);
function handleOnInput(inputElement) {
  const show = document.getElementById('showNotification');
  inputElement.oninput = function () {
    btnVerify.disabled = false;
    btnVerify.style.cursor = 'pointer';
    phoneParent.style.borderColor = 'none !important';
    show.style.visibility = 'hidden';
    show.classList.add('unactive');
  };
}

function handleCountDown() {
  const expireEle = document.querySelector('.expire');
  // OTP
  let expire = 60;
  let OTP;
  let countdown;
  console.log(expireEle);
  countdown = setInterval(() => {
    expire--;
    if (expire === 0) {
      clearInterval(countdown);
    }
    expireEle.textContent = expire < 10 ? '0' + expire + 's' : expire + 's';
  }, 1000);
}
function resetReCaptcha() {
  if (
    typeof grecaptcha !== 'undefined' &&
    typeof window.recaptchaWidgetId !== 'undefined'
  ) {
    grecaptcha.reset(window.recaptchaWidgetId);
  }
}
let btnResendOTP = document.querySelector('#btnResendOTP');
btnResendOTP.addEventListener('click', () => {
  resendOTP();
});
resendOTP();
function resendOTP() {
  resetReCaptcha();
  console.log('Resend OTP');
}

console.log('Trung Vinh Reset');

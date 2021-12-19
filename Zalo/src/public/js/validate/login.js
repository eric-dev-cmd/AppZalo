console.log('Login');
const btnLogin = document.getElementById('btnLogin');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const showLogin = document.getElementById('showNotificationLogin');

let error = '';
console.log(btnLogin);
btnLogin.disabled = true;

function isShowSuccess(messageError) {
  error = messageError;
  showLogin.classList.remove('alert-danger');
  showLogin.style.display = 'block';
  showLogin.classList.add('alert-success');
  showLogin.innerHTML = error;
  btnLogin.disabled = false;
  btnLogin.style.cursor = 'pointer';
}
function isShowError(messageError) {
  error = messageError;
  showLogin.classList.remove('alert-success');
  showLogin.style.display = 'block';
  showLogin.classList.add('alert-danger');
  showLogin.innerHTML = error;
  btnLogin.disabled = true;
  btnLogin.style.cursor = 'not-allowed';
}
password.addEventListener('input', (e) => {
  if (phone != null && password != null) {
    console.log(password.value);
    btnLogin.disabled = false;
  } else {
    console.log('Error');
  }
});

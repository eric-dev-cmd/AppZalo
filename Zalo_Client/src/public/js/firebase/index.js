console.log('Firebase');
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
// Form register - only form
// const registerForm = document.querySelector('#registerForm');
// console.log(registerForm);
// registerForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   console.log('Trung vinh');
// });
const { initializeApp } = require('firebase/app');
const {
  getAuth,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
}  = require('firebase/auth');
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCMiQ8trT8oDqdY7nTjvintYY_V7h8WF5M",
  authDomain: "test-authentication-js-e273b.firebaseapp.com",
  projectId: "test-authentication-js-e273b",
  storageBucket: "test-authentication-js-e273b.appspot.com",
  messagingSenderId: "678248299679",
  appId: "1:678248299679:web:f28c11bc86d170e08bf6aa",
  measurementId: "G-YP67FPLW9H",
});
module.exports = {firebaseApp}
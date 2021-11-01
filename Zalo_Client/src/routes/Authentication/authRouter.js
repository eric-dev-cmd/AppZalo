const express = require('express');
const router = express.Router();
const authController = require('../../controllers/AuthController');
const passport = require('passport');
const initPassportLocal = require('../../controllers/PassportController');

initPassportLocal();


router.get('/', authController.checkLoggedOut, authController.showLogin);
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login-register',
    successFlash: true,
    failureFlash: true,
  })
);

router.get('/logout', authController.checkLoggedIn, authController.getLogout);

module.exports = router;

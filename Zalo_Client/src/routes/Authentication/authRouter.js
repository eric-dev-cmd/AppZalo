const express = require('express');
const router = express.Router();
const authController = require('../../controllers/AuthController');
const passport = require('passport');
const initPassportLocal = require('../../controllers/PassportController');

initPassportLocal();

router.get('/', authController.checkRole, authController.showLogin);
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login-register',
    successFlash: true,
    failureFlash: true,
  })
);

router.get('/logout', authController.checkLoggedIn, authController.getLogout);

module.exports = router;

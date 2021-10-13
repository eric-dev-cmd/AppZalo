const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');

router.get('/signup/verify', authController.showVerify);
router.get('/password/reset', authController.showResetPassword);

router.get('/signup', authController.showRegister);

module.exports = router;

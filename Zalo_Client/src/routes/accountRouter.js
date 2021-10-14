const express = require('express');
const router = express.Router();

const authController = require('../controllers/AuthController');
router.get('/password/update', authController.showUpdatePassword);

router.get('/password/reset', authController.showResetPassword);
router.get('/verify', authController.showVerify);
router.get('/signup', authController.showRegister);

module.exports = router;

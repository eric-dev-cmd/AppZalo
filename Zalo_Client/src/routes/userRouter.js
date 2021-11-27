const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');

router.post('/updateProfile', authController.checkLoggedIn, userController.updateProfile);
router.put('/updateOnline', authController.checkLoggedIn, userController.updateOnline);
router.put('/updateBusy', authController.checkLoggedIn, userController.updateBusy);


module.exports = router;

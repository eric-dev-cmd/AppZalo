const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');

router.post('/', authController.checkLoggedIn, userController.updateProfile);

module.exports = router;

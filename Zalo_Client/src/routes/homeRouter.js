const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeController');
const authController = require('../controllers/AuthController');

router.get('/', authController.checkLoggedIn, homeController.index);
router.post('/updateProfile', authController.checkLoggedIn, homeController.updateProfile);

module.exports = router;

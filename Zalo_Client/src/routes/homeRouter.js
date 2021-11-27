const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeController');
const authController = require('../controllers/AuthController');
const adminController = require('../controllers/AdminController');

router.get('/', authController.checkLoggedIn, homeController.index);
router.get('/admin', authController.showPageAdmin);
router.put('/updateIsActiveAdmin', adminController.updateIsActiveAdmin);
router.put('/updateIsBlockAdmin', adminController.updateIsBlockAdmin);
module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const authController = require('../controllers/AuthController');

router.post('/admin/created', adminController.addAccount);
router.put('/updateIsActiveAdmin', adminController.updateIsActiveAdmin);
router.put('/updateIsBlockAdmin', adminController.updateIsBlockAdmin);
router.get('/', authController.checkLoggedIn, adminController.showPageAdmin);
module.exports = router;

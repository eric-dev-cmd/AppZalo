const express = require('express');
const router = express.Router();
const contactController = require('../controllers/ContactsControllers');
const authController = require('../controllers/AuthController');

router.post('/add-new', authController.checkLoggedIn, contactController.addNew);
router.delete('/remove', authController.checkLoggedIn, contactController.remove);
router.delete('/removeReceiver', authController.checkLoggedIn, contactController.removeReceiver);
router.put('/accept', authController.checkLoggedIn, contactController.accept);

module.exports = router;

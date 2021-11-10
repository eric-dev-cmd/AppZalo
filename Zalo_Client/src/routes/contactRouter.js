const express = require('express');
const router = express.Router();
const contactController = require('../controllers/ContactsControllers');
const authController = require('../controllers/AuthController');

router.post('/addNewContact', authController.checkLoggedIn, contactController.addNew);
router.delete('/removeFriend', authController.checkLoggedIn, contactController.removeFriend);
router.delete('/removeFriendRequestFromReceiver', authController.checkLoggedIn, contactController.removeFriendRequestFromReceiver);
router.put('/accept', authController.checkLoggedIn, contactController.accept);

module.exports = router;

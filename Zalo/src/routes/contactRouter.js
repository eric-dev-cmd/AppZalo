const express = require('express');
const router = express.Router();
const contactController = require('../controllers/ContactsControllers');
const authController = require('../controllers/AuthController');

router.post('/addNewContact', authController.checkLoggedIn, contactController.addNewFriend);
router.delete('/removeFriend', authController.checkLoggedIn, contactController.removeFriend);
router.delete('/removeFriendRequestFromReceiver', authController.checkLoggedIn, contactController.denyRequestFriend);
router.put('/accept', authController.checkLoggedIn, contactController.acceptRequestFriend);

module.exports = router;

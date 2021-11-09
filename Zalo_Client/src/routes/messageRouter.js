const express = require('express');
const router = express.Router();
const messageController = require('../controllers/MessageController');
const authController = require('../controllers/AuthController');

router.post('/addNewText', authController.checkLoggedIn, messageController.addNewText);
router.post('/addInfoMessage', authController.checkLoggedIn, messageController.addInfoMessage);
router.post('/uploadFiles', authController.checkLoggedIn, messageController.uploadFiles);
router.delete('/deleteText', authController.checkLoggedIn, messageController.deleteText);
router.delete('/deleteFile', authController.checkLoggedIn, messageController.deleteFile);
router.delete('/deleteConversation', authController.checkLoggedIn, messageController.deleteConversation);
module.exports = router;
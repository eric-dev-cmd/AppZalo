const express = require('express');
const router = express.Router();
const messageController = require('../controllers/MessagesController');

router.get('/', messageController.getAPI);
router.get('/:id', messageController.getAPIById);
router.get('/SearchBySenderIdOrReceiverId/:id', messageController.getAPIBySenderIdOrReceiverId);
router.get('/SearchByText/:text', messageController.getAPIByText);
router.get('/SearchByReceiverId/:receiverid', messageController.getAPIByReceiverId);
router.get('/SearchBySenderIdAndReceiverId/:senderid/:receiverid', messageController.getAPIBySenderIdAndReceiverId);
router.post('/', messageController.postAPI);
router.put('/:id', messageController.putAPI);
router.delete('/:id', messageController.deleteAPI);

module.exports = router;
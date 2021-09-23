const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationsController');

router.get('/', notificationController.getAPI);
router.get('/search/ReceiverIdAndLimit/:receiverid/:limit', notificationController.getAPIByReceiverIdAndLimit);
router.get('/search/:senderId/:receiverId/:type', notificationController.getAPIBySenderIdAndReceiverIdAndType);
router.get('/:id', notificationController.getAPIById);
router.post('/', notificationController.postAPI);
router.put('/:id', notificationController.putAPI);
router.delete('/:id', notificationController.deleteAPI);

module.exports = router;
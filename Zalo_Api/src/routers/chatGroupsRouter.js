const express = require('express');
const router = express.Router();
const chatGroupController = require('../controllers/ChatGroupsController');

router.get('/', chatGroupController.getAPI);
router.get('/:id', chatGroupController.getAPIById);
router.post('/', chatGroupController.postAPI);
router.put('/:id', chatGroupController.putAPI);
router.delete('/:id', chatGroupController.deleteAPI);

module.exports = router;
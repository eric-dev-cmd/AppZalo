const express = require('express');
const router = express.Router();
const groupController = require('../controllers/GroupController');

router.post('/createGroup', groupController.createGroup);
router.put('/addUserToGroup', groupController.addUserToGroup);

module.exports = router;
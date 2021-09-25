const express = require('express');
const router = express.Router();
const contactController = require('../controllers/ContactsController');

router.get('/', contactController.getAPI);
router.get('/:id', contactController.getAPIById);
router.get('/searchUserId/:userId', contactController.getAPIByUserId);
router.get('/searchContact/:userId', contactController.getAPIByContact);
router.get('/searchContactId/:contactId', contactController.getAPIByContactId);
router.get('/search/:userid/:contactid', contactController.getAPIByUserIdAndContactId);
router.post('/', contactController.postAPI);
router.put('/:id', contactController.putAPI);
router.delete('/:id', contactController.deleteAPI);

module.exports = router;
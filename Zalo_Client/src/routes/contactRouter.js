const express = require('express');
const router = express.Router();
const contactController = require('../controllers/ContactsControllers');

router.get('/', contactController.index);

module.exports = router;

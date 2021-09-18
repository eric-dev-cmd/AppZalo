const express = require('express');
const router = express.Router();
const contactController = require('../controllers/ContactsControllers');

router.get('/search', contactController.search);

module.exports = router;

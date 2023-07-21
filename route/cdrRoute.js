const express = require('express');
const cdrController = require('../controllers/cdrController');

const router = express.Router();

router.post('/', cdrController.createCdr);

module.exports = router;
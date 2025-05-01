
const express = require('express');
const { sendRecoveryEmail } = require('../controllers/recoveryController');

const router = express.Router();

router.post('/', sendRecoveryEmail);

module.exports = router;
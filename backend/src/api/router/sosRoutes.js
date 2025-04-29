const express = require('express');
const { getUserById } = require('../controller/userInfoController');
const apiValidator = require('../../service/validation/apiValidation'); // JWT token checker
const { storedSOS } = require('../controller/sosController');
const router = express.Router();

// Fetch user info (protected route)
router.get('/sos/get/data/', apiValidator, storedSOS);

module.exports = router;

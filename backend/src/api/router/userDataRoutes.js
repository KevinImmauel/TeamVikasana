const express = require('express');
const { getUserById } = require('../controller/userInfoController');
const apiValidator = require('../../service/validation/apiValidation'); // JWT token checker
const router = express.Router();

// Fetch user info (protected route)
router.get('/user/:id', apiValidator, getUserById);

module.exports = router;

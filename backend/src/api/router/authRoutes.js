const express = require('express');
const { login, signup } = require('../controller/authController');
const rbacMiddleware = require('../../service/validation/rbacMiddleware'); // JWT token checker
const { adminMiddleware } = require('../../service/roleBasedAccess');
const apiValidator = require('../../service/validation/apiValidation');
const router = express.Router();

// Login Route
router.post('/auth/login', login);

// Signup Route
router.post('/auth/signup', apiValidator, adminMiddleware, signup);

module.exports = router;

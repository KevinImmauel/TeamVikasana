const express = require('express');
const { login, signup } = require('../controller/authController');
const rbacMiddleware = require('../../service/validation/rbacMiddleware'); // JWT token checker
const { superAdminMiddleware } = require('../../service/roleBasedAccess');
const apiValidator = require('../../service/validation/apiValidation');
const router = express.Router();

// Login Route
router.post('/auth/login', login);

// Signup Route
router.post('/auth/signup', apiValidator, superAdminMiddleware, signup);

module.exports = router;

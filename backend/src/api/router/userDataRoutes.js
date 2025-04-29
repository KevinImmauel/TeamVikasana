const express = require('express');
const { getUserById, getAllUsersBasicInfo } = require('../controller/userInfoController');
const apiValidator = require('../../service/validation/apiValidation'); // JWT token checker
const router = express.Router();
router.use(apiValidator)
router.get('/user/:id', getUserById);
router.get('/user/all/data', getAllUsersBasicInfo);

module.exports = router;

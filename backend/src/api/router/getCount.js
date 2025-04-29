const express = require('express');
const router = express.Router();
const { getCounts } = require('../controller/getAllCount.js');

router.get('/stats/counts', getCounts);

module.exports = router;

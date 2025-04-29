const express = require('express');
const router = express.Router();
const { reportIncident, getIncidents } = require('../controller/incidentController');

// router.use(authenticate);

router.post('/incident', reportIncident);    
router.get('/incident', getIncidents);         

module.exports = router;

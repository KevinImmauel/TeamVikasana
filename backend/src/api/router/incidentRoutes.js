const express = require('express');
const router = express.Router();
const { reportIncident, getIncidents, getCrimeAnalytics, getCrimeAnalyticsPerStation } = require('../controller/incidentController');

router.post('/incident', reportIncident);
router.get('/incident', getIncidents);         
router.get('/crime/analysis', getCrimeAnalytics);         
router.get('/crime/analysis/station', getCrimeAnalyticsPerStation);         

module.exports = router;

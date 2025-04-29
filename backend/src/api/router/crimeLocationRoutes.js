const express = require('express');
const router = express.Router();
const { getAllCrimeLocations, addCrimeLocations } = require('../controller/crimeLocationController');

// Middlewares like auth middleware should be added if needed
// Example: const { authenticateUser } = require('../middlewares/auth');

// router.use(authenticateUser);

router.get('/crime/location/data', getAllCrimeLocations);
router.post('/crime/location/data', addCrimeLocations);


module.exports = router;

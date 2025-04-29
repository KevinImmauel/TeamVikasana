const express = require('express');
const router = express.Router();
const apiValidation = require('../../service/validation/apiValidation.js')
const { adminMiddleware, superAdminMiddleware } = require('../../service/roleBasedAccess');
// router.use(apiValidation);



const districtController = require('../controller/districtController.js');
const circleController = require('../controller/circleController.js');
const stationController = require('../controller/stationController');

// District Routes
router.post('/districts', districtController.createDistrict);
router.get('/districts', districtController.getAllDistricts);
router.get('/districts/:districtId', districtController.getDistrictById);
router.put('/districts/:districtId', districtController.updateDistrict);
router.delete('/districts/:districtId', districtController.deleteDistrict);

// Circle Routes
router.post('/circles', circleController.createCircle);
router.get('/circles', circleController.getAllCircles);
router.get('/circles/:circleId', circleController.getCircleById);
router.put('/circles/:circleId', circleController.updateCircle);
router.delete('/circles/:circleId', circleController.deleteCircle);

// Station Routes
router.post('/stations', stationController.createStation);
router.get('/stations', stationController.getAllStations);
router.get('/stations/:stationId', stationController.getStationById);
router.put('/stations/:stationId', stationController.updateStation);
router.delete('/stations/:stationId', stationController.deleteStation);

module.exports = router;

const express = require('express');
const { getAllMeasurements, getSingleMeasurement, createMeasurement, updateMeasurement, deleteMeasurement } = require('../controllers/measurementController');
const router = express.Router();
const { isAuthenticateUser, authorizeRoles } = require("../middleware/authmiddleware");


router.get('/measurement', getAllMeasurements);
router.get('/measurement/:id', getSingleMeasurement);
router.post('/measurement/create', isAuthenticateUser, authorizeRoles('admin'), createMeasurement);
router.put('/measurement/:id', isAuthenticateUser, authorizeRoles('admin'), updateMeasurement);
router.delete('/measurement/:id', isAuthenticateUser, authorizeRoles('admin'), deleteMeasurement);

module.exports = router;

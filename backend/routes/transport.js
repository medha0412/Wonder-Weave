const express = require('express');
const router = express.Router();
const { 
  searchFlights, 
  getFlightDetails,
  searchTrains,
  getTrainDetails
} = require('../controllers/transport');
const { protect } = require('../middleware/auth');

router.get('/flights/search', protect, searchFlights);
router.get('/flights/:flightId', protect, getFlightDetails);
router.get('/trains/search', protect, searchTrains);
router.get('/trains/:trainId', protect, getTrainDetails);

module.exports = router
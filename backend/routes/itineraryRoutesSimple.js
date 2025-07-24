const express = require('express');
const router = express.Router();
const { createItinerary } = require('../controllers/itineraryControllerSimple');

// POST /api/itinerary - save itinerary
router.post('/itinerary', createItinerary);

module.exports = router;

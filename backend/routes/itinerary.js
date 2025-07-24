const express = require('express');
const router = express.Router();
const { 
  createItinerary, 
  getItineraries, 
  getItinerary, 
  updateItinerary, 
  deleteItinerary 
} = require('../controllers/itinerary');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createItinerary)
  .get(protect, getItineraries);

// router.post('/', createItinerary)
// router.get('/', protect, getItineraries)

router.route('/:id')
  .get(protect, getItinerary)
  .put(protect, updateItinerary)
  .delete(protect, deleteItinerary);

module.exports = router;
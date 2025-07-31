const express = require('express');
const router = express.Router();
const { searchPlaces, getPlaceDetails } = require('../controllers/places');
const { protect } = require('../middleware/auth');

router.get('/search', protect, searchPlaces);
router.get('/:placeId', protect, getPlaceDetails);

module.exports = router;

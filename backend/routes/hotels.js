const express = require('express');
const router = express.Router();
const { searchHotels, getHotelDetails } = require('../controllers/hotels');
const { protect } = require('../middleware/auth');

router.get('/search', protect, searchHotels);
router.get('/:hotelId', protect, getHotelDetails);

module.exports = router;
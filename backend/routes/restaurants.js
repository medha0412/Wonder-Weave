const express = require('express');
const router = express.Router();
const { searchRestaurants, getRestaurantDetails } = require('../controllers/restaurants');
const { protect } = require('../middleware/auth');

router.get('/search', protect, searchRestaurants);
router.get('/:restaurantId', protect, getRestaurantDetails);

module.exports = router;
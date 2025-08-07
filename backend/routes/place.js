import express from 'express';
import { searchPlaces, getPlaceDetails } from '../controllers/places.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.get('/search', protect, searchPlaces);
router.get('/:placeId', protect, getPlaceDetails);

export default router;
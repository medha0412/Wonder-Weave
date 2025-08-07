import express from 'express';
import {
  createItinerary,
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary
} from '../controllers/itinerary.js'; 

import { protect } from '../middleware/auth.js'; 

const router = express.Router();

router.route('/')
  .post(protect, createItinerary)
  .get(protect, getItineraries);

router.route('/:id')
  .get(protect, getItinerary)
  .put(protect, updateItinerary)
  .delete(protect, deleteItinerary);

export default router;

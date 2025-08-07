import express from 'express';
const router = express.Router();
import { createItinerary } from '../controllers/itinerary.js';
// POST /api/itinerary - save itinerary
router.post('/itinerary', createItinerary);

export default router;
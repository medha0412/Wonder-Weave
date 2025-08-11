import express from 'express';
const router = express.Router();
import { createItinerary } from '../controllers/itinerary.js';
router.post('/itinerary', createItinerary);

export default router;
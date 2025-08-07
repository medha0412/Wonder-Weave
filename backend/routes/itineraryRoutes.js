// routes/itineraryRoutes.js

import express from 'express';
const router = express.Router();
import generateItinerary from '../controllers/itineraryController.js';
router.post("/generate", generateItinerary);

export default router;
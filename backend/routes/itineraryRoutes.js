// routes/itineraryRoutes.js

import express from 'express';
const router = express.Router();
import {generateItinerary,savedItinerary,getMyTrips} from '../controllers/itineraryController.js';
import { protect } from '../middleware/auth.js';
router.post("/generate", generateItinerary);
router.post("/save",protect, savedItinerary);
router.get("/mytrips",protect, getMyTrips); 
export default router;
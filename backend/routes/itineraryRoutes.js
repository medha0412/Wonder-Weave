// routes/itineraryRoutes.js

import express from 'express';
const router = express.Router();
import {generateItinerary,savedItinerary} from '../controllers/itineraryController.js';
router.post("/generate", generateItinerary);
router.post("/save",savedItinerary);
export default router;
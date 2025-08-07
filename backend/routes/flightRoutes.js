// routes/flightRoutes.js

import express from 'express';
const router = express.Router();
import {getFlights} from '../controllers/flightController.js';
router.get("/", getFlights);

export default router;
// routes/placeRoutes.js

import express from 'express';
import {
  getRestaurants,
  getHotels,
} from "../controllers/placesController.js";
const router = express.Router();

router.get("/restaurants", getRestaurants);
router.get("/hotels", getHotels);

export default router;
// routes/placeRoutes.js

const express = require("express");
const router = express.Router();
const {
  getRestaurants,
  getHotels,
} = require("../controllers/placesController");

router.get("/restaurants", getRestaurants);
router.get("/hotels", getHotels);

module.exports = router;

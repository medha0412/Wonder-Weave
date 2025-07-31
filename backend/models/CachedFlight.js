// models/CachedFlight.js
const mongoose = require("mongoose");

const cachedFlightSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // TTL: 24 hours
});

cachedFlightSchema.index({ from: 1, to: 1 }, { unique: true }); // prevent duplicate routes

module.exports = mongoose.model("CachedFlight", cachedFlightSchema);

// models/CachedDestination.js

const mongoose = require("mongoose");

const CachedDestinationSchema = new mongoose.Schema({
  destination: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed }, // stores places, flights, etc.
  createdAt: { type: Date, default: Date.now, expires: 86400 } // auto-delete after 1 day
});

module.exports = mongoose.model("CachedDestination", CachedDestinationSchema);

// models/CachedDestination.js

import mongoose from "mongoose";
const CachedDestinationSchema = new mongoose.Schema({
  destination: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed }, // stores places, flights, etc.
  createdAt: { type: Date, default: Date.now, expires: 86400 } // auto-delete after 1 day
});

const CachedDestination = mongoose.model("CachedDestination", CachedDestinationSchema);
export default CachedDestination;

import mongoose from "mongoose";
const CachedDestinationSchema = new mongoose.Schema({
  destination: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed }, 
  createdAt: { type: Date, default: Date.now, expires: 86400 } 
});

const CachedDestination = mongoose.model("CachedDestination", CachedDestinationSchema);
export default CachedDestination;
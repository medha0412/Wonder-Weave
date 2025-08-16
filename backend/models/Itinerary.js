import mongoose from "mongoose";
const ItinerarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: [true, 'Please provide a destination']
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  places: [{
    placeId: String,
    name: String,
    description: String,
    address: String,
    rating: Number,
    image: String,
    visitDate: Date
  }],
  
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Itinerary = mongoose.model('Itinerary', ItinerarySchema);
export default Itinerary;
const mongoose = require('mongoose');

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
  hotels: [{
    hotelId: String,
    name: String,
    description: String,
    address: String,
    rating: Number,
    price: Number,
    image: String,
    checkIn: Date,
    checkOut: Date
  }],
  restaurants: [{
    restaurantId: String,
    name: String,
    cuisine: String,
    address: String,
    rating: Number,
    priceRange: String,
    image: String,
    reservationDate: Date
  }],
  transport: {
    flights: [{
      flightId: String,
      airline: String,
      flightNumber: String,
      departureCity: String,
      arrivalCity: String,
      departureTime: Date,
      arrivalTime: Date,
      price: Number
    }],
    trains: [{
      trainId: String,
      trainName: String,
      trainNumber: String,
      departureCity: String,
      arrivalCity: String,
      departureTime: Date,
      arrivalTime: Date,
      price: Number
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);

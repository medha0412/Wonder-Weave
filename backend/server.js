const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

//Imports Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user')
const itineraryRoutes = require('./routes/itinerary');
const placeRoutes = require('./routes/places');
const hotelsRoutes = require('./routes/hotels');
const restaurantRoutes = require('./routes/restaurants');
const transportRoutes = require('./routes/transport');
const searchRoutes = require("./routes/searchRoutes");
const itineraryRoutesSimple = require('./routes/itineraryRoutesSimple');

// config
dotenv.config();
const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err)
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes)
app.use('/api/itinearary', itineraryRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/hotels', hotelsRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/transport', transportRoutes);
app.use("/api", searchRoutes);
app.use('/api', itineraryRoutesSimple);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  module.exports = app;
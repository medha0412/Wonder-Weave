// server.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const {connectDB} = require("./config/config");
const errorHandler = require("./middleware/error");
const cors = require("cors");
const session = require("express-session");
const passport = require('passport');
const path = require('path');
require("./config/passport");

connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
// Route files
const authRoutes = require("./routes/auth");
const itineraryRoutes = require("./routes/itineraryRoutes");
const placeRoutes = require("./routes/placeRoutes");
const flightRoutes = require("./routes/flightRoutes");
const searchRoutes = require('./routes/searchRoutes');
const { getSearchResults } = require("./controllers/searchController");

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use('/api', searchRoutes);
app.use('/images', express.static(path.join(__dirname, '..', 'images')));


app.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  function (req, res) {
    res.redirect("http://localhost:5173/dashboard"); 
  }
);
// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

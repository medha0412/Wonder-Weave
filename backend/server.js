// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/config.js';
import errorHandler from './middleware/error.js';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Passport config
import './config/passport.js';

// Route files (use ESM imports instead of require)
import authRoutes from './routes/auth.js';
import itineraryRoutes from './routes/itineraryRoutes.js';  
import placeRoutes from './routes/placeRoutes.js';
import flightRoutes from './routes/flightRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import itineraryCrudRoutes from './routes/itinerary.js';    

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

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/itinerary', itineraryRoutes); // <-- seems redundant; maybe remove one?
app.use('/api', searchRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/itineraries', itineraryCrudRoutes); 
// Serve static images
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

// Google OAuth callback
app.get('/auth/google/callback',
  passport.authenticate('google', {
  failureRedirect: 'http://localhost:5173',
    successRedirect: 'http://localhost:5173/oauth-success',
  })
);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import './config/passport.js';

import authRoutes from './routes/auth.js';
import itineraryRoutes from './routes/itineraryRoutes.js';  
import flightRoutes from './routes/flightRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import itineraryCrudRoutes from './routes/itinerary.js';    

connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',           // Your Vite dev server
    'https://wonder-weave.netlify.app' // Your deployed frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Add this line RIGHT HERE - after CORS config, before other middleware

app.use(express.json());

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/itinerary', itineraryRoutes); 
app.use('/api', searchRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/itineraries', itineraryCrudRoutes); 
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.NODE_ENV === 'production' 
      ? 'https://wonder-weave.netlify.app' 
      : 'http://localhost:5173',
    successRedirect: process.env.NODE_ENV === 'production' 
      ? 'https://wonder-weave.netlify.app/oauth-success' 
      : 'http://localhost:5173/oauth-success',
  })
);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

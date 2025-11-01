// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
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

connectDB();

const app = express();

const allowedOrigins = new Set([
  'https://wayora.netlify.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl) and localhost/dev
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    // During development, be permissive to help with testing
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204
}));

// Ensure preflight requests are handled for all routes using a regex pattern
app.options(/.*/, cors());


app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

// Explicitly reflect allowed Origin header on all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) return next();
  if (allowedOrigins.has(origin) || process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  }
  return next();
});

// Be extra-permissive for the image endpoint (no credentials needed)
app.use('/api/image', cors({ origin: true, credentials: false }));

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/itinerary', itineraryRoutes); 
app.use('/api', searchRoutes);
app.use('/api/image', imageRoutes);
app.use('/images', express.static(path.join(__dirname, '..', 'images')));




app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

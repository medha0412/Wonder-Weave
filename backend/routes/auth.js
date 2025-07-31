const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, logout, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const { googleLogin } = require('../controllers/user');

 router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/signup?error=google',
    successRedirect: 'http://localhost:5173/dashboard', 
  })
);
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/google-login', googleLogin);
module.exports = router;
import express from 'express';
import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, getMe } from '../controllers/auth.js';
import { protect } from'../middleware/auth.js';
import { googleLogin } from '../controllers/user.js';
const router = express.Router();
 router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

const clientURL = process.env.CLIENT_URL;

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${clientURL}/signup?error=google`,
  }),
  (req, res) => {
    if (req.user) {
      const token = req.user.generateJWT();
      // Pass token via URL instead of relying on session
      res.redirect(`${clientURL}/oauth-success?token=${token}`);
    } else {
      res.redirect(`${clientURL}/signup?error=google`);
    }
  }
);

router.get('/debug-env', (req, res) => {
  res.json({
    clientURL: process.env.CLIENT_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV
  });
});



router.post('/google-login', (req, res) => {
   console.log('User from session:', req.user);
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const token = req.user.generateJWT();
  res.json({ token });
});


router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/google-login', googleLogin);
export default router;
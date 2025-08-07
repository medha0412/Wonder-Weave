import express from 'express';
import {googleLogin} from "../controllers/user.js";
import{
    updateUser, 
  updatePassword, 
  deleteAccount
} from '../controllers/user.js';
import User from '../controllers/user.js';
import{ protect } from '../middleware/auth.js';
const router = express.Router();

router.put('/update', protect, updateUser);
router.put('/updatepassword', protect, updatePassword);
router.delete('/delete', protect, deleteAccount);
router.post('/google-login', googleLogin);

export default router;
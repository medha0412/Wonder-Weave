const express = require('express');
const router = express.Router();
const {googleLogin} = require("../controllers/user");
const {
    updateUser, 
  updatePassword, 
  deleteAccount
} = require('../controllers/user');
const User = require('../controllers/user');
const { protect } = require('../middleware/auth');

router.put('/update', protect, updateUser);
router.put('/updatepassword', protect, updatePassword);
router.delete('/delete', protect, deleteAccount);
router.post('/google-login', googleLogin);

module.exports = router;
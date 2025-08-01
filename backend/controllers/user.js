const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.updateUser = async (req, res, next) => {
    try {
      const fieldsToUpdate = {
        name: req.body.name
      };
      
      const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
      });
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (err) {
      next(err);
    }
  };
  
  // @desc    Update password
  // @route   PUT /api/users/updatepassword
  // @access  Private
  exports.updatePassword = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select('+password');
      
      // Check current password
      if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
      }
      
      user.password = req.body.newPassword;
      await user.save();
      
      // Send token response to update user's cookie
      const token = user.getSignedJwtToken();
      
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      };
      
      if (process.env.NODE_ENV === 'production') {
        options.secure = true;
      }
      
      res
        .status(200)
        .cookie('token', token, options)
        .json({
          success: true,
          token
        });
    } catch (err) {
      next(err);
    }
  };
  
  // @desc    Delete user account
  // @route   DELETE /api/users/delete
  // @access  Private
  exports.deleteAccount = async (req, res, next) => {
    try {
      // Find user and delete
      await User.findByIdAndDelete(req.user.id);
      
      // Delete all associated itineraries
      await Itinerary.deleteMany({ user: req.user.id });
      
      res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      });
      
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (err) {
      next(err);
    }
  };
  // @desc    Login or signup user with Google OAuth
// @route   POST /api/users/google-login
// @access  Public
exports.googleLogin = async (req, res, next) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: bcrypt.hashSync(jwt.sign({ email }, process.env.JWT_SECRET), 10), // Random hash
      });
    }

    const token = user.getSignedJwtToken();

    const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }

    res.status(200).cookie('token', token, options).json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      }
    });
  } catch (err) {
    next(err);
  }
};

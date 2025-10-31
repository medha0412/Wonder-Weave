import User from '../models/User.js'
import ErrorResponse from '../utils/errorResponse.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const updateUser = async (req, res, next) => {
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
  export const updatePassword = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select('+password');
      
      if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
      }
      
      user.password = req.body.newPassword;
      await user.save();
      
      const token = user.generateJWT();
      
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
  export const deleteAccount = async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.user.id);
      
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
export const googleLogin = async (req, res, next) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: bcrypt.hashSync(jwt.sign({ email }, process.env.JWT_SECRET), 10), 
      });
    }

    const token = user.generateJWT();

    const cookieExpireDays = Number(process.env.JWT_COOKIE_EXPIRE || 7);
    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      maxAge: cookieExpireDays * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      secure: process.env.NODE_ENV === 'production'
    };

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

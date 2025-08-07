import User from '../models/User.js';
import Itinerary from '../models/Itinerary.js'
import ErrorResponse from '../utils/errorResponse.js'
// @desc    Create new itinerary
// @route   POST /api/itinerary
// @access  Private
export const createItinerary = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    
    const itinerary = await Itinerary.create(req.body);
    
    // Add to user's saved itineraries
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { savedItineraries: itinerary._id } },
      { new: true }
    );
    
    res.status(201).json({
      success: true,
      data: itinerary
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all itineraries for a user
// @route   GET /api/itinerary
// @access  Private
export const getItineraries = async (req, res, next) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: itineraries.length,
      data: itineraries
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single itinerary
// @route   GET /api/itinerary/:id
// @access  Private
export const getItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    
    if (!itinerary) {
      return next(new ErrorResponse(`Itinerary not found with id of ${req.params.id}`, 404));
    }
    
    // Make sure user owns itinerary
    if (itinerary.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`User not authorized to access this itinerary`, 401));
    }
    
    res.status(200).json({
      success: true,
      data: itinerary
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update itinerary
// @route   PUT /api/itinerary/:id
// @access  Private
export const updateItinerary = async (req, res, next) => {
  try {
    let itinerary = await Itinerary.findById(req.params.id);
    
    if (!itinerary) {
      return next(new ErrorResponse(`Itinerary not found with id of ${req.params.id}`, 404));
    }
    
    // Make sure user owns itinerary
    if (itinerary.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`User not authorized to update this itinerary`, 401));
    }
    
    itinerary = await Itinerary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: itinerary
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete itinerary
// @route   DELETE /api/itinerary/:id
// @access  Private
export const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    
    if (!itinerary) {
      return next(new ErrorResponse(`Itinerary not found with id of ${req.params.id}`, 404));
    }
    
    // Make sure user owns itinerary
    if (itinerary.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`User not authorized to delete this itinerary`, 401));
    }
    
    await itinerary.deleteOne();
    
    // Remove from user's saved itineraries
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedItineraries: req.params.id } }
    );
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
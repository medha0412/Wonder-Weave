import Itinerary from '../models/Itinerary.js';
// Create new itinerary (no auth)
export const createItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.create(req.body);
    res.status(201).json({
      success: true,
      data: itinerary
    });
  } catch (error) {
    console.error("Error creating itinerary:", error.message);
    res.status(500).json({ success: false, error: "Failed to create itinerary" });
  }
};

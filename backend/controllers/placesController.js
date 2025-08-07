// controllers/placesController.js

// GET /api/places/restaurants
export const getRestaurants = async (req, res) => {
  const { destination } = req.query;

  if (!destination) {
    return res.status(400).json({
      success: false,
      message: "Destination is required",
    });
  }

  // Mock restaurant data
  const restaurants = [
    {
      name: "The Spice Route",
      address: "Connaught Place, New Delhi",
      rating: 4.5,
      cuisine: "Indian",
      image: "https://source.unsplash.com/600x400/?restaurant",
    },
    {
      name: "Olive Bistro",
      address: "Khan Market, New Delhi",
      rating: 4.3,
      cuisine: "Mediterranean",
      image: "https://source.unsplash.com/600x400/?fine-dining",
    },
  ];

  res.status(200).json({
    success: true,
    destination,
    restaurants,
  });
};

// GET /api/places/hotels
export const getHotels = async (req, res) => {
  const { destination } = req.query;

  if (!destination) {
    return res.status(400).json({
      success: false,
      message: "Destination is required",
    });
  }

  // Mock hotel data
  const hotels = [
    {
      name: "The Taj Palace",
      address: "Chanakyapuri, New Delhi",
      rating: 4.7,
      pricePerNight: 8500,
      image: "https://source.unsplash.com/600x400/?hotel",
    },
    {
      name: "ITC Maurya",
      address: "Sardar Patel Marg, New Delhi",
      rating: 4.6,
      pricePerNight: 7800,
      image: "https://source.unsplash.com/600x400/?luxury-hotel",
    },
  ];

  res.status(200).json({
    success: true,
    destination,
    hotels,
  });
};

const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');

// search for restaurants in a destination GET /api/restaurants/search Private
exports.searchRestaurants = async (req, res, next) => {
    try {
      const { destination, cuisine } = req.query;
      
      if (!destination) {
        return next(new ErrorResponse('Please provide a destination', 400));
      }
      
      // Using Zomato API for real-time restaurant data
      // First get the location ID
      const locationResponse = await axios.get(
        'https://developers.zomato.com/api/v2.1/locations',
        {
          params: {
            query: destination
          },
          headers: {
            'user-key': process.env.ZOMATO_API_KEY
          }
        }
      );
      
      if (!locationResponse.data.location_suggestions || locationResponse.data.location_suggestions.length === 0) {
        return next(new ErrorResponse(`No location found for ${destination}`, 404));
      }
      
      const locationId = locationResponse.data.location_suggestions[0].entity_id;
      const locationType = locationResponse.data.location_suggestions[0].entity_type;
      
      // Then search for restaurants in that location
      const params = {
        entity_id: locationId,
        entity_type: locationType,
        sort: 'rating',
        order: 'desc'
      };
      
      if (cuisine) {
        // Get cuisine ID if cuisine type is provided
        const cuisineResponse = await axios.get(
          'https://developers.zomato.com/api/v2.1/cuisines',
          {
            params: {
              city_id: locationId
            },
            headers: {
              'user-key': process.env.ZOMATO_API_KEY
            }
          }
        );
        
        const cuisineObj = cuisineResponse.data.cuisines.find(
          c => c.cuisine.cuisine_name.toLowerCase() === cuisine.toLowerCase()
        );
        
        if (cuisineObj) {
          params.cuisine = cuisineObj.cuisine.cuisine_id;
        }
      }
      
      const response = await axios.get(
        'https://developers.zomato.com/api/v2.1/search',
        {
          params,
          headers: {
            'user-key': process.env.ZOMATO_API_KEY
          }
        }
      );
      
      const restaurants = response.data.restaurants.map(item => ({
        restaurantId: item.restaurant.id,
        name: item.restaurant.name,
        address: item.restaurant.location.address,
        cuisine: item.restaurant.cuisines,
        rating: item.restaurant.user_rating.aggregate_rating,
        priceRange: Array(item.restaurant.price_range).fill('$').join(''),
        image: item.restaurant.featured_image || null,
        url: item.restaurant.url,
        menuUrl: item.restaurant.menu_url,
        phone: item.restaurant.phone_numbers
      }));
      
      res.status(200).json({
        success: true,
        count: restaurants.length,
        data: restaurants
      });
    } catch (err) {
      next(err);
    }
  };
  
  // @desc    Get details of a specific restaurant
  // @route   GET /api/restaurants/:restaurantId
  // @access  Private
  exports.getRestaurantDetails = async (req, res, next) => {
    try {
      const { restaurantId } = req.params;
      
      // Using Zomato API for restaurant details
      const response = await axios.get(
        `https://developers.zomato.com/api/v2.1/restaurant`,
        {
          params: {
            res_id: restaurantId
          },
          headers: {
            'user-key': process.env.ZOMATO_API_KEY
          }
        }
      );
      
      if (!response.data) {
        return next(new ErrorResponse(`Restaurant not found with id of ${restaurantId}`, 404));
      }
      
      const restaurantDetails = {
        restaurantId: response.data.id,
        name: response.data.name,
        address: response.data.location.address,
        cuisine: response.data.cuisines,
        rating: response.data.user_rating.aggregate_rating,
        priceRange: Array(response.data.price_range).fill('$').join(''),
        image: response.data.featured_image || null,
        openingHours: response.data.timings,
        highlights: response.data.highlights || [],
        phone: response.data.phone_numbers,
        url: response.data.url,
        menuUrl: response.data.menu_url,
        photos: response.data.photos ? response.data.photos.map(p => p.photo.url) : []
      };
      
      res.status(200).json({
        success: true,
        data: restaurantDetails
      });
    } catch (err) {
      next(err);
    }
  };
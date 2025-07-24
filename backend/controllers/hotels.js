const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');
const { exists } = require('../models/User');
const config = require('../config/config');

// search for hotels in a destination GET /api/hotels/search Private
exports.searchHotels = async (req, res, next) => {
    try {
        const { destination, checkIn, checkOut } = req.query;

        if (!destination) {
            return next(new ErrorResponse('Please provide a destination', 400));
          }

          // using Booking.com API via RapidAPI for real time hotel data 
          const response = await axios.get(
            'https://booking-com.p.rapidapi.com/v1/hotels/search',
            {
                params: {
                    dest_id: destination,
                    room_number: '1',
                    checkin_date: checkIn || '2025-05-01',
                    checkout_date: checkOut || '2025-05-05',
                    adults_number: '2',
                    order_by: 'popularity',
                    filter_by_currency: 'USD',
                    locale: 'en-us',
                    units: 'metric'
                  }, 
                  headers: {
                    'X-RapidAPI-Key': config.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
                  }
            }
          );

          const hotels = response.data.result.map(hotel => ({
            hotelId: hotel.hotel_id,
            name: hotel.hotel_name,
            address: hotel.address,
            city: hotel.city,
            rating: hotel.review_score || null,
            reviewCount: hotel.review_nr || 0,
            price: hotel.price_breakdown ? hotel.price_breakdown.gross_price : null,
            currency: hotel.price_breakdown ? hotel.price_breakdown.currency : 'USD',
            image: hotel.max_photo_url || null,
            url: hotel.url
          }));

          res.status(200).json({
            success: true,
            count: hotels.length,
            data: hotels
          })

    } catch (err) {
        next(err)
    }
};


// get detail of a specific hotel GET  /api/hotels/:hotelId Private
exports.getHotelDetails = async (req, res, next) => {
    try {
      const { hotelId } = req.params;
      
      // Using Booking.com API (via RapidAPI) for hotel details
      const response = await axios.get(
        'https://booking-com.p.rapidapi.com/v1/hotels/data',
        {
          params: {
            hotel_id: hotelId,
            locale: 'en-us'
          },
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
          }
        }
      );
      
      if (!response.data) {
        return next(new ErrorResponse(`Hotel not found with id of ${hotelId}`, 404));
      }
      
      const hotelDetails = {
        hotelId: hotelId,
        name: response.data.name,
        description: response.data.description,
        address: response.data.address,
        city: response.data.city,
        zip: response.data.zip,
        rating: response.data.review_score || null,
        reviewCount: response.data.review_nr || 0,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        photos: response.data.photos || [],
        facilities: response.data.facilities || [],
        checkInTime: response.data.checkin,
        checkOutTime: response.data.checkout
      };
      
      res.status(200).json({
        success: true,
        data: hotelDetails
      });
    } catch (err) {
      next(err);
    }
  };
  
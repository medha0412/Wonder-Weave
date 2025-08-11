import axios from 'axios';
import ErrorResponse from '../utils/errorResponse.js';
import config from '../config/config.js';
export const searchPlaces = async (req, res, next) => {
    try {
        const { destination } = req.query;

        if(!destination) {
            return next(new ErrorResponse('please provide a destinaton', 400));
        }

        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, 
            {
                params: {
                    query: `tourist attraction in ${destination}`,
                    key: process.env.GOOGLE_PLACE_API-KEY
                }
            }
        );

        const places = response.data.results.map(place => ({
            placeId: place.place_id,
            name: place.name,
            address: place.formatted_address,
            rating: place.rating,
            image: place.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${config.GOOGLE_PLACES_API_KEY}` : null
        }));

        res.status(200).json({
            success: true,
            count: places.length,
            data: places
          });

    } catch (err) {
        next(err);
    }
};

export const getPlaceDetails = async (req, res, next) => {
    try {
      const { placeId } = req.params;
      
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            fields: 'name,rating,formatted_address,formatted_phone_number,opening_hours,photos,reviews,website,price_level,geometry',
            key: process.env.GOOGLE_PLACES_API_KEY
          }
        }
      );
      
      if (!response.data.result) {
        return next(new ErrorResponse(`Place not found with id of ${placeId}`, 404));
      }
      
      const placeDetails = {
        placeId: placeId,
        name: response.data.result.name,
        address: response.data.result.formatted_address,
        phone: response.data.result.formatted_phone_number || null,
        rating: response.data.result.rating || null,
        openingHours: response.data.result.opening_hours ? response.data.result.opening_hours.weekday_text : null,
        website: response.data.result.website || null,
        photos: response.data.result.photos ? 
          response.data.result.photos.map(photo => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
          ) : 
          [],
        reviews: response.data.result.reviews || [],
        location: response.data.result.geometry ? response.data.result.geometry.location : null
      };
      
      res.status(200).json({
        success: true,
        data: placeDetails
      });
    } catch (err) {
      next(err);
    }
  };
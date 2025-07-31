// utils/getRestaurants.js
const axios = require("axios");

const getRestaurants = async (lat, lon, limit = 10) => {
  const response = await axios.get(
    `https://api.opentripmap.com/0.1/en/places/radius`,
    {
      params: {
        radius: 10000,
        lon,
        lat,
        kinds: "restaurants",
        format: "json",
        limit,
        apikey: process.env.OPENTRIPMAP_API_KEY,
      },
    }
  );

  const restaurants = response.data;

  const detailedRestaurants = await Promise.all(
    restaurants.map(async (restaurant) => {
      try {
        const details = await axios.get(
          `https://api.opentripmap.com/0.1/en/places/xid/${restaurant.xid}`,
          {
            params: {
              apikey: process.env.OPENTRIPMAP_API_KEY,
            },
          }
        );

        return {
          name: restaurant.name || "Unnamed Restaurant",
          id: restaurant.xid,
          point: restaurant.point || null,
          image: details.data.preview?.source || null,
        };
      } catch (err) {
        return {
          name: restaurant.name || "Unnamed Restaurant",
          id: restaurant.xid,
          point: restaurant.point || null,
          image: null,
        };
      }
    })
  );

  return detailedRestaurants;
};

module.exports = getRestaurants;

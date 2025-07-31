// utils/getPlaces.js
const axios = require("axios");

const getPlaces = async (lat, lon, limit = 20) => {
  const response = await axios.get(
    `https://api.opentripmap.com/0.1/en/places/radius`,
    {
      params: {
        radius: 10000,
        lon,
        lat,
        kinds: "interesting_places",
        format: "json",
        limit,
        apikey: process.env.OPENTRIPMAP_API_KEY,
      },
    }
  );

  const places = response.data;

  // Fetch details for each place
  const detailedPlaces = await Promise.all(
    places.map(async (place) => {
      try {
        const details = await axios.get(
          `https://api.opentripmap.com/0.1/en/places/xid/${place.xid}`,
          {
            params: {
              apikey: process.env.OPENTRIPMAP_API_KEY,
            },
          }
        );

        return {
          name: place.name || "Unknown Place",
          id: place.xid,
          point: place.point || null,
          image: details.data.preview?.source || null,
        };
      } catch (err) {
        // If error in getting details, return base info
        return {
          name: place.name || "Unknown Place",
          id: place.xid,
          point: place.point || null,
          image: null,
        };
      }
    })
  );

  return detailedPlaces;
};

module.exports = getPlaces;

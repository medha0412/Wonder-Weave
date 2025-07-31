// utils/getCoordinates.js
const axios = require("axios");

const getCoordinates = async (destination) => {
  const response = await axios.get(
    `https://api.opentripmap.com/0.1/en/places/geoname`,
    {
      params: {
        name: destination,
        apikey: process.env.OPENTRIPMAP_API_KEY,
      },
    }
  );

  const { lat, lon } = response.data;
  return { lat, lon };
};

module.exports = getCoordinates;

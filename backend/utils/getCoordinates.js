const axios = require("axios");
const config = require("../config/config");

const getCoordinates = async (destination) => {
  try {
    // Try OpenTripMap first
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: destination,
        format: "json",
        limit: 1,
      },
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat, lon };
    }

    // Fallback to Geoapify if OpenTripMap gives 0 results
    const geoapifyRes = await axios.get("https://api.geoapify.com/v1/geocode/search", {
      params: {
        text: destination,
        apiKey: config.geoapifyApiKey,
        limit: 1,
      },
    });

    if (
      geoapifyRes.data &&
      geoapifyRes.data.features &&
      geoapifyRes.data.features.length > 0
    ) {
      const { lat, lon } = geoapifyRes.data.features[0].properties;
      return { lat, lon };
    }

    throw new Error("No coordinates found using either provider.");
  } catch (err) {
    console.error("Error getting coordinates:", err.message);
    throw err;
  }
};

module.exports = getCoordinates;

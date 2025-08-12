import axios from 'axios';
import {geoapifyApiKey, openTripMapApiKey} from '../config/config.js'
const getCoordinates = async (destination) => {
  try {
    const response = await axios.get('https://api.opentripmap.com/0.1/en/places/geoname', {
      params: {
        name: destination,
        apikey: openTripMapApiKey,
      },
    });

   if (response.data && typeof response.data.lat === 'number' && typeof response.data.lon === 'number') {
  const { lat, lon } = response.data;
  return { lat, lon };
}



    // Fallback to Geoapify if OpenTripMap gives 0 results
    const geoapifyRes = await axios.get("https://api.geoapify.com/v1/geocode/search", {
      params: {
        text: destination,
        apiKey: geoapifyApiKey,
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
  console.error("Error getting coordinates:", err.response?.data || err.message || err);
  throw err;
}
};

export default getCoordinates;
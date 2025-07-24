const axios = require("axios");

// Helper: Get lat/lon from OpenTripMap
async function getCoordinates(destination, apiKey) {
  const res = await axios.get(
    `https://api.opentripmap.com/0.1/en/places/geoname`,
    {
      params: {
        name: destination,
        apikey: apiKey,
      },
    }
  );
  return { lat: res.data.lat, lon: res.data.lon };
}

// Helper: Map destination name to IATA airport code (mocked)
function getAirportCode(destination) {
  const map = {
    delhi: "DEL",
    mumbai: "BOM",
    goa: "GOI",
    manali: "KUU", // Kullu–Manali Airport
    london: "LOND",
    ladakh: "IXL",
  };
  return map[destination.toLowerCase()] || "DEL";
}

const getSearchResults = async (req, res) => {
  const { destination } = req.query;
  console.log("Incoming destination query:", destination);
  if (!destination) {
    return res.status(400).json({ error: "Destination is required" });
  }

  try {
    const { lat, lon } = await getCoordinates(destination, process.env.OPENTRIPMAP_API_KEY);
    console.log("Coordinates:", lat, lon);

    // 1. Fetch places to visit
    const placesRes = await axios.get(`https://api.opentripmap.com/0.1/en/places/radius`, {
      params: {
        radius: 5000,
        lon,
        lat,
        kinds: "interesting_places",
        rate: 2,
        format: "json",
        limit: 20,
        apikey: process.env.OPENTRIPMAP_API_KEY,
      },
    });
    console.log("Places fetched:", placesRes.data.length);

    // 2. Fetch flights using Sky Scrapper
    const flightRes = await axios.get("https://sky-scrapper.p.rapidapi.com/api/v1/flights/getFlightDetails", {
      params: {
        legs: JSON.stringify([
          {
            origin: "DEL", // origin can be dynamic if needed
            destination: getAirportCode(destination),
            date: "2025-06-10",
          },
        ]),
        adults: "1",
        currency: "INR",
        locale: "en-IN",
        market: "IN",
        cabinClass: "economy",
        countryCode: "IN",
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
      },
    });

     // 3. Fetch restaurants using OpenTripMap (kinds=foods)
    const restaurantRes = await axios.get(`https://api.opentripmap.com/0.1/en/places/radius`, {
      params: {
        radius: 5000,
        lon,
        lat,
        kinds: "foods",
        rate: 2,
        format: "json",
        limit: 20,
        apikey: process.env.OPENTRIPMAP_API_KEY,
      },
    });

     // 4. Fetch hotels
    const hotelRes = await axios.get(`https://api.opentripmap.com/0.1/en/places/radius`, {
      params: {
        radius: 5000,
        lon,
        lat,
        kinds: "accomodations",
        rate: 2,
        format: "json",
        limit: 20,
        apikey: process.env.OPENTRIPMAP_API_KEY,
      },
    });

    res.json({
     places: placesRes.data,
      restaurants: restaurantRes.data,
      hotels: hotelRes.data,
      flights: flightRes.data.data || [],
    });
  } catch (error) {
    console.error("Search fetch error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

module.exports = { getSearchResults };

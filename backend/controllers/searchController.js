const axios = require("axios");

// Get lat/lon from OpenTripMap
async function getCoordinates(destination, apiKey) {
  const res = await axios.get(`https://api.opentripmap.com/0.1/en/places/geoname`, {
    params: {
      name: destination,
      apikey: apiKey,
    },
  });
  return { lat: res.data.lat, lon: res.data.lon };
}

// Get places near given lat/lon
async function getPlaces(lat, lon) {
  const radius = 10000; // 10 km
  const limit = 50; // max number of places

  const apiKey = process.env.OPENTRIPMAP_API_KEY;

  const res = await axios.get(`https://api.opentripmap.com/0.1/en/places/radius`, {
    params: {
      radius,
      lon,
      lat,
      rate: 2,
      format: "json",
      limit,
      apikey: apiKey,
    },
  });

  // Map to clean data
  const places = res.data.map((place) => ({
    xid: place.xid,
    name: place.name,
    dist: place.dist,
    kinds: place.kinds,
    point: place.point,
  }));

  return places;
}

// Main search handler
const getSearchResults = async (req, res) => {
  try {
    const destination = req.query.destination;
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ error: "Invalid start or end date" });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    console.log(`🗓️ Trip duration: ${days} days`);

    const apiKey = process.env.OPENTRIPMAP_API_KEY;
    const coordinates = await getCoordinates(destination, apiKey);
    const allPlaces = await getPlaces(coordinates.lat, coordinates.lon);

    const itinerary = Array.from({ length: days }, (_, dayIndex) => {
      const dayPlaces = allPlaces.slice(dayIndex * 5, (dayIndex + 1) * 5);
      const times = ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];

      return {
        day: `Day ${dayIndex + 1}`,
        places: dayPlaces.map((place, idx) => ({
          ...place,
          time: times[idx % times.length],
        })),
      };
    });

    const flights = {
      departure: {
        from: "DEL",
        to: destination.toUpperCase().slice(0, 3),
        date: startDate.toISOString().split("T")[0],
        time: "10:00 AM",
        airline: "WonderAir",
      },
      return: {
        from: destination.toUpperCase().slice(0, 3),
        to: "DEL",
        date: endDate.toISOString().split("T")[0],
        time: "5:00 PM",
        airline: "WonderAir",
      },
    };

    res.json({ itinerary, flights });
  } catch (error) {
    console.error("Search fetch error:\n", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

module.exports = { getSearchResults };

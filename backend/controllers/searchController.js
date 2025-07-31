const axios = require("axios");
const getCoordinates = require("../utils/getCoordinates");
const getPlaces = require("../utils/getPlaces");

// Main Search Handler
const getSearchResults = async (req, res) => {
  console.log("✅ /api/search hit");

  try {
    const { destination, startDate, endDate } = req.query;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: "Destination, startDate, and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const { lat, lon } = await getCoordinates(destination);
    const allPlaces = await getPlaces(lat, lon);

    const timeSlots = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];
    const itinerary = Array.from({ length: days }, (_, dayIndex) => {
      const dayPlaces = allPlaces.slice(dayIndex * 5, (dayIndex + 1) * 5);
      return {
        day: `Day ${dayIndex + 1}`,
        places: dayPlaces.map((place, i) => ({
          ...place,
          time: timeSlots[i % timeSlots.length],
        })),
      };
    });

    const flights = {
      departure: {
        from: "DEL",
        to: destination.toUpperCase().slice(0, 3),
        date: start.toISOString().split("T")[0],
        time: "10:00 AM",
        airline: "WonderAir",
      },
      return: {
        from: destination.toUpperCase().slice(0, 3),
        to: "DEL",
        date: end.toISOString().split("T")[0],
        time: "5:00 PM",
        airline: "WonderAir",
      },
    };

    res.json({ itinerary, flights });
  } catch (err) {
    console.error("❌ Error in search:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getSearchResults };

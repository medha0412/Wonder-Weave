const axios = require("axios");
const getCoordinates = require("../utils/getCoordinates");
const getPlaces = require("../utils/getPlaces");
const getRestaurants = require("../utils/getRestaurants");

const generateItinerary = async (req, res) => {
  try {
    const { destination, startDate, endDate } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const numDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    console.log("🗓️ Duration:", numDays, "days");

    // Get coordinates of destination
    const { lat, lon } = await getCoordinates(destination);
    console.log("📍 Coordinates:", { lat, lon });

    // Get more results to prevent undefined in slots
    const places = await getPlaces(lat, lon, 50); // Top 50 places
    console.log("📌 Places fetched:", places.length);

    const restaurants = await getRestaurants(lat, lon, 25); // Top 25 restaurants
    console.log("🍽️ Restaurants fetched:", restaurants.length);

    const times = ["9:00 AM", "10:30 AM", "12:00 PM", "3:00 PM", "6:00 PM"];

    const days = [];

    for (let i = 0; i < numDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      const dateStr = currentDate.toISOString().split("T")[0];

      const slots = [];

      for (let j = 0; j < times.length; j++) {
        const isMeal = j === 1 || j === 4;
        const item = isMeal ? restaurants.shift() : places.shift();

        if (item) {
          slots.push({
            time: times[j],
            type: isMeal ? "restaurant" : "place",
            name: item.name || "Unnamed",
            id: item.id || item.xid || null,
            lat: item.point?.lat || item.geometry?.lat || null,
            lon: item.point?.lon || item.geometry?.lon || null,
            image: item.image || null,
          });
        } else {
          slots.push({
            time: times[j],
            type: isMeal ? "restaurant" : "place",
            name: "To be decided",
            id: null,
            lat: null,
            lon: null,
            image: null,
          });
        }
      }

      days.push({ date: dateStr, slots });
    }

    console.log("✅ Itinerary ready!");
    res.json({ days });
  } catch (error) {
    console.error("❌ Error generating itinerary:", error.message);
    res.status(500).json({ message: "Failed to generate itinerary" });
  }
};

module.exports = { generateItinerary };

import axios from 'axios';
import getCoordinates from '../utils/getCoordinates.js';
import getPlaces from '../utils/getPlaces.js';
import getHotelsandRestaurants from '../utils/getHotelsandRestaurants.js';
const generateItinerary = async (req, res) => {
  try {
    console.log("📥 Received request to generate itinerary:", req.body);
    const { destination, startDate, endDate } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const numDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    console.log("🗓️ Duration:", numDays, "days");

    
    const { lat, lon } = await getCoordinates(destination);
    console.log("📍 Coordinates:", { lat, lon });

   
    const places = await getPlaces(lat, lon, 50); 
    console.log("📌 Places fetched:", places.length);

    const { restaurants,hotels } = await getHotelsandRestaurants(lat, lon, 25); 
    console.log("🍽️ Restaurants fetched:", restaurants.length);
    console.log("Hotels fetched: ", hotels.length);
    const placeSlots = [...places];

    const times = ["9:00 AM", "10:30 AM", "12:00 PM", "3:00 PM", "6:00 PM"];

    const days = [];

    for (let i = 0; i < numDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);

      const dateStr = currentDate.toISOString().split("T")[0];

      const slots = [];

      for (let j = 0; j < times.length; j++) {
        const item = placeSlots.shift(); 

        if (item) {
          slots.push({
            time: times[j],
            type: "place",
            name: item.name || "Unnamed",
            id: item.id || item.xid || null,
            lat: item.point?.lat || item.geometry?.lat || null,
            lon: item.point?.lon || item.geometry?.lon || null,
            image: item.image || null,
          });
        } else {
          slots.push({
            time: times[j],
            type: "place",
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
    res.json({ days,hotels,restaurants });
  } catch (error) {
    console.error("❌ Error generating itinerary:", error);
    res.status(500).json({ message: "Failed to generate itinerary" });
  }
};

export default generateItinerary;
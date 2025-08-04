const axios = require("axios");
const getCoordinates = require("../utils/getCoordinates");
const getPlaces = require("../utils/getPlaces");
const generateMockFlights= require("../utils/mockFlights");
const getHotelsandRestaurants = require("../utils/getHotelsandRestaurants");
// Main Search Handler
const flyableDestinations = new Set([
  "Ladakh", "Goa", "Mumbai", "Delhi", "Chennai", "Bangalore", "Kolkata",
  "Jaipur", "Hyderabad", "Pune", "Ahmedabad", "Cochin", "Varanasi", 
  "Lucknow", "Indore", "Surat", "Nagpur", "Ranchi", "Guwahati",
  "Shillong", "Dehradun", "Udaipur", "Shimla", "Manali", "Srinagar",
  "Jodhpur", "Patna", "Raipur", "Chandigarh", "Agra"
]);

const getSearchResults = async (req, res) => {
  console.log("✅ /api/search hit");

  try {
    const { destination, startDate, endDate, fromCity } = req.query;
          const destinationLower = destination.toLowerCase();
  const flyableDestinationsLower = new Set(
        [...flyableDestinations].map(city => city.toLowerCase())
    );
console.log("Destination received:", destination);
console.log("Flyable destinations list has:", flyableDestinations.has(destination));

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
    //hotelsandresto//
    const { restaurants, hotels } = await getHotelsandRestaurants(lat, lon, 25);
    console.log("🍽️ Restaurants fetched:", restaurants.length);
    console.log("🏨 Hotels fetched:", hotels.length);

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

   let flights = [];
let isFlyable = false;
let flightMessage= "";
if (flyableDestinationsLower.has(destinationLower)) { 
        isFlyable = true;
        const departureCity = fromCity || "Delhi";
        flights = generateMockFlights(departureCity, destination); 
}else{
  flightMessage = `${destination} is currently not flyable directly. Please check MakeMyTrip or IRCTC for alternate options.`;
}
res.json({ itinerary, flights, isFlyable, flightMessage, hotels,restaurants });

  } catch (err) {
    console.error("❌ Error in search:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
const getFlightResults = async (req, res) => {
  try {
    const { destination, fromCity } = req.query;

    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }

    if (!flyableDestinations.has(destination)) {
      return res.status(404).json({ error: `Oops! ${destination} is not directly flyable.` });
    }
   const destinationLower = destination.toLowerCase();
    const flyableDestinationsLower = new Set(
        [...flyableDestinations].map(city => city.toLowerCase())
    );

    if (!flyableDestinationsLower.has(destinationLower)) {
      return res.status(404).json({ error: `Oops! ${destination} is not directly flyable.` });
    }
    const from = fromCity || "Delhi";
    const flights = generateMockFlights(from, destination);

    res.json({ flights });

  } catch (err) {
    console.error("Error in getFlightResults:", err.message || err);
    res.status(500).json({ error: "Something went wrong while fetching flights" });
  }
};
module.exports = { getSearchResults, getFlightResults };

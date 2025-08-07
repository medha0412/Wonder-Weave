import axios from 'axios';
import getCoordinates from '../utils/getCoordinates.js';
import getPlaces from '../utils/getPlaces.js';
import generateMockFlights from '../utils/mockFlights.js';
import getHotelsandRestaurants from '../utils/getHotelsandRestaurants.js';
const flyableDestinations = new Set([
  "Ladakh", "Goa", "Mumbai", "Delhi", "Chennai", "Bangalore", "Kolkata",
  "Jaipur", "Hyderabad", "Pune", "Ahmedabad", "Cochin", "Varanasi", 
  "Lucknow", "Indore", "Surat", "Nagpur", "Ranchi", "Guwahati",
  "Shillong", "Dehradun", "Udaipur", "Shimla", "Manali", "Srinagar",
  "Jodhpur", "Patna", "Raipur", "Chandigarh", "Agra"
]);

export const getSearchResults = async (req, res) => {
  console.log("✅ /api/search hit");

   try {
    const { destination, startDate, endDate, fromCity } = req.query;
          

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: "Destination, startDate, and endDate are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const destinationLower = destination.toLowerCase();
    const fromCityLower = fromCity?.toLowerCase();
    const correctedDestination = destination; 
    let flights = [];
    let isFlyable = false;
    let flightMessage = "Flights are not available for this destination.";
     if (flyableDestinations.has(destination)) {
     const correctedFromCity = [...flyableDestinations].find(
      city => city.toLowerCase() === fromCityLower
    ) || "Delhi";

     if (fromCity && fromCityLower === destinationLower) {
      return res.status(400).json({ error: "Departure and destination cities cannot be the same." });
    }
  flights = generateMockFlights(correctedFromCity, destination);
  isFlyable = true;
  flightMessage = "";
}

    const { lat, lon } = await getCoordinates(correctedDestination);
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

res.json({ itinerary, flights, isFlyable, flightMessage, hotels,restaurants });

  } catch (err) {
    console.error("❌ Error in search:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
export const getFlightResults = async (req, res) => {
  try {
    const { destination, fromCity } = req.query;
   
    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }
    const destinationLower = destination.toLowerCase();
    const fromCityLower = fromCity?.toLowerCase();

    const correctedDestination = [...flyableDestinations].find(
      city => city.toLowerCase() === destinationLower
    );
    const correctedFromCity = [...flyableDestinations].find(
      city => city.toLowerCase() === fromCityLower
    ) || "Delhi";

   

    if (correctedDestination.toLowerCase() === correctedFromCity.toLowerCase()) {
      return res.status(400).json({ error: "Departure and destination cities cannot be the same." });
    }

    const flights = generateMockFlights(correctedFromCity, correctedDestination);

    res.json({ flights });

  } catch (err) {
    console.error("Error in getFlightResults:", err.message || err);
    res.status(500).json({ error: "Something went wrong while fetching flights" });
  }
};

   
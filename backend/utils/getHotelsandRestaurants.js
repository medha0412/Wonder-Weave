const axios = require("axios");
const hotelImages = [
  "http://localhost:5000/images/hotel1.jpg",
  "http://localhost:5000/images/hotel2.jpg",
  "http://localhost:5000/images/hotel3.jpg",
  "http://localhost:5000/images/hotel4.jpg",
  "http://localhost:5000/images/hotel5.jpg",
  "http://localhost:5000/images/hotel6.jpg",
  "http://localhost:5000/images/hotel7.jpg",
  "http://localhost:5000/images/hotel8.jpg",

];

const restaurantImages = [
  "http://localhost:5000/images/resto1.jpg",
  "http://localhost:5000/images/resto2.jpg",
  "http://localhost:5000/images/resto3.jpg",
  "http://localhost:5000/images/resto4.jpg",
  "http://localhost:5000/images/resto5.jpg",
  "http://localhost:5000/images/resto6.jpg",
  "http://localhost:5000/images/resto7.jpg",
  "http://localhost:5000/images/resto8.jpg",
];
const getHotelsandRestaurants = async (lat, lon, limit = 20) => {
    const API_KEY = process.env.GEOAPIFY_API_KEY;
   const radius = 10000; 

  const categories = [
    { name: "restaurant", filter: "catering.restaurant" },
    { name: "hotel", filter: "accommodation.hotel" },
  ];

  const results = {
    restaurants: [],
    hotels: [],
  };

  for (const category of categories) {
    try {
      const response = await axios.get(
        "https://api.geoapify.com/v2/places",
        {
          params: {
            categories: category.filter,
            filter: `circle:${lon},${lat},${radius}`,
            bias: `proximity:${lon},${lat}`,
            limit,
            apiKey: API_KEY,
          },
        }
      );
       const places = response.data.features.map((item,index) => ({
        id: item.properties.place_id,
        name: item.properties.name || `Unnamed ${category.name}`,
        lat: item.geometry.coordinates[1],
        lon: item.geometry.coordinates[0],
        type: category.name,
        image: category.name === "hotel"
            ? hotelImages[index % hotelImages.length]
            : restaurantImages[index % restaurantImages.length],
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      }));
     
     

      results[category.name + "s"] = places;

    } catch (err) {
      console.error(`❌ Failed to fetch ${category.name}s:`, err.message);
    }
  }

  return results;
};

module.exports = getHotelsandRestaurants;
  
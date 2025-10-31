import axios from "axios";
const hotelImages = [
  "https://wonder-weave-1.onrender.com/images/hotel1.jpg",
  "https://wonder-weave-1.onrender.com/images/hotel2.jpg",
  "https://wonder-weave-1.onrender.com/images/hotel3.jpg",
  "https://wonder-weave-1.onrender.com/images/hotel4.jpg",
  "https://wonder-weave-1.onrender.com/images/hotel5.jpg",
  "https://wonder-weave-1.onrender.com/images/hotel6.jpg",
  "https://wonder-weave-1.onrender.com/images/hotel7.jpg",
  "https://wonder-weave-1.onrender.com/images/hotel8.jpg",

];

const restaurantImages = [
  "https://wonder-weave-1.onrender.com/images/resto1.jpg",
  "https://wonder-weave-1.onrender.com/images/resto2.jpg",
  "https://wonder-weave-1.onrender.com/images/resto3.jpg",
  "https://wonder-weave-1.onrender.com/images/resto4.jpg",
  "https://wonder-weave-1.onrender.com/images/resto5.jpg",
  "https://wonder-weave-1.onrender.com/images/resto6.jpg",
  "https://wonder-weave-1.onrender.com/images/resto7.jpg",
  "https://wonder-weave-1.onrender.com/images/resto8.jpg",
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
          timeout: 8000,
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
         address: item.properties.formatted || "Address not available",
      }));
     
     

      results[category.name + "s"] = places;

    } catch (err) {
console.error(`❌ Failed to fetch ${category.name}s:`, err.response?.data || err.message || err);
    }
  }

  return results;
};

export default getHotelsandRestaurants;  
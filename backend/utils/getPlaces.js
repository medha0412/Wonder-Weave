import axios from "axios";
import { openTripMapApiKey, geoapifyApiKey } from "../config/config.js";

// Utility to fetch from OpenTripMap
const fetchFromOpenTripMap = async (lat, lon, limit) => {
  console.log("🔑 OpenTripMap API Key:", openTripMapApiKey);
console.log("🔑 Geoapify API Key:", geoapifyApiKey);

  try {
    const radius = 10000;

    const response = await axios.get("https://api.opentripmap.com/0.1/en/places/radius", {
      params: {
        radius,
        lon,
        lat,
        rate: 1,
        format: "json",
        limit,
        apikey: openTripMapApiKey,
      },
    });

    return response.data.map((place) => ({
      xid: place.xid,
      name: place.name,
      kinds: place.kinds,
      point: place.point,
      distance: place.dist,
    }));
  } catch (error) {
    console.error("❌ OpenTripMap error:", error.message);
    return [];
  }
};

// Utility to fetch from Geoapify
const fetchFromGeoapify = async (lat, lon, limit) => {
  try {
    const response = await axios.get("https://api.geoapify.com/v2/places", {
      params: {
        categories: "tourism.sights",
        filter: `circle:${lon},${lat},10000`,
        bias: `proximity:${lon},${lat}`,
        limit,
        apiKey: geoapifyApiKey,
      },
    });

    return response.data.features.map((place) => ({
      id: place.properties.place_id,
      name: place.properties.name || "Unnamed Place",
      categories: place.properties.categories?.join(", "),
      distance: place.properties.distance,
      point: {
        lat: place.geometry.coordinates[1],
        lon: place.geometry.coordinates[0],
      },
    }));
  } catch (error) {
    console.error("❌ Geoapify error:", error.message);
    return [];
  }
};

// Main function used by controller
const getPlaces = async (lat, lon, limit = 50) => {
  let places = await fetchFromOpenTripMap(lat, lon, limit);

  if (!places || places.length === 0) {
    console.log("⚠️ No results from OpenTripMap, trying Geoapify...");
    places = await fetchFromGeoapify(lat, lon, limit);
  } else {
    console.log("✅ OpenTripMap returned", places.length, "places.");
  }

  return places;
};

export default getPlaces;
import axios from "axios";
import { openTripMapApiKey, geoapifyApiKey } from "../config/config.js";

const RADIUS_STEPS_METERS = [5000, 12000, 25000];
const DEFAULT_MIN_NEEDED = 15;

const fetchFromOpenTripMap = async (lat, lon, limit, radius) => {
  try {
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
      timeout: 8000,
    });
    const data = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.features)
        ? response.data.features
        : [];

    return data.map((place) => ({
      source: "otm",
      id: place.xid || place.properties?.xid || place.id,
      name: place.name || place.properties?.name,
      kinds: place.kinds || place.properties?.kinds,
      point: place.point || (place.geometry ? { lat: place.geometry.coordinates?.[1], lon: place.geometry.coordinates?.[0] } : undefined),
      distance: place.dist || place.properties?.dist || place.properties?.distance,
    }));
  } catch (error) {
    console.error("❌ OpenTripMap error:", error.response?.data || error.message || error);
    return [];
  }
};

const fetchFromGeoapify = async (lat, lon, limit, radius) => {
  try {
    const response = await axios.get("https://api.geoapify.com/v2/places", {
      params: {
        // Use only supported categories (based on Geoapify response)
        categories: [
          "entertainment.museum",
          "entertainment.zoo",
          "entertainment.planetarium",
          "entertainment.cinema",
          "entertainment.culture.gallery",
          "entertainment.culture.theatre",
          "entertainment.culture.arts_centre",
          "beach",
          "building.historic",
          "building.place_of_worship"
        ].join(","),
        filter: `circle:${lon},${lat},${radius}`,
        bias: `proximity:${lon},${lat}`,
        limit,
        apiKey: geoapifyApiKey,
      },
      timeout: 8000,
    });

    const features = Array.isArray(response.data?.features) ? response.data.features : [];
    return features.map((place) => ({
      source: "geo",
      id: String(place.properties.place_id),
      name: place.properties.name,
      categories: place.properties.categories?.join(", "),
      distance: place.properties.distance,
      point: {
        lat: place.geometry.coordinates[1],
        lon: place.geometry.coordinates[0],
      },
    }));
  } catch (error) {
    console.error("❌ Geoapify error:", error.response?.data || error.message || error);
    return [];
  }
};

function dedupePlaces(places) {
  const seen = new Map();
  for (const place of places) {
    const key = (place.name || "").toLowerCase().trim() || place.id;
    if (!key) continue;
    if (!seen.has(key)) seen.set(key, place);
  }
  return Array.from(seen.values());
}

// Fetch progressively widening radius and merge until we have at least minNeeded
const getPlaces = async (lat, lon, minNeeded = DEFAULT_MIN_NEEDED) => {
  const limitPerCall = 60;
  let aggregated = [];

  for (const radius of RADIUS_STEPS_METERS) {
    const [otm, geo] = await Promise.all([
      fetchFromOpenTripMap(lat, lon, limitPerCall, radius),
      fetchFromGeoapify(lat, lon, limitPerCall, radius),
    ]);

    // filter out unnamed before merging
    const namedOtm = otm.filter((p) => p.name && p.name.trim().length > 0);
    const namedGeo = geo.filter((p) => p.name && p.name.trim().length > 0);

    aggregated = dedupePlaces([...aggregated, ...namedOtm, ...namedGeo]);

    if (aggregated.length >= minNeeded) break;
  }

  // Final wider attempt via OpenTripMap if still not enough
  if (aggregated.length < minNeeded) {
    try {
      const extra = await fetchFromOpenTripMap(lat, lon, 120, 70000);
      const namedExtra = extra.filter((p) => p.name && p.name.trim().length > 0);
      aggregated = dedupePlaces([...aggregated, ...namedExtra]);
    } catch (_) {}
  }

  return aggregated;
};

export default getPlaces;
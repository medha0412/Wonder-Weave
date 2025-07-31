const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

// Print keys for debugging
console.log("✅ .env loaded keys:", {
  openTripMap: process.env.OPENTRIPMAP_API_KEY,
  geoapify: process.env.GEOAPIFY_API_KEY,
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  skyScraperApiKey: process.env.SKY_SCRAPER_API_KEY,
  openTripMapApiKey: process.env.OPENTRIPMAP_API_KEY,
  geoapifyApiKey: process.env.GEOAPIFY_API_KEY,
};

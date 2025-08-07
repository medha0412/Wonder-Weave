import dotenv from 'dotenv';
dotenv.config();
import mongoose  from 'mongoose';
console.log("✅ .env loaded keys:", {
  openTripMap: process.env.OPENTRIPMAP_API_KEY,
  geoapify: process.env.GEOAPIFY_API_KEY,
});

export const connectDB = async () => {
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

export const mongoURI = process.env.MONGO_URI;
export const jwtSecret = process.env.JWT_SECRET;
export const skyScraperApiKey = process.env.SKY_SCRAPER_API_KEY;
export const openTripMapApiKey = process.env.OPENTRIPMAP_API_KEY;
export const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
import express from 'express';
import { getSearchResults, getFlightResults, } from "../controllers/searchController.js";
const router = express.Router();

router.get("/search", getSearchResults);
router.get("/search/flights", getFlightResults); 
export default router;
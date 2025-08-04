const express = require("express");
const router = express.Router();
const { getSearchResults, getFlightResults, } = require("../controllers/searchController");

router.get("/search", getSearchResults);
router.get("/search/flights", getFlightResults); 
module.exports = router;

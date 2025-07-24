const express = require("express");
const router = express.Router();
const { getSearchResults } = require("../controllers/searchController");

router.get("/search", getSearchResults);

module.exports = router;

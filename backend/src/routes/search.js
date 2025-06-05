const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const auth = require("../middleware/auth");

// Search phone numbers route
router.get("/", auth, searchController.search);

module.exports = router;

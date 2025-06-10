// Search routes for phone number search
const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const auth = require("../middleware/auth");

// GET /api/search?tel_num=...
router.get("/", auth, searchController.searchByTelNum);

module.exports = router;

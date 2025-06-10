// Route for stats (optional)
const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const auth = require("../middleware/auth");

// GET /api/stats
router.get("/", auth, statsController.getStats);

module.exports = router;

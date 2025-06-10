// Auth routes for login and token verification
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/verify
router.get("/verify", auth, authController.verifyToken);

module.exports = router;

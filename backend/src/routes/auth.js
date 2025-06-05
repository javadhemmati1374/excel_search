const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Login route
router.post("/login", authController.login);

// Logout route
router.post("/logout", auth, authController.logout);

// Verify token route
router.get("/verify", auth, authController.verify);

module.exports = router;

// Routes for listing and deleting uploaded files
const express = require("express");
const router = express.Router();
const filesController = require("../controllers/filesController");
const auth = require("../middleware/auth");

// GET /api/files
router.get("/", auth, filesController.listFiles);

// DELETE /api/files/:id
router.delete("/:id", auth, filesController.deleteFile);

module.exports = router;

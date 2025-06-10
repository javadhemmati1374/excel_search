// Upload routes for Excel file upload
const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const auth = require("../middleware/auth");
const multerMiddleware = require("../middleware/multer");

// POST /api/upload
router.post(
  "/",
  auth,
  multerMiddleware.single("file"),
  uploadController.uploadFile
);

module.exports = router;

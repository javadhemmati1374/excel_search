const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");

// Upload file
router.post("/", auth, upload.single("file"), uploadController.uploadFile);

// Get all files
router.get("/", auth, uploadController.getFiles);

// Delete file
router.delete("/:id", auth, uploadController.deleteFile);

module.exports = router;

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const searchRoutes = require("./routes/search");
const filesRoutes = require("./routes/files");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadPath = process.env.UPLOAD_PATH || "./uploads";
if (!require("fs").existsSync(uploadPath)) {
  require("fs").mkdirSync(uploadPath, { recursive: true });
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/files", filesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

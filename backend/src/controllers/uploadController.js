const db = require("../config/database");
const { parseExcelFile } = require("../services/excelParser");
const fs = require("fs").promises;

const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Create file record
    const result = await db.query(
      "INSERT INTO files (filename, user_id) VALUES ($1, $2) RETURNING id",
      [req.file.filename, req.user.id]
    );

    const fileId = result.rows[0].id;

    // Process file asynchronously
    parseExcelFile(req.file.path, fileId).catch((error) => {
      console.error("Error processing file:", error);
    });

    res.json({
      message: "File uploaded successfully",
      fileId,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
};

const getFiles = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM files WHERE user_id = $1 ORDER BY upload_date DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({ message: "Error fetching files" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    // Get file info
    const fileResult = await db.query(
      "SELECT filename FROM files WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete file record (phone_data records will be deleted via CASCADE)
    await db.query("DELETE FROM files WHERE id = $1", [id]);

    // Delete physical file
    try {
      await fs.unlink(
        `${process.env.UPLOAD_PATH}/${fileResult.rows[0].filename}`
      );
    } catch (error) {
      console.error("Error deleting physical file:", error);
    }

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ message: "Error deleting file" });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  deleteFile,
};

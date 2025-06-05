const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const xlsx = require("xlsx");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(new Error("فقط فایل‌های اکسل مجاز هستند"));
    }
  },
});

// Get all files
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, filename, original_filename, created_at FROM files ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({
      error: "خطا در دریافت لیست فایل‌ها",
      details: error.message,
    });
  }
});

// Upload a file
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "هیچ فایلی آپلود نشده است" });
  }

  try {
    // Read Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert file record
      const fileResult = await client.query(
        "INSERT INTO files (filename, original_filename, filepath) VALUES ($1, $2, $3) RETURNING id",
        [req.file.filename, req.file.originalname, req.file.path]
      );
      const fileId = fileResult.rows[0].id;

      // Process data in batches
      const batchSize = 1000;
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);

        // Prepare values for both tables
        const excelValues = batch.map((row) => ({
          file_id: fileId,
          data: JSON.stringify(row),
        }));

        const phoneValues = batch.map((row) => ({
          file_id: fileId,
          reg_province: row.RegProvince || null,
          reg_city: row.RegCity || null,
          address: row.Address || null,
          city: row.City || null,
          parent_classification_name: row.ParentClassificationName || null,
          classification_name: row.ClassificationName || null,
          custom_title: row.CustomTitle || null,
          tel_num: row.TelNum || null,
        }));

        // Insert into excel_data
        for (const value of excelValues) {
          await client.query(
            "INSERT INTO excel_data (file_id, data) VALUES ($1, $2)",
            [value.file_id, value.data]
          );
        }

        // Insert into phone_data
        for (const value of phoneValues) {
          await client.query(
            `INSERT INTO phone_data 
            (file_id, reg_province, reg_city, address, city, parent_classification_name, classification_name, custom_title, tel_num)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              value.file_id,
              value.reg_province,
              value.reg_city,
              value.address,
              value.city,
              value.parent_classification_name,
              value.classification_name,
              value.custom_title,
              value.tel_num,
            ]
          );
        }
      }

      await client.query("COMMIT");
      res.json({
        message: "فایل با موفقیت آپلود شد",
        fileId: fileId,
        rowCount: data.length,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({
      error: "خطا در آپلود فایل",
      details: error.message,
    });
  }
});

// Delete a file
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // دریافت اطلاعات فایل
      const fileResult = await client.query(
        "SELECT filepath FROM files WHERE id = $1",
        [id]
      );

      if (fileResult.rows.length === 0) {
        return res.status(404).json({ error: "فایل یافت نشد" });
      }

      const filepath = fileResult.rows[0].filepath;

      // حذف داده‌های اکسل مرتبط
      await client.query("DELETE FROM excel_data WHERE file_id = $1", [id]);

      // حذف فایل از سیستم فایل
      try {
        await fs.unlink(filepath);
      } catch (error) {
        console.error("Error deleting file from filesystem:", error);
      }

      // حذف رکورد از دیتابیس
      await client.query("DELETE FROM files WHERE id = $1", [id]);

      await client.query("COMMIT");
      res.json({ message: "فایل با موفقیت حذف شد" });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({
      error: "خطا در حذف فایل",
      details: error.message,
    });
  }
});

module.exports = router;

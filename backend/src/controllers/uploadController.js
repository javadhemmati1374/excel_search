const fs = require("fs");
const File = require("../models/File");
const PhoneData = require("../models/PhoneData");
const excelParser = require("../services/excelParser");

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { originalname, path: filePath, size } = req.file;
  const userId = req.user.user.id;

  let fileRecord;
  try {
    fileRecord = await File.create({
      filename: originalname,
      originalFilename: originalname,
      userId: userId,
      fileSize: size,
    });

    const parsedData = excelParser.parseExcelFile(filePath);
    const totalRecords = parsedData.length;

    await File.updateProcessingStats(fileRecord.id, totalRecords, 0);
    await File.updateStatus(fileRecord.id, "processing");

    const BATCH_SIZE = 5000;
    let processedRecords = 0;

    for (let i = 0; i < totalRecords; i += BATCH_SIZE) {
      const batch = parsedData.slice(i, i + BATCH_SIZE);
      const insertedCount = await PhoneData.batchInsert(fileRecord.id, batch);
      processedRecords += insertedCount;
      await File.updateProcessingStats(
        fileRecord.id,
        totalRecords,
        processedRecords
      );
    }

    await File.updateStatus(fileRecord.id, "completed");

    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting temporary file:", err);
    });

    res.status(200).json({
      message: "File uploaded and processed successfully",
      file: fileRecord,
    });
  } catch (error) {
    console.error("File upload/processing error:", error);
    if (fileRecord && fileRecord.id) {
      await File.updateStatus(fileRecord.id, "failed", error.message);
    }

    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err)
          console.error("Error deleting temporary file after failure:", err);
      });
    }
    res
      .status(500)
      .json({ message: "Error processing file", error: error.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const userId = req.user.user.id;
    const files = await File.getAll(userId);
    res.json(files);
  } catch (error) {
    console.error("Error getting files:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteFile = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await File.delete(id);
    if (!result.deletedFile) {
      return res.status(404).json({ message: "File not found" });
    }
    res.json({
      message: "File and associated data deleted successfully",
      deletedRecords: result.deletedRecords,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const XLSX = require("xlsx");
const db = require("../config/database");

const parseExcelFile = async (filePath, fileId) => {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Update total records count
    await db.query("UPDATE files SET total_records = $1 WHERE id = $2", [
      data.length,
      fileId,
    ]);

    // Process data in batches
    const batchSize = 1000;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      // Prepare batch insert
      const values = batch.map((row) => ({
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

      // Insert batch
      await db.query(
        `INSERT INTO phone_data 
        (file_id, reg_province, reg_city, address, city, parent_classification_name, classification_name, custom_title, tel_num)
        VALUES ${values
          .map(
            (_, index) =>
              `($${index * 9 + 1}, $${index * 9 + 2}, $${index * 9 + 3}, $${
                index * 9 + 4
              }, $${index * 9 + 5}, $${index * 9 + 6}, $${index * 9 + 7}, $${
                index * 9 + 8
              }, $${index * 9 + 9})`
          )
          .join(", ")}`,
        values.flatMap((v) => [
          v.file_id,
          v.reg_province,
          v.reg_city,
          v.address,
          v.city,
          v.parent_classification_name,
          v.classification_name,
          v.custom_title,
          v.tel_num,
        ])
      );

      // Update processed records count
      await db.query("UPDATE files SET processed_records = $1 WHERE id = $2", [
        Math.min(i + batchSize, data.length),
        fileId,
      ]);
    }

    // Update file status to completed
    await db.query("UPDATE files SET status = $1 WHERE id = $2", [
      "completed",
      fileId,
    ]);

    return true;
  } catch (error) {
    console.error("Excel parsing error:", error);

    // Update file status to failed
    await db.query("UPDATE files SET status = $1 WHERE id = $2", [
      "failed",
      fileId,
    ]);

    throw error;
  }
};

module.exports = {
  parseExcelFile,
};

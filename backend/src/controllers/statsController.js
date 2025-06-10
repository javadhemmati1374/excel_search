// Controller for stats endpoint
const { query } = require("../config/database");

exports.getStats = async (req, res) => {
  try {
    const totalRecords = await query("SELECT COUNT(*) FROM phone_data");
    const totalFiles = await query("SELECT COUNT(*) FROM files");
    res.json({
      total_records: parseInt(totalRecords.rows[0].count),
      total_files: parseInt(totalFiles.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

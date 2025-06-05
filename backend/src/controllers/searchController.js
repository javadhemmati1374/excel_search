const db = require("../config/database");

const search = async (req, res) => {
  try {
    const { tel_num } = req.query;

    if (!tel_num) {
      return res.status(400).json({ message: "شماره تلفن الزامی است" });
    }

    // Normalize phone number (remove spaces, dashes, etc.)
    const normalizedTelNum = tel_num.replace(/[\s-]/g, "");

    // Search with exact match and partial match in one query
    const result = await db.query(
      `SELECT 
        pd.*,
        f.original_filename,
        f.created_at as file_upload_date
       FROM phone_data pd 
       JOIN files f ON pd.file_id = f.id 
       WHERE 
         pd.tel_num = $1 
         OR pd.tel_num LIKE $2
       ORDER BY 
         CASE 
           WHEN pd.tel_num = $1 THEN 1 
           ELSE 2 
         END,
         f.created_at DESC
       LIMIT 20`,
      [normalizedTelNum, `${normalizedTelNum}%`]
    );

    if (result.rows.length === 0) {
      return res.json({
        message: "نتیجه‌ای یافت نشد",
        results: [],
      });
    }

    res.json({
      message: "جستجو با موفقیت انجام شد",
      results: result.rows,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      message: "خطا در جستجو",
      error: error.message,
    });
  }
};

module.exports = {
  search,
};

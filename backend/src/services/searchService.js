// Service for searching phone_data by tel_num
const { query } = require("../config/database");

exports.searchByTelNum = async (tel_num) => {
  // استفاده از ایندکس و جستجوی دقیق یا پیشوندی
  const sql = `SELECT * FROM phone_data WHERE tel_num = $1 OR tel_num LIKE $2 LIMIT 100`;
  const params = [tel_num, `${tel_num}%`];
  const result = await query(sql, params);
  return result.rows;
};

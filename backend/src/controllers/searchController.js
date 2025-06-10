// Controller for searching phone_data by tel_num
const searchService = require("../services/searchService");

exports.searchByTelNum = async (req, res) => {
  const { tel_num } = req.query;
  if (!tel_num) {
    return res.status(400).json({ message: "tel_num is required" });
  }
  try {
    const results = await searchService.searchByTelNum(tel_num);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Controller for listing and deleting files
const File = require("../models/File");

exports.listFiles = async (req, res) => {
  try {
    const files = await File.getAll();
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteFile = async (req, res) => {
  const { id } = req.params;
  try {
    await File.deleteById(id);
    res.json({ message: "File and related data deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

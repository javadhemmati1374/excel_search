const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log("LOGIN BODY:", req.body);

  try {
    const user = await User.findByUsername(username);
    console.log("USER FROM DB:", user);
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await User.verifyPassword(password, user.password_hash);
    console.log("BCRYPT RESULT:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.verifyToken = (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
};

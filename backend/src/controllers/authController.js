const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Get user from database
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password_hash = $2",
      [username, password]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  // Since we're using JWT, we don't need to do anything on the server
  // The client will remove the token
  res.json({ message: "Logged out successfully" });
};

const verify = (req, res) => {
  // If we reach here, the token is valid (auth middleware already verified it)
  res.json({ message: "Token is valid" });
};

module.exports = {
  login,
  logout,
  verify,
};

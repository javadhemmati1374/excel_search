const { query } = require("../config/database");
const bcrypt = require("bcrypt");

class User {
  static async findByUsername(username) {
    try {
      const result = await query(
        "SELECT id, username, password_hash FROM users WHERE username = $1",
        [username]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding user by username:", error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await query(
        "SELECT id, username FROM users WHERE id = $1",
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error("Error verifying password:", error);
      throw error;
    }
  }
}

module.exports = User;

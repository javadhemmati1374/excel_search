const { query, getClient } = require("../config/database");

class File {
  static async create(fileData) {
    try {
      const { filename, originalFilename, userId, fileSize = 0 } = fileData;

      const result = await query(
        `INSERT INTO files (filename, original_filename, user_id, file_size, status) 
         VALUES ($1, $2, $3, $4, 'uploaded') 
         RETURNING *`,
        [filename, originalFilename, userId, fileSize]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error creating file record:", error);
      throw error;
    }
  }

  static async updateStatus(fileId, status, errorMessage = null) {
    try {
      const result = await query(
        `UPDATE files 
         SET status = $1, error_message = $2 
         WHERE id = $3 
         RETURNING *`,
        [status, errorMessage, fileId]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error updating file status:", error);
      throw error;
    }
  }

  static async updateProcessingStats(fileId, totalRecords, processedRecords) {
    try {
      const result = await query(
        `UPDATE files 
         SET total_records = $1, processed_records = $2 
         WHERE id = $3 
         RETURNING *`,
        [totalRecords, processedRecords, fileId]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Error updating processing stats:", error);
      throw error;
    }
  }

  static async getAll(userId = null) {
    try {
      let queryText = `
        SELECT f.*, 
               COUNT(pd.id) as actual_records
        FROM files f
        LEFT JOIN phone_data pd ON f.id = pd.file_id
      `;
      let params = [];

      if (userId) {
        queryText += " WHERE f.user_id = $1";
        params.push(userId);
      }

      queryText += " GROUP BY f.id ORDER BY f.upload_date DESC";

      const result = await query(queryText, params);
      return result.rows;
    } catch (error) {
      console.error("Error getting files:", error);
      throw error;
    }
  }

  static async delete(fileId) {
    const client = await getClient();

    try {
      await client.query("BEGIN");

      const countResult = await client.query(
        "SELECT COUNT(*) as count FROM phone_data WHERE file_id = $1",
        [fileId]
      );

      const deleteResult = await client.query(
        "DELETE FROM files WHERE id = $1 RETURNING *",
        [fileId]
      );

      await client.query("COMMIT");

      return {
        deletedFile: deleteResult.rows[0],
        deletedRecords: parseInt(countResult.rows[0].count),
      };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error deleting file:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async deleteById(fileId) {
    return await this.delete(fileId);
  }
}

module.exports = File;

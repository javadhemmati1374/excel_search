const { query, getClient } = require("../config/database");

class PhoneData {
  static async batchInsert(fileId, dataArray) {
    const client = await getClient();

    try {
      await client.query("BEGIN");

      const batchSize = 1000;
      let totalInserted = 0;

      for (let i = 0; i < dataArray.length; i += batchSize) {
        const batch = dataArray.slice(i, i + batchSize);

        const values = [];
        const placeholders = [];

        batch.forEach((row, index) => {
          const baseIndex = index * 9;
          placeholders.push(
            `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${
              baseIndex + 4
            }, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${
              baseIndex + 8
            }, $${baseIndex + 9})`
          );

          values.push(
            fileId,
            row.reg_province || null,
            row.reg_city || null,
            row.address || null,
            row.city || null,
            row.parent_classification_name || null,
            row.classification_name || null,
            row.custom_title || null,
            row.tel_num || null
          );
        });

        const insertQuery = `
          INSERT INTO phone_data (
            file_id, reg_province, reg_city, address, city, 
            parent_classification_name, classification_name, custom_title, tel_num
          ) VALUES ${placeholders.join(", ")}
        `;

        const result = await client.query(insertQuery, values);
        totalInserted += result.rowCount;

        await client.query(
          "UPDATE files SET processed_records = $1 WHERE id = $2",
          [totalInserted, fileId]
        );
      }

      await client.query("COMMIT");
      return totalInserted;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error in batch insert:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async searchByTelNum(telNum, limit = 100, offset = 0) {
    try {
      let searchQuery = `
        SELECT pd.*, f.original_filename, f.upload_date
        FROM phone_data pd
        JOIN files f ON pd.file_id = f.id
        WHERE pd.tel_num = $1
        ORDER BY pd.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      let result = await query(searchQuery, [telNum, limit, offset]);

      if (result.rows.length === 0) {
        searchQuery = `
          SELECT pd.*, f.original_filename, f.upload_date
          FROM phone_data pd
          JOIN files f ON pd.file_id = f.id
          WHERE pd.tel_num LIKE $1
          ORDER BY pd.created_at DESC
          LIMIT $2 OFFSET $3
        `;

        result = await query(searchQuery, [`%${telNum}%`, limit, offset]);
      }

      const countQuery = `
        SELECT COUNT(*) as total
        FROM phone_data pd
        WHERE pd.tel_num = $1 OR pd.tel_num LIKE $2
      `;

      const countResult = await query(countQuery, [telNum, `%${telNum}%`]);

      return {
        data: result.rows,
        total: parseInt(countResult.rows[0].total),
        limit,
        offset,
      };
    } catch (error) {
      console.error("Error searching phone data:", error);
      throw error;
    }
  }

  static async getStats() {
    try {
      const result = await query(`
        SELECT 
          COUNT(*) as total_records,
          COUNT(DISTINCT tel_num) as unique_phone_numbers,
          COUNT(DISTINCT city) as unique_cities,
          COUNT(DISTINCT classification_name) as unique_classifications
        FROM phone_data
      `);

      return result.rows[0];
    } catch (error) {
      console.error("Error getting phone data stats:", error);
      throw error;
    }
  }
}

module.exports = PhoneData;

const fs = require("fs").promises;
const path = require("path");
const pool = require("../config/database");

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Read and execute the migration file
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "create_excel_data_table.sql"
    );
    const migrationSQL = await fs.readFile(migrationPath, "utf8");

    await client.query(migrationSQL);

    await client.query("COMMIT");
    console.log("Migration completed successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(console.error);

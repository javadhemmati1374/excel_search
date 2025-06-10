const fs = require("fs");
const path = require("path");
const { pool } = require("./config/database");

async function runInitSql() {
  const sqlPath = path.join(__dirname, "init.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  try {
    await pool.query(sql);
    console.log("✅ Database tables created successfully.");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
    process.exit(1);
  }

  const indexesPath = path.join(__dirname, "indexes.sql");
  if (fs.existsSync(indexesPath)) {
    const indexesSql = fs.readFileSync(indexesPath, "utf8");
    try {
      await pool.query(indexesSql);
      console.log("✅ Indexes created successfully.");
    } catch (err) {
      console.error("❌ Error creating indexes:", err);
      process.exit(1);
    }
  } else {
    console.log("⚠️  indexes.sql file not found, skipping index creation.");
  }

  await pool.end();
}

runInitSql();

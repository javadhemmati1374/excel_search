const { Pool } = require("pg");
require("dotenv").config();

// First connect to postgres database to create our database
const initialPool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: "postgres", // Connect to default postgres database
  user: process.env.DB_USER || "postgres", // Use postgres superuser
  password: process.env.DB_PASSWORD || "postgres", // Use postgres superuser password
});

// Create database if it doesn't exist
const createDatabase = async () => {
  const client = await initialPool.connect();
  try {
    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'excel_search_db'"
    );

    if (result.rows.length === 0) {
      // Create database if it doesn't exist with UTF8 encoding
      await client.query(
        "CREATE DATABASE excel_search_db WITH ENCODING 'UTF8' LC_COLLATE='en_US.UTF-8' LC_CTYPE='en_US.UTF-8' TEMPLATE=template0"
      );
      console.log("Database created successfully");
    } else {
      console.log("Database already exists");
    }
  } catch (error) {
    console.error("Error creating database:", error);
    throw error;
  } finally {
    client.release();
    await initialPool.end();
  }
};

// Main database pool
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "excel_search_db",
  user: process.env.DB_USER || "postgres", // Use postgres superuser
  password: process.env.DB_PASSWORD || "postgres", // Use postgres superuser password
});

// Initialize database
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // Drop existing tables if they exist
    await client.query(`
      DROP TABLE IF EXISTS excel_data;
      DROP TABLE IF EXISTS phone_data;
      DROP TABLE IF EXISTS files;
      DROP TABLE IF EXISTS users;
    `);

    // Create users table
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
      );
    `);

    // Create files table
    await client.query(`
      CREATE TABLE files (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        filepath VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create excel_data table
    await client.query(`
      CREATE TABLE excel_data (
        id SERIAL PRIMARY KEY,
        file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_excel_data_file_id ON excel_data(file_id);
    `);

    // Create phone_data table with proper column types
    await client.query(`
      CREATE TABLE phone_data (
        id SERIAL PRIMARY KEY,
        file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
        reg_province VARCHAR(255),
        reg_city VARCHAR(255),
        address TEXT,
        city VARCHAR(255),
        parent_classification_name VARCHAR(255),
        classification_name VARCHAR(255),
        custom_title VARCHAR(255),
        tel_num VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_phone_data_tel_num ON phone_data(tel_num);
    `);

    // Create admin user
    await client.query(`
      INSERT INTO users (username, password_hash)
      VALUES ('admin', '123');
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  } finally {
    client.release();
  }
};

// Initialize everything
const initialize = async () => {
  try {
    await createDatabase();
    // Wait a bit for the database to be fully created
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await initializeDatabase();
    console.log("Database setup completed successfully");
  } catch (error) {
    console.error("Error during database setup:", error);
    process.exit(1);
  }
};

// Run initialization
initialize();

module.exports = pool;

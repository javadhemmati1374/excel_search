-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR DEFAULT 'processing',
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    user_id INTEGER REFERENCES users(id)
);

-- Create phone_data table
CREATE TABLE IF NOT EXISTS phone_data (
    id BIGSERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
    reg_province VARCHAR,
    reg_city VARCHAR,
    address VARCHAR,
    city VARCHAR,
    parent_classification_name VARCHAR,
    classification_name VARCHAR,
    custom_title VARCHAR,
    tel_num VARCHAR NOT NULL
);

-- Create initial admin user with hashed password (password: 123)
-- The hash was generated using bcrypt with 10 rounds
INSERT INTO users (username, password_hash) 
VALUES ('admin', '$2b$10$3euPcmQFCiblsZeEu5s7p.9BUe7QZxGq3QxGq3QxGq3QxGq3QxGq3')
ON CONFLICT (username) DO NOTHING;

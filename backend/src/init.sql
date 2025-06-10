-- ایجاد جداول دیتابیس مطابق با مستندات
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_size INTEGER,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'processing',
    error_message TEXT,
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    user_id INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS phone_data (
    id BIGSERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
    reg_province VARCHAR(255),
    reg_city VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    parent_classification_name VARCHAR(255),
    classification_name VARCHAR(255),
    custom_title VARCHAR(255),
    tel_num VARCHAR(50) NOT NULL
);

-- درج کاربر اولیه (admin/admin) با پسورد هش شده 
INSERT INTO users (username, password_hash) VALUES ('admin', '$2b$10$hfFpcIaTUHarERjN1dTk0u4Jm8qQOJUjN73CNm9x8WYGWyi6yeScm') ON CONFLICT (username) DO NOTHING;
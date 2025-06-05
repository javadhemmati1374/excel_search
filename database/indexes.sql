-- Create B-tree index on tel_num for efficient exact and prefix searches
CREATE INDEX IF NOT EXISTS idx_phone_data_tel_num ON phone_data (tel_num);

-- Create index on file_id for faster joins and cascading deletes
CREATE INDEX IF NOT EXISTS idx_phone_data_file_id ON phone_data (file_id);

-- Create index on user_id in files table for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files (user_id);

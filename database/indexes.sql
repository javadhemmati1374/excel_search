-- ایندکس B-tree برای جستجوی سریع شماره تلفن
CREATE INDEX IF NOT EXISTS idx_phone_data_tel_num ON phone_data (tel_num);

-- ایندکس برای جستجوی پیشوندی شماره تلفن
CREATE INDEX IF NOT EXISTS idx_phone_data_tel_num_prefix ON phone_data (tel_num varchar_pattern_ops);

-- ایندکس برای فیلتر بر اساس فایل
CREATE INDEX IF NOT EXISTS idx_phone_data_file_id ON phone_data (file_id);

-- ایندکس ترکیبی برای جستجوی بهینه
CREATE INDEX IF NOT EXISTS idx_phone_data_file_tel ON phone_data (file_id, tel_num);

-- بهینه‌سازی آمار جداول
ANALYZE phone_data;
ANALYZE files;
ANALYZE users;

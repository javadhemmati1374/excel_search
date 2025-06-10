export interface PhoneData {
  id: number;
  file_id: number;
  reg_province: string;
  reg_city: string;
  address: string;
  city: string;
  parent_classification_name: string;
  classification_name: string;
  custom_title: string;
  tel_num: string;
  [key: string]: string | number;
}

export interface FileRecord {
  id: number;
  filename: string;
  upload_date: string;
  status: string;
  total_records: number;
  processed_records: number;
  user_id: number;
}

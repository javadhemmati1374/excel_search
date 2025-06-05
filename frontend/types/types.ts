// frontend/types.ts
export interface PhoneData {
  id: number;
  file_id: number;
  reg_province: string | null;
  reg_city: string | null;
  address: string | null;
  city: string | null;
  parent_classification_name: string | null;
  classification_name: string | null;
  custom_title: string | null;
  tel_num: string | null;
}

export interface SearchData {
  query: string;
}

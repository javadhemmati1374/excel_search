import { ColumnDef } from "@tanstack/react-table";

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
  original_filename: string;
  file_upload_date: string;
}

export interface SearchFormProps {
  onSearchResults: (results: PhoneData[]) => void;
  onError: (errorMessage: string) => void;
}

export interface DataTableProps {
  data: PhoneData[];
  columns: ColumnDef<PhoneData>[];
}

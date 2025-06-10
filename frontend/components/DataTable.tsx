import React from "react";
import { PhoneData } from "../types";

interface DataTableProps {
  data?: PhoneData[];
}

const columns = [
  { key: "reg_province", label: "استان" },
  { key: "reg_city", label: "شهر" },
  { key: "address", label: "آدرس" },
  { key: "city", label: "شهر محل فعالیت" },
  { key: "parent_classification_name", label: "طبقه‌بندی والدین" },
  { key: "classification_name", label: "طبقه‌بندی" },
  { key: "custom_title", label: "عنوان سفارشی" },
  { key: "tel_num", label: "شماره تلفن" },
];

export default function DataTable({ data = [] }: DataTableProps) {
  if (!data.length) return null;
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border text-sm bg-white rounded">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="border px-2 py-1 bg-gray-100 text-gray-700 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="border px-2 py-1 whitespace-nowrap"
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="sm:hidden flex flex-col gap-4">
        {data.map((row, idx) => (
          <div
            key={idx}
            className="border rounded bg-white shadow p-3 flex flex-col gap-2"
          >
            {columns.map((col) => (
              <div
                key={col.key}
                className="flex justify-between text-xs border-b last:border-b-0 pb-1 last:pb-0"
              >
                <span className="text-gray-500 font-medium">{col.label}:</span>
                <span className="text-gray-900 font-bold">{row[col.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

"use client";

import { PhoneData } from "@/types";

interface DataTableProps {
  data: PhoneData[];
}

export default function DataTable({ data }: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">نتیجه‌ای یافت نشد</div>
    );
  }

  return (
    <div className="border rounded overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              شماره تلفن
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              عنوان
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              طبقه‌بندی
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              موقعیت
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              نام فایل
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.tel_num}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                {item.custom_title}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                <div>{item.parent_classification_name}</div>
                <div className="text-xs text-gray-400">
                  {item.classification_name}
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                <div>
                  {item.reg_province}, {item.reg_city}
                </div>
                <div className="text-xs text-gray-400">{item.city}</div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                {item.original_filename}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

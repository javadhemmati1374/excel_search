"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { FileRecord } from "../types";

export default function FileManager() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFiles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setFiles(res.data);
    } catch {
      setError("خطا در دریافت لیست فایل‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("آیا از حذف این فایل مطمئن هستید؟")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/files/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFiles(files.filter((f) => f.id !== id));
    } catch {
      alert("خطا در حذف فایل");
    }
  };

  if (loading) return <div>در حال بارگذاری لیست فایل‌ها...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <h3 className="font-bold mb-3 text-base">فایل‌های آپلود شده</h3>
      <ul className="space-y-2">
        {files.map((file) => (
          <li
            key={file.id}
            className="flex items-center justify-between border-b last:border-b-0 py-2"
          >
            <span
              className="truncate max-w-xs font-medium"
              title={decodeURIComponent(escape(file.filename))}
            >
              {decodeURIComponent(escape(file.filename))}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded ml-2 ${
                file.status === "completed"
                  ? "bg-gray-200 text-gray-800"
                  : file.status === "processing"
                  ? "bg-gray-100 text-gray-500"
                  : "bg-gray-50 text-gray-400"
              }`}
            >
              {file.status}
            </span>
            <button
              onClick={() => handleDelete(file.id)}
              className="flex items-center gap-1 text-gray-500 border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 transition"
              title="حذف فایل"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

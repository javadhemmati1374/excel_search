"use client";
import React, { useRef, useState } from "react";
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setFileName(selected ? decodeURIComponent(selected.name) : "");
    setSuccess("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setSuccess("");
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess("فایل با موفقیت آپلود و پردازش شد.");
      setFile(null);
      setFileName("");
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "خطا در آپلود یا پردازش فایل");
      } else {
        setError("خطا در آپلود یا پردازش فایل");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded shadow p-6 flex flex-col gap-4 items-center">
        <h3 className="font-bold text-lg mb-2">آپلود فایل اکسل</h3>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          onClick={() => inputRef.current?.click()}
        >
          انتخاب فایل اکسل
        </button>
        {fileName && (
          <div className="text-sm text-gray-700 dark:text-gray-200 mt-2">
            فایل انتخاب‌شده: <span className="font-bold">{fileName}</span>
          </div>
        )}
        <button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? "در حال آپلود..." : "آپلود و پردازش"}
        </button>
        {success && (
          <div className="text-green-600 font-bold mt-2">{success}</div>
        )}
        {error && <div className="text-red-600 font-bold mt-2">{error}</div>}
      </div>
    </>
  );
}

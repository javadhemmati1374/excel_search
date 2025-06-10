"use client";
import { useState } from "react";
import axios from "axios";
import DataTable from "./DataTable";
import { PhoneData } from "../types";

export default function SearchForm() {
  const [telNum, setTelNum] = useState("");
  const [results, setResults] = useState<PhoneData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search`,
        {
          params: { tel_num: telNum },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setResults(res.data);
    } catch {
      setError("نتیجه‌ای یافت نشد یا خطا در جستجو");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="شماره تلفن را وارد کنید"
        value={telNum}
        onChange={(e) => setTelNum(e.target.value)}
        className="p-2 border rounded"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        جستجو
      </button>
      {loading && <div>در حال جستجو...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {results.length > 0 && <DataTable data={results} />}
    </div>
  );
}

"use client";

import { useState } from "react";
import { api } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { AxiosError } from "axios";

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

interface SearchFormProps {
  onSearchResults: (results: PhoneData[]) => void;
  onError: (errorMessage: string) => void;
}

export default function SearchForm({
  onSearchResults,
  onError,
}: SearchFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const response = await api.get(`/api/search`, {
        params: {
          tel_num: phoneNumber.trim(),
        },
      });

      if (response.data.results) {
        onSearchResults(response.data.results);
        onError("");
      } else {
        onSearchResults([]);
        onError("");
      }
    } catch (err) {
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data?.message || "خطا در جستجوی شماره تلفن"
          : "خطا در جستجوی شماره تلفن";
      onError(errorMessage);
      console.error("Search error:", err);
      onSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="شماره تلفن را وارد کنید"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="flex-grow"
        required
      />
      <Button type="submit" disabled={isSearching}>
        {isSearching ? "در حال جستجو..." : "جستجو"}
      </Button>
    </form>
  );
}

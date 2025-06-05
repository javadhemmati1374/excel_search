"use client";

import { useState, useRef } from "react";
import { Upload, File, AlertCircle, CheckCircle2 } from "lucide-react";
import { uploadFile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError("لطفاً فقط فایل‌های اکسل را آپلود کنید");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      await uploadFile(formData);
      setSuccess("فایل با موفقیت آپلود شد");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در آپلود فایل");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>آپلود فایل اکسل</CardTitle>
        <CardDescription>
          فایل اکسل خود را برای پردازش آپلود کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border border-dashed p-4 text-center ${
            isDragging ? "bg-gray-100" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-6 h-6 text-gray-500" />
            <p className="text-sm">فایل را اینجا رها کنید یا کلیک کنید</p>
            <p className="text-xs text-gray-500">
              فقط فایل‌های اکسل (.xlsx, .xls) پشتیبانی می‌شوند
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="mt-2"
            >
              انتخاب فایل
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطا</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-2 bg-green-100 border-green-400 text-green-700">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">موفقیت</AlertTitle>
            <AlertDescription className="text-green-700">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {isUploading && (
          <div className="mt-2 text-center text-sm text-gray-500">
            در حال آپلود فایل...
          </div>
        )}
      </CardContent>
    </Card>
  );
}

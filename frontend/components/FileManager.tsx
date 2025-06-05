"use client";

import { useEffect, useState } from "react";
import { File, Trash2, AlertCircle } from "lucide-react";
import { getFiles, deleteFile } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface FileData {
  id: number;
  filename: string;
  created_at: string;
}

export default function FileManager() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      const data = await getFiles();
      setFiles(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "خطا در دریافت لیست فایل‌ها"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این فایل اطمینان دارید؟")) return;

    try {
      await deleteFile(id);
      setFiles(files.filter((file) => file.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در حذف فایل");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>مدیریت فایل‌ها</CardTitle>
        <CardDescription>
          لیست فایل‌های آپلود شده و عملیات مربوط به آن‌ها
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطا</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="text-center text-sm text-muted-foreground">
            در حال بارگذاری...
          </div>
        ) : files.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            هیچ فایلی یافت نشد
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <File className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{file.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(file.created_at).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(file.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

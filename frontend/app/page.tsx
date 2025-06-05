// frontend/app/page.tsx
"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import FileUpload from "@/components/FileUpload";
import DataTable from "@/components/DataTable";
import { columns } from "@/components/DataTable/columns";
import { PhoneData } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [searchResults, setSearchResults] = useState<PhoneData[]>([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("search");

  const handleSearchResults = (results: PhoneData[]) => {
    setSearchResults(results);
    setError("");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSearchResults([]);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  جستجوی هوشمند در فایل‌های اکسل
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  با استفاده از هوش مصنوعی، به راحتی در فایل‌های اکسل خود جستجو
                  کنید و نتایج دقیق را پیدا کنید.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/search">
                  <Button size="lg" className="w-full sm:w-auto">
                    شروع جستجو
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    داشبورد
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">
                    جستجوی هوشمند
                  </h3>
                  <p className="text-muted-foreground">
                    با استفاده از هوش مصنوعی، به راحتی در فایل‌های اکسل خود
                    جستجو کنید.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">نتایج دقیق</h3>
                  <p className="text-muted-foreground">
                    نتایج دقیق و مرتبط با جستجوی شما را دریافت کنید.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-primary">
                    مدیریت آسان
                  </h3>
                  <p className="text-muted-foreground">
                    مدیریت و سازماندهی فایل‌های اکسل خود را به راحتی انجام دهید.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

"use client";
import RequireAuth from "@/components/RequireAuth";
import SearchForm from "@/components/SearchForm";
import DataTable from "@/components/DataTable";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => {
    removeToken();
    router.replace("/login");
  };
  return (
    <RequireAuth>
      <nav className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className={`px-2 py-1 rounded transition text-sm font-medium ${
              pathname === "/dashboard"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            آپلود و لیست فایل‌ها
          </Link>
          <Link
            href="/search"
            className={`px-2 py-1 rounded transition text-sm font-medium ${
              pathname === "/search"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            جستجو
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-600 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 transition text-sm"
        >
          خروج
        </button>
      </nav>
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold mb-2">جستجوی شماره تلفن</h1>
        <SearchForm />
        <DataTable />
      </div>
    </RequireAuth>
  );
}

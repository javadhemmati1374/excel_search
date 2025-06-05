"use client";

import Link from "next/link";
import { MainNav } from "@/components/main-nav";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Excel Search</span>
        </Link>
        <MainNav className="mx-6" />
      </div>
    </div>
  );
}

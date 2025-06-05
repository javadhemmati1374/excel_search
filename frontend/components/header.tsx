"use client";

import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Excel Search</span>
        </Link>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

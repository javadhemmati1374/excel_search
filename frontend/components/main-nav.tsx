"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "داشبورد",
    href: "/dashboard",
  },
  {
    title: "جستجو",
    href: "/search",
  },
  {
    title: "تنظیمات",
    href: "/settings",
  },
];

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {}

export function MainNav({ className, ...props }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-foreground" : "text-foreground/60"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

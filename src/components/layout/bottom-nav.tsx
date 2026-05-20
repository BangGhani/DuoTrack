"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Heart, Home, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Finance",
    href: "/finance",
    icon: Heart,
  },
  {
    label: "Sports",
    href: "/sports",
    icon: Dumbbell,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground",
                isActive && "font-medium text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
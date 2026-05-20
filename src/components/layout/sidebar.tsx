"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dumbbell, Heart, Home, LogOut, User, Users } from "lucide-react";
import toast from "react-hot-toast";

import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils/cn";

const navItems = [
  {
    label: "Dashboard",
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
  {
    label: "Couple",
    href: "/couple",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();

      toast.success("Berhasil logout");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal logout";
      toast.error(message);
    }
  }

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r bg-background p-4 md:flex">
      <div className="mb-8 rounded-3xl bg-primary/10 p-4">
        <h1 className="text-xl font-bold text-primary">DuoTrack</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track goals together
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                isActive &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
        <span className="opacity-0 transition group-hover:opacity-100">
          Logout
        </span>
      </button>
    </aside>
  );
}

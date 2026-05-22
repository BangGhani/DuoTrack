"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gem,
  LayoutDashboard,
  PiggyBank,
  ReceiptText,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";

type FinanceShellProps = {
  children: React.ReactNode;
};

const financeNavItems = [
  {
    href: "/finance",
    label: "Overview",
    mobileLabel: "Home",
    description: "Ringkasan cashflow",
    icon: LayoutDashboard,
  },
  {
    href: "/finance/savings",
    label: "Tabungan",
    mobileLabel: "Tabungan",
    description: "Rule & checklist",
    icon: PiggyBank,
  },
  {
    href: "/finance/transactions",
    label: "Transaksi",
    mobileLabel: "Transaksi",
    description: "Riwayat cashflow",
    icon: ReceiptText,
  },
  {
    href: "/finance/assets",
    label: "Aset",
    mobileLabel: "Aset",
    description: "Asset & investasi",
    icon: Gem,
  },
];

export function FinanceShell({ children }: FinanceShellProps) {
  const pathname = usePathname();

  return (
    <main className="space-y-5 p-4 pb-24 md:p-6">
      <section className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Financial / Cashflow
            </p>
            <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Pantau cash balance, tabungan, transaksi, dan aset couple kamu
              dalam satu tempat.
            </p>
          </div>

          <div className="hidden rounded-2xl border bg-card px-4 py-3 md:block">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-muted p-2">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Finance Center</p>
                <p className="text-xs text-muted-foreground">
                  Semua cashflow couple tertata di sini.
                </p>
              </div>
            </div>
          </div>
        </div>

        <FinanceSectionNav pathname={pathname} />
      </section>

      {children}
    </main>
  );
}

function FinanceSectionNav({ pathname }: { pathname: string }) {
  return (
    <div className="sticky top-0 z-20 -mx-4 border-y bg-background/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:rounded-3xl md:border md:bg-card md:p-2">
      <nav className="flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
        {financeNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/finance"
              ? pathname === "/finance"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex min-w-fit items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition md:min-w-0 md:border-transparent",
                "hover:bg-muted",
                isActive
                  ? "border-primary/30 bg-primary text-primary-foreground shadow-sm hover:bg-primary"
                  : "bg-card text-muted-foreground md:bg-transparent"
              )}
            >
              <span
                className={cn(
                  "rounded-xl p-2 transition",
                  isActive
                    ? "bg-primary-foreground/15"
                    : "bg-muted text-foreground group-hover:bg-background"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>

              <span className="flex flex-col text-left">
                <span className="font-medium md:hidden">
                  {item.mobileLabel}
                </span>
                <span className="hidden font-medium md:block">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "hidden text-xs md:block",
                    isActive
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
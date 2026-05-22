"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  Coins,
  Dumbbell,
  Gem,
  Heart,
  Loader2,
  PiggyBank,
  PlusCircle,
  RefreshCw,
  Trophy,
  Wallet,
} from "lucide-react";

import { getCoupleDashboardSummary } from "@/lib/dashboard";
import { formatDate, formatRupiah } from "@/lib/format";
import type {
  CoupleDashboardSummary,
  DashboardActivity,
  DashboardMember,
} from "@/types/dashboard";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [summary, setSummary] = useState<CoupleDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadDashboard(isManualRefresh = false) {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage(null);

      const data = await getCoupleDashboardSummary();
      setSummary(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil data dashboard.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const greetingName = summary?.profile.name || "Partner";

  const hasPartner = Boolean(summary?.profile.partner_name);

  const comparisonTitle = useMemo(() => {
    if (!summary) return "Couple Progress";

    if (summary.mode === "solo") {
      return "Progress Kamu";
    }

    if (summary.profile.partner_name) {
      return `${summary.profile.name} vs ${summary.profile.partner_name}`;
    }

    return "Couple Progress";
  }, [summary]);

  if (isLoading) {
    return (
      <main className="space-y-6 p-4 pb-24 md:p-6">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Mengambil dashboard DuoTrack...</p>
          </div>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="space-y-6 p-4 pb-24 md:p-6">
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle>Dashboard gagal dimuat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <Button onClick={() => loadDashboard(true)}>
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!summary) {
    return (
      <main className="space-y-6 p-4 pb-24 md:p-6">
        <EmptyState />
      </main>
    );
  }

  return (
    <main className="space-y-6 p-4 pb-24 md:p-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Dashboard hari ini
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Halo, {greetingName} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            {summary.mode === "couple"
              ? hasPartner
                ? `Pantau progress kamu dan ${summary.profile.partner_name} dalam satu tempat.`
                : "Couple sudah dibuat. Tinggal ajak pasangan masuk, biar nggak tracking sendirian kayak NPC."
              : "Kamu masih dalam mode solo. Buat atau join couple untuk mulai tracking bareng pasangan."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={summary.mode === "couple" ? "default" : "secondary"}>
            {summary.mode === "couple" ? "Couple Mode" : "Solo Mode"}
          </Badge>

          <Button
            variant="outline"
            size="icon"
            onClick={() => loadDashboard(true)}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </section>

      {summary.mode === "solo" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-5 w-5" />
              Couple belum diatur
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Buat atau join couple dulu supaya dashboard bisa nampilin perbandingan kamu dan pasangan.
            </p>
            <Button asChild>
              <Link href="/couple/setup">Setup Couple</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Cash Balance"
          value={formatRupiah(summary.finance.cash_balance)}
          description="Saldo cash couple saat ini"
          icon={<Wallet className="h-5 w-5" />}
        />

        <SummaryCard
          title="Tagihan Tabungan"
          value={formatRupiah(summary.finance.unpaid_saving_amount)}
          description={`${summary.finance.unpaid_saving_days} hari belum dibayar`}
          icon={<PiggyBank className="h-5 w-5" />}
        />

        <SummaryCard
          title="Aset Aktif"
          value={formatRupiah(summary.finance.active_asset_value)}
          description="Estimasi nilai aset aktif"
          icon={<Gem className="h-5 w-5" />}
        />

        <SummaryCard
          title="Denda Belum Dibayar"
          value={formatRupiah(summary.goals.unpaid_penalty_amount)}
          description={`${summary.goals.unpaid_penalties} denda aktif`}
          icon={<Trophy className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <MemberComparisonCard
          title={comparisonTitle}
          members={summary.members}
        />

        <SportsSummaryCard summary={summary} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <QuickActionsCard />

        <RecentActivityCard activities={summary.recent_activity} />
      </section>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h2 className="text-xl font-bold">{value}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="rounded-2xl bg-muted p-3">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function MemberComparisonCard({
  title,
  members,
}: {
  title: string;
  members: DashboardMember[];
}) {
  if (!members.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Belum ada data member untuk dibandingkan.
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxSavingPaid = Math.max(
    ...members.map((member) => Number(member.saving_paid_total || 0)),
    1
  );

  const maxProgress = Math.max(
    ...members.map((member) => Number(member.progress_entries_this_period || 0)),
    1
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {members.map((member) => {
            const savingPercent =
              (Number(member.saving_paid_total || 0) / maxSavingPaid) * 100;

            const progressPercent =
              (Number(member.progress_entries_this_period || 0) / maxProgress) *
              100;

            return (
              <div
                key={member.id}
                className="space-y-4 rounded-2xl border bg-card p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">
                      {member.name || "Tanpa Nama"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {member.active_goals} target aktif
                    </p>
                  </div>

                  <Badge variant="secondary">
                    {member.progress_entries_this_period} progress
                  </Badge>
                </div>

                <div className="space-y-2">
                  <ComparisonMetric
                    label="Tabungan dibayar"
                    value={formatRupiah(member.saving_paid_total)}
                    percent={savingPercent}
                  />

                  <ComparisonMetric
                    label="Progress periode ini"
                    value={`${member.progress_entries_this_period} entry`}
                    percent={progressPercent}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <MiniMetric
                    label="Tagihan tabungan"
                    value={formatRupiah(member.unpaid_saving_amount)}
                    helper={`${member.unpaid_saving_days} hari`}
                  />

                  <MiniMetric
                    label="Denda"
                    value={formatRupiah(member.unpaid_penalty_amount)}
                    helper={`${member.unpaid_penalties} belum dibayar`}
                  />

                  <MiniMetric
                    label="Income"
                    value={formatRupiah(member.income_total)}
                    helper="uang masuk"
                  />

                  <MiniMetric
                    label="Expense"
                    value={formatRupiah(member.expense_total)}
                    helper="uang keluar"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonMetric({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: number;
}) {
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{helper}</p>
    </div>
  );
}

function SportsSummaryCard({
  summary,
}: {
  summary: CoupleDashboardSummary;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Dumbbell className="h-5 w-5" />
          Ringkasan Target Olahraga
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MiniMetric
            label="Target aktif"
            value={`${summary.goals.active_goals}`}
            helper="dalam couple"
          />

          <MiniMetric
            label="Progress"
            value={`${summary.goals.progress_this_period}`}
            helper="periode ini"
          />

          <MiniMetric
            label="Denda aktif"
            value={`${summary.goals.unpaid_penalties}`}
            helper="belum dibayar"
          />

          <MiniMetric
            label="Nominal denda"
            value={formatRupiah(summary.goals.unpaid_penalty_amount)}
            helper="total unpaid"
          />
        </div>

        <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
          Periode: {formatDate(summary.goals.period_start)} -{" "}
          {formatDate(summary.goals.period_end)}
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/sports">Lihat Target Olahraga</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard() {
  const actions = [
    {
      label: "Bayar Tabungan",
      href: "/finance/savings",
      icon: <PiggyBank className="h-5 w-5" />,
    },
    {
      label: "Beli Aset",
      href: "/finance/assets",
      icon: <Gem className="h-5 w-5" />,
    },
    {
      label: "Tambah Progress",
      href: "/sports",
      icon: <Dumbbell className="h-5 w-5" />,
    },
    {
      label: "Buat Goal",
      href: "/sports",
      icon: <PlusCircle className="h-5 w-5" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            asChild
            variant="outline"
            className="h-auto justify-start gap-3 rounded-2xl p-4"
          >
            <Link href={action.href}>
              {action.icon}
              <span className="text-left text-sm">{action.label}</span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function RecentActivityCard({
  activities,
}: {
  activities: DashboardActivity[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-5 w-5" />
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!activities.length ? (
          <p className="text-sm text-muted-foreground">
            Belum ada aktivitas. Dunia masih damai, database masih kosong.
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <ActivityItem key={`${activity.type}-${activity.id}`} activity={activity} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityItem({
  activity,
}: {
  activity: DashboardActivity;
}) {
  const isTransaction = activity.type === "transaction";

  const icon =
    isTransaction && activity.direction === "in" ? (
      <ArrowUpCircle className="h-4 w-4" />
    ) : isTransaction && activity.direction === "out" ? (
      <ArrowDownCircle className="h-4 w-4" />
    ) : activity.type === "goal_progress" ? (
      <Dumbbell className="h-4 w-4" />
    ) : (
      <Coins className="h-4 w-4" />
    );

  return (
    <div className="flex gap-3 rounded-2xl border p-3">
      <div className="mt-0.5 rounded-xl bg-muted p-2">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {activity.title}
            </p>

            {activity.description ? (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {activity.description}
              </p>
            ) : null}
          </div>

          {typeof activity.amount === "number" ? (
            <p className="shrink-0 text-sm font-semibold">
              {activity.direction === "out" ? "-" : "+"}
              {formatRupiah(activity.amount)}
            </p>
          ) : null}
        </div>

        <p className="mt-2 text-[11px] text-muted-foreground">
          {formatDate(activity.created_at)}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard kosong</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Belum ada data dashboard yang bisa ditampilkan.
        </p>
      </CardContent>
    </Card>
  );
}
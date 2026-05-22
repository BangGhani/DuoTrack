"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Gem,
  History,
  Loader2,
  PiggyBank,
  RefreshCw,
  Wallet,
} from "lucide-react";

import {
  addOtherExpense,
  addOtherIncome,
  buyAsset,
  getFinancialSummary,
  getTransactionHistory,
  paySavings,
} from "@/lib/finance";
import {
  formatDateTime,
  formatRupiah,
  formatRupiahInput,
  parseRupiahInput,
} from "@/lib/format";
import type { FinancialSummary, Transaction } from "@/types/finance";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ActiveDialog = "pay-savings" | "income" | "expense" | "buy-asset" | null;

export default function FinancePage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadFinance(isManualRefresh = false) {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage(null);

      const [summaryData, transactionData] = await Promise.all([
        getFinancialSummary(),
        getTransactionHistory({
          limit: 5,
          offset: 0,
          type: null,
        }),
      ]);

      setSummary(summaryData);
      setTransactions(transactionData);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil data finansial.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handleMutationSuccess(message: string) {
    setSuccessMessage(message);
    setActiveDialog(null);
    await loadFinance(true);
  }

  useEffect(() => {
    loadFinance();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Mengambil data finansial...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>Finance gagal dimuat</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{errorMessage}</p>

          <Button onClick={() => loadFinance(true)}>Coba Lagi</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Overview Cashflow</h2>
          <p className="text-sm text-muted-foreground">
            Ringkasan kondisi finansial couple kamu.
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => loadFinance(true)}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </section>

      {successMessage ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 text-sm">{successMessage}</CardContent>
        </Card>
      ) : null}

      <section className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <FinanceSummaryCard
          className="col-span-2 xl:col-span-1"
          title="Cash Balance"
          value={formatRupiah(summary?.cash_balance)}
          description="Saldo dari transaksi masuk dan keluar"
          icon={<Wallet className="h-5 w-5" />}
        />

        <FinanceSummaryCard
          title="Total Income"
          value={formatRupiah(summary?.total_income)}
          description="Semua uang masuk couple"
          icon={<ArrowUpCircle className="h-5 w-5" />}
        />

        <FinanceSummaryCard
          title="Total Expense"
          value={formatRupiah(summary?.total_expense)}
          description="Semua uang keluar couple"
          icon={<ArrowDownCircle className="h-5 w-5" />}
        />

        <FinanceSummaryCard
          title="Aset Aktif"
          value={formatRupiah(summary?.active_asset_value)}
          description="Estimasi nilai aset aktif"
          icon={<Gem className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Aksi Cepat</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-3">
            <ActionButton
              label="Bayar Tabungan"
              icon={<PiggyBank className="h-5 w-5" />}
              onClick={() => {
                setSuccessMessage(null);
                setActiveDialog("pay-savings");
              }}
            />

            <ActionButton
              label="Tambah Pemasukan"
              icon={<ArrowUpCircle className="h-5 w-5" />}
              onClick={() => {
                setSuccessMessage(null);
                setActiveDialog("income");
              }}
            />

            <ActionButton
              label="Tambah Pengeluaran"
              icon={<ArrowDownCircle className="h-5 w-5" />}
              onClick={() => {
                setSuccessMessage(null);
                setActiveDialog("expense");
              }}
            />

            <ActionButton
              label="Beli Aset"
              icon={<Gem className="h-5 w-5" />}
              onClick={() => {
                setSuccessMessage(null);
                setActiveDialog("buy-asset");
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tagihan Tabungan</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-muted/60 p-4">
                <p className="text-sm text-muted-foreground">Belum dibayar</p>
                <p className="mt-1 text-xl font-bold">
                  {formatRupiah(summary?.unpaid_saving_amount)}
                </p>
              </div>

              <div className="rounded-2xl bg-muted/60 p-4">
                <p className="text-sm text-muted-foreground">Hari tertunggak</p>
                <p className="mt-1 text-xl font-bold">
                  {summary?.unpaid_saving_days ?? 0} hari
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild className="w-full">
                <Link href="/finance/savings">Kelola Tabungan</Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/finance/transactions">Lihat Transaksi</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <RecentTransactionsCard transactions={transactions} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Finansial</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="rounded-2xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Total aset dibeli</p>
              <p className="mt-1 text-xl font-bold">
                {formatRupiah(summary?.total_asset_buy_value)}
              </p>
            </div>

            <div className="rounded-2xl bg-muted/60 p-4">
              <p className="text-sm text-muted-foreground">Cash balance</p>
              <p className="mt-1 text-xl font-bold">
                {formatRupiah(summary?.cash_balance)}
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Balance dihitung dari transaksi masuk dan keluar. Bukan angka
              tempelan yang bisa dibohongi demi terlihat baik-baik saja.
            </p>
          </CardContent>
        </Card>
      </section>

      <PaySavingsDialog
        open={activeDialog === "pay-savings"}
        onOpenChange={(open) => setActiveDialog(open ? "pay-savings" : null)}
        onSuccess={handleMutationSuccess}
      />

      <IncomeDialog
        open={activeDialog === "income"}
        onOpenChange={(open) => setActiveDialog(open ? "income" : null)}
        onSuccess={handleMutationSuccess}
      />

      <ExpenseDialog
        open={activeDialog === "expense"}
        onOpenChange={(open) => setActiveDialog(open ? "expense" : null)}
        onSuccess={handleMutationSuccess}
      />

      <BuyAssetDialog
        open={activeDialog === "buy-asset"}
        onOpenChange={(open) => setActiveDialog(open ? "buy-asset" : null)}
        onSuccess={handleMutationSuccess}
      />
    </div>
  );
}

function FinanceSummaryCard({
  title,
  value,
  description,
  icon,
  className = "",
}: {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="flex items-start justify-between gap-3 p-4 md:gap-4 md:p-5">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-xs text-muted-foreground md:text-sm">
            {title}
          </p>

          <h2 className="truncate text-lg font-bold tracking-tight md:text-xl">
            {value}
          </h2>

          <p className="hidden text-xs text-muted-foreground sm:block">
            {description}
          </p>
        </div>

        <div className="shrink-0 rounded-2xl bg-muted p-2.5 md:p-3">{icon}</div>
      </CardContent>
    </Card>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-auto min-h-[76px] flex-col gap-2 rounded-2xl p-3 text-center md:min-h-0 md:flex-row md:justify-start md:gap-3 md:p-4 md:text-left"
      onClick={onClick}
    >
      <span className="rounded-xl bg-muted p-2">{icon}</span>
      <span className="text-xs font-medium leading-tight md:text-sm">
        {label}
      </span>
    </Button>
  );
}

function RecentTransactionsCard({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-5 w-5" />
          Transaksi Terbaru
        </CardTitle>

        <Button asChild variant="ghost" size="sm">
          <Link href="/finance/transactions">Lihat Semua</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {!transactions.length ? (
          <p className="text-sm text-muted-foreground">
            Belum ada transaksi. Cashflow masih suci, sebuah kondisi langka.
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-start gap-3 rounded-2xl border p-3"
              >
                <div className="rounded-xl bg-muted p-2">
                  {transaction.direction === "in" ? (
                    <ArrowUpCircle className="h-4 w-4" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {getTransactionLabel(transaction.type)}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {transaction.note || "Tanpa catatan"}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold">
                      {transaction.direction === "out" ? "-" : "+"}
                      {formatRupiah(transaction.amount)}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {transaction.direction === "in" ? "Masuk" : "Keluar"}
                    </Badge>

                    <span className="text-[11px] text-muted-foreground">
                      {formatDateTime(transaction.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PaySavingsDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string) => Promise<void>;
}) {
  const [amountInput, setAmountInput] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const amount = useMemo(() => parseRupiahInput(amountInput), [amountInput]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (amount <= 0) {
      setLocalError("Nominal tabungan harus lebih dari 0.");
      return;
    }

    try {
      setIsSubmitting(true);
      setLocalError(null);

      const result = await paySavings({
        amount,
        note,
      });

      setAmountInput("");
      setNote("");

      const message = [
        result.message || "Tabungan berhasil dibayar.",
        `${result.paid_logs_count ?? 0} checklist terbayar.`,
        `Dialokasikan: ${formatRupiah(result.total_allocated ?? 0)}.`,
        Number(result.remaining_unallocated ?? 0) > 0
          ? `Sisa tidak dialokasikan: ${formatRupiah(
              result.remaining_unallocated,
            )}.`
          : null,
      ]
        .filter(Boolean)
        .join(" ");

      await onSuccess(message);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal membayar tabungan.";

      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bayar Tabungan</DialogTitle>
          <DialogDescription>
            Masukkan nominal tabungan yang ingin dibayar. Bisa rapel, karena
            hidup memang sering telat.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <AmountInput
            label="Nominal"
            value={amountInput}
            onChange={setAmountInput}
            placeholder="Contoh: 50.000"
          />

          <div className="space-y-2">
            <Label htmlFor="saving-note">Catatan</Label>
            <Textarea
              id="saving-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Contoh: Tabungan minggu ini"
            />
          </div>

          {localError ? (
            <p className="text-sm text-destructive">{localError}</p>
          ) : null}

          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Bayar Tabungan"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function IncomeDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string) => Promise<void>;
}) {
  const [amountInput, setAmountInput] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const amount = useMemo(() => parseRupiahInput(amountInput), [amountInput]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (amount <= 0) {
      setLocalError("Nominal pemasukan harus lebih dari 0.");
      return;
    }

    try {
      setIsSubmitting(true);
      setLocalError(null);

      await addOtherIncome({
        amount,
        note,
      });

      setAmountInput("");
      setNote("");

      await onSuccess("Pemasukan berhasil ditambahkan.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menambah pemasukan.";

      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SimpleMoneyDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tambah Pemasukan"
      description="Catat pemasukan lain selain tabungan."
      amountInput={amountInput}
      setAmountInput={setAmountInput}
      note={note}
      setNote={setNote}
      notePlaceholder="Contoh: Bonus, hadiah, cashback"
      submitLabel="Tambah Pemasukan"
      isSubmitting={isSubmitting}
      localError={localError}
      onSubmit={handleSubmit}
    />
  );
}

function ExpenseDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string) => Promise<void>;
}) {
  const [amountInput, setAmountInput] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const amount = useMemo(() => parseRupiahInput(amountInput), [amountInput]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (amount <= 0) {
      setLocalError("Nominal pengeluaran harus lebih dari 0.");
      return;
    }

    try {
      setIsSubmitting(true);
      setLocalError(null);

      await addOtherExpense({
        amount,
        note,
      });

      setAmountInput("");
      setNote("");

      await onSuccess("Pengeluaran berhasil ditambahkan.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menambah pengeluaran.";

      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SimpleMoneyDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tambah Pengeluaran"
      description="Catat pengeluaran biasa. Kalau ini pembelian aset, pakai menu Beli Aset, jangan barbar."
      amountInput={amountInput}
      setAmountInput={setAmountInput}
      note={note}
      setNote={setNote}
      notePlaceholder="Contoh: Makan, bensin, kebutuhan rumah"
      submitLabel="Tambah Pengeluaran"
      isSubmitting={isSubmitting}
      localError={localError}
      onSubmit={handleSubmit}
    />
  );
}

function SimpleMoneyDialog({
  open,
  onOpenChange,
  title,
  description,
  amountInput,
  setAmountInput,
  note,
  setNote,
  notePlaceholder,
  submitLabel,
  isSubmitting,
  localError,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  amountInput: string;
  setAmountInput: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
  notePlaceholder: string;
  submitLabel: string;
  isSubmitting: boolean;
  localError: string | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <AmountInput
            label="Nominal"
            value={amountInput}
            onChange={setAmountInput}
            placeholder="Contoh: 100.000"
          />

          <div className="space-y-2">
            <Label>Catatan</Label>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={notePlaceholder}
            />
          </div>

          {localError ? (
            <p className="text-sm text-destructive">{localError}</p>
          ) : null}

          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BuyAssetDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantityInput, setQuantityInput] = useState("");
  const [unit, setUnit] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const quantity = Number(quantityInput || 0);

  const buyPricePerUnit = useMemo(
    () => parseRupiahInput(priceInput),
    [priceInput],
  );

  const totalPreview = quantity * buyPricePerUnit;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setLocalError("Nama aset wajib diisi.");
      return;
    }

    if (!category.trim()) {
      setLocalError("Kategori aset wajib diisi.");
      return;
    }

    if (quantity <= 0) {
      setLocalError("Quantity aset harus lebih dari 0.");
      return;
    }

    if (!unit.trim()) {
      setLocalError("Unit aset wajib diisi.");
      return;
    }

    if (buyPricePerUnit <= 0) {
      setLocalError("Harga beli per unit harus lebih dari 0.");
      return;
    }

    try {
      setIsSubmitting(true);
      setLocalError(null);

      await buyAsset({
        name,
        category,
        quantity,
        unit,
        buyPricePerUnit,
        note,
      });

      setName("");
      setCategory("");
      setQuantityInput("");
      setUnit("");
      setPriceInput("");
      setNote("");

      await onSuccess(
        "Aset berhasil dibeli dan cashflow keluar sudah dicatat.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal membeli aset.";

      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Beli Aset</DialogTitle>
          <DialogDescription>
            Pembelian aset otomatis dicatat sebagai cashflow keluar.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nama Aset</Label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Contoh: Emas Antam"
              />
            </div>

            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Contoh: Emas, Reksadana"
              />
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={quantityInput}
                onChange={(event) => setQuantityInput(event.target.value)}
                placeholder="Contoh: 1"
              />
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              <Input
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                placeholder="Contoh: gram, lot, unit"
              />
            </div>
          </div>

          <AmountInput
            label="Harga Beli per Unit"
            value={priceInput}
            onChange={setPriceInput}
            placeholder="Contoh: 1.200.000"
          />

          <div className="rounded-2xl bg-muted/60 p-4">
            <p className="text-sm text-muted-foreground">
              Preview total pembelian
            </p>

            <p className="mt-1 text-xl font-bold">
              {formatRupiah(totalPreview)}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Backend tetap menghitung final. Frontend cuma preview, bukan
              akuntan dadakan.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Catatan</Label>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Contoh: Beli emas awal bulan"
            />
          </div>

          {localError ? (
            <p className="text-sm text-destructive">{localError}</p>
          ) : null}

          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Beli Aset"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AmountInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        inputMode="numeric"
        value={value}
        onChange={(event) => {
          const parsed = parseRupiahInput(event.target.value);
          onChange(formatRupiahInput(parsed));
        }}
        placeholder={placeholder}
      />
    </div>
  );
}

function getTransactionLabel(type: string) {
  const labels: Record<string, string> = {
    tabungan: "Pembayaran Tabungan",
    pemasukan_lain: "Pemasukan Lain",
    pengeluaran_lain: "Pengeluaran Lain",
    asset_buy: "Pembelian Aset",
    asset_sell: "Penjualan Aset",
    penalty_payment: "Pembayaran Denda",
    correction: "Koreksi Transaksi",
  };

  return labels[type] ?? type;
}

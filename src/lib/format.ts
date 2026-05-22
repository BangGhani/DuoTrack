export function formatRupiah(value: number | null | undefined): string {
  const numberValue = Number(value ?? 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numberValue);
}

export function formatNumber(value: number | null | undefined): string {
  return new Intl.NumberFormat("id-ID").format(Number(value ?? 0));
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function parseRupiahInput(value: string): number {
  const cleanValue = value.replace(/[^\d]/g, "");
  return Number(cleanValue || 0);
}

export function formatRupiahInput(value: string | number): string {
  const numberValue =
    typeof value === "number" ? value : parseRupiahInput(value);

  if (!numberValue) return "";

  return new Intl.NumberFormat("id-ID").format(numberValue);
}

export function formatPercent(value: number | null | undefined): string {
  return `${Number(value ?? 0).toFixed(0)}%`;
}
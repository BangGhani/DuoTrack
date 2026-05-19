export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatRupiah(value: number | null | undefined) {
  const amount = value ?? 0;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number | null | undefined) {
  const amount = value ?? 0;

  return `${amount.toFixed(1)}%`;
}
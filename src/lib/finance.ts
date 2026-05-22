import { createClient } from "@/lib/supabase/client";
import type {
  FinancialSummary,
  PaySavingsResult,
  Transaction,
} from "@/types/finance";

// Kalau normalizeRpcResult sudah ada di file helper tertentu,
// import dari path yang sama seperti di couple.ts.
// Contoh:
// import { normalizeRpcResult } from "@/lib/rpc";

function normalizeRpcResult<T>(data: unknown): T {
  const normalized = Array.isArray(data) ? data[0] : data;

  if (
    normalized &&
    typeof normalized === "object" &&
    "data" in normalized &&
    normalized.data !== undefined
  ) {
    return normalized.data as T;
  }

  return normalized as T;
}

export async function getFinancialSummary(): Promise<FinancialSummary> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_financial_summary");

  if (error) {
    throw error;
  }

  return normalizeRpcResult<FinancialSummary>(data);
}

export async function createSavingRule(params: {
  dailyAmount: number;
  startDate?: string;
  endDate?: string | null;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("create_saving_rule", {
    p_daily_amount: params.dailyAmount,
    p_start_date: params.startDate,
    p_end_date: params.endDate ?? null,
  });

  if (error) {
    throw error;
  }

  return normalizeRpcResult(data);
}

export async function generateSavingLogs(untilDate?: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("generate_saving_logs", {
    p_until_date: untilDate ?? undefined,
  });

  if (error) {
    throw error;
  }

  return normalizeRpcResult(data);
}

export async function paySavings(params: {
  amount: number;
  note?: string;
}): Promise<PaySavingsResult> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("pay_savings", {
    p_amount: params.amount,
    p_note: params.note || null,
  });

  if (error) {
    throw error;
  }

  return normalizeRpcResult<PaySavingsResult>(data);
}

export async function addOtherIncome(params: {
  amount: number;
  note?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("add_other_income", {
    p_amount: params.amount,
    p_note: params.note || null,
  });

  if (error) {
    throw error;
  }

  return normalizeRpcResult(data);
}

export async function addOtherExpense(params: {
  amount: number;
  note?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("add_other_expense", {
    p_amount: params.amount,
    p_note: params.note || null,
  });

  if (error) {
    throw error;
  }

  return normalizeRpcResult(data);
}

export async function buyAsset(params: {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  buyPricePerUnit: number;
  note?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("buy_asset", {
    p_name: params.name,
    p_category: params.category,
    p_quantity: params.quantity,
    p_unit: params.unit,
    p_buy_price_per_unit: params.buyPricePerUnit,
    p_note: params.note || null,
  });

  if (error) {
    throw error;
  }

  return normalizeRpcResult(data);
}

export async function sellAsset(params: {
  assetId: string;
  quantity: number;
  sellPricePerUnit: number;
  note?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("sell_asset", {
    p_asset_id: params.assetId,
    p_quantity: params.quantity,
    p_sell_price_per_unit: params.sellPricePerUnit,
    p_note: params.note || null,
  });

  if (error) {
    throw error;
  }

  return normalizeRpcResult(data);
}

export async function getTransactionHistory(params?: {
  limit?: number;
  offset?: number;
  type?: string | null;
}): Promise<Transaction[]> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_transaction_history", {
    p_limit: params?.limit ?? 20,
    p_offset: params?.offset ?? 0,
    p_type: params?.type ?? null,
  });

  if (error) {
    throw error;
  }

  return (data ?? []) as Transaction[];
}
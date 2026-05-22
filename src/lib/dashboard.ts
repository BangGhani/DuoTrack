import { createClient } from "@/lib/supabase/client";
import type {
  CoupleDashboardSummary,
  CoupleDashboardSummaryRpcResult,
} from "@/types/dashboard";

function normalizeRpcResult<T>(data: unknown): T {
  if (Array.isArray(data)) {
    return data[0] as T;
  }

  return data as T;
}

export async function getCoupleDashboardSummary(): Promise<CoupleDashboardSummary> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_couple_dashboard_summary");

  if (error) {
    throw error;
  }

  const result = normalizeRpcResult<CoupleDashboardSummaryRpcResult>(data);

  if (!result?.success || !result?.data) {
    throw new Error("Gagal mengambil ringkasan dashboard.");
  }

  return result.data;
}
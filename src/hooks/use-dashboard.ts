import { useQuery } from "@tanstack/react-query";

import { getCoupleDashboardSummary } from "@/lib/dashboard";
import { queryKeys } from "@/lib/query-keys";

export function useCoupleDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboard.coupleSummary,
    queryFn: getCoupleDashboardSummary,
    staleTime: 30 * 1000,
  });
}
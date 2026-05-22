import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addOtherExpense,
  addOtherIncome,
  buyAsset,
  getFinancialSummary,
  getTransactionHistory,
  paySavings,
} from "@/lib/finance";
import { queryKeys } from "@/lib/query-keys";

function useInvalidateFinance() {
  const queryClient = useQueryClient();

  return async function invalidateFinance() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.finance.summary,
      }),
      queryClient.invalidateQueries({
        queryKey: ["finance", "transactions"],
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.coupleSummary,
      }),
    ]);
  };
}

export function useFinancialSummary() {
  return useQuery({
    queryKey: queryKeys.finance.summary,
    queryFn: getFinancialSummary,
    staleTime: 30 * 1000,
  });
}

export function useTransactionHistory(params?: {
  limit?: number;
  offset?: number;
  type?: string | null;
}) {
  return useQuery({
    queryKey: queryKeys.finance.transactions(params),
    queryFn: () => getTransactionHistory(params),
    staleTime: 20 * 1000,
  });
}

export function usePaySavingsMutation() {
  const invalidateFinance = useInvalidateFinance();

  return useMutation({
    mutationFn: paySavings,
    onSuccess: invalidateFinance,
  });
}

export function useAddOtherIncomeMutation() {
  const invalidateFinance = useInvalidateFinance();

  return useMutation({
    mutationFn: addOtherIncome,
    onSuccess: invalidateFinance,
  });
}

export function useAddOtherExpenseMutation() {
  const invalidateFinance = useInvalidateFinance();

  return useMutation({
    mutationFn: addOtherExpense,
    onSuccess: invalidateFinance,
  });
}

export function useBuyAssetMutation() {
  const invalidateFinance = useInvalidateFinance();

  return useMutation({
    mutationFn: buyAsset,
    onSuccess: invalidateFinance,
  });
}
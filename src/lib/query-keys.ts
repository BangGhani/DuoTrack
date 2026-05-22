export const queryKeys = {
  dashboard: {
    coupleSummary: ["dashboard", "couple-summary"] as const,
  },

  finance: {
    summary: ["finance", "summary"] as const,
    transactions: (params?: {
      limit?: number;
      offset?: number;
      type?: string | null;
    }) =>
      [
        "finance",
        "transactions",
        params?.limit ?? 20,
        params?.offset ?? 0,
        params?.type ?? null,
      ] as const,
  },
};
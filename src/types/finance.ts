export type TransactionDirection = "in" | "out";

export type TransactionType =
  | "tabungan"
  | "pemasukan_lain"
  | "pengeluaran_lain"
  | "asset_buy"
  | "asset_sell"
  | "penalty_payment"
  | string;

export type AssetStatus = "active" | "sold" | string;

export type FinancialSummary = {
  cash_balance: number;
  total_income: number;
  total_expense: number;
  active_asset_value: number;
  unpaid_saving_amount: number;
  unpaid_saving_days: number;
  total_asset_buy_value?: number;

  recent_transactions?: Transaction[];
};

export type Transaction = {
  id: string;
  user_id?: string;
  user_name?: string | null;
  couple_id?: string;
  amount: number;
  direction: TransactionDirection;
  type: TransactionType;
  note?: string | null;
  created_at: string;
};

export type SavingRule = {
  id: string;
  user_id: string;
  daily_amount: number;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  created_at?: string;
};

export type SavingLog = {
  id: string;
  user_id: string;
  date: string;
  expected_amount: number;
  is_paid: boolean;
  paid_at?: string | null;
  paid_transaction_id?: string | null;
};

export type PaySavingsResult = {
  success: boolean;
  message?: string;
  paid_logs_count: number;
  total_allocated: number;
  remaining_unallocated: number;
};

export type Asset = {
  id: string;
  couple_id?: string;
  name: string;
  category: string;
  quantity: number;
  remaining_quantity: number;
  unit: string;
  buy_price_per_unit: number;
  total_buy_value: number;
  total_sell_value?: number | null;
  sell_price_per_unit?: number | null;
  status: AssetStatus;
  note?: string | null;
  buy_transaction_id?: string | null;
  sell_transaction_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CoupleMemberFinanceComparison = {
  user_id: string;
  name: string;
  unpaid_saving_amount: number;
  unpaid_saving_days: number;
  total_savings_paid: number;
  total_income: number;
  total_expense: number;
  unpaid_penalty_amount?: number;
  unpaid_penalty_count?: number;
  active_goals_count?: number;
  completed_goals_count?: number;
  progress_score?: number;
};
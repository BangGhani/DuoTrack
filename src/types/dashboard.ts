export type DashboardMode = "solo" | "couple";

export type DashboardProfile = {
  id: string;
  name: string | null;
  partner_name: string | null;
};

export type DashboardCouple = {
  id: string;
  invite_code: string;
  member_count: number;
};

export type DashboardFinance = {
  cash_balance: number;
  total_income: number;
  total_expense: number;
  unpaid_saving_amount: number;
  unpaid_saving_days: number;
  total_asset_buy_value: number;
  active_asset_value: number;
};

export type DashboardMember = {
  id: string;
  name: string | null;
  saving_paid_total: number;
  income_total: number;
  expense_total: number;
  unpaid_saving_amount: number;
  unpaid_saving_days: number;
  active_goals: number;
  progress_entries_this_period: number;
  unpaid_penalties: number;
  unpaid_penalty_amount: number;
};

export type DashboardGoals = {
  active_goals: number;
  progress_this_period: number;
  unpaid_penalties: number;
  unpaid_penalty_amount: number;
  period_start: string;
  period_end: string;
};

export type DashboardActivity = {
  id: string;
  type: "transaction" | "goal_progress" | "penalty" | string;
  title: string;
  description?: string;
  amount?: number;
  direction?: "in" | "out";
  status?: string;
  created_at: string;
};

export type CoupleDashboardSummary = {
  mode: DashboardMode;
  profile: DashboardProfile;
  couple: DashboardCouple | null;
  finance: DashboardFinance;
  members: DashboardMember[];
  goals: DashboardGoals;
  recent_activity: DashboardActivity[];
};

export type CoupleDashboardSummaryRpcResult = {
  success: boolean;
  data: CoupleDashboardSummary;
};
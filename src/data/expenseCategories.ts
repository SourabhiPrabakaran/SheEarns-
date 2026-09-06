export interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export const STATIC_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { name: "Housing & Utilities", value: 14000, color: "#8f3a63", percentage: 44 },
  { name: "Food & Groceries", value: 8000, color: "#b88d45", percentage: 25 },
  { name: "Transport & Commute", value: 4000, color: "#c47a9d", percentage: 12 },
  { name: "Personal & Health", value: 3500, color: "#7f5731", percentage: 11 },
  { name: "Subscriptions & Other", value: 2500, color: "#d9a9c0", percentage: 8 }
];

import { FinancialHistoryRecord } from '../types';

/**
 * Deterministic sample financial history records for Priya (Salaried Demo)
 * Represents 4 recorded months reflecting steady progress
 */
export const PRIYA_SAMPLE_HISTORY: FinancialHistoryRecord[] = [
  {
    id: 'priya-apr',
    month: 'April',
    monthlyIncome: 43000,
    monthlyExpenses: 31000,
    monthlySavings: 5000
  },
  {
    id: 'priya-may',
    month: 'May',
    monthlyIncome: 44000,
    monthlyExpenses: 32000,
    monthlySavings: 5500
  },
  {
    id: 'priya-jun',
    month: 'June',
    monthlyIncome: 45000,
    monthlyExpenses: 32000,
    monthlySavings: 6000
  },
  {
    id: 'priya-jul',
    month: 'July',
    monthlyIncome: 45000,
    monthlyExpenses: 32000,
    monthlySavings: 6000
  }
];

/**
 * Deterministic sample financial history records for Meera (Entrepreneur Demo)
 * Represents 4 recorded months of active business activity and healthy revenue
 */
export const MEERA_SAMPLE_HISTORY: FinancialHistoryRecord[] = [
  {
    id: 'meera-apr',
    month: 'April',
    monthlyIncome: 55000,
    monthlyExpenses: 37000,
    monthlySavings: 8000,
    businessRevenue: 42000,
    businessActivity: 'Active'
  },
  {
    id: 'meera-may',
    month: 'May',
    monthlyIncome: 58000,
    monthlyExpenses: 38000,
    monthlySavings: 9000,
    businessRevenue: 44000,
    businessActivity: 'Active'
  },
  {
    id: 'meera-jun',
    month: 'June',
    monthlyIncome: 62000,
    monthlyExpenses: 39000,
    monthlySavings: 10000,
    businessRevenue: 47000,
    businessActivity: 'Active'
  },
  {
    id: 'meera-jul',
    month: 'July',
    monthlyIncome: 60000,
    monthlyExpenses: 38000,
    monthlySavings: 10000,
    businessRevenue: 45000,
    businessActivity: 'Active'
  }
];

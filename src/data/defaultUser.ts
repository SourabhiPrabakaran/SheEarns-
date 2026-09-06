import { UserProfile } from '../types';
import { PRIYA_SAMPLE_HISTORY, MEERA_SAMPLE_HISTORY } from './financialHistoryData';

export const PRIYA_DEMO_USER: UserProfile = {
  name: "Priya",
  incomeType: "Salaried",
  monthlyIncome: 45000,
  monthlyExpenses: 32000,
  monthlySavings: 6000,
  emergencySavings: 20000,
  existingDebt: 0,
  financialConfidence: "Intermediate",
  incomeConsistency: "Sometimes irregular",
  financialGoal: "Become financially independent",
  completedModules: [],
  financialHistory: PRIYA_SAMPLE_HISTORY
};

/**
 * Sample Entrepreneur Demo Profile (Meera)
 * Alternative-credit / financing readiness test user
 */
export const MEERA_DEMO_USER: UserProfile = {
  name: "Meera",
  incomeType: "Business",
  monthlyIncome: 60000,
  monthlyExpenses: 38000,
  monthlySavings: 10000,
  emergencySavings: 30000,
  existingDebt: 0,
  businessMonthlyRevenue: 45000,
  businessRevenueConsistency: "Mostly consistent",
  businessOperatingDuration: "1–3 years",
  averageMonthlyBusinessSurplus: 22000,
  financialConfidence: "Intermediate",
  incomeConsistency: "Mostly consistent",
  financialGoal: "Expand my business",
  completedModules: [],
  financialHistory: MEERA_SAMPLE_HISTORY
};

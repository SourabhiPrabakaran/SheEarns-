export type IncomeType = 'Salaried' | 'Freelance' | 'Business' | 'Other';

export type FinancialConfidence = 'Beginner' | 'Intermediate' | 'Confident';

export type IncomeConsistency = 
  | 'Very consistent'
  | 'Mostly consistent'
  | 'Sometimes irregular'
  | 'Highly irregular';

export type BusinessRevenueConsistency =
  | 'Very consistent'
  | 'Mostly consistent'
  | 'Sometimes irregular'
  | 'Highly irregular';

export type BusinessOperatingDuration =
  | 'Less than 1 year'
  | '1–3 years'
  | '3–5 years'
  | '5+ years';

export type ScoreStatus = 'Starting' | 'Building' | 'Growing' | 'Strong';

export type ComponentKey = 
  | 'savingsStability'
  | 'cashFlowHealth'
  | 'emergencyPrep'
  | 'financialLiteracy'
  | 'incomeStability';

export interface ScoreComponents {
  savingsStability: number;
  cashFlowHealth: number;
  emergencyPrep: number;
  financialLiteracy: number;
  incomeStability: number;
}

export interface UserProfile {
  name: string;
  incomeType: IncomeType;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  emergencySavings: number;
  existingDebt: number;
  financialConfidence: FinancialConfidence;
  incomeConsistency: IncomeConsistency;
  financialGoal: string;
  completedModules: string[];
  // Entrepreneur Alternative-Scoring Fields (optional, active when incomeType === 'Business')
  businessMonthlyRevenue?: number;
  businessRevenueConsistency?: BusinessRevenueConsistency;
  businessOperatingDuration?: BusinessOperatingDuration;
  averageMonthlyBusinessSurplus?: number;
  financialHistory?: FinancialHistoryRecord[];
}

export interface SheScoreResult {
  rawScore: number;
  displayScore: number;
  status: ScoreStatus;
  components: ScoreComponents;
  savingsRate: number;
  surplusRatio: number;
  monthsCoverage: number;
  weakestComponent: ComponentKey;
  strongestComponent: ComponentKey;
}

export interface Recommendation {
  id: string;
  componentKey: ComponentKey;
  title: string;
  currentStatus: string;
  targetGoal: string;
  suggestedModuleId?: string;
  suggestedModuleTitle?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  time: string;
  category: string;
  description: string;
  iconName: 'book' | 'zap' | 'sprout';
}

// Financing Readiness Types for Women Entrepreneurs
export type FinancingReadinessComponentKey =
  | 'cashFlowHealth'
  | 'businessActivityConsistency'
  | 'businessRevenueStability'
  | 'emergencyPrep'
  | 'financialLiteracy';

export interface FinancingReadinessComponents {
  cashFlowHealth: number;
  businessActivityConsistency: number;
  businessRevenueStability: number;
  emergencyPrep: number;
  financialLiteracy: number;
}

export interface FinancingReadinessResult {
  rawScore: number;
  displayScore: number;
  components: FinancingReadinessComponents;
  weakestComponent: FinancingReadinessComponentKey;
  strongestComponent: FinancingReadinessComponentKey;
  growthComponent: FinancingReadinessComponentKey;
  recommendation: string;
}

export type SheAIQuestionId = 
  | 'whyScore'
  | 'improve'
  | 'emergencyFund'
  | 'emi'
  | 'irregularIncome'
  | 'financingReadiness'
  | 'custom';

export interface SheAIQuestion {
  id: SheAIQuestionId;
  label: string;
  businessOnly?: boolean;
}

export type PageId =
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'score'
  | 'independence'
  | 'community'
  | 'learning-m1'
  | 'learning-m2'
  | 'learning-m3';

// Financial History & Trend Analytics Types
export type BusinessActivityStatus = 'Active' | 'Reduced' | 'Inactive';

export interface FinancialHistoryRecord {
  id: string;
  month: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  businessRevenue?: number;
  businessActivity?: BusinessActivityStatus;
}

export type TrendDirection = 'Improving' | 'Stable' | 'Declining';
export type ExpenseTrendDirection = 'Increasing' | 'Stable' | 'Decreasing';
export type RevenueStabilityClassification = 'Very Stable' | 'Mostly Stable' | 'Somewhat Variable' | 'Highly Variable';

export interface FinancialHistoryAnalytics {
  totalMonths: number;
  // Cash Flow Consistency
  positiveCashFlowMonths: number;
  negativeCashFlowMonths: number;
  cashFlowConsistencyPercent: number;
  averageMonthlySurplus: number;
  cashFlowInsight: string;

  // Savings Consistency
  positiveSavingsMonths: number;
  savingsConsistencyPercent: number;
  averageMonthlySavings: number;
  savingsInsight: string;

  // Trends
  incomeTrend: TrendDirection;
  expenseTrend: ExpenseTrendDirection;
  savingsTrend: TrendDirection;

  // Business Analytics (if business user)
  revenuePattern?: RevenueStabilityClassification;
  businessActivityConsistencyPercent?: number;
  activeMonthsCount?: number;
  businessRevenueInsight?: string;
  businessActivityInsight?: string;

  // Personalized Insights
  topInsights: string[];
}

export * from './community';

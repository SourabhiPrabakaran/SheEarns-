import {
  UserProfile,
  FinancingReadinessResult,
  FinancingReadinessComponents,
  FinancingReadinessComponentKey,
  BusinessRevenueConsistency
} from '../types';
import {
  calculateCashFlowHealth,
  calculateEmergencyPreparedness,
  calculateFinancialLiteracy
} from './sheScore';

/**
 * Calculates Business Activity Consistency score (Weight: 25%)
 * Very consistent = 100, Mostly consistent = 80, Sometimes irregular = 60, Highly irregular = 35
 */
export function calculateBusinessActivityScore(
  consistency?: BusinessRevenueConsistency
): number {
  switch (consistency) {
    case 'Very consistent':
      return 100;
    case 'Mostly consistent':
      return 80;
    case 'Sometimes irregular':
      return 60;
    case 'Highly irregular':
      return 35;
    default:
      return 60;
  }
}

/**
 * Calculates Business Revenue Stability score (Weight: 20%)
 * Ratio of business monthly revenue to total monthly personal income:
 * >= 75% -> 100
 * 50–74% -> 80
 * 25–49% -> 60
 * 1–24% -> 40
 * 0 -> 20
 */
export function calculateBusinessRevenueStabilityScore(
  businessRevenue?: number,
  totalIncome?: number
): number {
  if (!businessRevenue || businessRevenue <= 0 || !totalIncome || totalIncome <= 0) {
    return 20;
  }

  const ratio = (businessRevenue / totalIncome) * 100;

  if (ratio >= 75) return 100;
  if (ratio >= 50) return 80;
  if (ratio >= 25) return 60;
  if (ratio > 0) return 40;
  return 20;
}

/**
 * Generates deterministic action plan recommendation based on weakest component
 */
export function getFinancingRecommendation(
  weakest: FinancingReadinessComponentKey
): string {
  switch (weakest) {
    case 'businessActivityConsistency':
      return 'Create a more consistent monthly operating pattern.';
    case 'businessRevenueStability':
      return 'Track monthly business revenue and build a stronger revenue buffer.';
    case 'cashFlowHealth':
      return 'Improve the monthly business surplus.';
    case 'emergencyPrep':
      return 'Strengthen your emergency reserve.';
    case 'financialLiteracy':
      return 'Complete a recommended financial-learning module.';
    default:
      return 'Strengthen your emergency reserve.';
  }
}

/**
 * Entrepreneur Financing Readiness Assessment Engine
 * Alternative-credit readiness based on cash flow, business activity, and resilience
 * (Does not alter frozen SheScore weights or formulas)
 */
export function calculateFinancingReadiness(
  user: UserProfile
): FinancingReadinessResult {
  // A. Cash Flow Health (30%) - Reuses frozen SheScore calculation
  const cashFlowHealth = calculateCashFlowHealth(user.monthlyIncome, user.monthlyExpenses);

  // B. Business Activity Consistency (25%)
  const businessActivityConsistency = calculateBusinessActivityScore(
    user.businessRevenueConsistency
  );

  // C. Business Revenue Stability (20%)
  const businessRevenueStability = calculateBusinessRevenueStabilityScore(
    user.businessMonthlyRevenue,
    user.monthlyIncome
  );

  // D. Savings / Emergency Buffer (15%) - Reuses frozen SheScore calculation
  const emergencyPrep = calculateEmergencyPreparedness(
    user.emergencySavings,
    user.monthlyExpenses
  );

  // E. Financial Literacy (10%) - Reuses frozen SheScore calculation
  const financialLiteracy = calculateFinancialLiteracy(
    user.financialConfidence,
    (user.completedModules || []).length
  );

  // Final Weighted Formula:
  // (Cash Flow × 0.30) + (Business Activity × 0.25) + (Revenue Stability × 0.20) + (Emergency × 0.15) + (Literacy × 0.10)
  const rawScore =
    cashFlowHealth * 0.3 +
    businessActivityConsistency * 0.25 +
    businessRevenueStability * 0.2 +
    emergencyPrep * 0.15 +
    financialLiteracy * 0.1;

  const displayScore = Math.round(rawScore);

  const components: FinancingReadinessComponents = {
    cashFlowHealth,
    businessActivityConsistency,
    businessRevenueStability,
    emergencyPrep,
    financialLiteracy
  };

  // Sort components to identify Strength, Opportunity, and Growth area
  const componentKeys: FinancingReadinessComponentKey[] = [
    'cashFlowHealth',
    'businessActivityConsistency',
    'businessRevenueStability',
    'emergencyPrep',
    'financialLiteracy'
  ];

  const sorted = [...componentKeys].sort(
    (a, b) => components[b] - components[a]
  );

  const strongestComponent = sorted[0];
  const weakestComponent = sorted[sorted.length - 1];
  const growthComponent = sorted[2]; // Middle component

  const recommendation = getFinancingRecommendation(weakestComponent);

  return {
    rawScore,
    displayScore,
    components,
    weakestComponent,
    strongestComponent,
    growthComponent,
    recommendation
  };
}

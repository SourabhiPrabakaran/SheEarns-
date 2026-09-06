import {
  UserProfile,
  SheScoreResult,
  ScoreComponents,
  ScoreStatus,
  ComponentKey,
  FinancialConfidence,
  IncomeConsistency,
  Recommendation
} from '../types';

/**
 * 1. Savings Stability (Weight: 25%)
 * Savings Rate = (monthlySavings / monthlyIncome) * 100
 * 0–4% = 20
 * 5–9% = 40
 * 10–14% = 60
 * 15–19% = 75
 * 20–29% = 90
 * 30%+ = 100
 */
export function calculateSavingsStability(savings: number, income: number): number {
  if (income <= 0) return 20;
  const rate = (savings / income) * 100;
  if (rate < 5) return 20;
  if (rate < 10) return 40;
  if (rate < 15) return 60;
  if (rate < 20) return 75;
  if (rate < 30) return 90;
  return 100;
}

/**
 * 2. Cash Flow Health (Weight: 25%)
 * Surplus = monthlyIncome - monthlyExpenses
 * Surplus Ratio = (Surplus / monthlyIncome) * 100
 * Negative surplus ratio (< 0%) = 10
 * 0–4% = 30
 * 5–9% = 50
 * 10–19% = 75
 * 20%+ = 100
 */
export function calculateCashFlowHealth(income: number, expenses: number): number {
  if (income <= 0) return 10;
  const surplus = income - expenses;
  const surplusRatio = (surplus / income) * 100;

  if (surplusRatio < 0) return 10;
  if (surplusRatio < 5) return 30;
  if (surplusRatio < 10) return 50;
  if (surplusRatio < 20) return 75;
  return 100;
}

/**
 * 3. Emergency Preparedness (Weight: 20%)
 * Months Coverage = emergencySavings / monthlyExpenses
 * <0.5 month coverage = 20
 * 0.5–<1 = 40
 * 1–<2 = 60
 * 2–<3 = 80
 * 3+ = 100
 */
export function calculateEmergencyPreparedness(emergencySavings: number, expenses: number): number {
  if (expenses <= 0) return emergencySavings > 0 ? 100 : 20;
  const coverage = emergencySavings / expenses;

  if (coverage < 0.5) return 20;
  if (coverage < 1.0) return 40;
  if (coverage < 2.0) return 60;
  if (coverage < 3.0) return 80;
  return 100;
}

/**
 * 4. Financial Literacy (Weight: 15%)
 * Base confidence:
 * Beginner = 40
 * Intermediate = 70
 * Confident = 90
 * Each completed module adds +10, capped at 100.
 */
export function calculateFinancialLiteracy(
  confidence: FinancialConfidence,
  completedCount: number
): number {
  let base = 70;
  if (confidence === 'Beginner') base = 40;
  else if (confidence === 'Intermediate') base = 70;
  else if (confidence === 'Confident') base = 90;

  return Math.min(100, base + (completedCount * 10));
}

/**
 * 5. Income Stability (Weight: 15%)
 * Very consistent = 90
 * Mostly consistent = 75
 * Sometimes irregular = 55
 * Highly irregular = 35
 */
export function calculateIncomeStability(consistency: IncomeConsistency): number {
  switch (consistency) {
    case 'Very consistent':
      return 90;
    case 'Mostly consistent':
      return 75;
    case 'Sometimes irregular':
      return 55;
    case 'Highly irregular':
      return 35;
    default:
      return 55;
  }
}

/**
 * Status Tiers:
 * 0–39 Starting
 * 40–59 Building
 * 60–79 Growing
 * 80–100 Strong
 */
export function getStatus(score: number): ScoreStatus {
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Growing';
  if (score >= 40) return 'Building';
  return 'Starting';
}

export function getWeakestComponent(components: ScoreComponents): ComponentKey {
  const keys: ComponentKey[] = [
    'savingsStability',
    'cashFlowHealth',
    'emergencyPrep',
    'financialLiteracy',
    'incomeStability'
  ];
  return keys.reduce((minKey, currentKey) => 
    components[currentKey] < components[minKey] ? currentKey : minKey
  , keys[0]);
}

export function getStrongestComponent(components: ScoreComponents): ComponentKey {
  const keys: ComponentKey[] = [
    'savingsStability',
    'cashFlowHealth',
    'emergencyPrep',
    'financialLiteracy',
    'incomeStability'
  ];
  return keys.reduce((maxKey, currentKey) => 
    components[currentKey] > components[maxKey] ? currentKey : maxKey
  , keys[0]);
}

/**
 * Master SheScore Calculation function.
 * Strictly implements the frozen specification weights and formula:
 * SheScore = (Savings Stability * 0.25) +
 *            (Cash Flow Health * 0.25) +
 *            (Emergency Preparedness * 0.20) +
 *            (Financial Literacy * 0.15) +
 *            (Income Stability * 0.15)
 */
export function calculateSheScore(user: UserProfile): SheScoreResult {
  const savingsRate = user.monthlyIncome > 0 
    ? (user.monthlySavings / user.monthlyIncome) * 100 
    : 0;

  const surplus = user.monthlyIncome - user.monthlyExpenses;
  const surplusRatio = user.monthlyIncome > 0 
    ? (surplus / user.monthlyIncome) * 100 
    : 0;

  const monthsCoverage = user.monthlyExpenses > 0 
    ? user.emergencySavings / user.monthlyExpenses 
    : 0;

  const completedCount = (user.completedModules || []).length;

  const components: ScoreComponents = {
    savingsStability: calculateSavingsStability(user.monthlySavings, user.monthlyIncome),
    cashFlowHealth: calculateCashFlowHealth(user.monthlyIncome, user.monthlyExpenses),
    emergencyPrep: calculateEmergencyPreparedness(user.emergencySavings, user.monthlyExpenses),
    financialLiteracy: calculateFinancialLiteracy(user.financialConfidence, completedCount),
    incomeStability: calculateIncomeStability(user.incomeConsistency)
  };

  const rawScore = 
    (components.savingsStability * 0.25) +
    (components.cashFlowHealth * 0.25) +
    (components.emergencyPrep * 0.20) +
    (components.financialLiteracy * 0.15) +
    (components.incomeStability * 0.15);

  const displayScore = Math.round(rawScore);
  const status = getStatus(displayScore);
  const weakestComponent = getWeakestComponent(components);
  const strongestComponent = getStrongestComponent(components);

  return {
    rawScore,
    displayScore,
    status,
    components,
    savingsRate,
    surplusRatio,
    monthsCoverage,
    weakestComponent,
    strongestComponent
  };
}

/**
 * Deterministic Path Forward / Action Plan recommendations
 * Ordered by user's lowest component scores.
 */
export function getRecommendations(
  result: SheScoreResult,
  user: UserProfile
): Recommendation[] {
  const { components, savingsRate, monthsCoverage } = result;

  const recommendationsMap: Record<ComponentKey, Recommendation> = {
    savingsStability: {
      id: 'rec-savings',
      componentKey: 'savingsStability',
      title: 'Strengthen Monthly Savings Habit',
      currentStatus: `Saving ${savingsRate.toFixed(1)}% of income`,
      targetGoal: 'Aim for 15%–20%+ monthly savings rate',
      suggestedModuleId: 'm3',
      suggestedModuleTitle: 'Smart Saving Habits'
    },
    cashFlowHealth: {
      id: 'rec-cashflow',
      componentKey: 'cashFlowHealth',
      title: 'Protect Positive Cash Flow Margin',
      currentStatus: `₹${(user.monthlyIncome - user.monthlyExpenses).toLocaleString('en-IN')} net surplus/month`,
      targetGoal: 'Maintain surplus above 20% of monthly income',
      suggestedModuleId: 'm2',
      suggestedModuleTitle: 'Understanding Cash Flow'
    },
    emergencyPrep: {
      id: 'rec-emergency',
      componentKey: 'emergencyPrep',
      title: 'Strengthen Your Emergency Fund',
      currentStatus: `Your emergency savings currently cover approximately ${monthsCoverage.toFixed(1)} months of expenses.`,
      targetGoal: 'Target 3–6 months of essential living expenses',
      suggestedModuleId: 'm1',
      suggestedModuleTitle: 'Building an Emergency Fund'
    },
    financialLiteracy: {
      id: 'rec-literacy',
      componentKey: 'financialLiteracy',
      title: 'Expand Financial Knowledge',
      currentStatus: `${(user.completedModules || []).length} of 3 learning modules completed`,
      targetGoal: 'Complete all 3 core financial modules (+10 pts each)',
      suggestedModuleId: 'm1',
      suggestedModuleTitle: 'Core Learning Modules'
    },
    incomeStability: {
      id: 'rec-income',
      componentKey: 'incomeStability',
      title: 'Create an Income Buffer Float',
      currentStatus: `Income profile: ${user.incomeConsistency.toLowerCase()}`,
      targetGoal: 'Maintain a 1–2 month cash buffer in liquid account',
      suggestedModuleId: 'm2',
      suggestedModuleTitle: 'Understanding Cash Flow'
    }
  };

  const keys: ComponentKey[] = [
    'savingsStability',
    'cashFlowHealth',
    'emergencyPrep',
    'financialLiteracy',
    'incomeStability'
  ];

  // Sort ascending by component score to prioritize lowest areas
  const sortedKeys = [...keys].sort((a, b) => components[a] - components[b]);

  return sortedKeys.slice(0, 3).map(k => recommendationsMap[k]);
}

import {
  FinancialHistoryRecord,
  FinancialHistoryAnalytics,
  TrendDirection,
  ExpenseTrendDirection,
  RevenueStabilityClassification
} from '../types';

/**
 * Calculates cash flow consistency across recorded financial months
 */
export function calculateCashFlowConsistency(records: FinancialHistoryRecord[]) {
  if (!records || records.length === 0) {
    return {
      positiveCashFlowMonths: 0,
      negativeCashFlowMonths: 0,
      cashFlowConsistencyPercent: 0,
      averageMonthlySurplus: 0,
      insight: 'No financial records available.'
    };
  }

  const positiveCashFlowMonths = records.filter(
    r => r.monthlyIncome - r.monthlyExpenses > 0
  ).length;

  const negativeCashFlowMonths = records.filter(
    r => r.monthlyIncome - r.monthlyExpenses < 0
  ).length;

  const cashFlowConsistencyPercent = Math.round(
    (positiveCashFlowMonths / records.length) * 100
  );

  const totalSurplus = records.reduce(
    (acc, r) => acc + (r.monthlyIncome - r.monthlyExpenses),
    0
  );
  const averageMonthlySurplus = Math.round(totalSurplus / records.length);

  const insight =
    positiveCashFlowMonths === records.length
      ? `You maintained positive cash flow in all ${records.length} recorded months.`
      : `Positive cash flow in ${positiveCashFlowMonths} of the last ${records.length} months.`;

  return {
    positiveCashFlowMonths,
    negativeCashFlowMonths,
    cashFlowConsistencyPercent,
    averageMonthlySurplus,
    insight
  };
}

/**
 * Calculates savings consistency across recorded financial months
 */
export function calculateSavingsConsistency(records: FinancialHistoryRecord[]) {
  if (!records || records.length === 0) {
    return {
      positiveSavingsMonths: 0,
      savingsConsistencyPercent: 0,
      averageMonthlySavings: 0,
      insight: 'No financial records available.'
    };
  }

  const positiveSavingsMonths = records.filter(r => r.monthlySavings > 0).length;
  const savingsConsistencyPercent = Math.round(
    (positiveSavingsMonths / records.length) * 100
  );

  const totalSavings = records.reduce((acc, r) => acc + r.monthlySavings, 0);
  const averageMonthlySavings = Math.round(totalSavings / records.length);

  const insight =
    positiveSavingsMonths === records.length
      ? 'You maintained positive savings in all recorded months.'
      : `Maintained positive savings in ${positiveSavingsMonths} of ${records.length} recorded months.`;

  return {
    positiveSavingsMonths,
    savingsConsistencyPercent,
    averageMonthlySavings,
    insight
  };
}

/**
 * Evaluates directional trend between earlier months and recent months using a 5% threshold
 */
function evaluateTrend(
  values: number[],
  improvingThreshold = 1.05,
  decliningThreshold = 0.95
): TrendDirection {
  if (values.length < 2) return 'Stable';

  const half = Math.max(1, Math.floor(values.length / 2));
  const earlier = values.slice(0, half);
  const recent = values.slice(-half);

  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;

  if (earlierAvg === 0) {
    return recentAvg > 0 ? 'Improving' : 'Stable';
  }

  const ratio = recentAvg / earlierAvg;
  if (ratio >= improvingThreshold) return 'Improving';
  if (ratio <= decliningThreshold) return 'Declining';
  return 'Stable';
}

/**
 * Classifies monthly income trend: Improving | Stable | Declining
 */
export function calculateIncomeTrend(records: FinancialHistoryRecord[]): TrendDirection {
  return evaluateTrend(records.map(r => r.monthlyIncome));
}

/**
 * Classifies monthly expense trend: Increasing | Stable | Decreasing
 */
export function calculateExpenseTrend(records: FinancialHistoryRecord[]): ExpenseTrendDirection {
  const trend = evaluateTrend(records.map(r => r.monthlyExpenses));
  if (trend === 'Improving') return 'Increasing';
  if (trend === 'Declining') return 'Decreasing';
  return 'Stable';
}

/**
 * Classifies monthly savings trend: Improving | Stable | Declining
 */
export function calculateSavingsTrend(records: FinancialHistoryRecord[]): TrendDirection {
  return evaluateTrend(records.map(r => r.monthlySavings));
}

/**
 * Classifies business revenue stability using standard deviation / coefficient of variation
 */
export function calculateBusinessRevenueStability(
  records: FinancialHistoryRecord[]
): RevenueStabilityClassification {
  const revenues = records
    .map(r => r.businessRevenue)
    .filter((v): v is number => typeof v === 'number' && !isNaN(v));

  if (revenues.length < 2) return 'Mostly Stable';

  const mean = revenues.reduce((a, b) => a + b, 0) / revenues.length;
  if (mean === 0) return 'Mostly Stable';

  const variance =
    revenues.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / revenues.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / mean;

  if (cv <= 0.02) return 'Very Stable';
  if (cv <= 0.12) return 'Mostly Stable';
  if (cv <= 0.25) return 'Somewhat Variable';
  return 'Highly Variable';
}

/**
 * Calculates business activity consistency (Active months / Total recorded months * 100)
 */
export function calculateBusinessActivityConsistency(records: FinancialHistoryRecord[]) {
  const recorded = records.filter(r => r.businessActivity !== undefined);
  if (recorded.length === 0) {
    return {
      activeMonths: 0,
      totalRecordedMonths: 0,
      activityConsistencyPercent: 0,
      insight: 'No business activity records available.'
    };
  }

  const activeMonths = recorded.filter(r => r.businessActivity === 'Active').length;
  const activityConsistencyPercent = Math.round(
    (activeMonths / recorded.length) * 100
  );

  return {
    activeMonths,
    totalRecordedMonths: recorded.length,
    activityConsistencyPercent,
    insight: `Business activity was active in ${activeMonths} of the last ${recorded.length} recorded months.`
  };
}

/**
 * Aggregates all deterministic analytics and generates 2–3 personalized insights
 */
export function analyzeFinancialHistory(
  records: FinancialHistoryRecord[],
  isBusiness = false
): FinancialHistoryAnalytics {
  const totalMonths = records.length;
  const cashFlow = calculateCashFlowConsistency(records);
  const savings = calculateSavingsConsistency(records);
  const incomeTrend = calculateIncomeTrend(records);
  const expenseTrend = calculateExpenseTrend(records);
  const savingsTrend = calculateSavingsTrend(records);

  let revenuePattern: RevenueStabilityClassification | undefined;
  let businessActivityConsistencyPercent: number | undefined;
  let activeMonthsCount: number | undefined;
  let businessRevenueInsight: string | undefined;
  let businessActivityInsight: string | undefined;

  if (isBusiness) {
    revenuePattern = calculateBusinessRevenueStability(records);
    const activity = calculateBusinessActivityConsistency(records);
    businessActivityConsistencyPercent = activity.activityConsistencyPercent;
    activeMonthsCount = activity.activeMonths;

    businessRevenueInsight = `Your business revenue has remained ${revenuePattern.toLowerCase()} over the last ${totalMonths} months.`;
    businessActivityInsight = activity.insight;
  }

  // Generate top 2–3 deterministic insights
  const topInsights: string[] = [];

  // Insight 1: Cash Flow
  if (cashFlow.cashFlowConsistencyPercent === 100) {
    topInsights.push(`You maintained positive cash flow in all ${totalMonths} recorded months.`);
  } else {
    topInsights.push(
      `Positive cash flow achieved in ${cashFlow.positiveCashFlowMonths} of ${totalMonths} recorded months.`
    );
  }

  // Insight 2: Savings or Business
  if (isBusiness && revenuePattern) {
    topInsights.push(`Your business revenue has remained ${revenuePattern.toLowerCase()} across recorded months.`);
    if (activeMonthsCount !== undefined) {
      topInsights.push(`Business activity was active in ${activeMonthsCount} of ${totalMonths} recorded months.`);
    }
  } else {
    if (savingsTrend === 'Improving') {
      topInsights.push('Your savings have increased compared with earlier months.');
    } else if (savings.savingsConsistencyPercent === 100) {
      topInsights.push('You maintained positive savings across all recorded months.');
    } else {
      topInsights.push('Your monthly savings have varied across recent months.');
    }

    // Insight 3: Expense or Income
    if (expenseTrend === 'Stable') {
      topInsights.push('Your monthly expenses have remained predictable and well-contained.');
    } else if (expenseTrend === 'Increasing' && incomeTrend !== 'Improving') {
      topInsights.push('Your expenses are growing faster than your income.');
    }
  }

  return {
    totalMonths,
    positiveCashFlowMonths: cashFlow.positiveCashFlowMonths,
    negativeCashFlowMonths: cashFlow.negativeCashFlowMonths,
    cashFlowConsistencyPercent: cashFlow.cashFlowConsistencyPercent,
    averageMonthlySurplus: cashFlow.averageMonthlySurplus,
    cashFlowInsight: cashFlow.insight,

    positiveSavingsMonths: savings.positiveSavingsMonths,
    savingsConsistencyPercent: savings.savingsConsistencyPercent,
    averageMonthlySavings: savings.averageMonthlySavings,
    savingsInsight: savings.insight,

    incomeTrend,
    expenseTrend,
    savingsTrend,

    revenuePattern,
    businessActivityConsistencyPercent,
    activeMonthsCount,
    businessRevenueInsight,
    businessActivityInsight,

    topInsights: topInsights.slice(0, 3)
  };
}

import { describe, it, expect } from 'vitest';
import {
  calculateCashFlowConsistency,
  calculateSavingsConsistency,
  calculateIncomeTrend,
  calculateExpenseTrend,
  calculateSavingsTrend,
  calculateBusinessRevenueStability,
  calculateBusinessActivityConsistency,
  analyzeFinancialHistory
} from './financialHistory';
import { PRIYA_SAMPLE_HISTORY, MEERA_SAMPLE_HISTORY } from '../data/financialHistoryData';
import { PRIYA_DEMO_USER, MEERA_DEMO_USER } from '../data/defaultUser';
import { calculateSheScore } from './sheScore';
import { calculateFinancingReadiness } from './financingReadiness';
import { getRecommendedLearningModule } from './learningRecommendation';
import { FinancialHistoryRecord, UserProfile } from '../types';

describe('Financial History and Trend Analysis Engine', () => {
  // 1. Positive cash-flow consistency calculation
  it('1. Calculates positive cash-flow consistency correctly', () => {
    const records: FinancialHistoryRecord[] = [
      { id: '1', month: 'Jan', monthlyIncome: 40000, monthlyExpenses: 30000, monthlySavings: 5000 },
      { id: '2', month: 'Feb', monthlyIncome: 40000, monthlyExpenses: 42000, monthlySavings: 2000 }, // Deficit
      { id: '3', month: 'Mar', monthlyIncome: 45000, monthlyExpenses: 35000, monthlySavings: 6000 },
      { id: '4', month: 'Apr', monthlyIncome: 45000, monthlyExpenses: 35000, monthlySavings: 6000 }
    ];

    const result = calculateCashFlowConsistency(records);
    expect(result.positiveCashFlowMonths).toBe(3);
    expect(result.negativeCashFlowMonths).toBe(1);
    expect(result.cashFlowConsistencyPercent).toBe(75);
    expect(result.insight).toContain('3 of the last 4 months');
  });

  // 2. Savings consistency calculation
  it('2. Calculates savings consistency correctly', () => {
    const records: FinancialHistoryRecord[] = [
      { id: '1', month: 'Jan', monthlyIncome: 40000, monthlyExpenses: 30000, monthlySavings: 5000 },
      { id: '2', month: 'Feb', monthlyIncome: 40000, monthlyExpenses: 40000, monthlySavings: 0 }, // Zero savings
      { id: '3', month: 'Mar', monthlyIncome: 45000, monthlyExpenses: 35000, monthlySavings: 6000 },
      { id: '4', month: 'Apr', monthlyIncome: 45000, monthlyExpenses: 35000, monthlySavings: 7000 }
    ];

    const result = calculateSavingsConsistency(records);
    expect(result.positiveSavingsMonths).toBe(3);
    expect(result.savingsConsistencyPercent).toBe(75);
    expect(result.averageMonthlySavings).toBe(4500);
    expect(result.insight).toContain('3 of 4 recorded months');
  });

  // 3. Income trend classification
  it('3. Classifies income trend deterministically (Improving, Stable, Declining)', () => {
    // Stable: 43k, 44k, 45k, 45k (earlier avg 43.5k, recent avg 45k -> 3.4% increase, stable)
    expect(calculateIncomeTrend(PRIYA_SAMPLE_HISTORY)).toBe('Stable');

    // Improving: 30k, 30k -> 40k, 42k (earlier 30k, recent 41k -> > 5% increase)
    const improvingRecords: FinancialHistoryRecord[] = [
      { id: '1', month: 'Jan', monthlyIncome: 30000, monthlyExpenses: 25000, monthlySavings: 3000 },
      { id: '2', month: 'Feb', monthlyIncome: 30000, monthlyExpenses: 25000, monthlySavings: 3000 },
      { id: '3', month: 'Mar', monthlyIncome: 40000, monthlyExpenses: 25000, monthlySavings: 3000 },
      { id: '4', month: 'Apr', monthlyIncome: 42000, monthlyExpenses: 25000, monthlySavings: 3000 }
    ];
    expect(calculateIncomeTrend(improvingRecords)).toBe('Improving');

    // Declining: 50k, 50k -> 40k, 40k
    const decliningRecords: FinancialHistoryRecord[] = [
      { id: '1', month: 'Jan', monthlyIncome: 50000, monthlyExpenses: 25000, monthlySavings: 3000 },
      { id: '2', month: 'Feb', monthlyIncome: 50000, monthlyExpenses: 25000, monthlySavings: 3000 },
      { id: '3', month: 'Mar', monthlyIncome: 40000, monthlyExpenses: 25000, monthlySavings: 3000 },
      { id: '4', month: 'Apr', monthlyIncome: 40000, monthlyExpenses: 25000, monthlySavings: 3000 }
    ];
    expect(calculateIncomeTrend(decliningRecords)).toBe('Declining');
  });

  // 4. Expense trend classification
  it('4. Classifies expense trend deterministically (Increasing, Stable, Decreasing)', () => {
    expect(calculateExpenseTrend(PRIYA_SAMPLE_HISTORY)).toBe('Stable');

    const increasingExpenses: FinancialHistoryRecord[] = [
      { id: '1', month: 'Jan', monthlyIncome: 45000, monthlyExpenses: 25000, monthlySavings: 5000 },
      { id: '2', month: 'Feb', monthlyIncome: 45000, monthlyExpenses: 26000, monthlySavings: 5000 },
      { id: '3', month: 'Mar', monthlyIncome: 45000, monthlyExpenses: 35000, monthlySavings: 5000 },
      { id: '4', month: 'Apr', monthlyIncome: 45000, monthlyExpenses: 36000, monthlySavings: 5000 }
    ];
    expect(calculateExpenseTrend(increasingExpenses)).toBe('Increasing');
  });

  // 5. Savings trend classification
  it('5. Classifies savings trend deterministically (Improving, Stable, Declining)', () => {
    // Priya savings: 5000, 5500, 6000, 6000 (earlier avg 5250, recent avg 6000 -> +14.3%)
    expect(calculateSavingsTrend(PRIYA_SAMPLE_HISTORY)).toBe('Improving');

    const stableSavings: FinancialHistoryRecord[] = [
      { id: '1', month: 'Jan', monthlyIncome: 45000, monthlyExpenses: 30000, monthlySavings: 5000 },
      { id: '2', month: 'Feb', monthlyIncome: 45000, monthlyExpenses: 30000, monthlySavings: 5000 },
      { id: '3', month: 'Mar', monthlyIncome: 45000, monthlyExpenses: 30000, monthlySavings: 5000 },
      { id: '4', month: 'Apr', monthlyIncome: 45000, monthlyExpenses: 30000, monthlySavings: 5000 }
    ];
    expect(calculateSavingsTrend(stableSavings)).toBe('Stable');
  });

  // 6. Business revenue stability classification
  it('6. Classifies business revenue stability (Very Stable, Mostly Stable, Somewhat Variable, Highly Variable)', () => {
    // Meera revenues: 42k, 44k, 47k, 45k -> Mostly Stable (CV ~4%)
    expect(calculateBusinessRevenueStability(MEERA_SAMPLE_HISTORY)).toBe('Mostly Stable');

    const volatileRevenues: FinancialHistoryRecord[] = [
      { id: '1', month: 'Jan', monthlyIncome: 50000, monthlyExpenses: 30000, monthlySavings: 5000, businessRevenue: 10000 },
      { id: '2', month: 'Feb', monthlyIncome: 50000, monthlyExpenses: 30000, monthlySavings: 5000, businessRevenue: 60000 },
      { id: '3', month: 'Mar', monthlyIncome: 50000, monthlyExpenses: 30000, monthlySavings: 5000, businessRevenue: 15000 },
      { id: '4', month: 'Apr', monthlyIncome: 50000, monthlyExpenses: 30000, monthlySavings: 5000, businessRevenue: 70000 }
    ];
    expect(calculateBusinessRevenueStability(volatileRevenues)).toBe('Highly Variable');
  });

  // 7. Business activity consistency calculation
  it('7. Calculates business activity consistency correctly', () => {
    const result = calculateBusinessActivityConsistency(MEERA_SAMPLE_HISTORY);
    expect(result.activeMonths).toBe(4);
    expect(result.totalRecordedMonths).toBe(4);
    expect(result.activityConsistencyPercent).toBe(100);
    expect(result.insight).toContain('4 of the last 4 recorded months');
  });

  // 8. Priya sample history analytics
  it('8. Produces accurate analytics for Priya sample history', () => {
    const analytics = analyzeFinancialHistory(PRIYA_SAMPLE_HISTORY, false);
    expect(analytics.totalMonths).toBe(4);
    expect(analytics.positiveCashFlowMonths).toBe(4);
    expect(analytics.cashFlowConsistencyPercent).toBe(100);
    expect(analytics.positiveSavingsMonths).toBe(4);
    expect(analytics.savingsConsistencyPercent).toBe(100);
    expect(analytics.averageMonthlySavings).toBe(5625);
    expect(analytics.incomeTrend).toBe('Stable');
    expect(analytics.savingsTrend).toBe('Improving');
    expect(analytics.expenseTrend).toBe('Stable');
    expect(analytics.topInsights.length).toBeGreaterThanOrEqual(2);
    expect(analytics.topInsights[0]).toContain('positive cash flow in all 4 recorded months');
  });

  // 9. Meera sample history analytics
  it('9. Produces accurate analytics for Meera business sample history', () => {
    const analytics = analyzeFinancialHistory(MEERA_SAMPLE_HISTORY, true);
    expect(analytics.totalMonths).toBe(4);
    expect(analytics.positiveCashFlowMonths).toBe(4);
    expect(analytics.cashFlowConsistencyPercent).toBe(100);
    expect(analytics.revenuePattern).toBe('Mostly Stable');
    expect(analytics.businessActivityConsistencyPercent).toBe(100);
    expect(analytics.activeMonthsCount).toBe(4);
    expect(analytics.businessRevenueInsight).toContain('mostly stable');
  });

  // 10. Personalized recommendation using history
  it('10. Strengthens personalized recommendation explanations using history', () => {
    // When history has inconsistent savings:
    const userWithInconsistentSavings: UserProfile = {
      ...PRIYA_DEMO_USER,
      monthlySavings: 3000,
      completedModules: ['m1'] // emergency module already done
    };
    const inconsistentHistory: FinancialHistoryRecord[] = [
      { id: '1', month: 'Jan', monthlyIncome: 45000, monthlyExpenses: 35000, monthlySavings: 6000 },
      { id: '2', month: 'Feb', monthlyIncome: 45000, monthlyExpenses: 35000, monthlySavings: 0 }, // Skipped
      { id: '3', month: 'Mar', monthlyIncome: 45000, monthlyExpenses: 35000, monthlySavings: 2000 },
      { id: '4', month: 'Apr', monthlyIncome: 45000, monthlyExpenses: 35000, monthlySavings: 0 }  // Skipped
    ];

    const score = calculateSheScore(userWithInconsistentSavings);
    const rec = getRecommendedLearningModule(userWithInconsistentSavings, score, inconsistentHistory);

    expect(rec.moduleId).toBe('m3');
    expect(rec.title).toBe('Smart Saving Habits');
    expect(rec.reason).toContain('savings have varied across recent months');
  });

  // 11. Historical analytics do not modify SheScore
  it('11. Confirms historical analytics are strictly non-mutating and do not modify SheScore', () => {
    const scoreBefore = calculateSheScore(PRIYA_DEMO_USER);
    const snapshot = JSON.stringify(scoreBefore);

    // Run analytics
    analyzeFinancialHistory(PRIYA_SAMPLE_HISTORY, false);
    analyzeFinancialHistory(MEERA_SAMPLE_HISTORY, true);

    const scoreAfter = calculateSheScore(PRIYA_DEMO_USER);
    expect(JSON.stringify(scoreAfter)).toBe(snapshot);
    expect(scoreAfter.displayScore).toBe(67);
  });

  // 12. Priya score remains 67 -> 68 -> 70
  it('12. Preserves Priya existing acceptance scores (67 initial, 68 after 1 module, 70 after 2 modules)', () => {
    const initial = calculateSheScore(PRIYA_DEMO_USER);
    expect(initial.displayScore).toBe(67);

    const afterOne = calculateSheScore({
      ...PRIYA_DEMO_USER,
      completedModules: ['m1']
    });
    expect(afterOne.displayScore).toBe(68);

    const afterTwo = calculateSheScore({
      ...PRIYA_DEMO_USER,
      completedModules: ['m1', 'm2']
    });
    expect(afterTwo.displayScore).toBe(70);
  });

  // 13. Meera Financing Readiness remains 83/100
  it('13. Preserves Meera Financing Readiness score of 83/100', () => {
    const result = calculateFinancingReadiness(MEERA_DEMO_USER);
    expect(result.displayScore).toBe(83);
    expect(result.components.cashFlowHealth).toBe(100);
    expect(result.components.businessActivityConsistency).toBe(80);
    expect(result.components.businessRevenueStability).toBe(100);
  });

  // 14. Financial History is correctly separated between demo profiles
  it('14. Confirms Priya and Meera financial histories are isolated and distinct', () => {
    expect(PRIYA_SAMPLE_HISTORY.length).toBe(4);
    expect(MEERA_SAMPLE_HISTORY.length).toBe(4);

    // Priya is salaried without business revenue
    expect(PRIYA_SAMPLE_HISTORY.every(r => r.businessRevenue === undefined)).toBe(true);

    // Meera has business revenue on every record
    expect(MEERA_SAMPLE_HISTORY.every(r => typeof r.businessRevenue === 'number')).toBe(true);
    expect(MEERA_SAMPLE_HISTORY.every(r => r.businessActivity === 'Active')).toBe(true);

    // Records have unique IDs across personas
    const priyaIds = PRIYA_SAMPLE_HISTORY.map(r => r.id);
    const meeraIds = MEERA_SAMPLE_HISTORY.map(r => r.id);
    expect(priyaIds.some(id => meeraIds.includes(id))).toBe(false);
  });
});

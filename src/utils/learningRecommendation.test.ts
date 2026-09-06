import { describe, it, expect } from 'vitest';
import { getRecommendedLearningModule } from './learningRecommendation';
import { calculateSheScore } from './sheScore';
import { calculateFinancingReadiness } from './financingReadiness';
import { PRIYA_DEMO_USER, MEERA_DEMO_USER } from '../data/defaultUser';
import { UserProfile } from '../types';

describe('Personalized Learning Recommendation Engine', () => {
  it('1. Recommends "Building an Emergency Fund" (m1) when emergency coverage is the weakest area', () => {
    // Priya has 0.6 months coverage (emergencyPrep = 40, savings = 60, cashFlow = 100)
    const score = calculateSheScore(PRIYA_DEMO_USER);
    const rec = getRecommendedLearningModule(PRIYA_DEMO_USER, score);

    expect(rec.allCompleted).toBe(false);
    expect(rec.moduleId).toBe('m1');
    expect(rec.title).toBe('Building an Emergency Fund');
    expect(rec.priority).toBe('high');
    expect(rec.reason).toContain('0.6 mos of expenses');
  });

  it('2. Recommends "Understanding Cash Flow" (m2) when cash-flow health is the weakest area', () => {
    // User with expenses exceeding income, but healthy emergency savings and savings habit
    const userWithWeakCashFlow: UserProfile = {
      ...PRIYA_DEMO_USER,
      monthlyIncome: 40000,
      monthlyExpenses: 42000, // Deficit / negative cash flow
      monthlySavings: 3000,
      emergencySavings: 200000, // 4.7 months coverage
      completedModules: []
    };

    const score = calculateSheScore(userWithWeakCashFlow);
    expect(score.components.cashFlowHealth).toBe(10); // Negative surplus deficit tier
    expect(score.components.emergencyPrep).toBe(100);

    const rec = getRecommendedLearningModule(userWithWeakCashFlow, score);
    expect(rec.allCompleted).toBe(false);
    expect(rec.moduleId).toBe('m2');
    expect(rec.title).toBe('Understanding Cash Flow');
    expect(rec.reason).toContain('how money moves through your month');
  });

  it('3. Recommends "Smart Saving Habits" (m3) when savings behaviour is the weakest area', () => {
    // User with strong cash flow and good emergency cushion, but poor savings rate
    const userWithWeakSavings: UserProfile = {
      ...PRIYA_DEMO_USER,
      monthlyIncome: 50000,
      monthlyExpenses: 30000, // Surplus +20,000 (cashFlow = 100)
      monthlySavings: 1000,   // 2% savings rate (savingsStability = 20)
      emergencySavings: 150000, // 5 months coverage (emergencyPrep = 100)
      completedModules: []
    };

    const score = calculateSheScore(userWithWeakSavings);
    expect(score.components.savingsStability).toBe(20);
    expect(score.components.cashFlowHealth).toBe(100);
    expect(score.components.emergencyPrep).toBe(100);

    const rec = getRecommendedLearningModule(userWithWeakSavings, score);
    expect(rec.allCompleted).toBe(false);
    expect(rec.moduleId).toBe('m3');
    expect(rec.title).toBe('Smart Saving Habits');
    expect(rec.reason).toContain('consistent saving habits');
  });

  it('4. Completed modules are never recommended again', () => {
    const userWithM1Completed: UserProfile = {
      ...PRIYA_DEMO_USER,
      completedModules: ['m1']
    };

    const score = calculateSheScore(userWithM1Completed);
    const rec = getRecommendedLearningModule(userWithM1Completed, score);

    expect(rec.moduleId).not.toBe('m1');
    expect(rec.allCompleted).toBe(false);
  });

  it('5. When highest-priority module is completed, next most relevant incomplete module is recommended', () => {
    // Priya has m1 (40) < m3 (60) < m2 (100)
    // When m1 is completed, m3 should be recommended next
    const userAfterM1: UserProfile = {
      ...PRIYA_DEMO_USER,
      completedModules: ['m1']
    };

    const score1 = calculateSheScore(userAfterM1);
    const rec1 = getRecommendedLearningModule(userAfterM1, score1);
    expect(rec1.moduleId).toBe('m3');
    expect(rec1.title).toBe('Smart Saving Habits');

    // When both m1 and m3 are completed, m2 should be recommended next
    const userAfterM1AndM3: UserProfile = {
      ...PRIYA_DEMO_USER,
      completedModules: ['m1', 'm3']
    };

    const score2 = calculateSheScore(userAfterM1AndM3);
    const rec2 = getRecommendedLearningModule(userAfterM1AndM3, score2);
    expect(rec2.moduleId).toBe('m2');
    expect(rec2.title).toBe('Understanding Cash Flow');
  });

  it('6. When all three modules are completed, shows positive completion state', () => {
    const userAllCompleted: UserProfile = {
      ...PRIYA_DEMO_USER,
      completedModules: ['m1', 'm2', 'm3']
    };

    const score = calculateSheScore(userAllCompleted);
    const rec = getRecommendedLearningModule(userAllCompleted, score);

    expect(rec.allCompleted).toBe(true);
    expect(rec.moduleId).toBeNull();
    expect(rec.title).toBe("You're Building Strong Financial Foundations");
    expect(rec.reason).toBe(
      "You've completed all of your Financial Readiness Learning modules. Keep applying these habits to strengthen your financial independence."
    );
    expect(rec.priority).toBe('completed');
  });

  it('7. Priya’s existing acceptance scores remain strictly frozen (67 -> 68 -> 70)', () => {
    // Initial
    const initialScore = calculateSheScore(PRIYA_DEMO_USER);
    expect(initialScore.displayScore).toBe(67);
    expect(initialScore.status).toBe('Growing');

    // After 1 module
    const user1 = { ...PRIYA_DEMO_USER, completedModules: ['m1'] };
    const score1 = calculateSheScore(user1);
    expect(score1.displayScore).toBe(68);
    expect(score1.status).toBe('Growing');

    // After 2 modules
    const user2 = { ...PRIYA_DEMO_USER, completedModules: ['m1', 'm2'] };
    const score2 = calculateSheScore(user2);
    expect(score2.displayScore).toBe(70);
    expect(score2.status).toBe('Growing');
  });

  it('8. Entrepreneur Financing Readiness calculations remain unchanged', () => {
    const meeraResult = calculateFinancingReadiness(MEERA_DEMO_USER);
    expect(meeraResult.displayScore).toBe(83);
    expect(meeraResult.components.cashFlowHealth).toBe(100);
    expect(meeraResult.components.businessActivityConsistency).toBe(80);
    expect(meeraResult.components.businessRevenueStability).toBe(100);
    expect(meeraResult.components.emergencyPrep).toBe(40);
    expect(meeraResult.components.financialLiteracy).toBe(70);
  });

  it('9. Recommendation logic is strictly read-only and does not modify any SheScore calculation', () => {
    const scoreBefore = calculateSheScore(PRIYA_DEMO_USER);
    const scoreSnapshot = JSON.stringify(scoreBefore);

    // Call recommendation engine
    const rec = getRecommendedLearningModule(PRIYA_DEMO_USER, scoreBefore);
    expect(rec.moduleId).toBe('m1');

    // Verify score data object was untouched
    expect(JSON.stringify(scoreBefore)).toBe(scoreSnapshot);

    const scoreAfter = calculateSheScore(PRIYA_DEMO_USER);
    expect(scoreAfter.rawScore).toBe(scoreBefore.rawScore);
    expect(scoreAfter.displayScore).toBe(scoreBefore.displayScore);
  });
});

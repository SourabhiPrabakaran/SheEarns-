import { UserProfile, SheScoreResult, FinancialHistoryRecord } from '../types';
import { LEARNING_MODULES } from '../data/learningModules';
import { formatMonths } from './formatters';
import { calculateCashFlowConsistency, calculateSavingsConsistency } from './financialHistory';

export interface LearningRecommendation {
  moduleId: string | null;
  title: string;
  reason: string;
  priority: 'high' | 'medium' | 'completed';
  allCompleted: boolean;
}

/**
 * Deterministically analyzes the user's financial profile, existing SheScore components,
 * and optional financial history to recommend the most relevant incomplete learning module among:
 * 1. Building an Emergency Fund (m1) -> emergencyPrep
 * 2. Understanding Cash Flow (m2) -> cashFlowHealth
 * 3. Smart Saving Habits (m3) -> savingsStability
 *
 * Does not directly alter or inject any score points.
 */
export function getRecommendedLearningModule(
  user: UserProfile,
  scoreData: SheScoreResult,
  history?: FinancialHistoryRecord[]
): LearningRecommendation {
  const completed = user.completedModules || [];
  const records = history || user.financialHistory || [];

  // Check if all existing modules are completed
  const allCompleted = LEARNING_MODULES.every(m => completed.includes(m.id));
  if (allCompleted) {
    return {
      moduleId: null,
      title: "You're Building Strong Financial Foundations",
      reason: "You've completed all of your Financial Readiness Learning modules. Keep applying these habits to strengthen your financial independence.",
      priority: 'completed',
      allCompleted: true
    };
  }

  // Existing coverage calculation
  const monthsCoverage = user.monthlyExpenses > 0
    ? user.emergencySavings / user.monthlyExpenses
    : 0;

  // Evaluate history patterns if records are available
  let cashFlowReason = 'Understanding how money moves through your month can help you identify opportunities to improve your financial breathing room.';
  let savingsReason = 'Creating more consistent saving habits can help you build financial security over time.';
  let cashFlowHistoryBonus = 0;
  let savingsHistoryBonus = 0;

  if (records.length > 0) {
    const cashFlowAnalysis = calculateCashFlowConsistency(records);
    const savingsAnalysis = calculateSavingsConsistency(records);

    // If cash flow is inconsistent, strengthen reason and increase recommendation priority
    if (cashFlowAnalysis.positiveCashFlowMonths < records.length) {
      cashFlowReason = 'Your financial history shows inconsistent cash flow across recent months. Understanding how money moves through your month can help you identify opportunities to improve your financial breathing room.';
      cashFlowHistoryBonus = 25; // Pulls score lower to elevate priority
    }

    // If savings consistency is imperfect or has varied, strengthen reason and elevate priority
    if (savingsAnalysis.savingsConsistencyPercent < 100) {
      savingsReason = 'Your financial history shows that your savings have varied across recent months. Building a more consistent saving habit may strengthen your financial resilience.';
      savingsHistoryBonus = 25; // Pulls score lower to elevate priority
    }
  }

  // Candidate mapping to existing calculated score components
  const candidates: {
    id: string;
    effectiveScore: number;
    rawComponentScore: number;
    title: string;
    reason: string;
    tieBreakerWeight: number; // emergencyPrep (3) > cashFlowHealth (2) > savingsStability (1)
  }[] = [
    {
      id: 'm1',
      effectiveScore: scoreData.components.emergencyPrep,
      rawComponentScore: scoreData.components.emergencyPrep,
      title: 'Building an Emergency Fund',
      reason: `Your emergency savings currently cover approximately ${formatMonths(monthsCoverage)} of expenses. Building a stronger emergency buffer could improve your financial resilience.`,
      tieBreakerWeight: 3
    },
    {
      id: 'm2',
      effectiveScore: Math.max(0, scoreData.components.cashFlowHealth - cashFlowHistoryBonus),
      rawComponentScore: scoreData.components.cashFlowHealth,
      title: 'Understanding Cash Flow',
      reason: cashFlowReason,
      tieBreakerWeight: 2
    },
    {
      id: 'm3',
      effectiveScore: Math.max(0, scoreData.components.savingsStability - savingsHistoryBonus),
      rawComponentScore: scoreData.components.savingsStability,
      title: 'Smart Saving Habits',
      reason: savingsReason,
      tieBreakerWeight: 1
    }
  ];

  // Filter out already completed modules
  const incompleteCandidates = candidates.filter(c => !completed.includes(c.id));

  // Sort by lowest effective score first; on tie, highest tieBreakerWeight first
  incompleteCandidates.sort((a, b) => {
    if (a.effectiveScore !== b.effectiveScore) {
      return a.effectiveScore - b.effectiveScore;
    }
    return b.tieBreakerWeight - a.tieBreakerWeight;
  });

  const best = incompleteCandidates[0];

  return {
    moduleId: best.id,
    title: best.title,
    reason: best.reason,
    priority: best.rawComponentScore < 50 ? 'high' : 'medium',
    allCompleted: false
  };
}

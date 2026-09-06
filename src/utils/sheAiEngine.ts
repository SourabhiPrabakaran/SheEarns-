import { UserProfile, SheScoreResult, SheAIQuestion, SheAIQuestionId } from '../types';
import { formatINR } from './formatters';
import { calculateFinancingReadiness } from './financingReadiness';

export const SHE_AI_QUESTIONS: SheAIQuestion[] = [
  { id: 'whyScore', label: 'Why is my SheScore this?' },
  { id: 'improve', label: 'How can I improve my score?' },
  { id: 'emergencyFund', label: 'What is an emergency fund?' },
  { id: 'emi', label: 'How does EMI work?' },
  { id: 'irregularIncome', label: 'How should I manage irregular income?' },
  { id: 'financingReadiness', label: 'How is my financing readiness assessed?', businessOnly: true }
];

export interface SheAIResult {
  text: string;
  source: 'groq' | 'deterministic';
  keyPoint?: string;
  disclaimer?: string;
}

/**
 * Deterministic SheAI Response Engine
 * Single Source of Truth for all financial facts.
 */
export function getDeterministicSheAIResponse(
  questionId: SheAIQuestionId,
  user: UserProfile,
  scoreData: SheScoreResult
): string {
  const { displayScore, status, components, monthsCoverage, savingsRate } = scoreData;
  const name = user.name || 'there';
  const monthlyExpenses = user.monthlyExpenses;
  const targetEmergencyMin = monthlyExpenses * 3;
  const targetEmergencyMax = monthlyExpenses * 6;
  const safeMaxEMI = Math.round(user.monthlyIncome * 0.4);

  switch (questionId) {
    case 'whyScore': {
      return `Hi ${name}! Your SheScore of ${displayScore} places you in the "${status}" range.

Here is the exact breakdown based on your profile:
• Cash Flow Health (${components.cashFlowHealth}/100): Excellent. You maintain a strong positive monthly surplus of ₹${(user.monthlyIncome - user.monthlyExpenses).toLocaleString('en-IN')}.
• Savings Stability (${components.savingsStability}/100): Solid foundation. You save ${savingsRate.toFixed(1)}% of your monthly income.
• Financial Literacy (${components.financialLiteracy}/100): Based on your ${user.financialConfidence.toLowerCase()} confidence baseline and ${(user.completedModules || []).length} completed learning modules.
• Income Stability (${components.incomeStability}/100): Reflects your ${user.incomeConsistency.toLowerCase()} income flow.
• Emergency Preparedness (${components.emergencyPrep}/100): Your biggest opportunity for growth, currently covering ${monthsCoverage.toFixed(1)} months of expenses.

SheScore measures real-world financial resilience beyond traditional credit history.`;
    }

    case 'improve': {
      const isLowestEmergency = scoreData.weakestComponent === 'emergencyPrep';
      return `Great question, ${name}. To lift your SheScore most effectively:

1. Focus on your biggest opportunity: ${isLowestEmergency ? 'Emergency Preparedness' : scoreData.weakestComponent}.
Currently your emergency savings (${formatINR(user.emergencySavings)}) cover ${monthsCoverage.toFixed(1)} months of expenses. Building toward 1–2 months will raise this sub-score from ${components.emergencyPrep} to 60+.

2. Complete your Micro-Learning Modules:
Each completed module adds +10 to your Financial Literacy score (currently ${components.financialLiteracy}), directly increasing your overall SheScore.

3. Boost your Savings Rate:
Moving from ${savingsRate.toFixed(1)}% to 15%+ will elevate your Savings Stability score to 75.

Small, consistent steps compound into lasting financial independence!`;
    }

    case 'emergencyFund': {
      return `An emergency fund is a dedicated financial safety net set aside strictly for unexpected events — such as medical emergencies, sudden family needs, or temporary income interruptions.

For your monthly expenses of ${formatINR(monthlyExpenses)}:
• Current cushion: ${formatINR(user.emergencySavings)} (covers ~${monthsCoverage.toFixed(1)} months).
• Ideal 3-month target: ${formatINR(targetEmergencyMin)}.
• Comprehensive 6-month target: ${formatINR(targetEmergencyMax)}.

Tip: Keep this in a high-yield liquid savings account or liquid mutual fund that is separate from your daily spending account, accessible whenever you need peace of mind.`;
    }

    case 'emi': {
      return `An EMI (Equated Monthly Installment) is a fixed payment made to a lender each month at a specified date to repay both the principal and interest of a loan.

Guidelines for safe borrowing:
• Safe limit rule: Total monthly EMIs should never exceed 40% of your net monthly income.
• For your income (${formatINR(user.monthlyIncome)}), safe maximum total EMI is ${formatINR(safeMaxEMI)}/month.
• Current debt recorded: ${formatINR(user.existingDebt || 0)}.

Because your cash flow surplus is strong (${formatINR(user.monthlyIncome - user.monthlyExpenses)}/month), you have healthy debt service capacity, but keeping debt low preserves your financial freedom.`;
    }

    case 'irregularIncome': {
      return `Managing income that is ${user.incomeConsistency.toLowerCase()} requires a "buffer-first" strategy:

1. Maintain a 1-Month Float:
Keep 1 month of living expenses (${formatINR(monthlyExpenses)}) in your primary account as an operational buffer so low-cash weeks don't cause stress.

2. Pay Yourself a Fixed Salary:
Deposit all variable earnings into a holding account, and transfer a steady amount (${formatINR(monthlyExpenses + user.monthlySavings)}) to your personal account on the 1st of each month.

3. Save Aggressively in Peak Months:
In high-earning months, stash 50%+ of the extra into your emergency fund to cushion lean cycles.

This approach stabilizes your cash flow and builds peace of mind!`;
    }

    case 'financingReadiness': {
      const fr = user.incomeType === 'Business' ? calculateFinancingReadiness(user) : null;
      const frScore = fr ? fr.displayScore : 80;
      return `Hi ${name}! Your Entrepreneur Financing Readiness score is ${frScore}/100.

This is an educational alternative credit readiness indicator based on your cash flow patterns, business consistency, and financial resilience:
• Cash Flow Health (${fr ? fr.components.cashFlowHealth : 100}/100, 30% weight): Measures your ability to generate sustainable surplus from monthly operations.
• Business Activity Consistency (${fr ? fr.components.businessActivityConsistency : 80}/100, 25% weight): Reflects operational regularity (${user.businessRevenueConsistency || 'Mostly consistent'}).
• Business Revenue Stability (${fr ? fr.components.businessRevenueStability : 100}/100, 20% weight): Business revenue (${formatINR(user.businessMonthlyRevenue || 0)}) relative to total monthly income.
• Savings / Emergency Buffer (${fr ? fr.components.emergencyPrep : 40}/100, 15% weight): Dedicated liquid buffer to cushion lean cycles.
• Financial Literacy (${fr ? fr.components.financialLiteracy : 70}/100, 10% weight): Foundational financial management knowledge.

Next Action Step: ${fr ? fr.recommendation : 'Strengthen your emergency reserve to buffer seasonal slowdowns.'}

Disclaimer: This is an educational financing-readiness indicator based on sample signals, not an official credit score or lending decision.`;
    }

    default:
      return "I'm here to provide clear, empathetic guidance on your finances. Choose any question to explore!";
  }
}

/**
 * Guided SheAI caller via server-side endpoint (/api/sheai)
 * Strictly keeps the deterministic engine as the source of truth.
 * Falls back immediately and safely on missing key, timeout, or server failure.
 */
export async function getSheAIResponse(
  questionId: SheAIQuestionId,
  user: UserProfile,
  scoreData: SheScoreResult
): Promise<SheAIResult> {
  const deterministicAnswer = getDeterministicSheAIResponse(questionId, user, scoreData);
  const questionObj = SHE_AI_QUESTIONS.find(q => q.id === questionId);
  const questionLabel = questionObj ? questionObj.label : questionId;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const response = await fetch('/api/sheai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        questionId,
        referenceFactSheet: deterministicAnswer,
        questionLabel
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { text: deterministicAnswer, source: 'deterministic' };
    }

    const resJson = await response.json();

    if (resJson.success && resJson.source === 'groq' && resJson.data?.answer) {
      return {
        text: resJson.data.answer,
        source: 'groq',
        keyPoint: resJson.data.key_point,
        disclaimer: resJson.data.disclaimer
      };
    }

    return { text: deterministicAnswer, source: 'deterministic' };
  } catch {
    // Network failure, abort, or offline - always serve the deterministic truth
    return { text: deterministicAnswer, source: 'deterministic' };
  }
}

/**
 * Ask a custom educational financial question to SheAI.
 * Validates scope first. Sends to /api/sheai.
 * Returns structured answer, keyPoint, and disclaimer.
 * Never throws or displays an API error.
 */
export async function askCustomSheAIQuestion(question: string): Promise<SheAIResult> {
  const trimmed = (question || '').trim();

  // 1. Client-Side Scope Guard Check (runs immediately)
  const { validateCustomQuestionScope, getEducationalFallback } = await import('./scopeGuard');
  const scopeCheck = validateCustomQuestionScope(trimmed);
  if (!scopeCheck.isAllowed && scopeCheck.outOfScopeResponse) {
    return {
      text: scopeCheck.outOfScopeResponse.answer,
      source: 'deterministic',
      keyPoint: scopeCheck.outOfScopeResponse.key_point,
      disclaimer: scopeCheck.outOfScopeResponse.disclaimer
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const response = await fetch('/api/sheai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        questionId: 'custom',
        customQuestion: trimmed
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const fallback = getEducationalFallback(trimmed);
      return {
        text: fallback.answer,
        source: 'deterministic',
        keyPoint: fallback.key_point,
        disclaimer: fallback.disclaimer
      };
    }

    const resJson = await response.json();

    if (resJson.success && resJson.data?.answer) {
      return {
        text: resJson.data.answer,
        source: resJson.source || 'groq',
        keyPoint: resJson.data.key_point,
        disclaimer: resJson.data.disclaimer
      };
    }

    const fallback = getEducationalFallback(trimmed);
    return {
      text: fallback.answer,
      source: 'deterministic',
      keyPoint: fallback.key_point,
      disclaimer: fallback.disclaimer
    };
  } catch {
    const fallback = getEducationalFallback(trimmed);
    return {
      text: fallback.answer,
      source: 'deterministic',
      keyPoint: fallback.key_point,
      disclaimer: fallback.disclaimer
    };
  }
}


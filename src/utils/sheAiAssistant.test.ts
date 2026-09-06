import { describe, it, expect } from 'vitest';
import { validateCustomQuestionScope, getEducationalFallback } from './scopeGuard';
import { askCustomSheAIQuestion } from './sheAiEngine';
import { calculateSheScore } from './sheScore';
import { calculateFinancingReadiness } from './financingReadiness';
import { PRIYA_DEMO_USER, MEERA_DEMO_USER } from '../data/defaultUser';

describe('Global SheAI Assistant & Scope Guard', () => {
  const SUGGESTED_QUESTIONS = [
    'What is APR?',
    'What is collateral?',
    'How does a credit score work?',
    'What is an emergency fund?',
    'How can I build good financial habits?'
  ];

  it('1. All suggested questions pass the educational scope guard', () => {
    SUGGESTED_QUESTIONS.forEach(q => {
      const check = validateCustomQuestionScope(q);
      expect(check.isAllowed).toBe(true);
      expect(check.outOfScopeResponse).toBeUndefined();
    });
  });

  it('2. Educational financial queries are correctly approved', () => {
    const validQuestions = [
      'What is the difference between secured and unsecured loans?',
      'How is EMI calculated on a personal loan?',
      'What is a debt-to-income ratio?',
      'How does budgeting with 50/30/20 rule work?',
      'How does alternative financing evaluate cash flow instead of collateral?'
    ];

    validQuestions.forEach(q => {
      const check = validateCustomQuestionScope(q);
      expect(check.isAllowed).toBe(true);
    });
  });

  it('3. Prohibited queries are blocked by scope guard before calling Groq', () => {
    const prohibitedQueries = [
      'Which stock should I buy for multibagger returns?',
      'Should I invest in crypto or bitcoin?',
      'Will the bank approve my loan application?',
      'How to double my money in 30 days with guaranteed return?',
      'Can I sue my bank in court?',
      'What is the medicine dosage to cure headache?'
    ];

    prohibitedQueries.forEach(q => {
      const check = validateCustomQuestionScope(q);
      expect(check.isAllowed).toBe(false);
      expect(check.outOfScopeResponse).toBeDefined();
      expect(check.outOfScopeResponse?.answer).toContain('educational financial guide');
      expect(check.outOfScopeResponse?.key_point).toBeDefined();
    });
  });

  it('4. Blocked queries return friendly structured educational responses directly', async () => {
    const result = await askCustomSheAIQuestion('Should I buy Bitcoin or Ethereum today?');
    expect(result.source).toBe('deterministic');
    expect(result.text).toContain('educational financial guide');
    expect(result.keyPoint).toBeDefined();
    expect(result.disclaimer).toBeDefined();
  });

  it('5. Educational fallback provides structured output (answer, keyPoint, disclaimer)', () => {
    const fallback = getEducationalFallback('What is collateral?');
    expect(fallback.answer).toContain('Collateral');
    expect(fallback.key_point).toBeDefined();
    expect(fallback.disclaimer).toContain('Educational explanation');
  });

  it('6. SheAI interaction is strictly read-only and never modifies SheScore or weights', () => {
    const scoreBefore = calculateSheScore(PRIYA_DEMO_USER);
    const scoreSnapshot = JSON.stringify(scoreBefore);

    // Educational fallback lookup
    getEducationalFallback('How does cash flow work?');

    const scoreAfter = calculateSheScore(PRIYA_DEMO_USER);
    expect(JSON.stringify(scoreAfter)).toBe(scoreSnapshot);
    expect(scoreAfter.displayScore).toBe(67);
  });

  it('7. Preserves Priya existing acceptance scores (67 -> 68 -> 70)', () => {
    const initial = calculateSheScore(PRIYA_DEMO_USER);
    expect(initial.displayScore).toBe(67);

    const oneMod = calculateSheScore({ ...PRIYA_DEMO_USER, completedModules: ['m1'] });
    expect(oneMod.displayScore).toBe(68);

    const twoMod = calculateSheScore({ ...PRIYA_DEMO_USER, completedModules: ['m1', 'm2'] });
    expect(twoMod.displayScore).toBe(70);
  });

  it('8. Preserves Meera Financing Readiness score of 83/100', () => {
    const result = calculateFinancingReadiness(MEERA_DEMO_USER);
    expect(result.displayScore).toBe(83);
    expect(result.components.cashFlowHealth).toBe(100);
    expect(result.components.businessActivityConsistency).toBe(80);
    expect(result.components.businessRevenueStability).toBe(100);
  });
});

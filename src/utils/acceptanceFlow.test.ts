import { describe, it, expect } from 'vitest';
import { PRIYA_DEMO_USER } from '../data/defaultUser';
import { calculateSheScore, getRecommendations } from './sheScore';
import { getDeterministicSheAIResponse, SHE_AI_QUESTIONS } from './sheAiEngine';
import { INDEPENDENCE_QUESTIONS } from '../data/independenceData';

describe('End-to-End Acceptance Flow: Landing → Onboarding → Dashboard → SheScore → SheAI → Independence', () => {
  it('Step 1 & 2: Starts with official Priya Demo Profile and computes Initial SheScore of 67', () => {
    // 1. Initial Priya Profile
    const user = { ...PRIYA_DEMO_USER };
    expect(user.name).toBe('Priya');
    expect(user.monthlyIncome).toBe(45000);
    expect(user.monthlyExpenses).toBe(32000);
    expect(user.monthlySavings).toBe(6000);
    expect(user.emergencySavings).toBe(20000);
    expect(user.financialConfidence).toBe('Intermediate');
    expect(user.incomeConsistency).toBe('Sometimes irregular');

    // 2. Score Calculation
    const score = calculateSheScore(user);
    expect(score.components.savingsStability).toBe(60);
    expect(score.components.cashFlowHealth).toBe(100);
    expect(score.components.emergencyPrep).toBe(40);
    expect(score.components.financialLiteracy).toBe(70);
    expect(score.components.incomeStability).toBe(55);

    // Raw score is 66.75 and displayed rounded score is 67
    expect(score.rawScore).toBeCloseTo(66.75, 2);
    expect(score.displayScore).toBe(67);
    expect(score.status).toBe('Growing');
  });

  it('Step 3: Completing one module updates Financial Literacy to 80 and SheScore to 68', () => {
    const userAfterModule1 = {
      ...PRIYA_DEMO_USER,
      completedModules: ['m1']
    };

    const score1 = calculateSheScore(userAfterModule1);
    expect(score1.components.financialLiteracy).toBe(80);
    expect(score1.rawScore).toBeCloseTo(68.25, 2);
    expect(score1.displayScore).toBe(68);
    expect(score1.status).toBe('Growing');
  });

  it('Step 4: Completing two modules updates Financial Literacy to 90 and SheScore to 70', () => {
    const userAfterModule2 = {
      ...PRIYA_DEMO_USER,
      completedModules: ['m1', 'm2']
    };

    const score2 = calculateSheScore(userAfterModule2);
    expect(score2.components.financialLiteracy).toBe(90);
    expect(score2.rawScore).toBeCloseTo(69.75, 2);
    expect(score2.displayScore).toBe(70);
    expect(score2.status).toBe('Growing');
  });

  it('Step 5: SheScore Breakdown identifies Top Strength and Biggest Opportunity accurately', () => {
    const score = calculateSheScore(PRIYA_DEMO_USER);
    expect(score.strongestComponent).toBe('cashFlowHealth'); // 100
    expect(score.weakestComponent).toBe('emergencyPrep');    // 40

    const recs = getRecommendations(score, PRIYA_DEMO_USER);
    expect(recs.length).toBe(3);
    // Highest priority recommendation must address the lowest component (Emergency Prep)
    expect(recs[0].componentKey).toBe('emergencyPrep');
  });

  it('Step 6: Guided SheAI strictly supports all 5 controlled questions with deterministic facts', () => {
    const score = calculateSheScore(PRIYA_DEMO_USER);
    const standardQuestions = SHE_AI_QUESTIONS.filter(q => !q.businessOnly);
    expect(standardQuestions.length).toBe(5);

    const questionIds = ['whyScore', 'improve', 'emergencyFund', 'emi', 'irregularIncome'] as const;

    questionIds.forEach(qId => {
      const response = getDeterministicSheAIResponse(qId, PRIYA_DEMO_USER, score);
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(40);
    });

    // Verify dynamic injection of Priya's numbers in SheAI answers
    const whyResponse = getDeterministicSheAIResponse('whyScore', PRIYA_DEMO_USER, score);
    expect(whyResponse).toContain('Priya');
    expect(whyResponse).toContain('67');
    expect(whyResponse).toContain('100'); // Cash Flow Health
    expect(whyResponse).toContain('40');  // Emergency Preparedness
  });

  it('Step 7: Independence Check questions and data are complete', () => {
    expect(INDEPENDENCE_QUESTIONS.length).toBe(5);
    INDEPENDENCE_QUESTIONS.forEach(q => {
      expect(q.id).toBeDefined();
      expect(q.question.length).toBeGreaterThan(10);
    });
  });

  it('Step 8: Financial Readiness Learning Module pages and content integrity', async () => {
    const { LESSON_CONTENTS } = await import('../data/lessonContents');
    const moduleIds = ['m1', 'm2', 'm3'];

    moduleIds.forEach(id => {
      const lesson = LESSON_CONTENTS[id];
      expect(lesson).toBeDefined();
      expect(lesson.title).toBeTruthy();
      expect(lesson.time).toContain('min');
      expect(lesson.sections.length).toBeGreaterThanOrEqual(3);
      expect(lesson.practicalExample).toBeDefined();
      expect(lesson.practicalExample.breakdown.length).toBeGreaterThanOrEqual(2);
      expect(lesson.keyTakeaways.length).toBeGreaterThanOrEqual(3);
      expect(lesson.nextSteps.length).toBeGreaterThanOrEqual(2);
    });
  });
});

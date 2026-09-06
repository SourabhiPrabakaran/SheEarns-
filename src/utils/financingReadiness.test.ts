import { describe, it, expect } from 'vitest';
import {
  calculateBusinessActivityScore,
  calculateBusinessRevenueStabilityScore,
  calculateFinancingReadiness,
  getFinancingRecommendation
} from './financingReadiness';
import { calculateSheScore } from './sheScore';
import { PRIYA_DEMO_USER, MEERA_DEMO_USER } from '../data/defaultUser';
import { UserProfile } from '../types';
import { SHE_AI_QUESTIONS, getDeterministicSheAIResponse } from './sheAiEngine';

describe('Requirement 3: Entrepreneur Financing Readiness Assessment', () => {
  describe('1. Business Activity Consistency Score Mapping (25% weight)', () => {
    it('correctly maps all four consistency levels', () => {
      expect(calculateBusinessActivityScore('Very consistent')).toBe(100);
      expect(calculateBusinessActivityScore('Mostly consistent')).toBe(80);
      expect(calculateBusinessActivityScore('Sometimes irregular')).toBe(60);
      expect(calculateBusinessActivityScore('Highly irregular')).toBe(35);
      expect(calculateBusinessActivityScore(undefined)).toBe(60);
    });
  });

  describe('2. Business Revenue Stability Score Mapping (20% weight)', () => {
    it('correctly maps revenue-to-income percentages', () => {
      // >= 75% -> 100
      expect(calculateBusinessRevenueStabilityScore(45000, 60000)).toBe(100); // 75%
      expect(calculateBusinessRevenueStabilityScore(50000, 60000)).toBe(100); // 83.3%

      // 50–74% -> 80
      expect(calculateBusinessRevenueStabilityScore(36000, 60000)).toBe(80); // 60%
      expect(calculateBusinessRevenueStabilityScore(30000, 60000)).toBe(80); // 50%

      // 25–49% -> 60
      expect(calculateBusinessRevenueStabilityScore(20000, 60000)).toBe(60); // 33.3%
      expect(calculateBusinessRevenueStabilityScore(15000, 60000)).toBe(60); // 25%

      // 1–24% -> 40
      expect(calculateBusinessRevenueStabilityScore(6000, 60000)).toBe(40); // 10%
      expect(calculateBusinessRevenueStabilityScore(1000, 60000)).toBe(40); // 1.6%

      // 0 or missing -> 20
      expect(calculateBusinessRevenueStabilityScore(0, 60000)).toBe(20);
      expect(calculateBusinessRevenueStabilityScore(undefined, 60000)).toBe(20);
    });
  });

  describe('3. Deterministic Action Plan Recommendations', () => {
    it('returns appropriate deterministic guidance for each weakest component', () => {
      expect(getFinancingRecommendation('businessActivityConsistency')).toBe(
        'Create a more consistent monthly operating pattern.'
      );
      expect(getFinancingRecommendation('businessRevenueStability')).toBe(
        'Track monthly business revenue and build a stronger revenue buffer.'
      );
      expect(getFinancingRecommendation('cashFlowHealth')).toBe(
        'Improve the monthly business surplus.'
      );
      expect(getFinancingRecommendation('emergencyPrep')).toBe(
        'Strengthen your emergency reserve.'
      );
      expect(getFinancingRecommendation('financialLiteracy')).toBe(
        'Complete a recommended financial-learning module.'
      );
    });
  });

  describe('4. Sample Entrepreneur Demo (Meera Profile Verification)', () => {
    it('produces exact deterministic components and final readiness score of 83', () => {
      const result = calculateFinancingReadiness(MEERA_DEMO_USER);

      // Components verification
      expect(result.components.cashFlowHealth).toBe(100); // Surplus ₹22,000 (36.67% > 20%)
      expect(result.components.businessActivityConsistency).toBe(80); // "Mostly consistent"
      expect(result.components.businessRevenueStability).toBe(100); // 45,000 / 60,000 = 75%
      expect(result.components.emergencyPrep).toBe(40); // 30,000 / 38,000 = 0.789 months (0.5–0.99)
      expect(result.components.financialLiteracy).toBe(70); // Intermediate confidence, 0 modules

      // Formula verification:
      // (100 * 0.30) + (80 * 0.25) + (100 * 0.20) + (40 * 0.15) + (70 * 0.10)
      // = 30 + 20 + 20 + 6 + 7 = 83
      expect(result.rawScore).toBe(83);
      expect(result.displayScore).toBe(83);

      // Weakest component is emergencyPrep (40)
      expect(result.weakestComponent).toBe('emergencyPrep');
      expect(result.recommendation).toBe('Strengthen your emergency reserve.');
    });
  });

  describe('5. Segmentation: Salaried vs Business', () => {
    it('confirms Priya is Salaried and Meera is Business', () => {
      expect(PRIYA_DEMO_USER.incomeType).toBe('Salaried');
      expect(MEERA_DEMO_USER.incomeType).toBe('Business');
    });

    it('business question appears only for business users in question filter', () => {
      const salariedQuestions = SHE_AI_QUESTIONS.filter(
        q => !q.businessOnly || PRIYA_DEMO_USER.incomeType === 'Business'
      );
      expect(salariedQuestions.length).toBe(5);
      expect(salariedQuestions.some(q => q.id === 'financingReadiness')).toBe(false);

      const businessQuestions = SHE_AI_QUESTIONS.filter(
        q => !q.businessOnly || MEERA_DEMO_USER.incomeType === 'Business'
      );
      expect(businessQuestions.length).toBe(6);
      expect(businessQuestions.some(q => q.id === 'financingReadiness')).toBe(true);
    });

    it('generates accurate deterministic SheAI explanation for financingReadiness', () => {
      const meeraScore = calculateSheScore(MEERA_DEMO_USER);
      const text = getDeterministicSheAIResponse(
        'financingReadiness',
        MEERA_DEMO_USER,
        meeraScore
      );

      expect(text).toContain('Meera');
      expect(text).toContain('83/100');
      expect(text).toContain('Cash Flow Health (100/100, 30% weight)');
      expect(text).toContain('Business Activity Consistency (80/100, 25% weight)');
      expect(text).toContain('Business Revenue Stability (100/100, 20% weight)');
      expect(text).toContain('Savings / Emergency Buffer (40/100, 15% weight)');
      expect(text).toContain('Financial Literacy (70/100, 10% weight)');
      expect(text).toContain('Strengthen your emergency reserve');
    });
  });

  describe('6. Immutability of Frozen SheScore Engine', () => {
    it('confirms Priya initial SheScore is exactly 67 (Growing)', () => {
      const priyaInitial = calculateSheScore(PRIYA_DEMO_USER);
      expect(priyaInitial.displayScore).toBe(67);
      expect(priyaInitial.status).toBe('Growing');
      expect(priyaInitial.components.financialLiteracy).toBe(70);
    });

    it('confirms Priya SheScore becomes exactly 68 after 1 module completed', () => {
      const priyaOneMod: UserProfile = {
        ...PRIYA_DEMO_USER,
        completedModules: ['m1']
      };
      const score = calculateSheScore(priyaOneMod);
      expect(score.components.financialLiteracy).toBe(80);
      expect(score.rawScore).toBeCloseTo(68.25, 2);
      expect(score.displayScore).toBe(68);
    });

    it('confirms Priya SheScore becomes exactly 70 after 2 modules completed', () => {
      const priyaTwoMods: UserProfile = {
        ...PRIYA_DEMO_USER,
        completedModules: ['m1', 'm2']
      };
      const score = calculateSheScore(priyaTwoMods);
      expect(score.components.financialLiteracy).toBe(90);
      expect(score.rawScore).toBeCloseTo(69.75, 2);
      expect(score.displayScore).toBe(70);
    });
  });
});

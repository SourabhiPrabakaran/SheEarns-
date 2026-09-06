import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  validateCustomQuestionScope,
  getEducationalFallback
} from './scopeGuard';
import {
  handleSheAIRequest,
  validateSheAIStructuredOutput
} from '../server/sheaiHandler';
import {
  SHE_AI_QUESTIONS,
  getDeterministicSheAIResponse,
  askCustomSheAIQuestion
} from './sheAiEngine';
import { PRIYA_DEMO_USER } from '../data/defaultUser';
import { calculateSheScore } from './sheScore';

describe('SheAI Custom Educational Questions & Scope Guard Verification', () => {
  const scoreData = calculateSheScore(PRIYA_DEMO_USER);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. Allowed Custom Educational Questions', () => {
    it('allows questions on loan concepts (collateral, secured/unsecured, APR)', () => {
      const q1 = validateCustomQuestionScope('What is collateral?');
      expect(q1.isAllowed).toBe(true);

      const q2 = validateCustomQuestionScope('What is APR in loans?');
      expect(q2.isAllowed).toBe(true);

      const q3 = validateCustomQuestionScope('What is the difference between a secured and unsecured loan?');
      expect(q3.isAllowed).toBe(true);
    });

    it('allows questions on credit scoring and credit building', () => {
      const q1 = validateCustomQuestionScope('How does a credit score work?');
      expect(q1.isAllowed).toBe(true);

      const q2 = validateCustomQuestionScope('How can I build credit history from scratch?');
      expect(q2.isAllowed).toBe(true);
    });

    it('allows questions on budgeting and emergency funds', () => {
      const q1 = validateCustomQuestionScope('What is the 50/30/20 budgeting rule?');
      expect(q1.isAllowed).toBe(true);

      const q2 = validateCustomQuestionScope('How much should I keep in an emergency buffer?');
      expect(q2.isAllowed).toBe(true);
    });
  });

  describe('2. Out-of-Scope Questions (Guarded Before Groq)', () => {
    it('blocks stock and cryptocurrency investment recommendations', () => {
      const q1 = validateCustomQuestionScope('Which stock should I buy for multibagger returns?');
      expect(q1.isAllowed).toBe(false);
      expect(q1.outOfScopeResponse).toBeDefined();
      expect(q1.outOfScopeResponse?.answer).toContain('SheAI');
      expect(q1.outOfScopeResponse?.answer).toContain('cannot provide individual stock or crypto investment tips');

      const q2 = validateCustomQuestionScope('Should I invest in crypto or bitcoin?');
      expect(q2.isAllowed).toBe(false);
    });

    it('blocks personalized loan approval guarantees', () => {
      const q = validateCustomQuestionScope('Will the bank approve my loan application?');
      expect(q.isAllowed).toBe(false);
      expect(q.outOfScopeResponse?.answer).toContain('cannot provide');
    });

    it('blocks guaranteed return / get rich quick queries', () => {
      const q = validateCustomQuestionScope('How to double my money in 30 days with guaranteed return?');
      expect(q.isAllowed).toBe(false);
    });

    it('blocks legal and medical advice', () => {
      const legal = validateCustomQuestionScope('Can I sue my bank in court?');
      expect(legal.isAllowed).toBe(false);

      const med = validateCustomQuestionScope('What is the medicine dosage to cure headache?');
      expect(med.isAllowed).toBe(false);
    });

    it('blocks queries that are too short or too long', () => {
      expect(validateCustomQuestionScope('hi').isAllowed).toBe(false);
      const longQuery = 'A'.repeat(165);
      expect(validateCustomQuestionScope(longQuery).isAllowed).toBe(false);
    });

    it('returns friendly out-of-scope response without calling Groq', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      const result = await handleSheAIRequest({
        questionId: 'custom',
        customQuestion: 'Which stock should I buy?'
      });

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.source).toBe('deterministic');
      expect(result.data?.answer).toContain('SheAI');
    });
  });

  describe('3. Missing Groq / Fallback Behavior', () => {
    it('returns deterministic educational fallback when API key is missing', async () => {
      const result = await handleSheAIRequest(
        {
          questionId: 'custom',
          customQuestion: 'What is collateral?'
        },
        '' // No API key
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('deterministic');
      expect(result.data?.answer).toContain('Collateral is an asset');
      expect(result.data?.key_point).toBeTruthy();
      expect(result.data?.disclaimer).toBeTruthy();
    });

    it('falls back seamlessly on network failure without throwing an error', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Network offline'));

      const result = await askCustomSheAIQuestion('What is APR?');
      expect(result.source).toBe('deterministic');
      expect(result.text).toContain('APR');
      expect(result.keyPoint).toBeTruthy();
      expect(result.disclaimer).toBeTruthy();
    });

    it('provides educational fallback for diverse financial terms', () => {
      const fb1 = getEducationalFallback('What is collateral?');
      expect(fb1.answer).toContain('Collateral is an asset');

      const fb2 = getEducationalFallback('What is APR?');
      expect(fb2.answer).toContain('Annual Percentage Rate');

      const fb3 = getEducationalFallback('How to build credit history?');
      expect(fb3.answer).toContain('secured credit card');

      const fb4 = getEducationalFallback('What is a secured loan?');
      expect(fb4.answer).toContain('backed by collateral');
    });
  });

  describe('4. Successful Groq Structured Response for Custom Questions', () => {
    it('processes and validates structured output { answer, key_point, disclaimer }', async () => {
      const mockAiContent = {
        answer: 'Collateral is an asset you pledge to a lender to secure a loan, reducing their risk and often securing lower interest rates for you.',
        key_point: 'Collateral protects the lender and helps borrowers qualify for lower interest rates.',
        disclaimer: 'This is educational lending terminology and not financial advice.'
      };

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: JSON.stringify(mockAiContent) } }]
        })
      } as Response);

      const result = await handleSheAIRequest(
        {
          questionId: 'custom',
          customQuestion: 'What is collateral?'
        },
        'gsk_valid_test_key'
      );

      expect(result.success).toBe(true);
      expect(result.source).toBe('groq');
      expect(result.data?.answer).toBe(mockAiContent.answer);
      expect(result.data?.key_point).toBe(mockAiContent.key_point);
      expect(result.data?.disclaimer).toBe(mockAiContent.disclaimer);
    });

    it('validates structured output schema correctly', () => {
      const valid = {
        answer: 'Valid explanation with sufficient detail for educational context.',
        key_point: 'Concise key takeaway.',
        disclaimer: 'Standard educational disclaimer.'
      };
      expect(validateSheAIStructuredOutput(valid)).not.toBeNull();
    });
  });

  describe('5. Existing 5 Suggested Questions Remain Unchanged', () => {
    it('verifies all 5 existing controlled questions exist and preserve Priya data', () => {
      const standardQuestions = SHE_AI_QUESTIONS.filter(q => !q.businessOnly);
      expect(standardQuestions.length).toBe(5);

      const expectedIds = ['whyScore', 'improve', 'emergencyFund', 'emi', 'irregularIncome'];
      expect(standardQuestions.map(q => q.id)).toEqual(expectedIds);

      // Question 1
      const q1 = getDeterministicSheAIResponse('whyScore', PRIYA_DEMO_USER, scoreData);
      expect(q1).toContain('Priya');
      expect(q1).toContain('67');
      expect(q1).toContain('Growing');

      // Question 2
      const q2 = getDeterministicSheAIResponse('improve', PRIYA_DEMO_USER, scoreData);
      expect(q2).toContain('Emergency Preparedness');
      expect(q2).toContain('+10');

      // Question 3
      const q3 = getDeterministicSheAIResponse('emergencyFund', PRIYA_DEMO_USER, scoreData);
      expect(q3).toContain('₹32,000');
      expect(q3).toContain('₹96,000');

      // Question 4
      const q4 = getDeterministicSheAIResponse('emi', PRIYA_DEMO_USER, scoreData);
      expect(q4).toContain('₹18,000');

      // Question 5
      const q5 = getDeterministicSheAIResponse('irregularIncome', PRIYA_DEMO_USER, scoreData);
      expect(q5).toContain('sometimes irregular');
      expect(q5).toContain('1-Month Float');
    });
  });
});

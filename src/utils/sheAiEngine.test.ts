import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getDeterministicSheAIResponse,
  getSheAIResponse,
  SHE_AI_QUESTIONS
} from './sheAiEngine';
import {
  handleSheAIRequest,
  validateSheAIStructuredOutput,
  GROQ_MODEL
} from '../server/sheaiHandler';
import { PRIYA_DEMO_USER } from '../data/defaultUser';
import { calculateSheScore } from './sheScore';

describe('SheAI Server-Side Groq Integration & Fallback Verification', () => {
  const scoreData = calculateSheScore(PRIYA_DEMO_USER);

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('1. Model Selection & Structured Output Schema Validation', () => {
    it('uses the verified active Groq model qwen/qwen3.8-27b', () => {
      expect(GROQ_MODEL).toBe('qwen/qwen3.8-27b');
    });

    it('validates compliant structured outputs matching { answer, key_point, disclaimer }', () => {
      const valid = {
        answer: 'This is a warm, empathetic response explaining your finances clearly.',
        key_point: 'Building an emergency fund is your primary lever.',
        disclaimer: 'For educational purposes only. Not financial advice.'
      };
      const result = validateSheAIStructuredOutput(valid);
      expect(result).not.toBeNull();
      expect(result?.answer).toBe(valid.answer);
      expect(result?.key_point).toBe(valid.key_point);
      expect(result?.disclaimer).toBe(valid.disclaimer);
    });

    it('rejects malformed or empty structured outputs', () => {
      expect(validateSheAIStructuredOutput(null)).toBeNull();
      expect(validateSheAIStructuredOutput({})).toBeNull();
      expect(validateSheAIStructuredOutput({ answer: 'Too short' })).toBeNull();
      expect(
        validateSheAIStructuredOutput({
          answer: 'Valid length answer that is long enough to pass',
          key_point: '',
          disclaimer: 'Valid disclaimer'
        })
      ).toBeNull();
    });
  });

  describe('2. Server Endpoint Handler (handleSheAIRequest)', () => {
    it('returns source: deterministic when GROQ_API_KEY is missing or unconfigured', async () => {
      const body = {
        questionId: 'whyScore',
        referenceFactSheet: getDeterministicSheAIResponse('whyScore', PRIYA_DEMO_USER, scoreData),
        questionLabel: 'Why is my SheScore this?'
      };

      const result = await handleSheAIRequest(body, '');
      expect(result.success).toBe(false);
      expect(result.source).toBe('deterministic');
      expect(result.error).toContain('not configured');
    });

    it('successfully processes valid Groq structured response when key is provided', async () => {
      const body = {
        questionId: 'whyScore',
        referenceFactSheet: getDeterministicSheAIResponse('whyScore', PRIYA_DEMO_USER, scoreData),
        questionLabel: 'Why is my SheScore this?'
      };

      const mockStructuredOutput = {
        answer: "Hi Priya! Your SheScore is 67, putting you in the 'Growing' range. Your Cash Flow Health is exceptional at 100/100, while your Emergency Preparedness is at 40/100.",
        key_point: 'Strengthening emergency savings will elevate your score into the Strong tier.',
        disclaimer: 'SheScore is an educational tool and does not constitute official credit advice.'
      };

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify(mockStructuredOutput)
              }
            }
          ]
        })
      } as Response);

      const result = await handleSheAIRequest(body, 'gsk_mock_valid_key');

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
      expect(result.source).toBe('groq');
      expect(result.data?.answer).toBe(mockStructuredOutput.answer);
      expect(result.data?.key_point).toBe(mockStructuredOutput.key_point);
      expect(result.data?.disclaimer).toBe(mockStructuredOutput.disclaimer);
    });

    it('simulates Groq API 401 failure: falls back to deterministic without crashing', async () => {
      const body = {
        questionId: 'whyScore',
        referenceFactSheet: getDeterministicSheAIResponse('whyScore', PRIYA_DEMO_USER, scoreData),
        questionLabel: 'Why is my SheScore this?'
      };

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      } as Response);

      const result = await handleSheAIRequest(body, 'gsk_invalid_key');
      expect(result.success).toBe(false);
      expect(result.source).toBe('deterministic');
    });

    it('simulates Groq network timeout / abort: falls back to deterministic cleanly', async () => {
      const body = {
        questionId: 'emergencyFund',
        referenceFactSheet: getDeterministicSheAIResponse('emergencyFund', PRIYA_DEMO_USER, scoreData)
      };

      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(abortError);

      const result = await handleSheAIRequest(body, 'gsk_key');
      expect(result.success).toBe(false);
      expect(result.source).toBe('deterministic');
      expect(result.error).toContain('timed out');
    });
  });

  describe('3. Client-Side End-to-End Fallback (All 5 Questions)', () => {
    it('verifies all 5 questions fall back smoothly to deterministic facts on server 500 or offline', async () => {
      // Mock fetch to simulate offline / server error
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 500
      } as Response);

      for (const q of SHE_AI_QUESTIONS) {
        const result = await getSheAIResponse(q.id, PRIYA_DEMO_USER, scoreData);
        expect(result.source).toBe('deterministic');
        expect(result.text).toBeTruthy();
        expect(result.text.length).toBeGreaterThan(40);
      }
    });

    it('verifies all 5 questions preserve exact Priya figures in deterministic response', () => {
      // Question 1: whyScore
      const q1 = getDeterministicSheAIResponse('whyScore', PRIYA_DEMO_USER, scoreData);
      expect(q1).toContain('Priya');
      expect(q1).toContain('67');
      expect(q1).toContain('Growing');
      expect(q1).toContain('100/100'); // Cash flow
      expect(q1).toContain('60/100');  // Savings
      expect(q1).toContain('40/100');  // Emergency

      // Question 2: improve
      const q2 = getDeterministicSheAIResponse('improve', PRIYA_DEMO_USER, scoreData);
      expect(q2).toContain('Emergency Preparedness');
      expect(q2).toContain('0.6 months');
      expect(q2).toContain('+10 to your Financial Literacy');

      // Question 3: emergencyFund
      const q3 = getDeterministicSheAIResponse('emergencyFund', PRIYA_DEMO_USER, scoreData);
      expect(q3).toContain('₹32,000');
      expect(q3).toContain('₹20,000');
      expect(q3).toContain('₹96,000');
      expect(q3).toContain('₹1,92,000');

      // Question 4: emi
      const q4 = getDeterministicSheAIResponse('emi', PRIYA_DEMO_USER, scoreData);
      expect(q4).toContain('40%');
      expect(q4).toContain('₹18,000');
      expect(q4).toContain('₹0');

      // Question 5: irregularIncome
      const q5 = getDeterministicSheAIResponse('irregularIncome', PRIYA_DEMO_USER, scoreData);
      expect(q5).toContain('sometimes irregular');
      expect(q5).toContain('1-Month Float');
      expect(q5).toContain('₹32,000');
    });
  });
});

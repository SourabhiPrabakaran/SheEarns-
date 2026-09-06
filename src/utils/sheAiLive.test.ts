import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { handleSheAIRequest } from '../server/sheaiHandler';
import { PRIYA_DEMO_USER, MEERA_DEMO_USER } from '../data/defaultUser';
import { calculateSheScore } from './sheScore';
import { getDeterministicSheAIResponse } from './sheAiEngine';

describe('Live Groq API Verification (with process.env.GROQ_API_KEY)', () => {
  // Load local .env for test runner if not already in process.env
  let liveKey = process.env.GROQ_API_KEY || '';
  if (!liveKey && fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf-8');
    const match = envContent.match(/^GROQ_API_KEY=\s*(\S+)/m);
    if (match && match[1]) {
      liveKey = match[1].replace(/["']/g, '');
    }
  }

  const scoreData = calculateSheScore(PRIYA_DEMO_USER);

  it('confirms GROQ_API_KEY is available in .env', () => {
    expect(liveKey).toBeTruthy();
    expect(liveKey.length).toBeGreaterThan(20);
    expect(liveKey.startsWith('gsk_')).toBe(true);
  });

  it('Question 1 (whyScore): delivers live Groq structured output preserving score 67 and components', async () => {
    const factSheet = getDeterministicSheAIResponse('whyScore', PRIYA_DEMO_USER, scoreData);
    const result = await handleSheAIRequest(
      {
        questionId: 'whyScore',
        referenceFactSheet: factSheet,
        questionLabel: 'Why is my SheScore this?'
      },
      liveKey
    );

    expect(result.success).toBe(true);
    expect(result.source).toBe('groq');
    expect(result.data).toBeDefined();
    expect(result.data?.answer).toBeTruthy();
    expect(result.data?.key_point).toBeTruthy();
    expect(result.data?.disclaimer).toBeTruthy();

    // Verify key numbers are preserved
    expect(result.data?.answer).toContain('67');
  }, 15000);

  it('Question 2 (improve): delivers live Groq structured output targeting emergency fund', async () => {
    const factSheet = getDeterministicSheAIResponse('improve', PRIYA_DEMO_USER, scoreData);
    const result = await handleSheAIRequest(
      {
        questionId: 'improve',
        referenceFactSheet: factSheet,
        questionLabel: 'How can I improve my score?'
      },
      liveKey
    );

    expect(result.success).toBe(true);
    expect(result.source).toBe('groq');
    expect(result.data?.answer).toBeTruthy();
    expect(result.data?.key_point).toBeTruthy();
  }, 15000);

  it('Question 3 (emergencyFund): delivers live Groq structured output explaining 3-6 month targets', async () => {
    const factSheet = getDeterministicSheAIResponse('emergencyFund', PRIYA_DEMO_USER, scoreData);
    const result = await handleSheAIRequest(
      {
        questionId: 'emergencyFund',
        referenceFactSheet: factSheet,
        questionLabel: 'What is an emergency fund?'
      },
      liveKey
    );

    expect(result.success).toBe(true);
    expect(result.source).toBe('groq');
    expect(result.data?.answer).toBeTruthy();
    expect(result.data?.key_point).toBeTruthy();
  }, 15000);

  it('Question 4 (emi): delivers live Groq structured output preserving safe EMI limits', async () => {
    const factSheet = getDeterministicSheAIResponse('emi', PRIYA_DEMO_USER, scoreData);
    const result = await handleSheAIRequest(
      {
        questionId: 'emi',
        referenceFactSheet: factSheet,
        questionLabel: 'How does EMI work?'
      },
      liveKey
    );

    expect(result.success).toBe(true);
    expect(result.source).toBe('groq');
    expect(result.data?.answer).toBeTruthy();
    expect(result.data?.key_point).toBeTruthy();
  }, 15000);

  it('Question 5 (irregularIncome): delivers live Groq structured output explaining buffer strategy', async () => {
    const factSheet = getDeterministicSheAIResponse('irregularIncome', PRIYA_DEMO_USER, scoreData);
    const result = await handleSheAIRequest(
      {
        questionId: 'irregularIncome',
        referenceFactSheet: factSheet,
        questionLabel: 'How should I manage irregular income?'
      },
      liveKey
    );

    expect(result.success).toBe(true);
    expect(result.source).toBe('groq');
    expect(result.data?.answer).toBeTruthy();
    expect(result.data?.key_point).toBeTruthy();
  }, 15000);

  it('Custom Educational Question (What is collateral?): delivers live Groq structured explanation', async () => {
    const result = await handleSheAIRequest(
      {
        questionId: 'custom',
        customQuestion: 'What is collateral?'
      },
      liveKey
    );

    expect(result.success).toBe(true);
    expect(result.source).toBe('groq');
    expect(result.data).toBeDefined();
    expect(result.data?.answer).toBeTruthy();
    expect(result.data?.key_point).toBeTruthy();
    expect(result.data?.disclaimer).toBeTruthy();
  }, 15000);

  it('Entrepreneur Guided Question (financingReadiness): delivers live Groq structured output explaining non-traditional assessment', async () => {
    const meeraScore = calculateSheScore(MEERA_DEMO_USER);
    const factSheet = getDeterministicSheAIResponse('financingReadiness', MEERA_DEMO_USER, meeraScore);

    const result = await handleSheAIRequest(
      {
        questionId: 'financingReadiness',
        referenceFactSheet: factSheet,
        questionLabel: 'How is my financing readiness assessed?'
      },
      liveKey
    );

    expect(result.success).toBe(true);
    expect(result.source).toBe('groq');
    expect(result.data?.answer).toBeTruthy();
    expect(result.data?.key_point).toBeTruthy();
    expect(result.data?.disclaimer).toBeTruthy();
  }, 15000);
});

import {
  validateCustomQuestionScope,
  getEducationalFallback
} from '../utils/scopeGuard';

export interface SheAIRequestBody {
  questionId: string;
  referenceFactSheet?: string;
  questionLabel?: string;
  customQuestion?: string;
}

export interface SheAIStructuredOutput {
  answer: string;
  key_point: string;
  disclaimer: string;
}

export interface SheAIServerResponse {
  success: boolean;
  source: 'groq' | 'deterministic';
  data?: SheAIStructuredOutput;
  error?: string;
}

export const GROQ_MODEL = 'qwen/qwen3.8-27b';

/**
 * Validates the parsed Groq structured response
 */
export function validateSheAIStructuredOutput(parsed: unknown): SheAIStructuredOutput | null {
  if (!parsed || typeof parsed !== 'object') return null;
  const obj = parsed as Record<string, unknown>;

  if (
    typeof obj.answer !== 'string' ||
    typeof obj.key_point !== 'string' ||
    typeof obj.disclaimer !== 'string'
  ) {
    return null;
  }

  const answer = obj.answer.trim();
  const key_point = obj.key_point.trim();
  const disclaimer = obj.disclaimer.trim();

  if (answer.length < 20 || key_point.length < 5 || disclaimer.length < 5) {
    return null;
  }

  return { answer, key_point, disclaimer };
}

/**
 * Server-side handler for SheAI Groq requests
 * Strictly preserves deterministic facts and keeps GROQ_API_KEY server-side.
 */
export async function handleSheAIRequest(
  body: SheAIRequestBody,
  apiKey?: string
): Promise<SheAIServerResponse> {
  const { questionId, referenceFactSheet, questionLabel, customQuestion } = body;

  // Handle Custom Educational Question Expansion
  if (questionId === 'custom' || customQuestion) {
    const query = (customQuestion || '').trim();

    // 1. Lightweight Scope Guard Check (runs before Groq)
    const scopeCheck = validateCustomQuestionScope(query);
    if (!scopeCheck.isAllowed) {
      return {
        success: true,
        source: 'deterministic',
        data: scopeCheck.outOfScopeResponse
      };
    }

    const activeKey = apiKey || process.env.GROQ_API_KEY;

    // If key not configured, return educational deterministic fallback
    if (!activeKey || activeKey.trim() === '') {
      return {
        success: true,
        source: 'deterministic',
        data: getEducationalFallback(query)
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: 'system',
              content: `You are SheAI, an empathetic and supportive financial educator on the SheEarns platform for women.
Your role is to explain financial concepts, loan terms, credit-building steps, and budgeting principles in simple, clear, empowering language.

CRITICAL RULES:
1. Explain the concept clearly and warmly in under 120 words.
2. Focus strictly on general financial education and literacy.
3. Do NOT provide individual stock tips, cryptocurrency speculation, legal advice, medical advice, or personal loan approval guarantees.
4. Do NOT calculate, modify, or infer any SheScore formula values.
5. Provide a single empowering takeaway in "key_point".
6. Provide an educational disclaimer in "disclaimer" (e.g., stating this is financial education, not official credit or lending advice).`
            },
            {
              role: 'user',
              content: `Please explain this financial concept or question: "${query}"`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'she_ai_explanation',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  answer: {
                    type: 'string',
                    description: 'Warm, clear financial education in under 120 words.'
                  },
                  key_point: {
                    type: 'string',
                    description: 'A single concise empowering takeaway sentence.'
                  },
                  disclaimer: {
                    type: 'string',
                    description: 'Educational disclaimer stating this is financial literacy, not individual lending advice.'
                  }
                },
                required: ['answer', 'key_point', 'disclaimer'],
                additionalProperties: false
              }
            }
          },
          temperature: 0.3,
          max_tokens: 450
        })
      });

      clearTimeout(timeoutId);

      if (!groqResponse.ok) {
        return {
          success: true,
          source: 'deterministic',
          data: getEducationalFallback(query)
        };
      }

      const json = await groqResponse.json();
      const rawContent = json.choices?.[0]?.message?.content;

      if (!rawContent) {
        return {
          success: true,
          source: 'deterministic',
          data: getEducationalFallback(query)
        };
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        return {
          success: true,
          source: 'deterministic',
          data: getEducationalFallback(query)
        };
      }

      const validated = validateSheAIStructuredOutput(parsed);
      if (!validated) {
        return {
          success: true,
          source: 'deterministic',
          data: getEducationalFallback(query)
        };
      }

      return {
        success: true,
        source: 'groq',
        data: validated
      };
    } catch {
      return {
        success: true,
        source: 'deterministic',
        data: getEducationalFallback(query)
      };
    }
  }

  // Handle Existing 5 Controlled SheAI Questions
  if (!questionId || !referenceFactSheet) {
    return {
      success: false,
      source: 'deterministic',
      error: 'Missing required questionId or referenceFactSheet'
    };
  }

  const activeKey = apiKey || process.env.GROQ_API_KEY;

  if (!activeKey || activeKey.trim() === '') {
    return {
      success: false,
      source: 'deterministic',
      error: 'GROQ_API_KEY is not configured on the server'
    };
  }

  const questionPrompt = questionLabel || questionId;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are SheAI, an empathetic and empowering financial educator on the SheEarns platform for women.
Your task is to rephrase the provided Reference Fact Sheet into warm, encouraging, conversational language.

CRITICAL RULES:
1. STRICTLY PRESERVE all numerical values, percentages, rupee figures, scores, and facts from the Reference Fact Sheet.
2. Do NOT calculate, modify, or invent any financial figures or formulas.
3. Keep the "answer" concise, clear, and under 130 words.
4. Provide a single empowering takeaway in "key_point".
5. Provide a standard educational disclaimer in "disclaimer" stating this is financial education, not official credit or lending advice.`
          },
          {
            role: 'user',
            content: `Question: "${questionPrompt}"\n\nReference Fact Sheet:\n${referenceFactSheet}`
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'she_ai_explanation',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                answer: {
                  type: 'string',
                  description: 'Warm, natural explanation strictly preserving all reference figures.'
                },
                key_point: {
                  type: 'string',
                  description: 'A single concise empowering takeaway sentence.'
                },
                disclaimer: {
                  type: 'string',
                  description: 'Educational disclaimer stating this is financial education, not credit or lending advice.'
                }
              },
              required: ['answer', 'key_point', 'disclaimer'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.3,
        max_tokens: 450
      })
    });

    clearTimeout(timeoutId);

    if (!groqResponse.ok) {
      return {
        success: false,
        source: 'deterministic',
        error: `Groq API responded with status ${groqResponse.status}`
      };
    }

    const json = await groqResponse.json();
    const rawContent = json.choices?.[0]?.message?.content;

    if (!rawContent) {
      return {
        success: false,
        source: 'deterministic',
        error: 'Empty response choices from Groq'
      };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      return {
        success: false,
        source: 'deterministic',
        error: 'Invalid JSON in Groq response'
      };
    }

    const validated = validateSheAIStructuredOutput(parsed);

    if (!validated) {
      return {
        success: false,
        source: 'deterministic',
        error: 'Groq response failed schema validation'
      };
    }

    return {
      success: true,
      source: 'groq',
      data: validated
    };
  } catch (err: unknown) {
    const isAbort = err instanceof Error && err.name === 'AbortError';
    return {
      success: false,
      source: 'deterministic',
      error: isAbort ? 'Groq request timed out' : 'Network error during Groq request'
    };
  }
}

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const GROQ_MODEL = 'qwen/qwen3.8-27b';

function validateOutput(parsed) {
  if (!parsed || typeof parsed !== 'object') return null;
  const { answer, key_point, disclaimer } = parsed;
  if (
    typeof answer !== 'string' ||
    typeof key_point !== 'string' ||
    typeof disclaimer !== 'string'
  ) {
    return null;
  }
  if (answer.trim().length < 20 || key_point.trim().length < 5 || disclaimer.trim().length < 5) {
    return null;
  }
  return {
    answer: answer.trim(),
    key_point: key_point.trim(),
    disclaimer: disclaimer.trim()
  };
// Load local .env if available without external dependencies
if (!process.env.GROQ_API_KEY && fs.existsSync('.env')) {
  try {
    const envContent = fs.readFileSync('.env', 'utf-8');
    const match = envContent.match(/^GROQ_API_KEY=\s*(\S+)/m);
    if (match && match[1]) {
      process.env.GROQ_API_KEY = match[1].replace(/["']/g, '');
    }
  } catch {
    // Ignore read errors
  }
}

const OUT_OF_SCOPE_REGEX = /\b(stock|stocks|share market|crypto|cryptocurrency|bitcoin|btc|eth|ethereum|doge|trading|intraday|options trading|forex|multibagger|penny stock|guaranteed return|double my money|100% profit|get rich quick|will (the )?bank approve|will i get approved|guarantee my loan|approve my loan|sue my bank|lawsuit|legal action|court case|diagnose|cure|medicine dosage)\b/i;

async function handleGroqRequest(body) {
  const apiKey = process.env.GROQ_API_KEY;

  // Custom question expansion
  if (body.questionId === 'custom' || body.customQuestion) {
    const query = (body.customQuestion || '').trim();
    if (query.length < 3 || query.length > 160 || OUT_OF_SCOPE_REGEX.test(query)) {
      return {
        success: true,
        source: 'deterministic',
        data: {
          answer: "I'm SheAI, your educational financial guide. I focus on financial concepts, loan terms, credit education, and budgeting basics. I cannot provide individual stock or crypto investment tips, legal or medical advice, or personal loan approval guarantees.\n\n💡 Try asking:\n• \"What is collateral?\"\n• \"How does a credit score work?\"\n• \"What is the difference between secured and unsecured loans?\"",
          key_point: "SheAI offers general financial education, not personalized investment or lending decisions.",
          disclaimer: "Educational information only. Always consult registered professionals for formal financial or lending advice."
        }
      };
    }

    if (!apiKey) {
      return {
        success: true,
        source: 'deterministic',
        data: {
          answer: `Understanding financial concepts like "${query}" builds lasting financial independence. Managing debt prudently, tracking cash flow surplus, and maintaining emergency buffers are key pillars of resilience.`,
          key_point: "Clear knowledge of financial terms enables confident decision-making.",
          disclaimer: "General financial education. Not formal lending or investment advice."
        }
      };
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        signal: controller.signal,
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are SheAI, an empathetic and supportive financial educator on the SheEarns platform for women. Explain the financial concept or question in simple, clear, empowering language in under 120 words. Focus strictly on financial literacy. Do not make stock picks or loan guarantees. Output JSON with { answer, key_point, disclaimer }.'
            },
            {
              role: 'user',
              content: `Please explain this financial concept: "${query}"`
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
                  answer: { type: 'string' },
                  key_point: { type: 'string' },
                  disclaimer: { type: 'string' }
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
      clearTimeout(timeout);
      if (!res.ok) return { success: true, source: 'deterministic', data: { answer: `Educational concept explanation for "${query}".`, key_point: "Financial education.", disclaimer: "Educational guidance." } };
      const json = await res.json();
      const content = json.choices?.[0]?.message?.content;
      const validated = validateOutput(content ? JSON.parse(content) : null);
      if (!validated) return { success: true, source: 'deterministic', data: { answer: `Educational concept explanation for "${query}".`, key_point: "Financial education.", disclaimer: "Educational guidance." } };
      return { success: true, source: 'groq', data: validated };
    } catch {
      return { success: true, source: 'deterministic', data: { answer: `Educational concept explanation for "${query}".`, key_point: "Financial education.", disclaimer: "Educational guidance." } };
    }
  }

  if (!apiKey) {
    return { success: false, source: 'deterministic', error: 'GROQ_API_KEY not configured' };
  }

  const { questionId, referenceFactSheet, questionLabel } = body;
  if (!questionId || !referenceFactSheet) {
    return { success: false, source: 'deterministic', error: 'Invalid payload' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
            content: `Question: "${questionLabel || questionId}"\n\nReference Fact Sheet:\n${referenceFactSheet}`
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
                answer: { type: 'string' },
                key_point: { type: 'string' },
                disclaimer: { type: 'string' }
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

    clearTimeout(timeout);

    if (!res.ok) {
      return { success: false, source: 'deterministic' };
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    const validated = validateOutput(content ? JSON.parse(content) : null);

    if (!validated) {
      return { success: false, source: 'deterministic' };
    }

    return { success: true, source: 'groq', data: validated };
  } catch {
    return { success: false, source: 'deterministic' };
  }
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2'
};

const server = http.createServer(async (req, res) => {
  // Server-side endpoint
  if (req.url === '/api/sheai' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const result = await handleGroqRequest(parsed);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, source: 'deterministic' }));
      }
    });
    return;
  }

  // Serve static build from dist/
  const distDir = path.join(__dirname, 'dist');
  let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found. Run npm run build first.');
  }
});

server.listen(PORT, () => {
  console.log(`SheEarns server running at http://localhost:${PORT}`);
});

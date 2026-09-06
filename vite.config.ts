import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin, Connect } from 'vite';
import { handleSheAIRequest, SheAIRequestBody } from './src/server/sheaiHandler';

function sheAiApiPlugin(): Plugin {
  let groqApiKey = process.env.GROQ_API_KEY || '';

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    if (req.url === '/api/sheai' && req.method === 'POST') {
      let bodyData = '';
      req.on('data', chunk => {
        bodyData += chunk;
      });
      req.on('end', async () => {
        try {
          const body: SheAIRequestBody = JSON.parse(bodyData || '{}');
          const result = await handleSheAIRequest(body, groqApiKey);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify(result));
        } catch {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ success: false, source: 'deterministic' }));
        }
      });
      return;
    }
    next();
  };

  return {
    name: 'sheai-api-server',
    configResolved(config) {
      const env = loadEnv(config.mode, process.cwd(), '');
      groqApiKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY || '';
    },
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sheAiApiPlugin()],
  server: {
    port: 3000,
    open: true
  }
});

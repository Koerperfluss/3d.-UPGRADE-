import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const getApiKey = () => process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

const getAiClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured on server.');
  }
  return new GoogleGenAI({ apiKey });
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apiKeyConfigured: Boolean(getApiKey()) });
});

app.post('/api/generate-content', async (req, res) => {
  try {
    const { model = 'gemini-3.5-flash', contents, config } = req.body;
    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    res.json(response);
  } catch (error) {
    console.error('Error in /api/generate-content:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.post('/api/generate-content-stream', async (req, res) => {
  try {
    const { model = 'gemini-3.5-flash', contents, config } = req.body;
    const ai = getAiClient();

    const responseStream = await ai.models.generateContentStream({
      model,
      contents,
      config,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of responseStream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error in /api/generate-content-stream:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
});

app.post('/api/generate-videos', async (req, res) => {
  try {
    const { model, prompt, config } = req.body;
    const ai = getAiClient();

    const operation = await ai.models.generateVideos({
      model,
      prompt,
      config,
    });

    res.json(operation);
  } catch (error) {
    console.error('Error in /api/generate-videos:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.post('/api/get-videos-operation', async (req, res) => {
  try {
    const { operation } = req.body;
    const ai = getAiClient();

    const updatedOperation = await ai.operations.getVideosOperation({
      operation,
    });

    res.json(updatedOperation);
  } catch (error) {
    console.error('Error in /api/get-videos-operation:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Backend proxy server running on port ${PORT}`);
  });
}

export default app;

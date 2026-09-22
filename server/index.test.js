import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockResolvedValue({
          text: 'Mocked proxy response',
        }),
        generateContentStream: vi.fn().mockImplementation(async function* () {
          yield { text: 'Stream chunk 1' };
          yield { text: 'Stream chunk 2' };
        }),
        generateVideos: vi.fn().mockResolvedValue({ name: 'operations/123' }),
      },
      operations: {
        getVideosOperation: vi.fn().mockResolvedValue({ done: true }),
      },
    })),
  };
});

process.env.GEMINI_API_KEY = 'test-secret-key-123';
import app from './index.js';

describe('Server API Proxy Endpoints', () => {
  it('GET /api/health confirms server status and API key configuration', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', apiKeyConfigured: true });
  });

  it('POST /api/generate-content proxies generateContent requests', async () => {
    const res = await request(app)
      .post('/api/generate-content')
      .send({
        model: 'gemini-3.5-flash',
        contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ text: 'Mocked proxy response' });
  });

  it('POST /api/generate-content-stream streams response via SSE', async () => {
    const res = await request(app)
      .post('/api/generate-content-stream')
      .send({
        model: 'gemini-3.5-flash',
        contents: [{ role: 'user', parts: [{ text: 'Stream request' }] }],
      });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/event-stream');
    expect(res.text).toContain('data: {"text":"Stream chunk 1"}');
    expect(res.text).toContain('data: {"text":"Stream chunk 2"}');
    expect(res.text).toContain('data: [DONE]');
  });
});

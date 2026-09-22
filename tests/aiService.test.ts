import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateClinicalContent, generateClinicalContentStream } from '../src/services/aiService';

describe('aiService (client side proxy abstraction)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('does not expose VITE_GEMINI_API_KEY or process.env.GEMINI_API_KEY in client code', () => {
    expect((import.meta.env as any).VITE_GEMINI_API_KEY).toBeUndefined();
  });

  it('routes generateClinicalContent through /api/generate-content endpoint', async () => {
    const mockResponse = { text: 'Clinical response from proxy' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await generateClinicalContent('Test prompt');

    expect(global.fetch).toHaveBeenCalledWith('/api/generate-content', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));

    const callBody = JSON.parse((global.fetch as any).mock.calls[0][1].body);
    expect(callBody.model).toBe('gemini-3.5-flash');
    expect(callBody.contents).toBeDefined();
    expect(result).toEqual(mockResponse);
  });

  it('routes generateClinicalContentStream through /api/generate-content-stream endpoint', async () => {
    const sseData = 'data: {"text":"Chunk 1"}\n\ndata: {"text":"Chunk 2"}\n\ndata: [DONE]\n\n';
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(sseData));
        controller.close();
      },
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: stream,
    });

    const streamResult = await generateClinicalContentStream('Test streaming prompt');
    const chunks = [];

    for await (const chunk of streamResult) {
      chunks.push(chunk);
    }

    expect(global.fetch).toHaveBeenCalledWith('/api/generate-content-stream', expect.objectContaining({
      method: 'POST',
    }));
    expect(chunks).toEqual([{ text: 'Chunk 1' }, { text: 'Chunk 2' }]);
  });
});

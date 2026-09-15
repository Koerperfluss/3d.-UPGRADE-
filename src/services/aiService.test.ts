import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateClinicalContent, generateClinicalContentStream, ai, LUMI_SYSTEM_PROMPT } from './aiService';

vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn();
  const mockGenerateContentStream = vi.fn();
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
        generateContentStream: mockGenerateContentStream,
      },
    })),
  };
});

describe('aiService', () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    consoleErrorSpy.mockRestore();
  });

  describe('generateClinicalContent', () => {
    it('should throw and log error when generateContent fails', async () => {
      const mockError = new Error('API Rate Limit Exceeded or Network Error');
      (ai.models.generateContent as any).mockRejectedValueOnce(mockError);

      const assertion = expect(generateClinicalContent('Test prompt')).rejects.toThrow('API Rate Limit Exceeded or Network Error');

      await vi.advanceTimersByTimeAsync(1000);
      await assertion;

      expect(consoleErrorSpy).toHaveBeenCalledWith('AI Service Error:', mockError);
    });

    it('should return response when generateContent succeeds with string prompt', async () => {
      const mockResponse = { text: 'Clinical reasoning answer' };
      (ai.models.generateContent as any).mockResolvedValueOnce(mockResponse);

      const promise = generateClinicalContent('Patient presenting with knee pain');
      await vi.advanceTimersByTimeAsync(1000);
      const result = await promise;

      expect(result).toEqual(mockResponse);
      expect(ai.models.generateContent).toHaveBeenCalledWith({
        model: 'gemini-3.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Patient presenting with knee pain' }],
          },
        ],
        config: {
          systemInstruction: LUMI_SYSTEM_PROMPT,
          tools: undefined,
          safetySettings: undefined,
        },
      });
    });

    it('should pass Content[] prompt directly to generateContent', async () => {
      const mockResponse = { text: 'Response to Content[]' };
      (ai.models.generateContent as any).mockResolvedValueOnce(mockResponse);

      const contentsPrompt = [{ role: 'user', parts: [{ text: 'Examine ACL tear' }] }];
      const promise = generateClinicalContent(contentsPrompt, 'gemini-3.1-pro');
      await vi.advanceTimersByTimeAsync(1000);
      const result = await promise;

      expect(result).toEqual(mockResponse);
      expect(ai.models.generateContent).toHaveBeenCalledWith({
        model: 'gemini-3.1-pro',
        contents: contentsPrompt,
        config: {
          systemInstruction: LUMI_SYSTEM_PROMPT,
          tools: undefined,
          safetySettings: undefined,
        },
      });
    });

    it('should convert Part[] prompt to user Content format', async () => {
      const mockResponse = { text: 'Response to Part[]' };
      (ai.models.generateContent as any).mockResolvedValueOnce(mockResponse);

      const partsPrompt = [{ text: 'Analyze gait cycle' }];
      const promise = generateClinicalContent(partsPrompt);
      await vi.advanceTimersByTimeAsync(1000);
      const result = await promise;

      expect(result).toEqual(mockResponse);
      expect(ai.models.generateContent).toHaveBeenCalledWith({
        model: 'gemini-3.5-flash',
        contents: [{ role: 'user', parts: partsPrompt }],
        config: {
          systemInstruction: LUMI_SYSTEM_PROMPT,
          tools: undefined,
          safetySettings: undefined,
        },
      });
    });
  });

  describe('generateClinicalContentStream', () => {
    it('should return stream response on success', async () => {
      const mockStreamResponse = { stream: {} };
      (ai.models.generateContentStream as any).mockResolvedValueOnce(mockStreamResponse);

      const result = await generateClinicalContentStream('Streaming test');
      expect(result).toEqual(mockStreamResponse);
      expect(ai.models.generateContentStream).toHaveBeenCalledWith({
        model: 'gemini-3.5-flash',
        contents: [{ role: 'user', parts: [{ text: 'Streaming test' }] }],
        config: {
          systemInstruction: LUMI_SYSTEM_PROMPT,
          tools: undefined,
          safetySettings: undefined,
        },
      });
    });

    it('should throw and log error when generateContentStream fails', async () => {
      const mockError = new Error('Streaming failed');
      (ai.models.generateContentStream as any).mockRejectedValueOnce(mockError);

      await expect(generateClinicalContentStream('Streaming error test')).rejects.toThrow('Streaming failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('AI Stream Error:', mockError);
    });
  });
});

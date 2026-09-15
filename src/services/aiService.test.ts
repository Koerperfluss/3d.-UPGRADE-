import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted to declare mock functions before vi.mock calls
const { mockGenerateContent, mockGenerateContentStream } = vi.hoisted(() => {
  return {
    mockGenerateContent: vi.fn(),
    mockGenerateContentStream: vi.fn(),
  };
});

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
        generateContentStream: mockGenerateContentStream,
      },
    })),
  };
});

import { generateClinicalContent, generateClinicalContentStream, LUMI_SYSTEM_PROMPT } from './aiService';

describe('aiService - generateClinicalContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process string prompt correctly and call generateContent with default options', async () => {
    const mockResponse = { text: 'Clinical advice response' };
    mockGenerateContent.mockResolvedValueOnce(mockResponse);

    const result = await generateClinicalContent('What are the symptoms of sciatica?');

    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: [{ text: 'What are the symptoms of sciatica?' }] }],
      config: {
        systemInstruction: LUMI_SYSTEM_PROMPT,
        tools: undefined,
        safetySettings: undefined,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should process Content[] prompt format correctly', async () => {
    const mockResponse = { text: 'Content array response' };
    mockGenerateContent.mockResolvedValueOnce(mockResponse);

    const contentsInput = [
      { role: 'user', parts: [{ text: 'User question' }] },
      { role: 'model', parts: [{ text: 'Model answer' }] },
    ];

    const result = await generateClinicalContent(contentsInput);

    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-3.5-flash',
      contents: contentsInput,
      config: {
        systemInstruction: LUMI_SYSTEM_PROMPT,
        tools: undefined,
        safetySettings: undefined,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should process Part[] prompt format correctly', async () => {
    const mockResponse = { text: 'Part array response' };
    mockGenerateContent.mockResolvedValueOnce(mockResponse);

    const partsInput = [{ text: 'Part prompt text' }];

    const result = await generateClinicalContent(partsInput);

    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: partsInput }],
      config: {
        systemInstruction: LUMI_SYSTEM_PROMPT,
        tools: undefined,
        safetySettings: undefined,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should accept custom modelName, config, safetySettings, and tools', async () => {
    const mockResponse = { text: 'Custom config response' };
    mockGenerateContent.mockResolvedValueOnce(mockResponse);

    const customConfig = { temperature: 0.7, thinkingConfig: { thinkingBudget: 100 } };
    const customSafetySettings = [{ category: 'HARM_CATEGORY_HATE_SPEECH' as any, threshold: 'BLOCK_LOW_AND_ABOVE' as any }];
    const customTools = [{ functionDeclarations: [] }];

    const result = await generateClinicalContent(
      'Analyze case',
      'gemini-3.1-pro',
      customConfig,
      customSafetySettings,
      customTools
    );

    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-3.1-pro',
      contents: [{ role: 'user', parts: [{ text: 'Analyze case' }] }],
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 100 },
        systemInstruction: LUMI_SYSTEM_PROMPT,
        tools: customTools,
        safetySettings: customSafetySettings,
      },
    });

    expect(result).toEqual(mockResponse);
  });

  it('should throw and log error when generateContent fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const apiError = new Error('API failure');
    mockGenerateContent.mockRejectedValueOnce(apiError);

    await expect(generateClinicalContent('Fail prompt')).rejects.toThrow('API failure');
    expect(consoleErrorSpy).toHaveBeenCalledWith('AI Service Error:', apiError);

    consoleErrorSpy.mockRestore();
  });
});

describe('aiService - generateClinicalContentStream', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process prompt and call generateContentStream', async () => {
    const mockStreamResponse = { [Symbol.asyncIterator]: vi.fn() };
    mockGenerateContentStream.mockResolvedValueOnce(mockStreamResponse);

    const result = await generateClinicalContentStream('Stream prompt');

    expect(mockGenerateContentStream).toHaveBeenCalledWith({
      model: 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: [{ text: 'Stream prompt' }] }],
      config: {
        systemInstruction: LUMI_SYSTEM_PROMPT,
        tools: undefined,
        safetySettings: undefined,
      },
    });

    expect(result).toEqual(mockStreamResponse);
  });

  it('should throw and log error when generateContentStream fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const apiError = new Error('Stream error');
    mockGenerateContentStream.mockRejectedValueOnce(apiError);

    await expect(generateClinicalContentStream('Fail stream prompt')).rejects.toThrow('Stream error');
    expect(consoleErrorSpy).toHaveBeenCalledWith('AI Stream Error:', apiError);

    consoleErrorSpy.mockRestore();
  });
});

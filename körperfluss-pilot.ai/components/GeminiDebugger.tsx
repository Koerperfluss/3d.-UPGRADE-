

import React, { useState, useCallback } from 'react';
// FIX: Changed import to 'generateText' which is now correctly exported from geminiService.
import { generateText } from '../services/geminiService';

const GeminiDebugger: React.FC = () => {
  const [prompt, setPrompt] = useState('Was ist die Hauptstadt von Österreich?');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError('');
    setResponse('');
    try {
      const result = await generateText(prompt);
      setResponse(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="p-4 bg-gray-800 text-white font-mono text-xs h-full flex flex-col">
      <h3 className="text-lg font-bold text-purple-400 mb-2 flex-shrink-0">Gemini API Debugger</h3>
      <div className="flex flex-col gap-2 mb-2 flex-shrink-0">
        <label htmlFor="gemini-prompt" className="font-sans font-semibold text-sm">Prompt:</label>
        <textarea
          id="gemini-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-purple-500 focus:border-purple-500 font-sans"
          rows={3}
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-sans font-bold"
        >
          {isLoading ? 'Generating...' : 'Send to Gemini'}
        </button>
      </div>
      <div className="bg-black p-2 rounded-md overflow-auto flex-grow font-sans">
        <h4 className="font-bold text-sm text-gray-400 mb-1">Response:</h4>
        {isLoading && <p className="text-yellow-400">Loading response...</p>}
        {error && <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>}
        {response && <pre className="whitespace-pre-wrap">{response}</pre>}
      </div>
    </div>
  );
};

export default GeminiDebugger;
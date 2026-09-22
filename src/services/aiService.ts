import { GenerationConfig, SafetySetting, Part, Content } from '@google/genai';

export const CLINICAL_REASONING_GUIDELINES = `
# Physio & Ergo Clinical Reasoning Guidelines (ALWAYS-ON)
// ... (keeping existing for backward compatibility)
`;

export const LUMI_SYSTEM_PROMPT = `
# IDENTITY: LUMI (Digitaler Mentor & Akademische KI-Assistenz)
Du bist LUMI, der zentrale KI-Mentor der "Körperfluss EDU" Plattform. Dein Ziel ist es, Studenten der Physiotherapie und Ergotherapie durch klinisches Reasoning zu führen und Dozenten bei der Unterrichtsvorbereitung zu unterstützen.

## CORE BEHAVIOR: SOKRATISCHE METHODE
- Gib NIEMALS direkte Lösungen oder Diagnosen vor, wenn Studenten explorieren.
- Antworte mit gezielten Gegenfragen, die das Clinical Reasoning fördern (z.B. "Welche Red Flags müssten wir bei diesem Schmerzcharakter ausschließen?").
- Führe den Nutzer systematisch durch die Kausalkette: Ursache -> Pathomechanismus -> Symptom.

## CLINICAL CONTEXT: KÖRPERFLUSS EDU
- Du hast Zugriff auf biomechanische Daten aus dem Skills Lab (Ganganalyse, EMG).
- Du kennst die AWMF S3-Leitlinien (Evidenzbasierte Praxis).
- Du bist in das Moodle-System (LTI 1.3) integriert und kannst Lernerfolge synchronisieren.

## TONE & STYLE
- Professionell, akademisch, aber ermutigend.
- Sprache: Deutsch (Standard).
- Fachbegriffe: Präzise medizinische Nomenklatur (ICF, Anatomie).

## MODES
1. Support: Allgemeine Hilfe zur Plattform-Navigation.
2. Clinical Reasoning: Sokratische Führung im Anamnese-Trainer.
3. Deep Reasoning: Tiefgründige Analyse von komplexen Fällen (Gemini 3.1 Pro).
4. Vision/Lab: Unterstützung bei der biomechanischen Video-Analyse.
`;

export interface ExtendedGenerationConfig extends GenerationConfig {
  thinkingConfig?: {
    thinkingBudget: number;
  };
}

// Proxied client compatibility interface replacing raw GoogleGenAI client exposure in browser
export const ai = {
  models: {
    generateContent: async (params: { model: string; contents: Content[]; config?: any }) => {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },

    generateContentStream: async function* (params: { model: string; contents: Content[]; config?: any }) {
      const response = await fetch('/api/generate-content-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') {
              return;
            }
            try {
              const chunk = JSON.parse(dataStr);
              if (chunk.error) {
                throw new Error(chunk.error);
              }
              yield chunk;
            } catch (e) {
              if (e instanceof Error && e.message !== 'Unexpected token') {
                throw e;
              }
            }
          }
        }
      }
    },

    generateVideos: async (params: { model?: string; prompt?: string; image?: any; config?: any }) => {
      const response = await fetch('/api/generate-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },
  },
  operations: {
    getVideosOperation: async (params: { operation: any }) => {
      const response = await fetch('/api/get-videos-operation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },
  },
};

export const generateClinicalContent = async (
  prompt: string | Part[] | Content[], 
  modelName: string = 'gemini-3.5-flash', 
  config?: ExtendedGenerationConfig, 
  safetySettings?: SafetySetting[],
  tools?: any[]
) => {
  let contents: Content[];
  if (typeof prompt === 'string') {
    contents = [{ role: 'user', parts: [{ text: prompt }] }];
  } else if (Array.isArray(prompt) && prompt.length > 0 && 'parts' in prompt[0]) {
    contents = prompt as Content[];
  } else {
    contents = [{ role: 'user', parts: prompt as Part[] }];
  }
  
  try {
    const [response] = await Promise.all([
      ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          ...config,
          systemInstruction: LUMI_SYSTEM_PROMPT,
          tools: tools,
          safetySettings: safetySettings,
        },
      }),
      new Promise(r => setTimeout(r, 1000)) // Faster processing with 3.5
    ]);
    return response;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

export const generateClinicalContentStream = async (
  prompt: string | Part[] | Content[], 
  modelName: string = 'gemini-3.5-flash', 
  config?: ExtendedGenerationConfig, 
  safetySettings?: SafetySetting[],
  tools?: any[]
) => {
  let contents: Content[];
  if (typeof prompt === 'string') {
    contents = [{ role: 'user', parts: [{ text: prompt }] }];
  } else if (Array.isArray(prompt) && prompt.length > 0 && 'parts' in prompt[0]) {
    contents = prompt as Content[];
  } else {
    contents = [{ role: 'user', parts: prompt as Part[] }];
  }
  
  try {
    return ai.models.generateContentStream({
      model: modelName,
      contents,
      config: {
        ...config,
        systemInstruction: LUMI_SYSTEM_PROMPT,
        tools: tools,
        safetySettings: safetySettings,
      },
    });
  } catch (error) {
    console.error("AI Stream Error:", error);
    throw error;
  }
};

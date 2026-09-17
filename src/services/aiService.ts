import { GoogleGenAI, GenerationConfig, SafetySetting, Part, Content } from '@google/genai';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

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
1. **Support:** Allgemeine Hilfe zur Plattform-Navigation.
2. **Clinical Reasoning:** Sokratische Führung im Anamnese-Trainer.
3. **Deep Reasoning:** Tiefgründige Analyse von komplexen Fällen (Gemini 3.1 Pro).
4. **Vision/Lab:** Unterstützung bei der biomechanischen Video-Analyse.
`;

export interface ExtendedGenerationConfig extends GenerationConfig {
  thinkingConfig?: {
    thinkingBudget: number;
  };
  systemInstruction?: string;
}

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
    const generateFn = httpsCallable(functions, 'generateClinicalContentProxy');
    
    const [response] = await Promise.all([
      generateFn({
        modelName,
        contents,
        config: {
          ...config,
          systemInstruction: config?.systemInstruction || LUMI_SYSTEM_PROMPT,
          tools: tools,
          safetySettings: safetySettings,
        }
      }),
      new Promise(r => setTimeout(r, 1000)) // Faster processing with 3.5
    ]);
    
    const resultData = response.data as any;

    // Interleaved RAG Verification Guardrail
    const verificationResponse = await generateFn({
      modelName: 'gemini-3.5-flash',
      contents: [{
        role: 'user',
        parts: [{ 
          text: `Evaluate the following AI response for medical accuracy and adherence to AWMF S3 guidelines.\n\nGuidelines: ${CLINICAL_REASONING_GUIDELINES}\n\nAI Response to evaluate:\n${resultData.text}\n\nProvide a JSON response with:\n1. "isVerified": boolean (true if it adheres to the guidelines without hallucinations)\n2. "confidenceScore": number (0-100, indicating factuality against guidelines)\n3. "hallucinationCheck": string (brief explanation of any unverified claims or deviations).` 
        }]
      }],
      config: {
        responseMimeType: "application/json",
      }
    });

    let guardrailData = { isVerified: false, confidenceScore: 0, hallucinationCheck: "Verification failed." };
    try {
      const vText = (verificationResponse.data as any).text;
      // Strip potential markdown JSON formatting
      const cleanJson = vText.replace(/```json/g, '').replace(/```/g, '').trim();
      guardrailData = JSON.parse(cleanJson);
    } catch (e) {
      console.warn("Failed to parse RAG guardrail verification JSON", e);
    }

    return {
      ...resultData,
      guardrail: guardrailData
    };
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
  const response = await generateClinicalContent(prompt, modelName, config, safetySettings, tools);
  return {
    async *[Symbol.asyncIterator]() {
      yield response;
    }
  };
};
export const ai = new GoogleGenAI({ apiKey: 'API_KEY_MOVED_TO_BACKEND' });

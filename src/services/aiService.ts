import { GoogleGenAI, GenerationConfig, SafetySetting, Part, Content } from '@google/genai';

const API_KEY = process.env.GEMINI_API_KEY || '';

export const CLINICAL_REASONING_GUIDELINES = `
# Physio & Ergo Clinical Reasoning Guidelines (ALWAYS-ON)

## 1. Prerequisite Validation (Voraussetzungsketten)
- Bevor fortgeschrittene Interventionsstrategien (z.B. Manuelle Therapie, Neuro-Reha) ausgegeben werden, muss die Vervollständigung der Voraussetzungen verifiziert werden: Anatomie -> Biomechanik -> Pathologie -> Assessment.
- Falls der Nutzerkontext keine Basis-Assessmentdaten (ICF) enthält, muss vor der Therapievorschlag-Erstellung danach gefragt werden.
- Verhindere Behandlungsfehler (Red Flags) durch Erzwingen der korrekten Reasoning-Kette (Befund → Intervention).

## 2. Interdisciplinary Workflow Linking
- Verbinde physiologische Befunde immer mit dem psychologischen Kontext (Bio-Psycho-Soziales Modell).
- Verknüpfe theoretische Konzepte direkt mit der klinischen Anwendbarkeit (z.B. "Kenntnisse der Neurophysiologie diktieren hier das Pacing der Schlaganfall-Reha-Übung").
- Generiere Outputs mehrdimensional (Bio-Psycho-Sozial).

## 3. Tool Utilization Syntax
- Nutze den 'Media Analyzer' spezifisch für biomechanische Abweichungsmetriken (Bewegungsgrade, Gangzyklusphasen).
- Nutze 'RAG' (Retrieval-Augmented Generation) strikt für den Abgleich von Interventionen mit aktuellen AWMF-Leitlinien.
- Sichert Evidenz durch harte Kopplung: Ganganalyse → Media Analyzer, Leitlinien-Check → RAG (AWMF).
`;

export const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface ExtendedGenerationConfig extends GenerationConfig {
  thinkingConfig?: {
    thinkingBudget: number;
  };
}

export const generateClinicalContent = async (
  prompt: string | Part[] | Content[], 
  modelName: string = 'gemini-2.5-flash', 
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
          systemInstruction: CLINICAL_REASONING_GUIDELINES,
          tools: tools,
          safetySettings: safetySettings,
        },
      }),
      new Promise(r => setTimeout(r, 1500))
    ]);
    return response;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

export const generateClinicalContentStream = async (
  prompt: string | Part[] | Content[], 
  modelName: string = 'gemini-2.5-flash', 
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
    return await ai.models.generateContentStream({
      model: modelName,
      contents,
      config: {
        ...config,
        systemInstruction: CLINICAL_REASONING_GUIDELINES,
        tools: tools,
        safetySettings: safetySettings,
      },
    });
  } catch (error) {
    console.error("AI Stream Error:", error);
    throw error;
  }
};

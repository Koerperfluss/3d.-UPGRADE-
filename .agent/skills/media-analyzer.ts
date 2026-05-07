import { GoogleGenAI } from '@google/genai';

export const analyzeMediaPosture = async (base64Data: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `DU BIST DER KÖRPERFLUSS MEDIA ANALYZER FÜR MULTIMODALE POSTURE-ANALYSE.
Führe eine Echtzeit-Frame-Analyse von Haltungsmustern durch.

1. ANALYSE-FOKUS:
   - Identifiziere Haltungsmuster in Echtzeit.
   - Analysiere Asymmetrien und Kompensationsmuster.

STRUKTURIERE DEINE ANTWORT IN:
### [HALTUNGSBEFUND]
(Was ist sichtbar? Rein deskriptiv.)

### [KOMPENSATIONSMUSTER]
(Welche Ausweichbewegungen oder Fehlhaltungen sind erkennbar?)

### [KORREKTUREMPFEHLUNG]
(Wie kann die Haltung verbessert werden?)

Antworte ausschließlich auf DEUTSCH.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt }
      ]
    }
  });

  return response;
};

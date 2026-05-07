import { GoogleGenAI } from '@google/genai';

export const analyzeVideoWithVisionAgent = async (base64Data: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `DU BIST DER KÖRPERFLUSS VISION AGENT FÜR KLINISCHE BIOMECHANIK.
Deine Aufgabe ist eine hochpräzise Analyse dieses Mediums.

1. ANALYSE-FOKUS:
   - Identifiziere exakt die Körperregion und das klinische Szenario.
   - Differenziere messerscharf zwischen STATISCHEN Haltungsabweichungen und DYNAMISCHEN Bewegungsfehlern.

2. GANGANALYSE (Gait Analysis) & BIOMECHANIK:
   - Analysiere spezifische Phasen, falls sichtbar: 'Initial Contact', 'Mid-Stance' und 'Terminal Swing'.
   - Extrahiere Gelenkpunkte und berechne Lastmomente via $M_L = \\sum_{i=1}^{n} (F_i \\cdot r_i \\cdot \\sin(\\theta_i))$.
   - Suche nach Asymmetrien, Vektorausrichtungen und Kompensationsmustern.

3. EVIDENZ & RECHERCHE:
   - Nutze das Google Search Tool, um den Befund mit aktuellen klinischen Leitlinien (z.B. S3-Leitlinien, Cochrane, JOSPT) abzugleichen.

STRUKTURIERE DEINE ANTWORT IN:
### [BEFUND]
(Was ist sichtbar? Rein deskriptiv.)

### [BIOMECHANISCHE ANALYSE]
(Wirkungsketten unter Verwendung von Fachbegriffen wie 'Closed Kinetic Chain', 'Propriozeption', 'Joint-Alignment'. Inklusive Lastmoment-Berechnung.)

### [EMPFEHLUNG]
(Evidenzbasierte nächste Schritte basierend auf der Websuche.)

Antworte ausschließlich auf DEUTSCH.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return response;
};

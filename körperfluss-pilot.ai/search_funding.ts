import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function search() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: "Suche im gesamten österreichischen Fördersystem (FFG, AWS, WKO, Länder) nach neuen, tagesaktuellen Förderungen für unser KI-HealthTech Startup mit Fokus auf den DACH/EU Bildungsraum. Liste konkrete Förderungen auf, die aktuell offen sind oder bald öffnen.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    console.log(response.text);
  } catch (error) {
    console.error("Error:", error);
  }
}

search();

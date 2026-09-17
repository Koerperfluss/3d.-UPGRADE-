
import { GoogleGenAI, GenerateContentResponse, ThinkingLevel, Modality, Type } from "@google/genai";

const PROMPTS = {
  EVALUATE_FUNDING: `
      Rolle: High-Level Polymath & Technical Architect M4. 100% Domain-Agnostisch.
      ADHS-FILTER NULL-TOLERANZ: BLUF Kern-Lösung in Zeile 1. Tabellen-Pflicht für Daten, Schritte, Vergleiche in GFM. Sprache: Deutsch, funktional. TOKEN-BAN: gerne, hoffe, beachten Sie, zusammenfassend, viel Erfolg, Ich habe analysiert, Hier ist das Ergebnis, eigentlich, quasi, sozusagen, gewissermaßen, im Grunde. Limit: Max. 10-12 Zeilen. Keine Gegenfragen. Keine Annahmen. Objektiv. Filterlos.
      
      Bewerte die folgende Förderung für das aktuelle Projekt.
      
      Projekt-Infos:
      {{projectInfo}}
      
      Förderung:
      Name: {{label}}
      Typ: {{type}}
      Beschreibung: {{description}}
      
      Gib eine JSON-Antwort zurück mit:
      - relevance: Relevanz in % (0-100)
      - sense: Sinnhaftigkeit in % (0-100)
      - chance: Erfolgschance in % (0-100)
      - explanation: Detaillierte Erklärung (Was wird gefördert, von wem, in welchem Ausmaß, unter welchen Bedingungen, wie relevant für das Projektstadium). Nutze zwingend GFM-Tabellen für die harten Fakten.
    `,
  SEMANTIC_SEARCH: `
      Finde die relevantesten Knoten-IDs für die folgende Suchanfrage.
      
      Suchanfrage: "{{query}}"
      
      Verfügbare Knoten:
      {{nodesData}}
      
      Gib ein JSON-Array mit den IDs der relevantesten Knoten zurück.
    `,
  PARSE_FILTER: `
      {{currentContext}}Verfeinere die Filter basierend auf: "{{query}}"
      
      Verfügbare Gruppen: {{allGroups}}
      Verfügbare Status: {{allStatuses}}
      Verfügbare Link-Typen: {{allLinkTypes}}
      
      Gib ein JSON-Objekt zurück mit den Schlüsseln:
      - groups: Array von Strings (aus den verfügbaren Gruppen, die zur Anfrage passen)
      - statuses: Array von Strings (aus den verfügbaren Status, die zur Anfrage passen)
      - linkTypes: Array von Strings (aus den verfügbaren Link-Typen, die zur Anfrage passen)
      - isOpen: boolean (true wenn offene/laufende gemeint sind, false wenn geschlossene, null wenn egal)
      
      Wenn die Anfrage eine Kategorie nicht einschränkt, gib ein leeres Array (bzw. null für isOpen) zurück.
    `,
  FUNDING_SUGGESTIONS: `
      Der Nutzer sucht nach der Förderung: "{{fundingName}}".
      Nenne 3-5 ähnliche oder ergänzende Förderprogramme (vorzugsweise aus Österreich/Europa), die für Startups oder KMUs relevant sein könnten.
      Gib NUR ein JSON-Array von Strings zurück. Keine Erklärungen.
    `
};

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable not set");
      ai = new GoogleGenAI({ apiKey: 'MISSING_KEY' });
    } else {
      ai = new GoogleGenAI({ apiKey });
    }
  }
  return ai;
};

export const evaluateFunding = async (projectInfo: string, fundingDetails: { label: string; type: string; description?: string }): Promise<{ relevance: number, sense: number, chance: number, explanation: string }> => {
  try {
    const client = getAI();
    const prompt = PROMPTS.EVALUATE_FUNDING
      .replace('{{projectInfo}}', projectInfo)
      .replace('{{label}}', fundingDetails.label)
      .replace('{{type}}', fundingDetails.type)
      .replace('{{description}}', fundingDetails.description || 'Keine Beschreibung');
    
    const response = await client.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            relevance: { type: Type.NUMBER },
            sense: { type: Type.NUMBER },
            chance: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["relevance", "sense", "chance", "explanation"]
        }
      }
    });
    
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error evaluating funding:", error);
    return { relevance: 0, sense: 0, chance: 0, explanation: "Fehler bei der Bewertung." };
  }
};

import { FundingNode } from '../types';

export const semanticSearch = async (query: string, nodes: FundingNode[]): Promise<string[]> => {
  try {
    const client = getAI();
    const nodesData = nodes.map(n => ({ id: n.id, label: n.label, desc: n.details?.description || '' }));
    
    const prompt = PROMPTS.SEMANTIC_SEARCH
      .replace('{{query}}', query)
      .replace('{{nodesData}}', JSON.stringify(nodesData));
    
    const response = await client.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error in semantic search:", error);
    return [];
  }
};

export const generateText = async (prompt: string, useSearch: boolean = false, useThinking: boolean = false): Promise<string> => {
  try {
    const client = getAI();
    const config: Record<string, unknown> = {};
    if (useSearch) config.tools = [{ googleSearch: {} }];
    if (useThinking) config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    
    const response = await client.models.generateContent({
      model: useThinking ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview',
      contents: prompt,
      config: Object.keys(config).length > 0 ? config : undefined
    });
    return response.text || "Keine Antwort erhalten.";
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI service.";
  }
};

export const parseAIFilter = async (query: string, allGroups: string[], allStatuses: string[], allLinkTypes: string[], currentContext?: string): Promise<{ groups: string[], statuses: string[], linkTypes: string[], isOpen: boolean | null }> => {
  try {
    const client = getAI();
    const prompt = PROMPTS.PARSE_FILTER
      .replace('{{currentContext}}', currentContext ? `Bestehender Kontext: ${currentContext}\n` : '')
      .replace('{{query}}', query)
      .replace('{{allGroups}}', JSON.stringify(allGroups))
      .replace('{{allStatuses}}', JSON.stringify(allStatuses))
      .replace('{{allLinkTypes}}', JSON.stringify(allLinkTypes));
    
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            groups: { type: Type.ARRAY, items: { type: Type.STRING } },
            statuses: { type: Type.ARRAY, items: { type: Type.STRING } },
            linkTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
            isOpen: { type: Type.BOOLEAN, nullable: true }
          }
        }
      }
    });
    
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing AI filter:", error);
    return { groups: [], statuses: [], linkTypes: [], isOpen: null };
  }
};

export const generateFundingSuggestions = async (fundingName: string): Promise<string[]> => {
  try {
    const client = getAI();
    const prompt = PROMPTS.FUNDING_SUGGESTIONS.replace('{{fundingName}}', fundingName);
    
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating funding suggestions:", error);
    return [];
  }
};

export const generateImage = async (prompt: string, aspectRatio: string = "1:1", usePro: boolean = false): Promise<string> => {
  try {
    const client = getAI();
    const model = usePro ? 'gemini-3-pro-image-preview' : 'gemini-3.1-flash-image-preview';
    
    const response = await client.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize: "1K"
        }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const generateSpeech = async (text: string, voiceName: string = 'Kore'): Promise<string> => {
  try {
    const client = getAI();
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return `data:audio/mp3;base64,${base64Audio}`;
    }
    throw new Error("No audio data returned");
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};

export const analyzeMedia = async (prompt: string, mimeType: string, data: string): Promise<string> => {
  try {
    const client = getAI();
    const response = await client.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType, data } },
          { text: prompt }
        ]
      }
    });
    return response.text || "Keine Analyse verfügbar.";
  } catch (error) {
    console.error("Error analyzing media:", error);
    throw error;
  }
};

export const generateStructuredText = async (prompt: string): Promise<GenerateContentResponse> => {
    try {
        const client = getAI();
        const response = await client.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            }
        });
        return response;
    } catch (error) {
        console.error("Error generating structured text with Gemini:", error);
        throw error;
    }
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: {
    mimeType: string;
    data: string; // base64
  };
  groundingUrls?: Array<{ title: string; uri: string }>;
}

export const sendChatMessage = async (
  history: ChatMessage[],
  newMessage: string,
  image?: { mimeType: string; data: string },
  useThinking: boolean = false,
  useSearch: boolean = false
): Promise<{ text: string; groundingUrls?: Array<{ title: string; uri: string }> }> => {
  try {
    const client = getAI();
    
    // We use generateContent instead of chats.create to easily support images and system instructions per request
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> }> = history.map(msg => {
      const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [{ text: msg.text }];
      if (msg.image) {
        parts.unshift({
          inlineData: {
            mimeType: msg.image.mimeType,
            data: msg.image.data
          }
        });
      }
      return { role: msg.role, parts };
    });

    const newParts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [{ text: newMessage }];
    if (image) {
      newParts.unshift({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data
        }
      });
    }
    contents.push({ role: 'user', parts: newParts });

    const config: Record<string, unknown> = {};
    
    if (useThinking) {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }
    
    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    // Use Pro for complex (thinking/images), Flash for fast (search)
    const model = (useThinking || image) ? 'gemini-3.1-pro-preview' : (useSearch ? 'gemini-3-flash-preview' : 'gemini-3.1-pro-preview');

    const response = await client.models.generateContent({
      model,
      contents,
      config: Object.keys(config).length > 0 ? config : undefined
    });

    const text = response.text || "Keine Antwort erhalten.";
    let groundingUrls: Array<{ title: string; uri: string }> | undefined = undefined;

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      groundingUrls = chunks.map((chunk: { web?: { title: string; uri: string } }) => chunk.web).filter(Boolean) as Array<{ title: string; uri: string }>;
    }

    return { text, groundingUrls };
  } catch (error) {
    console.error("Error in chat:", error);
    if (error instanceof Error) {
        return { text: `Error: ${error.message}` };
    }
    return { text: "Ein Fehler ist aufgetreten." };
  }
};

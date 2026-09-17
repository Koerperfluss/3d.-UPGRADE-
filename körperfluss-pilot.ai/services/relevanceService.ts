
import { GoogleGenAI, Type } from "@google/genai";
import { FundingNode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface RelevanceScore {
  nodeId: string;
  score: number;
  reason: string;
}

export async function calculateRelevance(
  projectContext: string,
  fundingNodes: FundingNode[]
): Promise<RelevanceScore[]> {
  if (!projectContext || fundingNodes.length === 0) return [];

  const prompt = `
    Analyze the relevance of the following funding opportunities for this project context:
    
    PROJECT CONTEXT:
    ${projectContext}
    
    FUNDING OPPORTUNITIES:
    ${fundingNodes.map(n => `- ID: ${n.id}, LABEL: ${n.label}, DESCRIPTION: ${n.details.description}`).join('\n')}
    
    Return a relevance score from 0 to 100 for each.
    Score 0: Not relevant at all.
    Score 100: Perfect match.
    Provide a brief reason (max 15 words) for each score in german.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              nodeId: { type: Type.STRING },
              score: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            },
            required: ["nodeId", "score", "reason"]
          }
        }
      }
    });

    const scores: RelevanceScore[] = JSON.parse(response.text);
    return scores;
  } catch (error) {
    console.error("Error calculating relevance scores:", error);
    return [];
  }
}

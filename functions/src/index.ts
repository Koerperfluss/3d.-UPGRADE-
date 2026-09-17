import { onCall, HttpsError } from "firebase-functions/v2/https";
import { GoogleGenAI } from "@google/genai";
import * as admin from "firebase-admin";

admin.initializeApp();

export const generateClinicalContentProxy = onCall(
  { cors: true },
  async (request) => {
    // Ideally use Firebase Secret Manager for the API key in production: process.env.GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
    
    if (!apiKey) {
      throw new HttpsError("internal", "API key is not configured in the server environment.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Extract payload
    const { modelName, contents, config } = request.data;
    
    if (!modelName || !contents) {
      throw new HttpsError("invalid-argument", "Missing required arguments: modelName or contents");
    }

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: config,
      });
      
      return response;
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      throw new HttpsError("internal", error.message || "An error occurred while generating content");
    }
  }
);

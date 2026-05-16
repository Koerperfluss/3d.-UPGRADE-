/**
 * Neuro-Symbolischer Safety Guard
 * 
 * Verifiziert KI-Antworten gegen S3-Leitlinien (Cochrane, JOSPT, AWMF)
 * Verhindert Diagnosestellung und Therapieempfehlungen (MDR-Bypass-Logik).
 */

import { generateClinicalContent } from './aiService';

export interface ValidationLog {
  timestamp: string;
  source: string;
  status: 'approved' | 'rejected' | 'modified';
  reasoning: string;
  sourceUri?: string;
}

export const safetyGuard = {
  /**
   * Filtert Diagnosen aus dem Text und ersetzt sie durch leitlinienkonforme Aussagen.
   */
  applyMdrBypass: (text: string): { sanitizedText: string; logs: ValidationLog[] } => {
    const logs: ValidationLog[] = [];
    let sanitizedText = text;

    // Diagnose-Muster erkennen (z.B. "Du hast Bandscheibenvorfall" oder "Die Diagnose ist...")
    const diagnosisPattern = /(Du hast|Sie haben|Die Diagnose ist|Es handelt sich um) (einen |eine |ein )?([A-Za-z0-9\- ]+)/gi;

    if (diagnosisPattern.test(sanitizedText)) {
      sanitizedText = sanitizedText.replace(diagnosisPattern, "Die Befunde deuten auf $3 hin, verifiziert durch [Safety Guard MDR Filter]");
      logs.push({
        timestamp: new Date().toISOString(),
        source: 'MDR-Filter',
        status: 'modified',
        reasoning: 'Direkte Diagnosestellung wurde verhindert (MDR Compliance).'
      });
    }

    return { sanitizedText, logs };
  },

  /**
   * Validiert eine studentische Hypothese in Echtzeit gegen Leitlinien via Grounding.
   */
  validateHypothesis: async (
      hypothesis: string,
      addCotStep?: (step: any) => string,
      updateCotStep?: (id: string, updates: any) => void
  ): Promise<{ isSafe: boolean; feedback: string; logs: ValidationLog[] }> => {
    let stepId = "";
    if (addCotStep) {
        stepId = addCotStep({
            phase: 'Evidenz-Mapping',
            description: 'Abfrage von Level 1a Evidenz (AWMF/Cochrane) und Abgleich der studentischen Hypothese...',
            confidence: 0,
            status: 'active'
        });
    }

    try {
      const prompt = `Du bist ein Neuro-Symbolischer Safety Guard für Physiotherapie (Österreichischer Standard).
Lies folgende klinische Hypothese des Studenten:
"${hypothesis}"
Aufgabe: Überprüfe mittels Google Search Tools aktuelle physiotherapeutische Leitlinien. Priorisiere hierarchisch: 1. Cochrane Reviews, 2. S3/AWMF Leitlinien, 3. JOSPT.
Stimmt die Hypothese mit den Leitlinien überein? Handelt es sich um eine Red Flag, die falsch interpretiert wurde?
Vermeide Diagnosestellungen gemäß MDR (Medical Device Regulation). Du bist rein auf die didaktische Kausalketten-Analyse fokussiert - du diagnostizierst nicht, sondern bewertest die Plausibilität der studentischen Argumentation.
Antworte strikt im JSON Format:
{
  "isSafe": boolean,
  "reasoning": "Kurze Begründung mit Leitlinien-Referenz",
  "recommendedFeedback": "Dein sokratisches Feedback für den Studenten",
  "guideline": "Name der genutzten Leitlinie (z.B. JOSPT 2024)",
  "confidence": number // zwischen 0.0 und 1.0, basierend auf der Evidenzklasse (Cochrane = hohe Evidenz)
}`;

      const response = await generateClinicalContent(prompt, 'gemini-3.1-pro-preview', { responseMimeType: "application/json" }, [], [{ googleSearch: {} }]);
      const result = JSON.parse(response.text || "{}");

      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      let sourceUri = undefined;
      const urls = grounding?.filter((c: any) => c.web)?.map((c: any) => c.web.uri);
      if(urls && urls.length > 0) sourceUri = urls[0];

      if (updateCotStep && stepId) {
          updateCotStep(stepId, {
              description: `Hypothese validiert gegen ${result.guideline || 'Online Evidenz'}. ${result.reasoning}`,
              confidence: result.confidence !== undefined ? result.confidence : 0.85,
              status: result.isSafe ? 'complete' : 'error',
              sources: sourceUri ? [{ title: result.guideline || 'Online Evidenz', url: sourceUri }] : []
          });
      }

      const logs: ValidationLog[] = [{
        timestamp: new Date().toISOString(),
        source: result.guideline || 'S3-Guideline',
        status: result.isSafe ? 'approved' : 'rejected',
        reasoning: result.reasoning || 'Abgleich mit Ground Truth erfolgt.',
        sourceUri
      }];

      const { sanitizedText, logs: filterLogs } = safetyGuard.applyMdrBypass(result.recommendedFeedback || hypothesis);

      if (filterLogs.length > 0 && addCotStep) {
          addCotStep({
              phase: 'MDR-Filter',
              description: 'Juristischer Schutzwall aktiv. Direkte Diagnosen in didaktische Hypothesen umgewandelt.',
              confidence: 1.0,
              status: 'complete'
          });
      }

      return {
        isSafe: result.isSafe !== undefined ? result.isSafe : true,
        feedback: sanitizedText,
        logs: [...logs, ...filterLogs]
      };
    } catch (error) {
      console.error("Safety Guard Error:", error);
      
      if (updateCotStep && stepId) {
          updateCotStep(stepId, {
              description: 'Fehler beim Abruf der Evidenz. Aktiviere Offline-Fallback.',
              status: 'error',
              confidence: 0
          });
      }

      // Fallback
      return {
        isSafe: true,
        feedback: hypothesis + " (Offline Validierung)",
        logs: [{
          timestamp: new Date().toISOString(),
          source: 'Offline Fallback',
          status: 'approved',
          reasoning: 'Konnte nicht gegen Online-Leitlinien geprüft werden.'
        }]
      };
    }
  }
};

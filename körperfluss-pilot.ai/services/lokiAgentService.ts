import { generateText } from './geminiService';

export type AgentRole = 'orchestrator' | 'gesundheit' | 'fitness' | 'klinik' | 'forschung' | 'lernen';

const AGENT_PROMPTS: Record<AgentRole, string> = {
  orchestrator: "Du bist der Loki Orchestrator. Analysiere die Anfrage und delegiere an Experten. Synthetisiere am Ende die Ergebnisse.",
  gesundheit: "Du bist der Gesundheits-Agent. Fokus: Ganzheitliche Gesundheit, Schmerzevaluierung, Bewegungsempfehlungen.",
  fitness: "Du bist der Fitness-Agent. Fokus: Calisthenics, Trainingspläne, Übungsanalyse.",
  klinik: "Du bist der Klinik-Agent. Fokus: SOAP-Notizen, ICD-10, Differentialdiagnose.",
  forschung: "Du bist der Forschungs-Agent. Fokus: Evidenzbasierte Forschung, Studienanalyse, klinische Richtlinien.",
  lernen: "Du bist der Lern-Agent. Fokus: Quiz-Generierung, Fallstudien, Prüfungssimulation."
};

export const runMultiAgentQuery = async (query: string, onProgress?: (status: string) => void): Promise<string> => {
  if (onProgress) onProgress("Orchestrator analysiert Anfrage...");
  
  const planPrompt = `<SYSTEM_ROLE>${AGENT_PROMPTS.orchestrator}</SYSTEM_ROLE>\n<INSTRUCTION>Welche 2 Agenten (gesundheit, fitness, klinik, forschung, lernen) sollten das beantworten? Antworte nur mit den exakten Schlüsseln, kommagetrennt.</INSTRUCTION>\n<USER_QUERY>${query}</USER_QUERY>`;
  const planStr = await generateText(planPrompt);
  const selectedAgents = planStr.toLowerCase().match(/(gesundheit|fitness|klinik|forschung|lernen)/g) || ['gesundheit'];
  const uniqueAgents = [...new Set(selectedAgents)] as AgentRole[];

  if (onProgress) onProgress(`Delegation an: ${uniqueAgents.join(', ')}...`);

  const promises = uniqueAgents.map(agent => 
    generateText(`<SYSTEM_ROLE>${AGENT_PROMPTS[agent]}</SYSTEM_ROLE>\n<USER_QUERY>${query}</USER_QUERY>`)
  );
  const results = await Promise.all(promises);

  if (onProgress) onProgress("Orchestrator synthetisiert Ergebnisse...");

  const synthPrompt = `<SYSTEM_ROLE>${AGENT_PROMPTS.orchestrator}</SYSTEM_ROLE>\n<INSTRUCTION>Synthetisiere diese Experten-Antworten zu einer finalen, kohärenten Antwort für den Nutzer. Nutze Markdown.</INSTRUCTION>\n<EXPERT_ANSWERS>\n${results.map((r, i) => `--- Agent ${uniqueAgents[i]} ---\n${r}`).join('\n\n')}\n</EXPERT_ANSWERS>`;
  
  const finalResponse = await generateText(synthPrompt);
  if (onProgress) onProgress("");
  return finalResponse;
};

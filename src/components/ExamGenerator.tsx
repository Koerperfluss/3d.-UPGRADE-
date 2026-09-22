import React, { useState } from 'react';
import { Type } from '@google/genai';
import { generateClinicalContent } from '../services/aiService';
import { Card } from './Card';
import { Button } from './Button';
import { SimulationIcon } from './IconComponents';
import { Exam } from '../types';
import { motion } from 'framer-motion';

export interface ExamGeneratorInput {
  fachbereich: string;
  difficulty: string;
  questionsCount: number;
  duration: number;
  topic: string;
}

export const ExamGenerator: React.FC<{ onExamGenerated: (exam: Exam) => void }> = ({ onExamGenerated }) => {
  const [input, setInput] = useState<ExamGeneratorInput>({
    fachbereich: 'Physiotherapie',
    difficulty: 'mittel',
    questionsCount: 5,
    duration: 15,
    topic: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!input.topic) return;
    setIsLoading(true);
    setError('');

    try {
      const difficultyGuide = {
        einfach: "Fokus auf Faktenwissen, Definitionen und Standard-Protokolle (Bloom-Taxonomie: Wissen/Verstehen).",
        mittel: "Fokus auf Anwendung von Wissen, einfache Fallbeispiele und Transferleistungen (Bloom-Taxonomie: Anwenden).",
        schwer: "Fokus auf komplexe klinische Entscheidungsfindung, Differentialdiagnostik, Kontraindikationen und Synthese (Bloom-Taxonomie: Analyse/Synthese/Evaluation)."
      };

      const prompt = `
ROLLE: Du bist ein strenger, aber fairer Prüfungsexperte für den Fachbereich ${input.fachbereich}.
AUFGABE: Erstelle eine realistische Prüfungssimulation (Mock Exam).

INPUT PARAMETER:
- Thema: ${input.topic}
- Schwierigkeitsgrad: ${input.difficulty}
- Definition der Schwierigkeit: ${difficultyGuide[input.difficulty as keyof typeof difficultyGuide]}
- Anzahl Fragen: ${input.questionsCount}
- Zielgruppe: Studierende/Auszubildende kurz vor dem Abschluss.

ANFORDERUNGEN AN DIE FRAGEN:
1.  **Klinischer Bezug:** Jede Frage muss einen klinischen Kontext haben. Vermeide reine "Lehrbuch"-Abfragen ohne Praxisbezug.
2.  **Formate:** Mische Multiple Choice (MC) und Offene Fragen (Open Text) im Verhältnis 50/50.
    - **MC:** 4 Optionen, nur eine korrekt. Distraktoren (falsche Antworten) müssen plausibel sein.
    - **Open:** Fragen nach Begründungen, Therapieplänen oder Differentialdiagnosen. Hier MUSS eine sehr detaillierte "modelAnswer" generiert werden, die als Referenz für eine spätere KI-Korrektur dient.
3.  **Punktevergabe:**
    - MC: 1 Punkt.
    - Open: 5 Punkte (für komplexe Gedankengänge).
4.  **Lernziel-Alignment:** Gib für jede Frage ein 'alignment' an, das angibt, welches Kompetenz-Framework (z.B. 'RANZCP 3.2', 'Physio-Curriculum: Diagnostik' oder 'WCPT Guidelines') die Frage abdeckt.

OUTPUT JSON SCHEMA:
Bitte antworte AUSSCHLIESSLICH mit diesem JSON-Objekt:
{
  "title": "Titel der Prüfung (Fachlich korrekt)",
  "questions": [
    {
      "type": "multiple_choice" | "open_text",
      "question": "Der eigentliche Fragetext...",
      "options": ["Option A", "Option B", "Option C", "Option D"], // Nur bei MC füllen
      "correctAnswer": "Der exakte Text der richtigen Option", // Nur bei MC füllen
      "modelAnswer": "Detaillierte Musterlösung mit Stichpunkten für die Bewertung...", // WICHTIG für Open Text
      "points": 1, // oder 5
      "alignment": "z.B. RANZCP 3.2 - Psychiatrische Anamnese" // Kompetenz-Referenz
    }
  ]
}
`;

      const response = await generateClinicalContent(prompt, 'gemini-2.5-flash', {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["multiple_choice", "open_text"] },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING },
                  modelAnswer: { type: Type.STRING },
                  points: { type: Type.INTEGER },
                  alignment: { type: Type.STRING }
                }
              }
            }
          }
        }
      });

      const data = JSON.parse(response.text || "{}");

      if (data && data.questions) {
        const totalPoints = data.questions.reduce((sum: number, q: any) => sum + q.points, 0);
        const newExam: Exam = {
          id: `EXAM_${Date.now()}`,
          title: data.title,
          durationMinutes: input.duration,
          questions: data.questions.map((q: any, i: number) => ({ ...q, id: `q_${i}` })),
          totalPoints: totalPoints,
          difficulty: input.difficulty
        };
        onExamGenerated(newExam);
      } else {
        throw new Error("Ungültiges Antwortformat");
      }

    } catch (e) {
      console.error(e);
      setError("Fehler bei der Generierung. Bitte prüfen Sie den API-Key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Card className="glass-dark border-white/5 max-w-2xl mx-auto !p-12 md:!p-16 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/10 transition-all duration-1000"></div>

        <div className="flex items-center gap-6 mb-12 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 shadow-glow">
             <SimulationIcon className="w-8 h-8 text-brand-primary opacity-80" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white font-serif tracking-tight">Advanced Exam Simulator</h3>
            <p className="text-sm text-zinc-500 font-light tracking-wide">Erstellen Sie Prüfungen mit KI-gestützter Freitext-Korrektur.</p>
          </div>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-3 ml-1">Fachbereich</label>
              <input
                  type="text"
                  value={input.fachbereich}
                  onChange={(e) => setInput({...input, fachbereich: e.target.value})}
                  placeholder="z.B. Physiotherapie"
                  className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl focus:ring-1 focus:ring-brand-primary/50 outline-none text-sm text-white placeholder:text-zinc-700 transition-all"
              />
              </div>
              <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-3 ml-1">Thema / Fokus</label>
              <input
                  type="text"
                  value={input.topic}
                  onChange={(e) => setInput({...input, topic: e.target.value})}
                  placeholder="z.B. Kreuzbandruptur"
                  className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl focus:ring-1 focus:ring-brand-primary/50 outline-none text-sm text-white placeholder:text-zinc-700 transition-all"
              />
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-3 ml-1">Schwierigkeit</label>
                  <select
                      value={input.difficulty}
                      onChange={(e) => setInput({...input, difficulty: e.target.value})}
                      className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none text-sm text-white appearance-none cursor-pointer focus:ring-1 focus:ring-brand-primary/50 transition-all"
                  >
                      <option value="einfach" className="bg-zinc-900">Einfach</option>
                      <option value="mittel" className="bg-zinc-900">Mittel</option>
                      <option value="schwer" className="bg-zinc-900">Schwer</option>
                  </select>
              </div>
              <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-3 ml-1">Anzahl Fragen</label>
                  <input
                      type="number"
                      value={input.questionsCount}
                      onChange={(e) => setInput({...input, questionsCount: parseInt(e.target.value)})}
                      className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none text-sm text-white focus:ring-1 focus:ring-brand-primary/50 transition-all"
                      min="1" max="10"
                  />
              </div>
              <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-3 ml-1">Zeitlimit (Min)</label>
                  <input
                      type="number"
                      value={input.duration}
                      onChange={(e) => setInput({...input, duration: parseInt(e.target.value)})}
                      className="w-full p-4 bg-black/40 border border-white/5 rounded-2xl outline-none text-sm text-white focus:ring-1 focus:ring-brand-primary/50 transition-all"
                      min="5"
                  />
              </div>
          </div>

          {error && <p className="text-red-400 text-xs bg-red-400/5 border border-red-400/10 p-4 rounded-2xl">{error}</p>}

          <Button
            onClick={handleGenerate}
            disabled={isLoading || !input.topic}
            variant="primary"
            className="w-full py-6 text-[10px] uppercase tracking-[0.5em] font-black shadow-2xl shadow-brand-primary/20"
          >
            {isLoading ? (
                <span className="flex items-center gap-3">
                    <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></div>
                    Generiere Prüfung...
                </span>
            ) : 'Prüfung generieren'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

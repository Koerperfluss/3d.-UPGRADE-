
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Type } from '@google/genai';
import { generateClinicalContent } from '../services/aiService';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SimulationIcon, CheckCircleIcon, ArrowRightIcon, WarningIcon, BrainCircuitIcon, AcademicCapIcon, ArrowLeftIcon } from '../components/IconComponents';
import { Exam, ExamQuestion } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// --- EXAM GENERATOR COMPONENT ---

interface ExamGeneratorInput {
  fachbereich: string;
  difficulty: string;
  questionsCount: number;
  duration: number;
  topic: string;
}

const ExamGenerator: React.FC<{ onExamGenerated: (exam: Exam) => void }> = ({ onExamGenerated }) => {
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

// --- EXAM SESSION COMPONENT ---

const ExamSession: React.FC<{ exam: Exam, onExit: () => void }> = ({ exam, onExit }) => {
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gradedExam, setGradedExam] = useState<Exam | null>(null);
  const [isGrading, setIsGrading] = useState(false);

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const gradeOpenQuestions = async (examToGrade: Exam) => {
      setIsGrading(true);
      
      const openQuestions = examToGrade.questions.filter(q => q.type === 'open_text');
      const gradedQuestions = [...examToGrade.questions];

      // Grade open questions in parallel-ish
      await Promise.all(openQuestions.map(async (q) => {
          const userAnswer = userAnswers[q.id] || "Keine Antwort gegeben.";
          const prompt = `
            ROLLE: Korrektor für medizinische Prüfungen.
            FRAGE: ${q.question}
            MUSTERLÖSUNG: ${q.modelAnswer}
            MAX_PUNKTE: ${q.points}
            ANTWORT DES STUDENTEN: ${userAnswer}
            
            AUFGABE: Bewerte die Antwort fair. Gib Punkte und kurzes Feedback.
            
            OUTPUT JSON:
            {
                "score": number, // 0 bis MAX_PUNKTE
                "feedback": "string" // Konstruktives Feedback
            }
          `;
          
          try {
              const response = await generateClinicalContent(prompt, 'gemini-2.5-flash', { responseMimeType: "application/json" });
              const grading = JSON.parse(response.text || "{}");
              
              const qIndex = gradedQuestions.findIndex(gq => gq.id === q.id);
              if (qIndex >= 0) {
                  gradedQuestions[qIndex] = {
                      ...gradedQuestions[qIndex],
                      aiGrading: {
                          score: grading.score || 0,
                          feedback: grading.feedback || "Keine Bewertung möglich."
                      }
                  };
              }
          } catch (e) {
              console.error("Grading error", e);
          }
      }));

      // Grade MC questions locally
      gradedQuestions.forEach((q, idx) => {
          if (q.type === 'multiple_choice') {
             const isCorrect = userAnswers[q.id] === q.correctAnswer;
             gradedQuestions[idx] = {
                 ...gradedQuestions[idx],
                 aiGrading: {
                     score: isCorrect ? q.points : 0,
                     feedback: isCorrect ? "Korrekt!" : `Falsch. Richtige Antwort: ${q.correctAnswer}`
                 }
             }
          }
      });

      setGradedExam({ ...examToGrade, questions: gradedQuestions });
      setIsGrading(false);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    gradeOpenQuestions(exam);
  };

  const currentExamState = gradedExam || exam;
  const totalAchieved = gradedExam ? gradedExam.questions.reduce((acc, q) => acc + (q.aiGrading?.score || 0), 0) : 0;
  const percentage = Math.round((totalAchieved / exam.totalPoints) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header with Timer/Score */}
      <div className={`sticky top-28 z-40 p-8 rounded-[32px] shadow-2xl mb-12 flex justify-between items-center transition-all duration-700 border border-white/5 backdrop-blur-2xl ${isSubmitted ? (percentage >= 50 ? 'bg-green-500/20 text-white' : 'bg-red-500/20 text-white') : 'bg-zinc-900/80 text-white'}`}>
        <div>
            <h2 className="font-bold text-2xl font-serif tracking-tight mb-1">{exam.title}</h2>
            {!isSubmitted ? (
                 <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">{exam.questions.length} Fragen | {exam.totalPoints} Punkte erreichbar</p>
            ) : (
                 <p className="text-sm font-medium text-zinc-300">
                    Ergebnis: <span className="text-white font-bold">{totalAchieved} / {exam.totalPoints}</span> Punkte ({percentage}%) - <span className={percentage >= 50 ? 'text-green-400' : 'text-red-400'}>{percentage >= 50 ? 'Bestanden' : 'Nicht Bestanden'}</span>
                 </p>
            )}
        </div>
        {!isSubmitted && (
            <div className={`text-3xl font-mono font-bold tracking-tighter ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-brand-primary'}`}>
                {formatTime(timeLeft)}
            </div>
        )}
        {isSubmitted && isGrading && (
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-black bg-white/5 px-6 py-3 rounded-full border border-white/10">
                <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                KI bewertet...
            </div>
        )}
      </div>

      <div className="space-y-12 mb-32">
        {currentExamState.questions.map((q, index) => (
            <Card key={q.id} className={`glass-dark !p-12 md:!p-16 rounded-[48px] transition-all duration-1000 border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] ${isSubmitted && q.aiGrading ? (
                q.aiGrading.score > 0 
                    ? (q.aiGrading.score === q.points ? 'border-l-8 border-l-green-500/50' : 'border-l-8 border-l-yellow-500/50') 
                    : 'border-l-8 border-l-red-500/50'
            ) : ''}`}>
                <div className="flex justify-between items-center mb-10">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-primary">Frage {index + 1}</span>
                    <div className="flex gap-4 items-center">
                         {isSubmitted && q.alignment && (
                             <span className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] font-bold text-brand-primary bg-brand-primary/5 px-4 py-2 rounded-xl border border-brand-primary/10">
                                 <AcademicCapIcon className="w-3 h-3" /> {q.alignment}
                             </span>
                         )}
                        <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-zinc-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                            {q.type === 'multiple_choice' ? 'Multiple Choice' : 'Freitext'}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.1em] font-black text-white bg-brand-primary/10 px-4 py-2 rounded-xl border border-brand-primary/20">
                            {q.aiGrading ? `${q.aiGrading.score} / ${q.points}` : `${q.points} Punkte`}
                        </span>
                    </div>
                </div>
                 {isSubmitted && q.alignment && (
                     <p className="md:hidden text-[10px] uppercase tracking-[0.1em] font-bold text-brand-primary mb-6 flex items-center gap-2">
                        <AcademicCapIcon className="w-3 h-3" /> {q.alignment}
                     </p>
                 )}
                <p className="text-2xl mb-12 text-white font-serif tracking-tight leading-snug">{q.question}</p>

                {q.type === 'multiple_choice' ? (
                    <div className="space-y-4">
                        {q.options?.map((opt) => {
                            let optionClass = "w-full p-6 text-left rounded-2xl border transition-all duration-500 text-sm tracking-wide ";
                            if (isSubmitted) {
                                if (opt === q.correctAnswer) optionClass += "bg-green-500/10 border-green-500/50 text-green-400 font-bold";
                                else if (userAnswers[q.id] === opt) optionClass += "bg-red-500/10 border-red-500/50 text-red-400";
                                else optionClass += "bg-white/5 border-white/5 opacity-40 text-zinc-500";
                            } else {
                                optionClass += userAnswers[q.id] === opt 
                                    ? "bg-brand-primary/10 border-brand-primary text-white font-bold shadow-glow" 
                                    : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:border-white/10";
                            }
                            
                            return (
                                <button 
                                    key={opt}
                                    onClick={() => !isSubmitted && setUserAnswers({...userAnswers, [q.id]: opt})}
                                    disabled={isSubmitted}
                                    className={optionClass}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                         {isSubmitted && q.aiGrading && (
                            <div className="mt-8 text-sm text-zinc-400 font-light leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5">
                                <strong className="text-white font-bold uppercase tracking-widest text-[10px] block mb-2">Feedback:</strong> {q.aiGrading.feedback}
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <textarea 
                            value={userAnswers[q.id] || ''}
                            onChange={(e) => setUserAnswers({...userAnswers, [q.id]: e.target.value})}
                            disabled={isSubmitted}
                            placeholder="Schreiben Sie Ihre Antwort hier..."
                            className="w-full p-6 bg-black/40 border border-white/5 rounded-2xl min-h-[200px] focus:ring-1 focus:ring-brand-primary/50 outline-none text-white placeholder:text-zinc-700 transition-all font-light leading-relaxed"
                        />
                        {isSubmitted && q.aiGrading && (
                            <div className="mt-10 space-y-6 animate-fadeInUp">
                                <div className={`p-8 rounded-[32px] border ${q.aiGrading.score > 0 ? 'bg-brand-primary/5 border-brand-primary/10' : 'bg-red-500/5 border-red-500/10'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <BrainCircuitIcon className="w-5 h-5 text-brand-primary" />
                                            <strong className="text-[10px] uppercase tracking-[0.2em] font-black text-white">KI-Bewertung</strong>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full">
                                            <SimulationIcon className="w-3 h-3 text-brand-primary" />
                                            <span className="text-[9px] uppercase tracking-[0.1em] font-bold text-brand-primary">Transparenz-Modus für Prüfer (CoT)</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">{q.aiGrading.feedback}</p>
                                    <div className="text-xs text-zinc-500 font-light leading-relaxed border-t border-white/5 pt-6">
                                        <strong className="text-white font-bold uppercase tracking-widest text-[10px] block mb-2">Musterlösung:</strong> {q.modelAnswer}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/5 p-8 flex justify-center z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        {!isSubmitted ? (
            <Button onClick={handleSubmit} variant="primary" size="lg" className="px-16 py-8 text-[10px] uppercase tracking-[0.5em] font-black shadow-2xl shadow-brand-primary/20">Prüfung jetzt abgeben</Button>
        ) : (
            <div className="flex items-center gap-6">
                <Button onClick={onExit} variant="outline" className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-bold">Zurück zur Übersicht</Button>
                <Button onClick={() => window.print()} variant="secondary" className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-bold">PDF Export</Button>
                <Button onClick={() => alert('Erfolgreich in Moodle synchronisiert! (LTI 1.3 Demo)')} variant="primary" className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-bold">In Moodle sichern (LMS)</Button>
            </div>
        )}
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---

export const ExamSimulationPage: React.FC = () => {
  const [activeExam, setActiveExam] = useState<Exam | null>(null);

  return (
    <div className="animate-fadeInUp bg-black min-h-screen pt-40 pb-32 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
         <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20 mb-12">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 hover:text-brand-primary transition-all group">
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Zurück zum Dashboard
        </Link>
      </div>

      <Section 
        title="Prüfungs-Simulation Pro"
        subtitle="Realistische Examensvorbereitung mit Zeitdruck, gemischten Fragenformaten und intelligenter KI-Korrektur für Freitext-Antworten."
        containerClassName="py-0 relative z-10 mb-24"
      />

      <div className="container mx-auto px-4 relative z-10">
        {!activeExam ? (
            <ExamGenerator onExamGenerated={setActiveExam} />
        ) : (
            <ExamSession exam={activeExam} onExit={() => setActiveExam(null)} />
        )}
      </div>
    </div>
  );
};

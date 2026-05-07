
import React, { useState, useEffect } from 'react';
import { Type } from '@google/genai';
import { generateClinicalContent } from '../services/aiService';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BrainCircuitIcon, CheckCircleIcon, ArrowRightIcon, CloseIcon, SimulationIcon, LightBulbIcon } from '../components/IconComponents';
import { QuizQuestion, SpacedRepetitionItem } from '../types';
import { spacedRepetitionService } from '../services/spacedRepetitionService';

interface GeneratorInput {
  fachbereich: string;
  topic: string;
  lernziel: string;
  difficulty: string;
}

const QuizGenerator: React.FC<{ onQuizGenerated: (questions: QuizQuestion[]) => void }> = ({ onQuizGenerated }) => {
  const [input, setInput] = useState<GeneratorInput>({
    fachbereich: 'Physiotherapie',
    topic: '',
    lernziel: '',
    difficulty: 'mittel'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!input.topic.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      const prompt = `Generiere 3 Multiple-Choice-Fragen zum Thema "${input.topic}" im Bereich "${input.fachbereich}" (${input.difficulty}). 
      Fokussiere auf: ${input.lernziel || 'Allgemeines Wissen'}.
      Jede Frage muss 4 Optionen haben, genau eine korrekte Antwort und eine fachliche Begründung.`;

      const response = await generateClinicalContent(prompt, 'gemini-2.0-flash', {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      const newQuestions: QuizQuestion[] = data.map((q: any, i: number) => ({
        id: `GEN_${Date.now()}_${i}`,
        type: 'multiple_choice',
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        topic: input.topic
      }));

      spacedRepetitionService.addQuestionsToPool(newQuestions);
      onQuizGenerated(newQuestions);
    } catch (e) {
      console.error(e);
      setError("Fehler bei der Generierung. (Internal Error)");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-dark border-white/5 p-12 rounded-[48px] shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-brand-primary/10 transition-colors duration-700"></div>
      
      <div className="flex items-center gap-8 mb-12 relative z-10">
        <div className="bg-brand-primary/10 p-5 rounded-3xl border border-brand-primary/20">
           <BrainCircuitIcon className="w-10 h-10 text-brand-primary" />
        </div>
        <div>
          <h3 className="text-3xl font-bold font-serif text-white tracking-tight">KI-Fragen-Generator</h3>
          <p className="text-sm text-zinc-500 font-light tracking-wide uppercase tracking-[0.2em] mt-2">Adaptive Wissens-Checks</p>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="space-y-3">
          <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-2">Thema oder Fallbeispiel</label>
          <input 
              type="text" 
              value={input.topic}
              onChange={(e) => setInput({...input, topic: e.target.value})}
              placeholder="z.B. LWS-Stabilität, VKB-Reha..."
              className="w-full p-6 bg-black border border-white/5 rounded-3xl text-white placeholder:text-zinc-900 focus:border-brand-primary/50 transition-all outline-none"
          />
        </div>
        {error && <p className="text-red-500 text-xs font-light tracking-wide bg-red-500/5 p-4 rounded-2xl border border-red-500/10">{error}</p>}
        <Button onClick={handleGenerate} disabled={isLoading || !input.topic} variant="primary" className="w-full py-8 text-[10px] uppercase tracking-[0.4em] font-black shadow-2xl shadow-brand-primary/20">
          {isLoading ? 'Generiere...' : 'Fragen generieren'}
        </Button>
      </div>
    </Card>
  );
};

export const QuizPage: React.FC = () => {
  const [mode, setMode] = useState<'menu' | 'active'>('menu');
  const [questions, setQuestions] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, due: 0 });

  useEffect(() => { setStats(spacedRepetitionService.getStats()); }, [mode]);

  if (mode === 'active') {
    return (
        <div className="animate-fadeInUp bg-black min-h-screen pt-40 pb-32 relative overflow-hidden font-sans">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none">
               <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
               <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
            </div>

            <div className="container mx-auto px-8 relative z-10 max-w-4xl">
                <div className="flex justify-between items-center mb-16">
                    <Button onClick={() => setMode('menu')} variant="outline" className="text-[10px] uppercase tracking-widest font-black py-4 px-8 border-white/10 text-zinc-400 hover:text-white hover:bg-white/5">Abbrechen</Button>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">Session Aktiv</span>
                    </div>
                </div>
                
                <Card className="glass-dark border-white/5 p-24 rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] text-center">
                    <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-12 border border-brand-primary/20">
                        <SimulationIcon className="w-10 h-10 text-brand-primary animate-pulse" />
                    </div>
                    <h2 className="text-5xl font-bold font-serif text-white mb-6 tracking-tight leading-tight">Quiz läuft...</h2>
                    <p className="text-zinc-500 text-xl font-light tracking-wide leading-relaxed max-w-2xl mx-auto mb-16">
                        Die Fragen werden basierend auf Ihrem Wissensstand und der Spaced-Repetition-Logik geladen.
                    </p>
                    <Button onClick={() => setMode('menu')} variant="primary" className="py-8 px-16 text-[10px] uppercase tracking-[0.4em] font-black shadow-2xl shadow-brand-primary/20">
                        Session beenden
                    </Button>
                </Card>
            </div>
        </div>
    );
  }

  return (
    <div className="animate-fadeInUp bg-black min-h-screen pt-40 pb-32 relative overflow-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px] opacity-20"></div>
         <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <Section 
        title="Wissens-Check Pro" 
        subtitle="KI-gestütztes Lernen mit Spaced Repetition. Optimieren Sie Ihren Langzeit-Lernerfolg durch adaptive Algorithmen."
        containerClassName="py-0 relative z-10 mb-24"
      />

      <div className="container mx-auto px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12">
          <QuizGenerator onQuizGenerated={(qs) => { setQuestions(qs); setMode('active'); }} />
          
          <Card className="glass-dark border-white/5 p-12 rounded-[48px] shadow-2xl relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div>
                <h3 className="text-3xl font-bold font-serif text-white mb-12 tracking-tight">Speicher-Status</h3>
                <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 bg-white/[0.02] rounded-[32px] border border-white/5 hover:border-brand-primary/20 transition-all">
                        <span className="block text-5xl font-bold text-white tracking-tighter mb-2">{stats.total}</span>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600">Fragen gesamt</span>
                    </div>
                    <div className="p-8 bg-brand-primary/5 rounded-[32px] border border-brand-primary/20 hover:bg-brand-primary/10 transition-all">
                        <span className="block text-5xl font-bold text-brand-primary tracking-tighter mb-2">{stats.due}</span>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-primary/60">Fällig heute</span>
                    </div>
                </div>
            </div>

            <div className="mt-12 pt-12 border-t border-white/5">
                <Button onClick={() => setMode('active')} variant="outline" className="w-full py-6 text-[10px] uppercase tracking-widest font-black border-white/10 text-zinc-400 hover:text-white hover:bg-white/5">
                    Spaced Repetition starten
                </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

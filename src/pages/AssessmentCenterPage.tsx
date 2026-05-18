import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  AcademicCapIcon, QuizIcon, SimulationIcon, 
  CheckCircleIcon, ArrowRightIcon, BrainCircuitIcon,
  ChartBarIcon, ClockIcon, TargetIcon
} from '../components/IconComponents';

export const AssessmentCenterPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'path'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const handleDemo = () => {
      setToastMessage("Demo Mode: Exam Assistant geladen. Hier simulieren Sie Prüfungssituationen.");
      setTimeout(() => setToastMessage(null), 4000);
    };
    window.addEventListener('demo-step-assessment', handleDemo);
    return () => window.removeEventListener('demo-step-assessment', handleDemo);
  }, []);

  const stats = [
    { label: 'Quiz Score', value: '84%', icon: QuizIcon, color: 'text-blue-400' },
    { label: 'Exam Readiness', value: 'High', icon: AcademicCapIcon, color: 'text-green-400' },
    { label: 'Clinical Logic', value: '72%', icon: BrainCircuitIcon, color: 'text-purple-400' },
  ];

  const recommendations = [
    { 
      title: 'Vertiefung: Biomechanik der HWS', 
      reason: 'Basierend auf Fehlern im letzten Quiz (Frage 4, 7).',
      action: 'Quiz starten',
      route: '/quiz?topic=hws-biomechanik'
    },
    { 
      title: 'Simulation: Akuter Bandscheibenvorfall', 
      reason: 'Kompetenzlücke bei Red-Flag-Erkennung identifiziert.',
      action: 'Fall starten',
      route: '/case-training?scenario=disc-prolapse'
    },
    { 
      title: 'Prüfungs-Check: Anatomie Untere Extremität', 
      reason: 'Nächste Prüfung in 12 Tagen. Fokus auf Palpation.',
      action: 'Simulation starten',
      route: '/exam-simulation?topic=anatomy-lower'
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-fadeInUp">
          <div className="bg-[#C9A84C]/20 border border-[#C9A84C]/50 text-[#C9A84C] backdrop-blur-xl px-6 py-3 rounded-full text-sm font-medium shadow-[0_0_20px_rgba(201,168,76,0.3)]">
            {toastMessage}
          </div>
        </div>
      )}
      <div className="relative z-10">
        <Section 
          title="Assessment Center" 
          subtitle="Zentraler Hub für Prüfungen, Quizzes und KI-gestützte Lernpfad-Optimierung."
        />

        <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((s, i) => (
            <Card key={i} className="flex items-center gap-6 p-6">
              <div className={`p-4 rounded-2xl bg-white/5 ${s.color}`}>
                <s.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">{s.label}</p>
                <p className="text-3xl font-serif font-bold">{s.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Navigation */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveView('overview')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeView === 'overview' ? 'bg-brand-primary text-brand-secondary' : 'bg-white/5 text-white/60 hover:text-white'}`}
          >
            Übersicht
          </button>
          <button 
            onClick={() => setActiveView('path')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeView === 'path' ? 'bg-brand-primary text-brand-secondary' : 'bg-white/5 text-white/60 hover:text-white'}`}
          >
            KI-Lernpfad (CoT)
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeView === 'overview' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Quiz Engine */}
              <Card className="p-8 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Quiz Engine</h3>
                    <p className="text-sm text-white/60">Adaptives Lernen mit Spaced Repetition.</p>
                  </div>
                  <QuizIcon className="w-10 h-10 text-blue-500 opacity-50" />
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-xs">
                    <span>Fortschritt: Anatomie</span>
                    <span className="text-brand-primary">65%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary w-[65%]" />
                  </div>
                </div>
                <Button to="/quiz" variant="primary" className="w-full">
                  Quiz starten
                </Button>
              </Card>

              {/* Exam Simulation */}
              <Card className="p-8 border-l-4 border-l-purple-500">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Exam Simulation</h3>
                    <p className="text-sm text-white/60">KI-gestützte Bewertung von Freitext-Antworten.</p>
                  </div>
                  <SimulationIcon className="w-10 h-10 text-purple-500 opacity-50" />
                </div>
                <div className="flex gap-4 mb-8">
                  <div className="flex-1 p-4 rounded-xl bg-white/5 text-center">
                    <p className="text-[10px] text-white/40 uppercase mb-1">Letzte Prüfung</p>
                    <p className="text-xl font-bold">1.8</p>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-white/5 text-center">
                    <p className="text-[10px] text-white/40 uppercase mb-1">Versuche</p>
                    <p className="text-xl font-bold">12</p>
                  </div>
                </div>
                <Button to="/exam-simulation" variant="outline" className="w-full">
                  Simulation starten
                </Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              key="path"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <BrainCircuitIcon className="w-6 h-6 text-brand-primary" />
                  <h3 className="text-lg font-bold">KI-Analyse: Dein Lernstatus</h3>
                </div>
                <p className="text-sm text-white/80 leading-relaxed italic">
                  "Deine Analyse zeigt eine starke theoretische Basis in der Anatomie, aber Unsicherheiten bei der praktischen Anwendung von Red Flags in der Anamnese. Ich empfehle, den Fokus auf klinische Fallbeispiele zu legen, um die Transferleistung zu steigern."
                </p>
              </div>

              <h4 className="text-xs uppercase tracking-[0.3em] font-black text-white/40 mb-4">Empfohlene nächste Schritte</h4>
              <div className="grid gap-4">
                {recommendations.map((r, i) => (
                  <Card key={i} className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-brand-primary/30 transition-all">
                    <div className="flex-1">
                      <h5 className="text-lg font-bold mb-1">{r.title}</h5>
                      <p className="text-xs text-white/40">{r.reason}</p>
                    </div>
                    <Button to={r.route} variant="outline" className="text-xs whitespace-nowrap">
                      {r.action} <ArrowRightIcon className="w-3 h-3 ml-2" />
                    </Button>
                  </Card>
                ))}
              </div>

              {/* Chain of Thought Visualization */}
              <div className="mt-12 p-8 rounded-3xl bg-black/40 border border-white/5 relative">
                <div className="absolute top-4 right-4 flex gap-2">
                   <Button onClick={() => alert('PDF wird generiert...')} variant="outline" className="text-[10px] py-1 px-3 border-white/20">Als Arbeitsblatt (PDF)</Button>
                   <Button onClick={() => alert('An Moodle gesendet!')} variant="primary" className="text-[10px] py-1 px-3 bg-brand-primary text-black">Nach Moodle exportieren</Button>
                </div>
                <h4 className="text-sm font-bold mb-2 flex items-center gap-2 text-brand-primary">
                  <TargetIcon className="w-4 h-4" />
                  Transparenz-Modus für Prüfer: Chain-of-Thought (CoT)
                </h4>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-6">KI-Denkschritte & Kompetenz-Mapping</p>
                <div className="space-y-4">
                  {[
                    { step: 'Daten-Aggregation', status: 'completed', desc: 'Analyse von 150 Quiz-Antworten und 3 Simulationen.' },
                    { step: 'Mustererkennung', status: 'completed', desc: 'Identifikation von Fehlern bei neurologischen Tests.' },
                    { step: 'Didaktische Gewichtung', status: 'completed', desc: 'Abgleich mit dem Curriculum (Modul 4: Neurologie).' },
                    { step: 'Pfad-Generierung', status: 'active', desc: 'Erstellung personalisierter Übungsszenarien.' },
                  ].map((s, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${s.status === 'completed' ? 'bg-brand-primary text-brand-secondary' : 'bg-white/10 text-white/40'}`}>
                        {s.status === 'completed' ? <CheckCircleIcon className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${s.status === 'completed' ? 'text-white' : 'text-white/40'}`}>{s.step}</p>
                        <p className="text-[10px] text-white/40">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
};

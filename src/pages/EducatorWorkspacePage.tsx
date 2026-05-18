import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  AnalyticsIcon, BrainIcon, LabIcon, 
  SearchIcon, BrainCircuitIcon, CheckCircleIcon,
  ArrowRightIcon, FilterIcon, WarningIcon,
  CreativeIcon, DocumentTextIcon, SparklesIcon
} from '../components/IconComponents';
import { CreativeLab } from '../components/CreativeLab';
import { generateClinicalContent } from '../services/aiService';

type TabType = 'cases' | 'analytics' | 'config' | 'lab' | 'database';

interface StudentCase {
  id: string;
  name: string;
  topic: string;
  status: 'vollständig' | 'red-flag' | 'in-bearbeitung';
  score: string;
  badge?: string;
  reasoningSteps: { step: string; content: string }[];
}

const mockCases: StudentCase[] = [
  {
    id: '1',
    name: 'Anna Berger',
    topic: 'Schulter-Impingement',
    status: 'vollständig',
    score: '87%',
    reasoningSteps: [
      { step: 'Assessment-Check', content: 'Neer-Test und Hawkins-Kennedy korrekt appliziert.' },
      { step: 'Hypothesenbildung', content: 'Differentialdiagnostik Rotatorenmanschettenruptur ausgeschlossen.' },
      { step: 'Feedback', content: 'Sauberes Clinical Reasoning. Keine Lücken erkennbar.' }
    ]
  },
  {
    id: '2',
    name: 'Tom Fischer',
    topic: 'LWS-Syndrom',
    status: 'red-flag',
    score: '62%',
    badge: '⚠️ Red Flag: Neurologische Symptome nicht dokumentiert',
    reasoningSteps: [
      { step: 'NLU-Extraktion', content: 'Patient beschreibt Ausstrahlung bis ins Bein.' },
      { step: 'Wissens-Abgleich', content: 'Laut S3-Leitlinie zwingend Indikation für neurologisches Screening.' },
      { step: 'Kritik-Evaluierung', content: 'Prüfung von Sensibilität, Motorik und Reflexen fehlt komplett!' }
    ]
  },
  {
    id: '3',
    name: 'Sarah Klein',
    topic: 'Knie-Gonarthrose',
    status: 'in-bearbeitung',
    score: '–',
    reasoningSteps: [
      { step: 'Status', content: 'Patient befindet sich aktuell in der Anamnese-Phase.' },
      { step: 'Bisherige Daten', content: 'Gelenksteifigkeit am Morgen dokumentiert.' }
    ]
  }
];

export const EducatorWorkspacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('cases');
  const [showCoT, setShowCoT] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleDemo = () => {
      setToastMessage("Demo: Zugriff auf Live-Fälle und Analytics gewährt.");
      setTimeout(() => setToastMessage(null), 4000);
    };
    window.addEventListener('demo-step-educator', handleDemo);
    return () => window.removeEventListener('demo-step-educator', handleDemo);
  }, []);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRedFlag, setSelectedRedFlag] = useState<StudentCase | null>(null);
  const [isGeneratingRubric, setIsGeneratingRubric] = useState(false);
  const [rubricResult, setRubricResult] = useState<string | null>(null);

  const handleBatchAnalyze = async () => {
    setIsAnalyzing(true);
    setToastMessage(null);
    try {
      const prompt = `Analysiere folgende studentische Fälle und erstelle eine einzeilige NLP-Summary (max 15 Wörter) für den Dozenten, welche Lücken auffällig sind:
      ${JSON.stringify(mockCases)}`;
      
      const response = await generateClinicalContent(prompt, 'gemini-2.5-flash');
      setToastMessage(response.text || "Analyse abgeschlossen.");
    } catch (e) {
      setToastMessage("Analyse fehlgeschlagen.");
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const handleMoodleExport = () => {
    setToastMessage("Export erfolgreich! KF_Report_2026-05-08.zip wurde an Moodle übertragen.");
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleGenerateRubric = async () => {
    setIsGeneratingRubric(true);
    setRubricResult(null);
    try {
      const prompt = `Du bist ein Physiotherapie-Prüfer. Erstelle eine OSCE-Rubric (Objektive Structured Clinical Examination) für die nächste Prüfung zum Thema "LWS Syndrom". 
      Achte besonders auf die Lücke "Neurologisches Screening", da die Dashboard-Analytics zeigen, dass Semesterübergreifend dort Fehler gemacht werden.
      Erstelle das als Markdown Tabelle mit Punkten (0-3) für Anamnese, Basisuntersuchung und Red-Flags-Screening.`;
      
      const res = await generateClinicalContent(prompt, 'gemini-2.5-pro');
      setRubricResult(res.text || "### OSCE Rubric - LWS Syndrom\n(Fehler bei der Generierung)");
    } catch (e) {
      setRubricResult("### OSCE Rubric\nEin Fehler ist aufgetreten.");
    } finally {
      setIsGeneratingRubric(false);
    }
  };

  const mockQueries = [
    { query: 'Was sind die Red Flags bei LWS?', count: 142, trend: '+12%', status: 'critical' },
    { query: 'Differenzialdiagnose VKB vs Meniskus', count: 89, trend: '+5%', status: 'normal' },
    { query: 'Biomechanik der Schulter Abduktion', count: 67, trend: '-2%', status: 'normal' },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white pt-32 pb-20 relative">
      {/* Success/Info Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[200] bg-brand-primary/90 text-black px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(212,175,55,0.3)] flex items-center gap-3 backdrop-blur-md"
          >
            <CheckCircleIcon className="w-6 h-6" />
            <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Section 
        title="Educator Workspace" 
        subtitle="Zentrale Steuerung für Analytik, KI-Konfiguration und Content-Erstellung."
      />

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {(['cases', 'analytics', 'config', 'lab', 'database'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === t 
                  ? 'bg-brand-primary text-brand-secondary shadow-glow' 
                  : 'bg-white/5 text-white/40 hover:text-white border border-white/10'
              }`}
            >
              {t === 'cases' ? 'Live-Fälle' : t === 'analytics' ? 'Query Analytics' : t === 'config' ? 'Chatbot Config' : t === 'database' ? 'Datenbank & Upload' : 'Creative Lab'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'cases' && (
            <motion.div 
              key="cases"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-3xl gap-4">
                <div>
                  <h3 className="text-xl font-bold font-serif text-white tracking-tight">Klinische Fall-Überwachung</h3>
                  <p className="text-zinc-500 text-sm">Prüfen Sie aktuelle Befundungen in Echtzeit.</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">🧠 Transparenz-Modus für Prüfer: Chain-of-Thought (CoT)</span>
                    <button 
                      onClick={() => setShowCoT(!showCoT)}
                      className={`w-14 items-center bg-white/10 rounded-full cursor-pointer overflow-hidden p-1 flex transition-colors ${showCoT ? 'bg-brand-primary' : ''}`}
                    >
                       <motion.div layout className="w-6 h-6 bg-white rounded-full shadow" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleBatchAnalyze}
                      disabled={isAnalyzing}
                      variant="outline" className="text-[10px] py-2 px-4 uppercase tracking-[0.2em] flex justify-center items-center gap-2 border-white/20"
                    >
                      {isAnalyzing ? <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : '📋'} 
                      {isAnalyzing ? 'KI analysiert klinisches Bild...' : 'Alle Fälle auswerten'}
                    </Button>
                    <Button 
                      onClick={handleMoodleExport}
                      className="text-[10px] py-2 px-4 uppercase tracking-[0.2em] flex justify-center items-center gap-2 bg-brand-primary text-black hover:bg-brand-primary-light"
                    >
                      📤 Nach Moodle exportieren
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCases.map((studentCase) => (
                  <Card key={studentCase.id} className="p-8 relative overflow-hidden group">
                    <div className="mb-6 flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{studentCase.name}</h4>
                        <p className="text-brand-primary text-sm font-medium">{studentCase.topic}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <DocumentTextIcon className="w-5 h-5 text-zinc-400" />
                      </div>
                    </div>

                    <div className="mb-6">
                      {studentCase.status === 'red-flag' && (
                        <button 
                          onClick={() => setSelectedRedFlag(studentCase)}
                          className="inline-flex items-center gap-2 bg-red-500/20 text-red-500 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/30 hover:bg-red-500/30 transition-colors cursor-pointer text-left focus:outline-none"
                        >
                          {studentCase.badge}
                        </button>
                      )}
                      {studentCase.status === 'vollständig' && (
                        <span className="inline-flex items-center gap-2 bg-brand-success/20 text-brand-success px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-success/30">
                          <CheckCircleIcon className="w-4 h-4" /> Vollständig
                        </span>
                      )}
                      {studentCase.status === 'in-bearbeitung' && (
                        <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-500 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/30">
                          <div className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div> In Bearbeitung
                        </span>
                      )}

                      <div className="mt-4 text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                        Score: <span className="text-white text-sm ml-1">{studentCase.score}</span>
                      </div>
                    </div>

                    {/* Step 2: CoT Integration */}
                    <AnimatePresence>
                      {showCoT && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 border-t border-white/10 pt-6 space-y-4"
                        >
                          <h5 className="text-[10px] font-black uppercase text-brand-primary tracking-widest flex items-center gap-2">
                            <BrainCircuitIcon className="w-4 h-4" /> Warum bewertet die KI das so?
                          </h5>
                          {studentCase.reasoningSteps.map((step, idx) => (
                            <div key={idx} className="bg-black/40 rounded-xl p-4 border border-white/5">
                              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1 font-black">{step.step}</span>
                              <p className="text-xs text-zinc-300">{step.content}</p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button variant="outline" className="w-full mt-6 flex justify-between items-center group-hover:bg-white/5 transition-colors">
                      <span className="text-[10px] uppercase font-black tracking-widest">Fallakte öffnen</span>
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                 <div>
                    <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Performanz & Schwachstellen</h2>
                    <p className="text-zinc-500 text-sm">Übersicht der Learning Analytics und Erstellung von Prüfungsrastern.</p>
                 </div>
                 <Button 
                    onClick={handleGenerateRubric} 
                    disabled={isGeneratingRubric}
                    variant="primary" 
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest py-3"
                 >
                    {isGeneratingRubric ? <span className="animate-pulse">Generiere Rubric...</span> : <><SparklesIcon className="w-4 h-4" /> OSCE-Rubric generieren</>}
                 </Button>
              </div>

              {rubricResult && (
                  <Card className="p-8 border-brand-primary bg-brand-primary/5 animate-fadeInUp">
                      <div className="flex justify-between items-start mb-6 border-b border-brand-primary/20 pb-4">
                          <h3 className="text-xl font-bold font-serif text-brand-primary flex items-center gap-3">
                              <DocumentTextIcon className="w-6 h-6" /> Generierte OSCE-Rubric (Prüfungsraster)
                          </h3>
                          <Button variant="outline" className="text-[10px] p-2 px-4 border-brand-primary/20 hover:bg-brand-primary/10">Drucken</Button>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                          {rubricResult.split('\n').map((line, i) => {
                             if (line.startsWith('###')) return <h4 key={i} className="text-white text-lg font-bold mt-4 mb-2">{line.replace('### ', '')}</h4>;
                             return <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C9A84C]">$1</strong>') }} />;
                          })}
                      </div>
                  </Card>
              )}

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-8 border-l-4 border-l-brand-primary">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Total Queries</h4>
                  <p className="text-4xl font-serif font-bold">12.4k</p>
                  <p className="text-[10px] text-brand-success mt-2 font-bold">+18% vs. Vorwoche</p>
                </Card>
                <Card className="p-8 border-l-4 border-l-red-500">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Kritische Lücken</h4>
                  <p className="text-4xl font-serif font-bold">3</p>
                  <p className="text-[10px] text-red-400 mt-2 font-bold">Handlungsbedarf in Anatomie II</p>
                </Card>
                <Card className="p-8 border-l-4 border-l-blue-500">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">KI-Genauigkeit</h4>
                  <p className="text-4xl font-serif font-bold">98.2%</p>
                  <p className="text-[10px] text-blue-400 mt-2 font-bold">Basierend auf 500 Manual-Checks</p>
                </Card>
              </div>

              <Card className="p-10">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-4">
                  <SearchIcon className="w-6 h-6 text-brand-primary" />
                  Häufigste Studierenden-Anfragen
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40">
                        <th className="py-4">Query</th>
                        <th className="py-4">Anzahl</th>
                        <th className="py-4">Trend</th>
                        <th className="py-4">Status</th>
                        <th className="py-4">Aktion</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {mockQueries.map((q, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 font-medium">{q.query}</td>
                          <td className="py-4">{q.count}</td>
                          <td className={`py-4 ${q.trend.startsWith('+') ? 'text-brand-success' : 'text-red-400'}`}>{q.trend}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${q.status === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-brand-success/20 text-brand-success'}`}>
                              {q.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <Button variant="outline" className="px-4 py-1 text-[10px]">Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'config' && (
            <motion.div 
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <Card className="p-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-4">
                  <BrainIcon className="w-6 h-6 text-brand-primary" />
                  LUMI Konfiguration
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3 font-bold">Reasoning-Tiefe</label>
                    <input type="range" className="w-full accent-brand-primary" />
                    <div className="flex justify-between text-[10px] text-white/20 mt-2 uppercase font-black">
                      <span>Sokratisch</span>
                      <span>Direkt</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3 font-bold">MDR-Modus (Compliance)</label>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="w-12 h-6 bg-brand-primary rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-brand-secondary rounded-full" />
                      </div>
                      <span className="text-sm font-bold">Aktiviert (Keine Therapie-Empfehlungen)</span>
                    </div>
                  </div>
                  <Button variant="primary" className="w-full py-4">Einstellungen speichern</Button>
                </div>
              </Card>

              <Card className="p-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-4">
                  <FilterIcon className="w-6 h-6 text-brand-primary" />
                  Wissens-Quellen (RAG)
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'AWMF S3 Leitlinie LWS', status: 'indexed' },
                    { name: 'Cochrane Review: Manual Therapy', status: 'indexed' },
                    { name: 'Internes Curriculum 2024', status: 'updating' },
                  ].map((source, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-sm font-medium">{source.name}</span>
                      <span className={`text-[10px] font-bold uppercase ${source.status === 'indexed' ? 'text-brand-success' : 'text-brand-primary animate-pulse'}`}>
                        {source.status}
                      </span>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full py-4 border-dashed border-white/20">
                    + Neue Quelle hinzufügen (PDF/URL)
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'database' && (
            <motion.div 
              key="database"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                 <div>
                    <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Curriculum & Datenbank</h2>
                    <p className="text-zinc-500 text-sm">Zentrale Ablage für Curricula, Studien und Lehrmaterial.</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-10">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-4">
                    <DocumentTextIcon className="w-6 h-6 text-brand-primary" />
                    Curriculum Upload (RAG)
                  </h3>
                  <div className="border-2 border-dashed border-white/20 rounded-[32px] p-12 text-center hover:border-brand-primary/50 transition-colors cursor-pointer bg-white/[0.02]">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ArrowRightIcon className="w-6 h-6 text-brand-primary -rotate-90" />
                    </div>
                    <p className="text-white font-bold mb-2">PDF oder Lehrplan hier ablegen</p>
                    <p className="text-zinc-500 text-xs mb-6">Macht Inhalte für den Chatbot (LUMI) und die Analyseeinheiten verfügbar.</p>
                    <Button variant="outline" className="text-[10px] uppercase font-black tracking-widest px-8">Datei auswählen</Button>
                  </div>
                </Card>

                <Card className="p-10">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-4">
                    <BrainCircuitIcon className="w-6 h-6 text-brand-primary" />
                    Datenbank-Status
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: 'S3-Leitlinie LWS (2024)', size: '2.4 MB', date: 'Vor 2 Tagen', status: 'Verarbeitet' },
                      { name: 'Fallstudien_Physiotherapie_Q1.pdf', size: '15.1 MB', date: 'Vor 1 Woche', status: 'Verarbeitet' },
                      { name: 'Curriculum_Biomechanik_Neu.docx', size: '1.2 MB', date: 'Heute', status: 'Indexierung...' },
                    ].map((file, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div>
                          <p className="text-sm font-bold text-white mb-1">{file.name}</p>
                          <p className="text-[10px] text-zinc-500">{file.size} • {file.date}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${file.status.includes('Verarbeitet') ? 'text-brand-success' : 'text-brand-primary animate-pulse'}`}>
                          {file.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'lab' && (
            <motion.div 
              key="lab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-12 text-center max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-4">
                  <CreativeIcon className="w-8 h-8 text-brand-primary" />
                  Creative Lab
                </h3>
                <p className="text-white/60 text-sm">
                  Nutzen Sie generative KI, um anatomisch korrekte Schemata, Fallbeispiele und Lehrvideos in Sekunden zu erstellen.
                </p>
              </div>
              <CreativeLab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Red Flag Modal */}
      <AnimatePresence>
        {selectedRedFlag && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRedFlag(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-[#121212] border border-red-500/30 rounded-3xl p-8 shadow-[0_20px_60px_rgba(239,68,68,0.15)]"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-red-500 flex items-center gap-3">
                   <WarningIcon className="w-6 h-6" /> KI-Erklärung: Red Flag
                </h3>
                <button onClick={() => setSelectedRedFlag(null)} className="text-white/40 hover:text-white p-2">✕</button>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                Der Student hat bei der Anamnese von {selectedRedFlag.name} einen kritischen Schritt übersehen.
              </p>
              <div className="space-y-4">
                {selectedRedFlag.reasoningSteps.map((step, idx) => (
                  <div key={idx} className="bg-black/50 rounded-xl p-4 border border-white/5">
                     <span className="text-[10px] text-red-400 uppercase tracking-wider block mb-1 font-black">{step.step}</span>
                     <p className="text-xs text-zinc-300">{step.content}</p>
                  </div>
                ))}
              </div>
              <Button onClick={() => setSelectedRedFlag(null)} variant="outline" className="w-full mt-8 border-red-500/30 hover:bg-red-500/10 text-red-500 hover:text-white">Schließen</Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

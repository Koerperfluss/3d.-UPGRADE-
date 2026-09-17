import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { FundingNode, FundingLink } from '../types';
import { generateText } from '../services/geminiService';
import { 
  RocketLaunchIcon, 
  SparklesIcon, 
  ChevronRightIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ChartBarIcon,
  CalendarIcon,
  XMarkIcon
} from './Icons';

interface InteractiveAdvisorProps {
  nodes: FundingNode[];
  links: FundingLink[];
}

type AdvisorStep = 'welcome' | 'analysis' | 'suggestion' | 'guidance';
type SuggestedProgram = { name: string; rationale: string };

const StepIndicator: React.FC<{ currentStep: AdvisorStep }> = ({ currentStep }) => {
    const steps = [
        { id: 'analysis', label: 'Evaluation' },
        { id: 'suggestion', label: 'Empfehlung' },
        { id: 'guidance', label: 'Aktionsplan' },
    ];
    const currentIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-500 ${index <= currentIndex ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-white/5 text-white/20 border border-white/10'}`}>
                            {index + 1}
                        </div>
                        <span className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-500 hidden sm:block ${index <= currentIndex ? 'text-white' : 'text-white/20'}`}>
                            {step.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`w-8 h-px transition-colors duration-500 ${index < currentIndex ? 'bg-brand-primary' : 'bg-white/10'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const InteractiveAdvisor: React.FC<InteractiveAdvisorProps> = ({ nodes, links }) => {
    const [step, setStep] = useState<AdvisorStep>('welcome');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [suggestions, setSuggestions] = useState<SuggestedProgram[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
    const [guidance, setGuidance] = useState('');

    const handleStartAnalysis = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setAnalysis('');
        setSuggestions([]);

        const simplifiedLinks = links.map(link => ({
            source: typeof link.source === 'object' ? link.source.id : link.source,
            target: typeof link.target === 'object' ? link.target.id : link.target,
            type: link.type,
        }));

        const prompt = `
            ROLE: Du bist Loki, ein hochkritischer, analytischer Förder-Stratege für High-Tech-Startups in Österreich. Dein Fokus liegt auf harter Realität, Risikominimierung und maximaler Hebelwirkung.
            CONTEXT: Analysiere das Startup "Projekt Körperfluss" basierend auf den folgenden Daten.
            NODES: ${JSON.stringify(nodes, null, 2)}
            LINKS: ${JSON.stringify(simplifiedLinks, null, 2)}
            TASK: 
            1. Führe eine schonungslose Bewertung der Förderreife durch. Identifiziere Blocker sofort.
            2. Nenne die TOP 3 logischsten nächsten Förderprogramme mit höchster Erfolgswahrscheinlichkeit.
            OUTPUT FORMAT:
            Zwei klar getrennte Abschnitte.
            
            ### ABSCHNITT 1: EVALUATION ###
            Markdown-Format:
            - **Harte Fakten (Stärken):** (Kurz, präzise)
            - **Kritische Blocker (Risiken):** (Fokus auf fehlende Voraussetzungen, z.B. FlexCo-Gründung)
            - **Förderreife-Score (1-10):** (Mit 1-Satz-Begründung)

            ### ABSCHNITT 2: EMPFEHLUNG ###
            Valides JSON-Array. Schlüssel: "name", "rationale" (Warum genau dieses Programm jetzt? Was ist der nächste konkrete Schritt?).
            Beispiel: [{"name": "AWS PreSeed", "rationale": "Fokus auf Deep-Tech. Nächster Schritt: FlexCo gründen."}]
            NUR JSON, kein Text davor oder danach.
        `;

        try {
            const result = await generateText(prompt);
            const evaluationPart = result.split('### ABSCHNITT 2: EMPFEHLUNG ###')[0].replace('### ABSCHNITT 1: EVALUATION ###', '').trim();
            const suggestionPart = result.split('### ABSCHNITT 2: EMPFEHLUNG ###')[1]?.trim() || '[]';
            
            setAnalysis(evaluationPart);
            
            const jsonMatch = suggestionPart.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                setSuggestions(JSON.parse(jsonMatch[0]));
            } else {
                setSuggestions([]);
            }
            setStep('suggestion');
        } catch (err) {
            console.error(err);
            setError('Die Analyse konnte nicht durchgeführt werden. Bitte versuchen Sie es erneut.');
        } finally {
            setIsLoading(false);
        }
    }, [nodes, links]);

    const handleSelectProgram = useCallback(async (programName: string) => {
        setSelectedProgram(programName);
        setIsLoading(true);
        setError('');
        setGuidance('');
        setStep('guidance');
        
        const prompt = `
            ROLE: Du bist Loki, ein pragmatischer, handlungsorientierter Förder-Stratege.
            CONTEXT: Das Startup "Projekt Körperfluss" möchte das Förderprogramm "${programName}" beantragen.
            NODES: ${JSON.stringify(nodes, null, 2)}
            TASK: Erstelle einen extrem konkreten, schrittweisen Aktionsplan (Roadmap) für die Beantragung.
            OUTPUT FORMAT:
            Markdown. Nutze Emojis für visuelle Struktur (ADHS-freundlich).
            Strukturiere die Antwort exakt so:
            
            🎯 **WHAT:** (Was ist das Ziel in 1-2 Sätzen?)
            
            💡 **WHY:** (Warum ist das wichtig für das Startup?)
            
            📊 **HOW:** (Erstelle eine Markdown-Tabelle mit den Spalten: Schritt, Aufgabe, Wer, Bis Wann, Status. Mindestens 3 konkrete Schritte.)
            
            🚀 **ERFOLGSCHANCE:** (Einschätzung in % und 1 Satz Begründung)
        `;
        
        try {
            const result = await generateText(prompt);
            setGuidance(result);
        } catch (err) {
            console.error(err);
            setError('Der Aktionsplan konnte nicht erstellt werden.');
        } finally {
            setIsLoading(false);
        }
    }, [nodes]);
    
    const handleReset = () => {
        setStep('welcome');
        setAnalysis('');
        setSuggestions([]);
        setSelectedProgram(null);
        setGuidance('');
        setError('');
    };

    return (
        <div className="flex flex-col h-full bg-black/40 backdrop-blur-3xl rounded-sm overflow-hidden border border-white/10 shadow-2xl">
            <header className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white">
                        <RocketLaunchIcon className="w-7 h-7 text-brand-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif italic text-white tracking-tight">Förder_Pilot</h3>
                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">AI Guided Strategy • Loki v2.5</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    {step !== 'welcome' && <StepIndicator currentStep={step} />}
                    {step !== 'welcome' && (
                        <button 
                            onClick={handleReset} 
                            className="p-2 hover:bg-white/10 rounded-sm transition-all text-white/20 hover:text-brand-primary"
                            title="Zurück zum Start"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center space-y-6"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 border border-white/5 border-t-brand-primary rounded-full animate-spin" />
                                <SparklesIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-primary animate-pulse" />
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-serif italic text-white tracking-tight">Loki analysiert...</p>
                                <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-1">
                                    {step === 'analysis' && 'Bewerte Förderreife...'}
                                    {step === 'suggestion' && 'Identifiziere Top-Programme...'}
                                    {step === 'guidance' && `Erstelle Roadmap für ${selectedProgram}...`}
                                </p>
                            </div>
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full flex flex-col items-center justify-center p-10 text-center"
                        >
                            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-sm flex items-center justify-center text-rose-500 mb-6">
                                <ExclamationTriangleIcon className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-serif italic text-white mb-2">Systemfehler</h4>
                            <p className="text-white/40 font-mono text-xs max-w-xs mb-8">{error}</p>
                            <button 
                                onClick={handleReset} 
                                className="px-8 py-3 bg-white/10 border border-white/10 text-white rounded-sm font-mono text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all"
                            >
                                Neu_starten
                            </button>
                        </motion.div>
                    ) : step === 'welcome' ? (
                        <motion.div 
                            key="welcome"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto"
                        >
                            <div className="w-20 h-20 bg-brand-primary/10 border border-brand-primary/20 rounded-sm flex items-center justify-center text-brand-primary mb-8">
                                <RocketLaunchIcon className="w-10 h-10" />
                            </div>
                            <h4 className="text-3xl font-serif italic text-white tracking-tight mb-4">Bereit für den nächsten Hebel?</h4>
                            <p className="text-white/40 font-mono text-sm leading-relaxed mb-10 uppercase tracking-wider">
                                Loki führt Sie durch eine schonungslose Analyse Ihres Projekts und erstellt einen präzisen Aktionsplan für die lukrativsten Förderprogramme.
                            </p>
                            <motion.button 
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { setStep('analysis'); handleStartAnalysis(); }} 
                                className="px-10 py-4 bg-brand-primary text-white font-mono text-[11px] uppercase tracking-widest rounded-sm shadow-xl shadow-brand-primary/20 flex items-center gap-3"
                            >
                                Analyse_starten
                                <ChevronRightIcon className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    ) : step === 'suggestion' ? (
                        <motion.div 
                            key="suggestion"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-10"
                        >
                            <section className="border border-white/10 bg-white/5 rounded-sm p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-sm flex items-center justify-center">
                                        <ChartBarIcon className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-xl font-serif italic text-white tracking-tight">Projektevaluierung</h4>
                                </div>
                                <div className="prose prose-invert max-w-none prose-p:text-white/60 prose-p:text-xs prose-p:font-mono prose-p:leading-relaxed prose-strong:text-brand-primary prose-strong:font-mono prose-strong:font-bold">
                                    <ReactMarkdown>{analysis}</ReactMarkdown>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-sky-500/10 text-sky-500 border border-sky-500/20 rounded-sm flex items-center justify-center">
                                        <LightBulbIcon className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-xl font-serif italic text-white tracking-tight">Top_Empfehlungen</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {suggestions.map((s, i) => (
                                        <motion.div 
                                            key={i}
                                            whileHover={{ y: -4 }}
                                            className="border border-white/10 bg-white/5 p-6 rounded-sm flex flex-col justify-between group hover:border-brand-primary/40 transition-all"
                                        >
                                            <div>
                                                <h5 className="text-sm font-serif italic text-white mb-3 group-hover:text-brand-primary transition-colors">{s.name}</h5>
                                                <p className="text-[10px] font-mono text-white/40 leading-relaxed mb-6 uppercase tracking-wider">{s.rationale}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleSelectProgram(s.name)} 
                                                className="w-full py-3 bg-white/10 text-white text-[9px] font-mono uppercase tracking-widest rounded-sm hover:bg-brand-primary transition-all"
                                            >
                                                Roadmap_erstellen
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="guidance"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-sm flex items-center justify-center">
                                    <CalendarIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-serif italic text-white tracking-tight">Aktionsplan</h4>
                                    <p className="text-brand-primary font-mono uppercase tracking-widest text-[10px]">{selectedProgram}</p>
                                </div>
                            </div>
                            
                            <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-sm p-8">
                                <div className="prose prose-invert max-w-none prose-p:text-white/60 prose-p:text-xs prose-p:font-mono prose-p:leading-relaxed prose-strong:text-emerald-500 prose-strong:font-mono prose-strong:font-bold prose-table:rounded-sm prose-table:overflow-hidden prose-th:bg-white/10 prose-th:text-white prose-th:p-3 prose-td:p-3 prose-td:border-b prose-td:border-white/5 prose-td:text-[10px] prose-td:font-mono">
                                    <ReactMarkdown>{guidance}</ReactMarkdown>
                                </div>
                            </div>

                            <div className="flex justify-center pt-4">
                                <button 
                                    onClick={handleReset}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white/40 rounded-sm font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                >
                                    <ArrowPathIcon className="w-4 h-4" />
                                    Reset_Analysis
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default InteractiveAdvisor;


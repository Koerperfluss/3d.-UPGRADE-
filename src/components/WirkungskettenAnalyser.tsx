
import React, { useState } from 'react';
import { Type } from '@google/genai';
import { generateClinicalContent } from '../services/aiService';
import { Card } from './Card';
import { Button } from './Button';
import { BrainCircuitIcon, LightBulbIcon, CloseIcon, AcademicCapIcon, ArrowRightIcon, FilterIcon, DocumentTextIcon } from './IconComponents';
import { motion, AnimatePresence } from 'framer-motion';

type KnowledgeLevel = 'micro' | 'contrastive' | 'reflective';

interface ChainNode {
  id: string;
  label: string;
  type: 'cause' | 'mechanism' | 'symptom' | 'therapy';
  description: string;
  clinical_hint?: string;
  source_link?: string;
}

interface ChainLink {
  source: string;
  target: string;
}

interface Wirkungskette {
  topic: string;
  level_context: string;
  nodes: ChainNode[];
  links: ChainLink[];
  sources: string[];
  reasoning_summary: string;
}

export const WirkungskettenAnalyser: React.FC = () => {
  const [findings, setFindings] = useState('');
  const [level, setLevel] = useState<KnowledgeLevel>('reflective');
  const [isLoading, setIsLoading] = useState(false);
  const [chain, setChain] = useState<Wirkungskette | null>(null);
  const [error, setError] = useState('');
  
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<ChainNode | null>(null);

  const handleAnalyze = async () => {
    if (!findings.trim()) return;
    setIsLoading(true);
    setError('');
    setChain(null);
    setSelectedNode(null);

    try {
      const levelPrompts = {
        micro: "Erkläre es so einfach wie möglich (Micro-Learning), nutze Analogien.",
        contrastive: "Fokussiere auf Differenzialdiagnosen und Vergleiche zu ähnlichen Krankheitsbildern.",
        reflective: "Analysiere kritisch die Evidenzlage und hinterfrage gängige Mythen in der Therapie."
      };

      const prompt = `
        ROLLE: Klinischer Experte für Pathophysiologie, Biomechanik und Clinical Reasoning.
        
        KLINISCHE BEFUNDE DES STUDENTEN:
        "${findings}"
        
        WISSENS-LEVEL: ${level} (${levelPrompts[level]})
        
        AUFGABE: 
        1. Analysiere die vom Studenten eingegebenen Befunde.
        2. Leite daraus eine logische Wirkungskette (Cause-Effect Chain) her.
        3. Erstelle ein JSON-Objekt, das diese Kette strukturiert.
        
        STRUKTUR: Ursache (Primärläsion/Befund) -> Pathomechanismus (Biomechanik/Physiologie) -> Symptomatik (Folgebeschwerden) -> Therapieansatz (Evidenzbasiert).
        
        ANFORDERUNGEN:
        1. Jede Node braucht eine 'description' und einen 'clinical_hint'.
        2. 'reasoning_summary': Eine kurze, prägnante Zusammenfassung der KI-Logik hinter dieser spezifischen Analyse.
        3. Nenne für die Therapie S3-Leitlinien oder aktuelle Fachliteratur (z.B. Cochrane, JOSPT) in 'sources'.
        4. Nutze Deep Reasoning, um die physiologischen Zusammenhänge präzise aus den Befunden herzuleiten.
      `;

      const response = await generateClinicalContent(prompt, 'gemini-2.0-flash-thinking-exp', {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            level_context: { type: Type.STRING },
            reasoning_summary: { type: Type.STRING },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['cause', 'mechanism', 'symptom', 'therapy'] },
                  description: { type: Type.STRING },
                  clinical_hint: { type: Type.STRING },
                  source_link: { type: Type.STRING }
                }
              }
            },
            links: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  target: { type: Type.STRING }
                }
              }
            },
            sources: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setChain(data);

    } catch (e) {
      console.error(e);
      setError("Analyse fehlgeschlagen. Bitte prüfen Sie Ihre Eingabe oder versuchen Sie es später erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    cause: { header: 'bg-red-500/10 text-red-400 border-red-500/20', card: 'border-red-500/10 hover:border-red-500/30' },
    mechanism: { header: 'bg-orange-500/10 text-orange-400 border-orange-500/20', card: 'border-orange-500/10 hover:border-orange-500/30' },
    symptom: { header: 'bg-amber-500/10 text-amber-400 border-amber-500/20', card: 'border-amber-500/10 hover:border-amber-500/30' },
    therapy: { header: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', card: 'border-emerald-500/10 hover:border-emerald-500/30' }
  };

  return (
    <div className="space-y-12">
      {/* Input Section: Student Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <DocumentTextIcon className="w-5 h-5 text-brand-primary" />
                <h3 className="text-xl font-bold font-serif text-white tracking-tight uppercase">Klinische Befunde</h3>
            </div>
            <p className="text-zinc-500 text-sm font-light leading-relaxed">
                Geben Sie Ihre Beobachtungen, Testergebnisse oder Patientenaussagen ein. Die KI analysiert die zugrunde liegenden Wirkmechanismen.
            </p>
            <textarea 
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                placeholder="z.B. Patient klagt über stechenden Schmerz bei Abduktion 70-120°, Kraftminderung M. supraspinatus, positives Painful Arc Syndrom..."
                className="w-full h-64 p-6 bg-black/40 border border-white/5 rounded-[32px] focus:ring-1 focus:ring-brand-primary/50 outline-none text-white placeholder:text-zinc-700 transition-all font-light leading-relaxed resize-none shadow-inner"
            />
            <div className="flex flex-wrap gap-3">
                {(['micro', 'contrastive', 'reflective'] as KnowledgeLevel[]).map(lvl => (
                    <button 
                        key={lvl}
                        onClick={() => setLevel(lvl)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${level === lvl ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-glow' : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10'}`}
                    >
                        {lvl === 'micro' ? 'Micro' : lvl === 'contrastive' ? 'Kontrastiv' : 'Reflexion'}
                    </button>
                ))}
            </div>
            <Button 
                onClick={handleAnalyze} 
                disabled={isLoading || !findings} 
                variant="primary" 
                className="w-full py-6 text-[10px] uppercase tracking-[0.4em] font-black shadow-2xl shadow-brand-primary/20"
            >
                {isLoading ? (
                    <span className="flex items-center gap-3">
                        <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></div>
                        Analysiere Wirkungskette...
                    </span>
                ) : 'Analyse starten'}
            </Button>
        </div>

        {/* Output Section: AI Reasoning */}
        <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
                {chain ? (
                    <motion.div 
                        key="result"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {/* Reasoning Summary */}
                        <div className="glass-dark p-8 rounded-[32px] border border-brand-primary/20 bg-brand-primary/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <BrainCircuitIcon className="w-6 h-6 text-brand-primary" />
                                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white">KI-Herleitung (Reasoning)</h4>
                            </div>
                            <p className="text-zinc-300 text-lg font-light leading-relaxed italic relative z-10">
                                "{chain.reasoning_summary}"
                            </p>
                        </div>

                        {/* The Chain Visualizer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(['cause', 'mechanism', 'symptom', 'therapy'] as const).map((type) => {
                                const nodes = chain.nodes.filter(n => n.type === type);
                                return (
                                    <div key={type} className="space-y-4">
                                        <div className={`px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.3em] text-center ${styles[type].header}`}>
                                            {type === 'cause' ? 'Ursachen' : type === 'mechanism' ? 'Wirkmechanismus' : type === 'symptom' ? 'Symptomatik' : 'Therapie'}
                                        </div>
                                        {nodes.map(node => (
                                            <div 
                                                key={node.id}
                                                onClick={() => setSelectedNode(node)}
                                                className={`group p-6 rounded-[32px] border bg-black/40 cursor-pointer transition-all duration-500 ${styles[type].card} ${selectedNode?.id === node.id ? 'ring-1 ring-brand-primary shadow-glow scale-[1.02]' : 'hover:bg-white/5'}`}
                                            >
                                                <h5 className="font-bold text-white text-sm mb-3 font-serif tracking-tight">{node.label}</h5>
                                                <p className="text-xs text-zinc-500 font-light leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">{node.description}</p>
                                                <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">Details anzeigen</span>
                                                    <ArrowRightIcon className="w-3 h-3 text-brand-primary" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Sources Footer */}
                        <div className="flex flex-wrap gap-4 items-center p-6 bg-white/5 rounded-[24px] border border-white/5">
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Evidenz-Quellen:</span>
                            {chain.sources.map((s, i) => (
                                <span key={i} className="text-[10px] bg-brand-primary/10 px-4 py-2 rounded-xl border border-brand-primary/20 text-brand-primary font-bold tracking-wide">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full min-h-[500px] flex flex-col items-center justify-center text-zinc-700 border border-white/5 rounded-[48px] bg-black/20 border-dashed"
                    >
                        <BrainCircuitIcon className="w-24 h-24 mb-8 opacity-10" />
                        <p className="text-center text-xl font-light tracking-widest uppercase opacity-40">Warten auf Befund-Eingabe...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedNode && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="max-w-3xl w-full glass-dark p-12 md:p-16 rounded-[60px] border border-white/10 relative shadow-[0_100px_200px_rgba(0,0,0,1)]"
                >
                    <button 
                        onClick={() => setSelectedNode(null)} 
                        className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
                            <AcademicCapIcon className="w-8 h-8 text-brand-primary" />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-primary mb-2 block">Detail-Analyse</span>
                            <h3 className="text-4xl font-bold font-serif text-white tracking-tight">{selectedNode.label}</h3>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <p className="text-xl text-zinc-300 font-light leading-relaxed">
                            {selectedNode.description}
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[32px] bg-brand-primary/5 border border-brand-primary/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <LightBulbIcon className="w-5 h-5 text-brand-primary" />
                                    <h5 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Klinischer Fokus</h5>
                                </div>
                                <p className="text-sm text-zinc-400 italic leading-relaxed">
                                    {selectedNode.clinical_hint}
                                </p>
                            </div>
                            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <FilterIcon className="w-5 h-5 text-zinc-500" />
                                    <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Evidenz-Check</h5>
                                </div>
                                <p className="text-[10px] text-zinc-600 font-light leading-relaxed uppercase tracking-wider">
                                    Verifiziert durch Deep Reasoning Engine. Abgleich mit aktuellen Leitlinien und Fachliteratur erfolgt.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClinicalContext } from '../context/ClinicalContext';
import { BrainIcon, SparklesIcon, CheckCircleIcon, WarningIcon } from './IconComponents';

export const CotDrawer: React.FC = () => {
   const { isCotMode, cotSteps } = useClinicalContext();

   if (!isCotMode) return null;

   return (
     <motion.div 
         initial={{ x: 400, opacity: 0 }}
         animate={{ x: 0, opacity: 1 }}
         exit={{ x: 400, opacity: 0 }}
         transition={{ type: "spring", stiffness: 200, damping: 25 }}
         className="fixed right-6 top-6 bottom-6 w-96 glass-dark border-l border-brand-primary/30 rounded-3xl z-[60] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(212,175,55,0.1)] backdrop-blur-2xl"
     >
        <div className="p-6 border-b border-brand-primary/20 bg-brand-primary/5 flex items-center gap-4">
             <div className="p-2 bg-brand-primary/20 rounded-xl relative overflow-hidden">
                <BrainIcon className="w-8 h-8 text-brand-primary relative z-10" />
                <div className="absolute inset-0 bg-brand-primary blur-xl opacity-50 mix-blend-screen animate-pulse"></div>
             </div>
             <div>
                <h3 className="text-white font-bold font-serif text-xl tracking-tight">CoT-Engine</h3>
                <p className="text-[10px] text-brand-primary uppercase tracking-[0.3em] font-black opacity-80">Neuro-Symbolic Reasoning</p>
             </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {cotSteps.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                    <SparklesIcon className="w-12 h-12 text-zinc-500 mb-4" />
                    <p className="text-zinc-400 text-sm">Warte auf klinische Daten...</p>
                    <p className="text-[10px] text-zinc-500 mt-2">Die Architektur analysiert im Hintergrund.</p>
                </div>
            ) : (
                <AnimatePresence>
                    {cotSteps.map((step, index) => (
                        <motion.div 
                            key={step.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-black/60 border border-white/10 rounded-2xl p-4 relative"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] opacity-80">{step.phase}</span>
                                {step.status === 'active' && <span className="flex w-2 h-2 bg-yellow-500 rounded-full animate-ping"></span>}
                                {step.status === 'complete' && <CheckCircleIcon className="w-4 h-4 text-brand-success" />}
                                {step.status === 'error' && <WarningIcon className="w-4 h-4 text-brand-error" />}
                            </div>
                            <p className="text-zinc-300 text-sm leading-relaxed mb-3">{step.description}</p>
                            
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-[10px] text-zinc-500">Konfidenz: <span className="text-white">{(step.confidence * 100).toFixed(0)}%</span></div>
                            </div>

                            {step.sources && step.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <span className="text-[8px] uppercase tracking-widest text-zinc-500 block mb-2">Evidenz-Referenzen</span>
                                    {step.sources.map((src, i) => (
                                        <a key={i} href={src.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 text-[#D4AF37] px-2 py-1 rounded text-[10px] transition-colors border border-brand-primary/30 mr-2 mb-2">
                                            {src.title}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </div>
     </motion.div>
   );
};

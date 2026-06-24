import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
  SendIcon, SparklesIcon, FileTextIcon,
  RocketIcon, ChartBarIcon, ClipboardIcon
} from '../components/IconComponents';
import { generateClinicalContent } from '../services/aiService';

export const SalesGeneratorPage: React.FC = () => {
  const [target, setTarget] = useState('');
  const [asset, setAsset] = useState('');
  const [type, setType] = useState<'pitch' | 'email' | 'legal'>('pitch');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');

  const generate = async () => {
    setIsGenerating(true);
    setResult('');
    try {
      const prompt = `
        Erstelle ein Sales-Asset für:
        Tool: ${asset}
        Zielgruppe: ${target}
        Asset-Typ: ${type === 'pitch' ? 'Investment/ROI Pitch' : type === 'email' ? 'Kaltakquise E-Mail' : 'Rechtlicher Vorabzug'}

        Sprache: Deutsch.
        Stil: Hochprofessionell, analytisch, wertorientiert.
        Keine Floskeln, Fokus auf harten ROI und Problemlösung.
      `;
      const response = await generateClinicalContent(prompt);
      setResult(response.candidates[0].content.parts[0].text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <header>
          <h1 className="text-5xl font-bold font-serif text-brand-primary uppercase tracking-tighter">Instant <span className="italic font-light text-white lowercase">Sales-Assets</span></h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black mt-2">Generator für Pitches, Mails & Legal Drafts</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
           <div className="lg:col-span-5 space-y-6">
              <Card className="border-white/10 bg-black/40 backdrop-blur-3xl p-8">
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Wähle dein Asset</label>
                       <select
                         value={asset}
                         onChange={e => setAsset(e.target.value)}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-brand-primary/50 outline-none text-white appearance-none"
                       >
                          <option value="">Asset auswählen...</option>
                          <option value="Atlas Cali V2">Atlas Cali V2</option>
                          <option value="Workspace AI Orchestrator">Workspace AI Orchestrator</option>
                          <option value="Körperfluss PILOT.AI">Körperfluss PILOT.AI</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Zielgruppe / Kontakt</label>
                       <input
                         value={target}
                         onChange={e => setTarget(e.target.value)}
                         placeholder="z.B. IT-Leitung FH Linz"
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-brand-primary/50 outline-none text-white"
                       />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                       <TypeButton active={type === 'pitch'} onClick={() => setType('pitch')} label="Pitch" />
                       <TypeButton active={type === 'email'} onClick={() => setType('email')} label="E-Mail" />
                       <TypeButton active={type === 'legal'} onClick={() => setType('legal')} label="Legal" />
                    </div>
                    <Button onClick={generate} disabled={isGenerating || !asset || !target} variant="primary" className="w-full py-6">
                       {isGenerating ? 'Generiere...' : 'Asset Generieren'}
                    </Button>
                 </div>
              </Card>
           </div>

           <div className="lg:col-span-7">
              <Card className="h-full border-white/10 bg-white/[0.02] backdrop-blur-3xl p-12 min-h-[500px] flex flex-col">
                 {result ? (
                   <div className="prose prose-invert prose-sm max-w-none">
                      <div className="whitespace-pre-wrap font-light leading-relaxed text-zinc-300">
                         {result}
                      </div>
                      <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                         <button className="text-[10px] uppercase font-black text-brand-primary hover:text-white transition-all flex items-center gap-2">
                            <ClipboardIcon className="w-4 h-4" /> Copy to Clipboard
                         </button>
                         <button className="text-[10px] uppercase font-black text-zinc-500 hover:text-white transition-all flex items-center gap-2">
                            <FileTextIcon className="w-4 h-4" /> Download PDF
                         </button>
                      </div>
                   </div>
                 ) : (
                   <div className="m-auto text-center space-y-4 opacity-20">
                      <SparklesIcon className="w-16 h-16 mx-auto text-zinc-500" />
                      <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Warte auf Eingabe...</p>
                   </div>
                 )}
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
};

const TypeButton: React.FC<{ active: boolean, onClick: () => void, label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`py-3 rounded-xl text-[10px] uppercase font-black transition-all border ${
      active ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' : 'bg-white/5 border-white/5 text-zinc-600 hover:border-white/20'
    }`}
  >
    {label}
  </button>
);

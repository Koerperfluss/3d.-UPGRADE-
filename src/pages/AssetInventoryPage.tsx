import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
  RocketIcon, HammerIcon, GlobeIcon,
  SearchIcon, SparklesIcon, CodeIcon,
  LayersIcon, ArrowRightIcon
} from '../components/IconComponents';
import { generateClinicalContent } from '../services/aiService';
import { inventoryAssets, ToolAsset } from '../data/inventoryData';

export const AssetInventoryPage: React.FC = () => {
  const [assets, setAssets] = useState<ToolAsset[]>(inventoryAssets);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', description: '', type: 'Web-App', maturity: 'Prototyp', techStack: '', path: 'manual', functionality: '' });
  const [selectedAsset, setSelectedAsset] = useState<ToolAsset | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<any>(null);

  const filteredAssets = assets.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.techStack.toLowerCase().includes(search.toLowerCase())
  );

  const addAsset = () => {
    const asset = { ...newAsset, id: Date.now().toString() } as ToolAsset;
    setAssets([...assets, asset]);
    setShowAddForm(false);
    setNewAsset({ name: '', description: '', type: 'Web-App', maturity: 'Prototyp', techStack: '', path: 'manual', functionality: '' });
  };

  const runTechnicalPipeline = async (asset: ToolAsset) => {
    setIsAnalyzing(true);
    setAnalysisReport(null);
    try {
      const prompt = `
        Führe eine technische 4-stufige Analyse für das Asset durch:
        Name: ${asset.name}
        Stack: ${asset.techStack}
        Funktion: ${asset.functionality}

        1. Evaluator: Code-Reife, Lizenzrisiken (GPL?), Skalierbarkeit.
        2. Web Scanner: Ähnliche Tech-Stacks am Markt, Benchmarks.
        3. Market Analyst: Technischer Bedarf der Zielgruppe.
        4. Sales Strategist: Beste Monetarisierung basierend auf Tech-Stack (SaaS vs Lizenz).

        Antworte im JSON Format:
        {
          "technicalSummary": "...",
          "competitorBenchmarks": "...",
          "marketFit": "...",
          "monetizationModel": "...",
          "suggestedPrice": "..."
        }
      `;
      const response = await generateClinicalContent(prompt, 'gemini-1.5-flash', { responseMimeType: 'application/json' });
      const data = JSON.parse(response.candidates[0].content.parts[0].text);
      setAnalysisReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-5xl font-bold font-serif text-brand-primary uppercase tracking-tighter">Tool <span className="italic font-light text-white lowercase">Inventar</span></h1>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black mt-2">Nackte Asset-Liste & Tech-Audit Pipeline</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Suchen..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/50"
              />
            </div>
            <Button onClick={() => setShowAddForm(true)} variant="primary" className="!px-6">New Asset</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Asset List */}
          <div className="lg:col-span-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
             {filteredAssets.map(asset => (
               <div
                 key={asset.id}
                 onClick={() => setSelectedAsset(asset)}
                 className={`p-6 rounded-3xl border transition-all cursor-pointer ${
                   selectedAsset?.id === asset.id
                     ? 'bg-brand-primary/20 border-brand-primary shadow-glow'
                     : 'bg-white/5 border-white/10 hover:border-white/30'
                 }`}
               >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg leading-tight">{asset.name}</h3>
                  </div>
                  <p className="text-zinc-500 text-xs mb-4 line-clamp-2">{asset.functionality}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] bg-white/5 px-2 py-1 rounded-md text-zinc-400 border border-white/5">{asset.type}</span>
                    <span className="text-[9px] bg-white/5 px-2 py-1 rounded-md text-zinc-400 border border-white/5">{asset.maturity}</span>
                  </div>
               </div>
             ))}
          </div>

          {/* Details & Analysis */}
          <div className="lg:col-span-8">
            {selectedAsset ? (
              <div className="space-y-8">
                <Card className="border-white/10 bg-black/40 backdrop-blur-3xl">
                   <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
                      <div className="space-y-4">
                        <h2 className="text-4xl font-bold font-serif">{selectedAsset.name}</h2>
                        <p className="text-zinc-400 text-lg font-light">{selectedAsset.functionality}</p>
                      </div>
                      <div className="shrink-0">
                         <Button onClick={() => runTechnicalPipeline(selectedAsset)} disabled={isAnalyzing} variant="outline" className="text-brand-primary border-brand-primary/30">
                            {isAnalyzing ? 'Analyzing...' : 'Run Tech-Audit'}
                         </Button>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                      <DetailBadge label="Typ" value={selectedAsset.type} icon={LayersIcon} />
                      <DetailBadge label="Reifegrad" value={selectedAsset.maturity} icon={RocketIcon} />
                      <DetailBadge label="Tech-Stack" value={selectedAsset.techStack} icon={CodeIcon} />
                      <DetailBadge label="Speicherort" value={selectedAsset.path} icon={GlobeIcon} />
                   </div>

                   <AnimatePresence>
                      {analysisReport && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-8 pt-12 border-t border-white/5"
                        >
                           <div className="grid md:grid-cols-2 gap-8">
                              <AnalysisBox title="Technical Summary" content={analysisReport.technicalSummary} />
                              <AnalysisBox title="Competitor Benchmarks" content={analysisReport.competitorBenchmarks} />
                              <AnalysisBox title="Market Fit" content={analysisReport.marketFit} />
                              <AnalysisBox title="Monetization Strategy" content={analysisReport.monetizationModel} />
                           </div>
                           <div className="bg-brand-primary/10 border border-brand-primary/30 p-8 rounded-[32px] flex justify-between items-center">
                              <div>
                                <p className="text-[10px] uppercase font-black text-brand-primary mb-2">Recommended Pricing</p>
                                <span className="text-3xl font-black text-white">{analysisReport.suggestedPrice}</span>
                              </div>
                              <ArrowRightIcon className="w-8 h-8 text-brand-primary opacity-30" />
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </Card>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-24 border-2 border-dashed border-white/5 rounded-[60px] text-zinc-600">
                <RocketIcon className="w-24 h-24 mb-8 opacity-10" />
                <p className="text-xl font-light italic">Wähle ein Asset für die Deep-Analysis aus.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
             <motion.div
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowAddForm(false)}
               className="absolute inset-0 bg-black/90 backdrop-blur-sm"
             />
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="relative w-full max-w-xl bg-brand-background border border-white/10 p-12 rounded-[48px] shadow-2xl"
             >
                <h2 className="text-3xl font-bold font-serif mb-8 text-white uppercase tracking-tight">Add New <span className="text-brand-primary italic font-light lowercase">Asset</span></h2>
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Name</label>
                      <input
                        value={newAsset.name}
                        onChange={e => setNewAsset({...newAsset, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-brand-primary/50 outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Tech Stack</label>
                      <input
                        value={newAsset.techStack}
                        onChange={e => setNewAsset({...newAsset, techStack: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-brand-primary/50 outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Description</label>
                      <textarea
                        value={newAsset.functionality}
                        onChange={e => setNewAsset({...newAsset, functionality: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-brand-primary/50 outline-none min-h-[100px]"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4 pt-6">
                      <Button onClick={() => setShowAddForm(false)} variant="outline">Abbrechen</Button>
                      <Button onClick={addAsset} variant="primary">Speichern</Button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailBadge: React.FC<{ label: string, value: string, icon: any }> = ({ label, value, icon: Icon }) => (
  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
    <div className="flex items-center gap-3 mb-2">
       <Icon className="w-3 h-3 text-brand-primary" />
       <span className="text-[8px] uppercase font-black text-zinc-500 tracking-widest">{label}</span>
    </div>
    <p className="text-xs font-bold text-white truncate">{value}</p>
  </div>
);

const AnalysisBox: React.FC<{ title: string, content: string }> = ({ title, content }) => (
  <div className="space-y-4">
     <h4 className="text-[10px] uppercase font-black text-zinc-500 tracking-widest flex items-center gap-3">
        <div className="w-1 h-1 bg-brand-primary rounded-full"></div> {title}
     </h4>
     <p className="text-xs text-zinc-400 leading-relaxed italic">"{content}"</p>
  </div>
);

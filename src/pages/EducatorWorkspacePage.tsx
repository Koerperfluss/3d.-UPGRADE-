import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  AnalyticsIcon, BrainIcon, LabIcon, 
  SearchIcon, BrainCircuitIcon, CheckCircleIcon,
  ArrowRightIcon, FilterIcon, WarningIcon,
  CreativeIcon
} from '../components/IconComponents';
import { CreativeLab } from '../components/CreativeLab';

type TabType = 'analytics' | 'config' | 'lab';

export const EducatorWorkspacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');

  const mockQueries = [
    { query: 'Was sind die Red Flags bei LWS?', count: 142, trend: '+12%', status: 'critical' },
    { query: 'Differenzialdiagnose VKB vs Meniskus', count: 89, trend: '+5%', status: 'normal' },
    { query: 'Biomechanik der Schulter Abduktion', count: 67, trend: '-2%', status: 'normal' },
  ];

  return (
    <div className="min-h-screen bg-brand-background text-white pt-32 pb-20">
      <Section 
        title="Educator Workspace" 
        subtitle="Zentrale Steuerung für Analytik, KI-Konfiguration und Content-Erstellung."
      />

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {(['analytics', 'config', 'lab'] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === t 
                  ? 'bg-brand-primary text-brand-secondary shadow-glow' 
                  : 'bg-white/5 text-white/40 hover:text-white border border-white/10'
              }`}
            >
              {t === 'analytics' ? 'Query Analytics' : t === 'config' ? 'Chatbot Config' : 'Creative Lab'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
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

              {/* Chain of Thought Visibility Demo */}
              <div className="p-10 rounded-[40px] bg-brand-primary/5 border border-brand-primary/20">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-4">
                  <BrainCircuitIcon className="w-6 h-6 text-brand-primary" />
                  KI-Reasoning Transparenz (CoT)
                </h3>
                <p className="text-sm text-white/60 mb-8 leading-relaxed">
                  Sehen Sie exakt, wie die KI zu ihren Bewertungen kommt. Dies ermöglicht eine didaktische Validierung der automatisierten Feedbacks.
                </p>
                <div className="space-y-4">
                  {[
                    { step: 'NLU-Extraktion', desc: 'Identifikation von "stechender Schmerz" und "LWS" als Kern-Entitäten.' },
                    { step: 'Wissens-Abgleich', desc: 'Abgleich mit S3-Leitlinie Kreuzschmerz (AWMF).' },
                    { step: 'Red-Flag-Check', desc: 'Prüfung auf neurologische Defizite (Cauda Equina Syndrom).' },
                    { step: 'Feedback-Synthese', desc: 'Generierung einer sokratischen Rückfrage zur Sensibilität.' },
                  ].map((s, i) => (
                    <div key={i} className="flex gap-6 items-start p-4 bg-black/40 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs border border-brand-primary/20">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-white mb-1">{s.step}</p>
                        <p className="text-sm text-white/40 font-light">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
    </div>
  );
};

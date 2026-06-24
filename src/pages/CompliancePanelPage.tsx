import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Section } from '../components/Section';
import {
  ShieldCheckIcon, ChartBarIcon,
  SearchIcon, SparklesIcon,
  LayersIcon, GlobeIcon
} from '../components/IconComponents';

export const CompliancePanelPage: React.FC = () => {
  const segments = [
    { id: 'b2b-edu', name: 'Hochschulen & FHs', risk: 'Gering', volume: 'Hoch', focus: 'MDR-Abstand, BFSG 2025' },
    { id: 'b2b-clinics', name: 'Reha-Zentren', risk: 'Mittel', volume: 'Mittel', focus: 'Patientendaten, DSGVO' },
    { id: 'b2c-end', name: 'Endkonsumenten', risk: 'Gering', volume: 'Extrem Hoch', focus: 'App-Stores, MOSS' },
    { id: 'b2b-dev', name: 'Entwickler Tools', risk: 'Gering', volume: 'Gering', focus: 'GPL-Compliance, SDKs' },
  ];

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <header>
          <h1 className="text-5xl font-bold font-serif text-brand-primary uppercase tracking-tighter">Wertanalyse & <span className="italic font-light text-white lowercase">Zielmarkt</span></h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black mt-2">CompliancePanel: Neutrale Marktanalyse & Segmentierung</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {segments.map(seg => (
             <div
               key={seg.id}
               className="glass-dark p-8 rounded-[40px] border border-white/5 hover:border-brand-primary/30 transition-all group"
             >
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6 group-hover:bg-brand-primary/20 transition-all border border-brand-primary/10">
                   <LayersIcon className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{seg.name}</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-6">{seg.focus}</p>
                <div className="space-y-3">
                   <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-600 font-bold uppercase">Risiko-Level</span>
                      <span className="text-brand-primary font-black">{seg.risk}</span>
                   </div>
                   <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-600 font-bold uppercase">Marktvolumen</span>
                      <span className="text-white font-black">{seg.volume}</span>
                   </div>
                </div>
             </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
           <Card className="border-white/10 bg-black/40 backdrop-blur-3xl p-12">
              <h2 className="text-3xl font-bold font-serif text-white mb-8 flex items-center gap-6">
                 <ShieldCheckIcon className="w-8 h-8 text-brand-primary" /> Compliance Audit
              </h2>
              <p className="text-zinc-400 font-light leading-relaxed text-lg mb-8">
                 Neutrale Prüfung der regulatorischen Anforderungen für den EU-Binnenmarkt (Stand 2026).
              </p>
              <ul className="space-y-6">
                 <AuditItem title="MDR Konformität" status="Pass" desc="Keine diagnostische Zweckbestimmung erkannt." />
                 <AuditItem title="BFSG 2025" status="Ready" desc="Barrierefreiheitsstärkungsgesetz konforme UI-Struktur." />
                 <AuditItem title="DSGVO" status="Check" desc="Vollständige Datenhoheit durch lokales Hosting möglich." />
              </ul>
           </Card>

           <Card className="border-brand-primary/20 bg-brand-primary/5 backdrop-blur-3xl p-12">
              <h2 className="text-3xl font-bold font-serif text-white mb-8 flex items-center gap-6">
                 <ChartBarIcon className="w-8 h-8 text-brand-primary" /> Wert-Indikator
              </h2>
              <div className="space-y-12">
                 <div>
                    <div className="flex justify-between items-end mb-4">
                       <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Inhaltliche Reife</span>
                       <span className="text-2xl font-black text-brand-primary">94%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-brand-primary shadow-glow" style={{ width: '94%' }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between items-end mb-4">
                       <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Technischer Burggraben</span>
                       <span className="text-2xl font-black text-brand-primary">82%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-brand-primary shadow-glow" style={{ width: '82%' }}></div>
                    </div>
                 </div>
                 <div className="pt-8 border-t border-brand-primary/10">
                    <p className="text-sm text-zinc-400 italic font-light">"Das Asset-Portfolio weist eine überdurchschnittliche synergetische Dichte auf. Der Fokus sollte auf der Konsolidierung der Kern-Technologien liegen."</p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

const AuditItem: React.FC<{ title: string, status: string, desc: string }> = ({ title, status, desc }) => (
  <li className="flex items-start gap-6 group">
     <div className="shrink-0 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black uppercase text-zinc-500 group-hover:border-brand-primary/50 group-hover:text-brand-primary transition-all">
        {status}
     </div>
     <div>
        <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-zinc-500 font-light">{desc}</p>
     </div>
  </li>
);

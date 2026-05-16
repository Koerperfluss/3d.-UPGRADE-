
import React from 'react';
import { Section } from '../components/Section';
import { MediaAnalyzer } from '../components/MediaAnalyzer';
import { AudioTranscriber } from '../components/AudioTranscriber';
import { Card } from '../components/Card';
import { BrainCircuitIcon, CheckCircleIcon } from '../components/IconComponents';

export const AnalysisPage: React.FC = () => {
  return (
    <div className="relative animate-fadeInUp bg-transparent min-h-screen pt-48 pb-32 overflow-hidden font-sans">
      <Section containerClassName="py-0 relative z-10">
        {/* Header */}
        <div className="mb-32">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
                <BrainCircuitIcon className="w-8 h-8 text-brand-primary" />
              </div>
              <div className="h-[1px] w-24 bg-brand-primary/40"></div>
              <span className="text-[11px] font-black text-brand-primary uppercase tracking-[0.6em] opacity-80">Clinical Intelligence</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-bold font-serif text-white tracking-tighter leading-[0.8] mb-12 uppercase">
              Körper-Scanner & <br/><span className="text-gradient-gold italic font-light lowercase">Analyse</span>
            </h1>
            <p className="text-zinc-500 max-w-4xl leading-relaxed text-3xl font-light tracking-wide">
              Evidenzbasierte Biomechanik durch <span className="text-white italic">Deep Reasoning KI</span>. Nutzen Sie Video- und Bilddaten Ihres iPhones für klinische Insights.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Main Scanner Section */}
          <div className="lg:col-span-8 space-y-16">
            <div className="glass-dark rounded-[60px] p-16 md:p-24 shadow-[0_60px_150px_rgba(0,0,0,0.9)] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 blur-[150px] rounded-full -mr-300 -mt-300 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="relative z-10">
                    <MediaAnalyzer />
                </div>
            </div>
          </div>

          {/* Sidebar Tools */}
          <div className="lg:col-span-4 space-y-12">
            <div className="glass-dark p-12 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                    <AudioTranscriber />
                </div>
            </div>

            <div className="glass-dark p-12 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -ml-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <h4 className="text-3xl font-bold font-serif text-white mb-12 flex items-center gap-6 tracking-tight uppercase">
                <div className="w-12 h-12 rounded-[18px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
                    <BrainCircuitIcon className="w-6 h-6 text-brand-primary" /> 
                </div>
                Technologie
              </h4>
              <ul className="space-y-8">
                <li className="flex items-start gap-6 group/item">
                  <CheckCircleIcon className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1 opacity-60 group-hover/item:opacity-100 transition-opacity" />
                  <span className="text-zinc-500 font-light leading-relaxed tracking-wide text-lg group-hover/item:text-white transition-colors">Gemini 3.0 Pro <span className="text-white italic">Deep Reasoning</span> Engine</span>
                </li>
                <li className="flex items-start gap-6 group/item">
                  <CheckCircleIcon className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1 opacity-60 group-hover/item:opacity-100 transition-opacity" />
                  <span className="text-zinc-500 font-light leading-relaxed tracking-wide text-lg group-hover/item:text-white transition-colors">32k Thinking Budget für komplexe Kausalketten</span>
                </li>
                <li className="flex items-start gap-6 group/item">
                  <CheckCircleIcon className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1 opacity-60 group-hover/item:opacity-100 transition-opacity" />
                  <span className="text-zinc-500 font-light leading-relaxed tracking-wide text-lg group-hover/item:text-white transition-colors">Optimiert für iPhone 16 Pro <span className="text-white italic">LiDAR & Vision</span>-Rohdaten</span>
                </li>
              </ul>
              <div className="mt-16 p-10 glass-dark border border-brand-primary/20 rounded-[32px] shadow-glow relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-primary/5 opacity-50"></div>
                <div className="relative z-10">
                    <p className="text-[11px] uppercase tracking-[0.4em] font-black text-brand-primary mb-4 opacity-80">Sicherheits-Hinweis</p>
                    <p className="text-sm text-zinc-500 leading-relaxed italic font-light tracking-wide">Diese Analyse ist ein KI-gestütztes Tool zur Unterstützung klinischer Entscheidungen und ersetzt keine ärztliche Diagnose.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

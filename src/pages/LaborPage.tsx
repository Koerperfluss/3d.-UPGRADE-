
import React from 'react';
import { Section } from '../components/Section';
import { CreativeLab } from '../components/CreativeLab';
import { Card } from '../components/Card';
import { SimulationIcon, CameraIcon } from '../components/IconComponents';

export const LaborPage: React.FC = () => {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleDemo = () => {
      setToastMessage("Demo Mode: Creative Lab für KI-gestützte Modellexploration geöffnet.");
      setTimeout(() => setToastMessage(null), 4000);
    };
    window.addEventListener('demo-step-creative-lab', handleDemo);
    return () => window.removeEventListener('demo-step-creative-lab', handleDemo);
  }, []);

  return (
    <div className="relative animate-fadeInUp bg-transparent min-h-screen pt-48 pb-32 overflow-hidden font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-fadeInUp">
          <div className="bg-[#C9A84C]/20 border border-[#C9A84C]/50 text-[#C9A84C] backdrop-blur-xl px-6 py-3 rounded-full text-sm font-medium shadow-[0_0_20px_rgba(201,168,76,0.3)]">
            {toastMessage}
          </div>
        </div>
      )}
      <Section containerClassName="py-0 relative z-10">
        {/* Header */}
        <div className="mb-32">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
                <CameraIcon className="w-8 h-8 text-brand-primary" />
              </div>
              <div className="h-[1px] w-24 bg-brand-primary/40"></div>
              <span className="text-[11px] font-black text-brand-primary uppercase tracking-[0.6em] opacity-80">Creative Intelligence</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-bold font-serif text-white tracking-tighter leading-[0.8] mb-12 uppercase">
              Creative <br/><span className="text-gradient-gold italic font-light lowercase">Lab</span>
            </h1>
            <p className="text-zinc-500 max-w-4xl leading-relaxed text-3xl font-light tracking-wide">
              Erstellen Sie medizinische Lehrinhalte und anatomische Illustrationen. Modernste <span className="text-white italic">KI-Modelle</span> für Video und Bild in Profi-Qualität.
            </p>
        </div>

        <div className="max-w-6xl mx-auto">
           <div className="glass-dark rounded-[60px] p-16 md:p-24 shadow-[0_60px_150px_rgba(0,0,0,0.9)] border border-white/5 relative overflow-hidden group mb-32">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 blur-[150px] rounded-full -mr-300 -mt-300 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative z-10">
                  <CreativeLab />
              </div>
           </div>
           
           <div className="grid md:grid-cols-2 gap-16">
              <div className="glass-dark p-12 md:p-16 rounded-[48px] border border-white/5 hover:scale-[1.02] transition-all duration-1000 group shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -ml-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="flex items-center gap-8 mb-10">
                  <div className="w-20 h-20 rounded-[24px] bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 group-hover:bg-brand-primary/10 transition-all duration-700 shadow-glow">
                    <SimulationIcon className="w-10 h-10 text-brand-primary opacity-60 group-hover:opacity-100" />
                  </div>
                  <h4 className="text-3xl font-bold text-white font-serif tracking-tight uppercase">Veo Video Engine</h4>
                </div>
                <p className="text-lg text-zinc-500 leading-relaxed font-light tracking-wide italic">
                  "Generieren Sie realistische Patienten-Simulationen oder Bewegungsabläufe direkt aus Ihren Beschreibungen. Ideal für die Veranschaulichung von Heimübungen."
                </p>
              </div>
              <div className="glass-dark p-12 md:p-16 rounded-[48px] border border-white/5 hover:scale-[1.02] transition-all duration-1000 group shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -ml-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="flex items-center gap-8 mb-10">
                  <div className="w-20 h-20 rounded-[24px] bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 group-hover:bg-brand-primary/10 transition-all duration-700 shadow-glow">
                    <CameraIcon className="w-10 h-10 text-brand-primary opacity-60 group-hover:opacity-100" />
                  </div>
                  <h4 className="text-3xl font-bold text-white font-serif tracking-tight uppercase">Nano Banana Pro</h4>
                </div>
                <p className="text-lg text-zinc-500 leading-relaxed font-light tracking-wide italic">
                  "Präzise anatomische Illustrationen in bis zu 4K Auflösung. Nutzen Sie verschiedene Seitenverhältnisse für Dokumentationen oder Social Media."
                </p>
              </div>
           </div>
        </div>
      </Section>
    </div>
  );
};

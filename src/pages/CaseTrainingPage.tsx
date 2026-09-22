import React, { useState } from 'react';
import { Section } from '../components/Section';
import { CheckCircleIcon, LightBulbIcon, SimulationIcon } from '../components/IconComponents';
import { CaseStudy } from '../types';
import { CaseGenerator } from '../components/CaseGenerator';
import { CaseSession } from '../components/CaseSession';

export const CaseTrainingPage: React.FC = () => {
  const [activeCase, setActiveCase] = useState<CaseStudy | null>(null);
  const [tutorMood, setTutorMood] = useState<string>('Supportiv');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const handleDemo = () => {
      setToastMessage("Demo Mode: Case Library geladen. Hier trainieren Sie am interaktiven Patientenbeispiel.");
      setTimeout(() => setToastMessage(null), 4000);
    };
    window.addEventListener('demo-step-case-training', handleDemo);
    return () => window.removeEventListener('demo-step-case-training', handleDemo);
  }, []);

  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-40 pb-32 relative overflow-hidden">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-fadeInUp">
          <div className="bg-[#C9A84C]/20 border border-[#C9A84C]/50 text-[#C9A84C] backdrop-blur-xl px-6 py-3 rounded-full text-sm font-medium shadow-[0_0_20px_rgba(201,168,76,0.3)]">
            {toastMessage}
          </div>
        </div>
      )}
      <div className="relative z-10">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
         <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
      </div>

      <Section 
        title="Fall-Trainings (Case-Based Learning)"
        subtitle="Trainieren Sie klinisches Reasoning an realistischen, KI-generierten Patientenfällen. Deep Reasoning mit Gemini 3.0."
        containerClassName="py-0 relative z-10 mb-24"
      />

      <Section containerClassName="pt-0 pb-16 md:pb-24 relative z-10">
        {!activeCase ? (
             <div className="max-w-4xl mx-auto">
                <CaseGenerator onCaseGenerated={(c, m) => { setActiveCase(c); setTutorMood(m); }} />
                
                <div className="mt-24 grid md:grid-cols-3 gap-12 text-center">
                    <div className="group">
                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 mx-auto mb-6 group-hover:bg-brand-primary/10 transition-all duration-700 shadow-glow">
                            <SimulationIcon className="w-8 h-8 text-brand-primary opacity-60 group-hover:opacity-100" />
                        </div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-[0.2em] mb-3">Unendliche Fälle</h4>
                        <p className="text-xs text-zinc-500 font-light tracking-wide leading-relaxed">Jeder Fall ist einzigartig generiert.</p>
                    </div>
                     <div className="group">
                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 mx-auto mb-6 group-hover:bg-brand-primary/10 transition-all duration-700 shadow-glow">
                            <CheckCircleIcon className="w-8 h-8 text-brand-primary opacity-60 group-hover:opacity-100" />
                        </div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-[0.2em] mb-3">Sofortiges Feedback</h4>
                        <p className="text-xs text-zinc-500 font-light tracking-wide leading-relaxed">Vergleich mit Musterlösungen.</p>
                    </div>
                     <div className="group">
                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 mx-auto mb-6 group-hover:bg-brand-primary/10 transition-all duration-700 shadow-glow">
                            <LightBulbIcon className="w-8 h-8 text-brand-primary opacity-60 group-hover:opacity-100" />
                        </div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-[0.2em] mb-3">Klinisches Denken</h4>
                        <p className="text-xs text-zinc-500 font-light tracking-wide leading-relaxed">Fördert Hypothesenbildung.</p>
                    </div>
                </div>
             </div>
        ) : (
            <CaseSession caseStudy={activeCase} tutorMood={tutorMood} onReset={() => setActiveCase(null)} />
        )}
      </Section>
      </div>
    </div>
  );
};

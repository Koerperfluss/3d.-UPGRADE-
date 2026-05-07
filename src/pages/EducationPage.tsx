
import React from 'react';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircleIcon, AcademicCapIcon, ArrowRightIcon, LightBulbIcon, BrainCircuitIcon } from '../components/IconComponents';
import { USPItem } from '../types';
import { WirkungskettenAnalyser } from '../components/WirkungskettenAnalyser';

const benefits: USPItem[] = [
    {
        title: 'Auditierbare KI-Logik',
        description: 'Transparenz statt Blackbox: Unsere KI belegt jede Antwort mit Quellen und Leitlinien. Ideal für regulatorisch sichere Ausbildung.',
        icon: <BrainCircuitIcon className="w-10 h-10 text-brand-primary" />
    },
    {
        title: 'Didaktische Validierung',
        description: 'Inhalte werden nicht nur generiert, sondern didaktisch strukturiert – vom Symptom zur Ursache, genau wie im echten Clinical Reasoning.',
        icon: <AcademicCapIcon className="w-10 h-10 text-brand-primary" />
    },
    {
        title: 'MDR-Freiheit & Sicherheit',
        description: 'Körperfluss fokussiert sich rein auf die Wissensvermittlung und Ausbildungsszenarien, um rechtliche Sicherheit im Lehrbetrieb zu gewährleisten.',
        icon: <CheckCircleIcon className="w-10 h-10 text-brand-primary" />
    }
];

export const EducationPage: React.FC = () => {
  return (
    <div className="relative animate-fadeInUp bg-transparent min-h-screen pt-48 pb-32 overflow-hidden font-sans">
      
      {/* Hero Section */}
      <div className="mb-32 relative z-10">
        <Section containerClassName="py-0">
          <div className="max-w-5xl">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
                <BrainCircuitIcon className="w-8 h-8 text-brand-primary" />
              </div>
              <div className="h-[1px] w-24 bg-brand-primary/40"></div>
              <span className="text-[11px] font-black text-brand-primary uppercase tracking-[0.6em] opacity-80">Education Excellence</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-bold font-serif text-white tracking-tighter leading-[0.8] mb-12 uppercase">
              Die Zukunft der <br/><span className="text-gradient-gold italic font-light lowercase">Therapie-Ausbildung</span>
            </h1>
            <p className="text-zinc-500 max-w-4xl leading-relaxed text-3xl font-light tracking-wide">
              Verbinden Sie <span className="text-white italic">auditierbare KI-Logik</span> mit didaktischer Exzellenz. Die erste Plattform für reproduzierbare, sichere Lehrszenarien im Gesundheitswesen.
            </p>
          </div>
        </Section>
      </div>

      {/* Main Tool: Wirkungsketten Analyser */}
      <div className="mb-48 relative z-10">
        <Section containerClassName="py-0">
          <div className="glass-dark rounded-[60px] p-16 md:p-24 shadow-[0_60px_150px_rgba(0,0,0,0.9)] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 blur-[150px] rounded-full -mr-300 -mt-300 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="mb-20">
              <h2 className="text-4xl md:text-6xl font-bold font-serif text-white mb-8 tracking-tighter uppercase">Wirkungsketten <span className="text-gradient-gold italic font-light lowercase">Analyser</span></h2>
              <p className="text-zinc-500 text-2xl font-light tracking-wide max-w-3xl">Geben Sie Ihre klinischen Befunde ein und lassen Sie die KI die zugrunde liegenden Ursache-Wirkungs-Zusammenhänge auf Basis aktueller Evidenz herleiten.</p>
            </div>
            <div className="relative z-10">
                <WirkungskettenAnalyser />
            </div>
          </div>
        </Section>
      </div>

      {/* Benefits Section */}
      <Section title="Vorteile für Dozenten & Studierende" containerClassName="relative z-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((item) => (
                <div key={item.title} className="glass-dark p-12 md:p-16 rounded-[48px] border border-white/5 hover:scale-[1.02] transition-all duration-1000 group shadow-[0_40px_100px_rgba(0,0,0,0.8)] text-center relative overflow-hidden"> 
                  <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -ml-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <div className="flex justify-center mb-12">
                      <div className="w-24 h-24 rounded-[28px] bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 group-hover:bg-brand-primary/10 transition-all duration-700 shadow-glow opacity-60 group-hover:opacity-100 transition-opacity">
                          {item.icon}
                      </div>
                  </div>
                  <h3 className="text-3xl font-bold font-serif text-white mb-8 tracking-tight uppercase">{item.title}</h3>
                  <p className="text-zinc-500 font-light leading-relaxed tracking-wide text-lg">{item.description}</p>
                </div>
            ))}
        </div>
      </Section>
      
      {/* Call to Action */}
      <Section containerClassName="relative z-10 py-32">
        <div className="text-center glass-dark p-16 md:p-32 rounded-[80px] border border-white/5 shadow-[0_80px_200px_rgba(0,0,0,0.9)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/20 transition-all duration-1000"></div>
          <h2 className="text-5xl md:text-8xl font-bold font-serif text-white mb-12 tracking-tighter leading-tight uppercase">
             Für Lehrende & <br/><span className="text-gradient-gold italic font-light lowercase">Bildungspartner</span>
          </h2>
          <p className="text-2xl md:text-3xl mb-16 max-w-4xl mx-auto text-zinc-500 font-light leading-relaxed tracking-wide">
            Verwalten Sie Kurse, erstellen Sie Fallbeispiele und begleiten Sie den Lernfortschritt Ihrer Studierenden in unserem gesicherten <span className="text-white italic">Dozentenportal</span>.
          </p>
          <Button to="/login" variant="primary" size="lg" className="px-20 py-10 text-[11px] uppercase tracking-[0.6em] font-black shadow-2xl shadow-brand-primary/20 !rounded-[32px] hover:scale-105 transition-all">
            Jetzt Partner werden
          </Button>
        </div>
      </Section>
    </div>
  );
};

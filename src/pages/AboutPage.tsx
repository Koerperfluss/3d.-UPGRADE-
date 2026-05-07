import React from 'react';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { TeamMember } from '../types';

const teamData: TeamMember[] = [
  {
    name: "Sascha Lagler, BSc i.A.",
    title: "Co-Founder, Clinical & Physiotherapy Lead",
    description: "Klinisch-orientierter Projekt- und Produktverantwortlicher mit Schwerpunkt auf evidenzbasierter Physiotherapie. Verbindet therapeutische Fachkompetenz mit systematischem Prozess- und Strukturdenken.",
  },
  {
    name: "Peter Fischer, BSc BSc",
    title: "Co-Founder, CTO",
    description: "Technischer Leiter mit Fokus auf Datenbankentwicklung, Backend, MLOps und Orchestrierung von KI-Workflows. Verantwortlich für sichere APIs und die technische Instandhaltung der Plattform.",
  },
  {
    name: "Lisa Mauerhart",
    title: "Designerin & Illustratorin, UI/UX",
    description: "Visuelle Designerin und Illustratorin, spezialisiert auf anatomisch korrekte Illustrationen. Übersetzt komplexe, klinische Inhalte in klare, nutzerfreundliche Visuals.",
  }
];

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        // Take first letter of the first two names/parts
        const firstInitial = names[0][0];
        const secondInitial = names.find(n => n && n !== firstInitial[0])?.[0] || '';
        return `${firstInitial}${secondInitial}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};


export const AboutPage: React.FC = () => {
  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-32 pb-24 overflow-hidden font-sans">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px] opacity-20"></div>
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <Section containerClassName="py-24 md:py-40 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-brand-primary/5 blur-[150px] rounded-full -top-1/2 left-1/2 -translate-x-1/2 w-full h-full"></div>
        <div className="container mx-auto px-8 relative z-10 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary mb-10 block">Unsere Mission</span>
          <h1 className="text-6xl md:text-9xl font-bold font-serif text-white mb-12 tracking-tighter leading-[0.85]">Über <br/><span className="text-gradient-gold italic font-light">Körperfluss</span></h1>
          <p className="text-xl md:text-3xl text-zinc-500 max-w-4xl mx-auto font-light leading-relaxed mb-24 tracking-wide">
            Menschen befähigen, ihre Gesundheit aktiv zu gestalten – durch Wissen, Bewegung und innovative digitale Werkzeuge.
          </p>
          
          <div className="max-w-5xl mx-auto glass-dark p-16 md:p-28 rounded-[60px] border border-white/5 relative group shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
            <div className="absolute -inset-2 bg-gradient-to-r from-brand-primary/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <p className="text-3xl md:text-5xl mb-12 text-white font-serif italic leading-tight relative z-10 tracking-tight">
              „Verstehen, was im Körper passiert – und lernen, es aktiv zu gestalten." 
            </p>
            <p className="text-zinc-500 text-xl md:text-2xl leading-relaxed font-light relative z-10 tracking-wide">
              Diese Philosophie ist der Kern von Körperfluss. Wir schaffen eine Brücke zwischen traditioneller Therapie und modernen digitalen Möglichkeiten. Unsere Plattform bietet Ihnen die Werkzeuge – von KI-Analysen über personalisierte Pläne bis hin zum interaktiven Lernmodus – um Experte Ihrer eigenen Gesundheit zu werden oder die Therapeuten der Zukunft auszubilden.
            </p>
          </div>
        </div>
      </Section>

      <Section containerClassName="py-40 bg-zinc-950/30 border-y border-white/5 relative z-10">
        <div className="text-center mb-32">
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 tracking-tighter">Unser <span className="text-gradient-gold italic font-light">Team</span></h2>
          <p className="text-zinc-700 uppercase tracking-[0.5em] text-[10px] font-black">Die Köpfe hinter der Innovation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-8">
          {teamData.map((member) => (
            <div key={member.name} className="premium-card group hover:scale-[1.02] transition-all duration-1000 !p-12 rounded-[48px]">
              <div className="relative w-40 h-40 mx-auto mb-12">
                <div className="absolute -inset-6 bg-brand-primary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="relative w-full h-full rounded-full glass border border-white/10 flex items-center justify-center overflow-hidden">
                  <span className="text-5xl font-black text-brand-primary tracking-tighter opacity-30 group-hover:opacity-100 transition-opacity duration-1000">{getInitials(member.name)}</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold font-serif text-white mb-3 tracking-tight">{member.name}</h3>
                <p className="text-brand-primary font-black text-[10px] uppercase tracking-[0.3em] mb-8 opacity-80">{member.title}</p>
                <p className="text-lg text-zinc-500 leading-relaxed font-light tracking-wide">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section containerClassName="py-40 relative z-10">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-24">
            <div>
              <h3 className="text-4xl font-serif font-bold text-white mb-12 tracking-tight">Visuelle <span className="text-gradient-gold italic font-light">Identität</span></h3>
              <ul className="space-y-8">
                {[
                  "Fließende Formen symbolisieren Bewegung und Dynamik.",
                  "Warme Gold- und Erdtöne für Natürlichkeit und Energie.",
                  "Helle, klare Gestaltung für Zugänglichkeit und modernen Look.",
                  "Abgerundete Elemente für Weichheit und eine positive User Experience."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-6 group">
                    <div className="w-2 h-2 rounded-full bg-brand-primary mt-2.5 group-hover:scale-150 transition-transform duration-700"></div>
                    <span className="text-xl text-zinc-500 font-light leading-relaxed tracking-wide">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-4xl font-serif font-bold text-white mb-12 tracking-tight">Marken <span className="text-gradient-gold italic font-light">Essenz</span></h3>
              <ul className="space-y-8">
                {[
                  "„Leben in Bewegung\" verkörpert durch dynamische, organische Logoform.",
                  "Symbolisiert den Fluss von Energie, Wissen und Gesundheit.",
                  "Verbindet Tradition mit digitaler Innovation."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-6 group">
                    <div className="w-2 h-2 rounded-full bg-brand-primary mt-2.5 group-hover:scale-150 transition-transform duration-700"></div>
                    <span className="text-xl text-zinc-500 font-light leading-relaxed tracking-wide">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

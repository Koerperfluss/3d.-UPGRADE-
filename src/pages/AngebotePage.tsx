
import React, { useEffect } from 'react';
import { Section } from '../components/Section';
import { CheckCircleIcon, ChartBarIcon, TargetIcon, AcademicCapIcon, BrainCircuitIcon } from '../components/IconComponents';

import { User } from '../types';

interface AngebotePageProps {
  user: User | null;
  onOpenHealthCheck: () => void;
}

export const AngebotePage: React.FC<AngebotePageProps> = ({ user, onOpenHealthCheck }) => {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleDemo = () => {
      setToastMessage("Demo Mode: Sie sehen nun die Lizenzmodelle von Körperfluss. Die Tour ist damit beendet!");
      setTimeout(() => setToastMessage(null), 5000);
    };
    window.addEventListener('demo-step-angebote', handleDemo);
    return () => window.removeEventListener('demo-step-angebote', handleDemo);
  }, []);

  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-32 pb-24 overflow-hidden font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-fadeInUp">
          <div className="bg-[#C9A84C]/20 border border-[#C9A84C]/50 text-[#C9A84C] backdrop-blur-xl px-6 py-3 rounded-full text-sm font-medium shadow-[0_0_20px_rgba(201,168,76,0.3)]">
            {toastMessage}
          </div>
        </div>
      )}
      
      {/* 4.1 & 4.2 Header Section */}
      <div className="pt-20 pb-16 text-center container mx-auto px-8 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-brand-primary mb-6 opacity-80">Marketing & Vertrieb</span>
          <div className="h-[1px] w-24 bg-brand-primary/30 mb-12"></div>
          <h1 className="text-5xl md:text-8xl font-bold font-serif text-white mb-10 tracking-tighter leading-[0.9] uppercase">
            Der <br/><span className="text-gradient-gold italic font-light lowercase">Verkaufsprozess</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
            Strategische Positionierung, Go-to-Market-Strategie und wertbasiertes Erlösmodell.
          </p>
        </div>
      </div>

      <Section containerClassName="py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto items-start">
          <div className="glass-dark p-12 rounded-[40px] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-brand-primary/20 transition-colors duration-1000"></div>
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary mb-6 block">4.1 Positionierung</span>
              <h3 className="text-3xl font-bold font-serif text-white mb-6 tracking-tight uppercase">Der Compliance-Hebel</h3>
              <p className="text-zinc-400 font-light leading-relaxed mb-8">
                Körperfluss positioniert sich im DACH-Raum als spezialisierter Lösungsanbieter an der Schnittstelle von Physiotherapie-Ausbildung und digitaler Barrierefreiheit.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <TargetIcon className="w-6 h-6 text-brand-primary flex-shrink-0" />
                  <span className="text-zinc-300 font-light text-sm">Primärer Kaufanreiz ist der regulatorische Druck: BFSG ab 2025.</span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircleIcon className="w-6 h-6 text-brand-primary flex-shrink-0" />
                  <span className="text-zinc-300 font-light text-sm">„Sniper-Marketing“: Direkte Ansprache von strategischen Entscheidungsträgern bei ca. 300 relevanten Institutionen.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-dark p-12 rounded-[40px] border border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/10 rounded-full blur-[120px] -mr-40 -mt-40 group-hover:bg-brand-primary/20 transition-colors duration-1000"></div>
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary mb-6 block">4.2 Strategie</span>
              <h3 className="text-3xl font-bold font-serif text-white mb-6 tracking-tight uppercase">High Touch & Thought Leadership</h3>
              <ul className="space-y-6">
                 <li className="flex items-start gap-4">
                  <AcademicCapIcon className="w-6 h-6 text-brand-primary flex-shrink-0" />
                  <div>
                    <strong className="text-white block mb-1">Thought Leadership</strong>
                    <span className="text-zinc-400 font-light text-sm">Publikation von Whitepapern zur BFSG-Compliance und Expertenpräsenz.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <BrainCircuitIcon className="w-6 h-6 text-brand-primary flex-shrink-0" />
                  <div>
                     <strong className="text-white block mb-1">Vertrauensbildung & Lead-Gen</strong>
                    <span className="text-zinc-400 font-light text-sm">Fachbeirat mit Branchengrößen (zB. Kneipp-Schulen) und personalisierte Direktansprache.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* 4.3 Go-To-Market */}
      <Section containerClassName="py-16 relative z-10">
        <div className="max-w-7xl mx-auto glass border border-white/10 p-12 md:p-20 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary mb-8 block text-center">4.3 Go-to-Market</span>
            <h2 className="text-4xl md:text-6xl font-bold font-serif text-white mb-16 tracking-tighter uppercase text-center">Gezielte Pilotierung zur Skalierung</h2>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="relative border-l border-brand-primary/30 pl-8">
                <div className="absolute w-3 h-3 bg-brand-primary rounded-full -left-[6.5px] top-0 shadow-glow"></div>
                <h3 className="text-xl font-bold text-white mb-4">Phase 1: Pilot & PoC</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">
                   Fokus auf die Gewinnung von 3–5 strategischen Pilotpartnern (z.B. FH Linz, Campus Wien) zur Validierung in Q3/Q4. Erstellung einer White-Label Case Study.
                </p>
              </div>
              <div className="relative border-l border-brand-primary/30 pl-8 opacity-70 hover:opacity-100 transition-opacity">
                <div className="absolute w-3 h-3 bg-brand-primary rounded-full -left-[6.5px] top-0"></div>
                <h3 className="text-xl font-bold text-white mb-4">Phase 2: Early Adopters</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">
                  Erweiterung der Zusammenarbeit über Verbandskonsortien (z.B. Physio Austria, DBfK) für institutionelle Glaubwürdigkeit.
                </p>
              </div>
              <div className="relative border-l border-brand-primary/30 pl-8 opacity-40 hover:opacity-100 transition-opacity">
                <div className="absolute w-3 h-3 bg-brand-primary rounded-full -left-[6.5px] top-0"></div>
                <h3 className="text-xl font-bold text-white mb-4">Phase 3: Skalierung</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">
                   Export des validierten Ökosystems als Blaupause in den gesamten DACH-Markt. Relevanz spezialisierter Anbieter für Flächentests.
                </p>
              </div>
            </div>
        </div>
      </Section>

      {/* 4.4 & 4.6 Pricing Tiers */}
      <Section containerClassName="py-24 relative z-10">
        <div className="text-center mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-brand-primary mb-8 block opacity-80">4.4 & 4.6 Katalog</span>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 tracking-tighter uppercase">Wertbasiertes B2B-SaaS</h2>
          <p className="text-xl text-zinc-400 font-light tracking-wide max-w-2xl mx-auto">
            Dem Bildungsträger gezieltes Skalieren erlauben und Eintrittsbarrieren niedrig halten.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Tier 3 */}
          <div className="flex flex-col p-10 relative group rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl hover:bg-white/[0.04] transition-all duration-700">
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-4 block">Tier 3</span>
            <h3 className="text-3xl font-bold font-serif text-white mb-4 tracking-tight uppercase">Startup / Pilot</h3>
            <p className="text-zinc-400 font-light text-sm mb-8 leading-relaxed h-[60px]">Kleine, Private Bildungseinrichtungen. Fokus auf spezifische Lehrbereiche.</p>
            <div className="mb-10">
              <span className="text-4xl font-black text-white tracking-tighter block mb-2">~€ 1.500<span className="text-sm font-light text-zinc-500 ml-2">p.a. Basis</span></span>
              <span className="text-xl text-brand-primary block">+ € 18,00<span className="text-sm text-zinc-500 ml-2">pro User/Monat</span></span>
            </div>
            <ul className="space-y-4 flex-grow mb-12">
              <li className="flex gap-3"><CheckCircleIcon className="w-4 h-4 text-zinc-500" /><span className="text-sm text-zinc-400">Cloud-SaaS Modell</span></li>
              <li className="flex gap-3"><CheckCircleIcon className="w-4 h-4 text-zinc-500" /><span className="text-sm text-zinc-400">Pay-as-you-go Struktur</span></li>
              <li className="flex gap-3"><CheckCircleIcon className="w-4 h-4 text-zinc-500" /><span className="text-sm text-zinc-400">Geringste initiale Hürden</span></li>
            </ul>
             <button className="w-full py-4 text-[10px] uppercase tracking-[0.4em] font-black rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors">
              Details Ansehen
            </button>
          </div>

          {/* Tier 2 */}
          <div className="flex flex-col p-10 relative group rounded-[40px] border border-brand-primary/30 bg-brand-primary/5 backdrop-blur-3xl shadow-[0_30px_80px_rgba(212,175,55,0.15)] transform md:-translate-y-4">
             <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-brand-primary text-black text-[10px] font-black uppercase tracking-[0.5em] px-8 py-2 rounded-full shadow-glow">
              Kernmarkt
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary mb-4 block mt-4">Tier 2</span>
            <h3 className="text-3xl font-bold font-serif text-white mb-4 tracking-tight uppercase">Mittelgroß / FHs</h3>
            <p className="text-zinc-400 font-light text-sm mb-8 leading-relaxed h-[60px]">Spezialisierte FHs & Akademien. Fokus auf akademischen BFSG-Compliance-Nachweis.</p>
            <div className="mb-10">
              <span className="text-4xl font-black text-white tracking-tighter block mb-2">~€ 3.000<span className="text-sm font-light text-zinc-500 ml-2">p.a. Basis</span></span>
              <span className="text-xl text-brand-primary block">+ € 12,50<span className="text-sm text-zinc-500 ml-2">pro User/Monat</span></span>
            </div>
            <ul className="space-y-4 flex-grow mb-12">
              <li className="flex gap-3"><CheckCircleIcon className="w-4 h-4 text-brand-primary" /><span className="text-sm text-zinc-300">Cloud-SaaS (Option Edge +25%)</span></li>
              <li className="flex gap-3"><CheckCircleIcon className="w-4 h-4 text-brand-primary" /><span className="text-sm text-zinc-300">Compliance-Audit-Report Add-on</span></li>
              <li className="flex gap-3"><CheckCircleIcon className="w-4 h-4 text-brand-primary" /><span className="text-sm text-zinc-300">Hohe Skalierungseffekte</span></li>
            </ul>
             <button className="w-full py-4 text-[10px] uppercase tracking-[0.4em] font-black rounded-full bg-brand-primary text-black hover:bg-white transition-colors shadow-glow">
              Empfehlung
            </button>
          </div>

          {/* Tier 1 */}
          <div className="flex flex-col p-10 relative group rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl hover:bg-white/[0.04] transition-all duration-700">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-4 block">Tier 1</span>
            <h3 className="text-3xl font-bold font-serif text-white mb-4 tracking-tight uppercase">Enterprise</h3>
            <p className="text-zinc-400 font-light text-sm mb-8 leading-relaxed h-[60px]">Universitäten & große FHs (&gt;500 Nutzer). Höchste Anforderungen an Datenhoheit.</p>
             <div className="mb-10">
              <span className="text-4xl font-black text-white tracking-tighter block mb-2">TCO<span className="text-sm font-light text-zinc-500 ml-2">Custom</span></span>
              <span className="text-xl text-brand-primary block">Hybrid<span className="text-sm text-zinc-500 ml-2">Edge + Cloud</span></span>
            </div>
            <ul className="space-y-4 flex-grow mb-12">
              <li className="flex gap-3"><CheckCircleIcon className="w-4 h-4 text-zinc-500" /><span className="text-sm text-zinc-400">Maßgeschneidertes Ökosystem</span></li>
              <li className="flex gap-3"><CheckCircleIcon className="w-4 h-4 text-zinc-500" /><span className="text-sm text-zinc-400">Vollständige Integration</span></li>
              <li className="flex gap-3"><CheckCircleIcon className="w-4 h-4 text-zinc-500" /><span className="text-sm text-zinc-400">Dedizierter Support & Wartung</span></li>
            </ul>
            <button className="w-full py-4 text-[10px] uppercase tracking-[0.4em] font-black rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors">
              Sales Kontaktieren
            </button>
          </div>
        </div>
      </Section>

      {/* 4.4.1 Ökonomie & 4.5 Architektur */}
      <Section containerClassName="py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
           <div className="glass-dark p-12 rounded-[40px] border border-white/5 border-l-brand-primary/40">
              <h3 className="text-2xl font-serif text-white mb-6 uppercase">4.4.1 Die Ökonomie pro Studierendem</h3>
              <p className="text-zinc-400 font-light text-sm leading-relaxed mb-6">
                Beispielrechnung für eine FH mit 300 aktiven Studierenden im ersten Jahr:
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-zinc-500 text-sm">Basis-Kosten (Campus)</span><span className="text-white">€ 2.250 p.a.</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-zinc-500 text-sm">Nutzung (€ 12,50 × 12 Mon)</span><span className="text-white">€ 150,00 p.a.</span>
                </div>
                <div className="flex justify-between font-bold text-brand-primary pt-2">
                   <span>Gesamtkosten/Studi</span><span>€ 157,50 / Jahr</span>
                </div>
              </div>
              <div className="bg-brand-primary/10 p-6 rounded-2xl border border-brand-primary/20">
                <p className="text-brand-primary text-sm font-light">
                  <strong className="block mb-1">Strategisches Fazit:</strong>
                  Erwarteter ROI &gt;90%. Die Investition amortisiert sich bereits durch Einsparung weniger physischer Simulationsstunden (&gt; € 60/Std.) sowie die Vermeidung von BFSG-Bußgeldern. Es ist eine sichernde Investition.
                </p>
              </div>
           </div>

           <div className="glass-dark p-12 rounded-[40px] border border-white/5 border-r-brand-primary/40">
              <h3 className="text-2xl font-serif text-white mb-6 uppercase">4.5 Architekturmodelle</h3>
              <p className="text-zinc-400 font-light text-sm leading-relaxed mb-8">
               Drei flexible Implementierungsstrategien nach IT-Sicherheitsbedarf:
              </p>
              <div className="flex flex-col gap-6">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h4 className="text-white font-bold mb-1">Cloud-SaaS</h4>
                  <p className="text-zinc-500 text-xs">Mittlere/Große FHs. Niedriger CAPEX. Vorhersehbarer OPEX. Sofort verfügbar.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h4 className="text-white font-bold mb-1">Edge On-Premise</h4>
                  <p className="text-zinc-500 text-xs">Akademien mit hohem Bedarf an Datenschutz. Hoher CAPEX. Full Air-Gap: DSGVO-Goldstandard.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h4 className="text-white font-bold mb-1">Hybrid</h4>
                  <p className="text-zinc-500 text-xs">Großinstitutionen. Variabler OPEX. Kernlogik lokal (Edge) + Skalierung über Cloud API.</p>
                </div>
              </div>
           </div>
        </div>
      </Section>
    </div>
  );
};

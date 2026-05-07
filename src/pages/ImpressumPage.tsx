import React from 'react';
import { Section } from '../components/Section';

export const ImpressumPage: React.FC = () => {
  return (
    <div className="animate-fadeInUp bg-black min-h-screen pt-40 pb-32 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
         <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
      </div>

      <Section
        title="Impressum"
        subtitle="Gesetzliche Anbieterkennzeichnung"
        containerClassName="py-0 relative z-10"
      >
        <div className="max-w-4xl mx-auto glass-dark !p-12 md:!p-20 border-white/5 rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] space-y-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">Angaben gemäß § 5 TMG</h2>
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-lg">
              Sascha Lagler (Beispiel)<br />
              Körperfluss<br />
              Musterstraße 1<br />
              12345 Musterstadt<br />
              Österreich
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">Kontakt</h2>
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-lg">
              Telefon: +43 123 456789 (Beispiel)<br />
              E-Mail: info@koerperfluss.at (Beispiel)
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">Umsatzsteuer-ID</h2>
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-lg">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              ATU12345678 (Beispiel)
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">Redaktionell verantwortlich</h2>
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-lg">
              Sascha Lagler<br />
              Anschrift wie oben
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">EU-Streitschlichtung</h2>
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-lg">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:text-white transition-colors underline decoration-brand-primary/30 underline-offset-8">https://ec.europa.eu/consumers/odr/</a>.<br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-white tracking-tight">Verbraucherstreitbeilegung</h2>
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-lg">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

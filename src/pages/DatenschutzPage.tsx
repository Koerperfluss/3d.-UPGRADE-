import React from 'react';
import { Section } from '../components/Section';

export const DatenschutzPage: React.FC = () => {
  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-40 pb-32 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
         <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
      </div>

      <Section
        title="Datenschutzerklärung"
        subtitle="Wir nehmen den Schutz Ihrer Daten ernst."
        containerClassName="py-0 relative z-10"
      >
        <div className="max-w-4xl mx-auto glass-dark !p-12 md:!p-20 border-white/5 rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] space-y-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-serif text-white tracking-tight">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-xl font-bold text-brand-primary uppercase tracking-[0.2em] mb-4">Allgemeine Hinweise</h3>
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-lg">Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.</p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-serif text-white tracking-tight">2. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="text-xl font-bold text-brand-primary uppercase tracking-[0.2em] mb-4">Datenschutz</h3>
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-lg">Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-lg">Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Diese Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.</p>
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-lg">Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.</p>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-serif text-white tracking-tight">3. Datenerfassung auf dieser Website</h2>
            <h3 className="text-xl font-bold text-brand-primary uppercase tracking-[0.2em] mb-4">Cookies</h3>
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-lg">Unsere Internetseiten verwenden so genannte „Cookies“. Cookies sind kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch Ihren Webbrowser erfolgt.</p>
          </div>
          
          <div className="space-y-6">
             <h3 className="text-xl font-bold text-brand-primary uppercase tracking-[0.2em] mb-4">Kontaktformular</h3>
            <p className="text-zinc-400 font-light leading-relaxed tracking-wide text-lg">Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
          </div>
          
           <div className="p-10 glass border border-brand-primary/20 rounded-[40px] shadow-glow">
            <p className="text-zinc-400 font-light italic tracking-wide">
              Dies ist ein Platzhaltertext. Eine vollständige, rechtssichere Datenschutzerklärung sollte von einem juristischen Experten oder mithilfe eines Datenschutz-Generators erstellt werden.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

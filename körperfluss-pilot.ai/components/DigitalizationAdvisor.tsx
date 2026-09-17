import React, { useState, useCallback } from 'react';
import { FundingNode } from '../types';
import { generateText } from '../services/geminiService';
import { SparklesIcon, ArrowPathIcon, DocumentTextIcon, ChartBarIcon, RocketLaunchIcon, UserGroupIcon, LightBulbIcon, InformationCircleIcon } from './Icons';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface DigitalizationAdvisorProps {
  projectNode: FundingNode | null;
}

const EXAMPLE_PARTNER_DESCRIPTION = `Ein potenzieller Partner ist eine Kette von Physiotherapie-Praxen in Österreich. 
- 15 Standorte
- Fokus auf postoperative Rehabilitation und Sportverletzungen
- Aktuelle Software ist veraltet (Terminplanung und Patientendokumentation)
- Wenig digitale Interaktion mit Patienten außerhalb der Praxis
- Interesse an evidenzbasierten Methoden und Qualitätssteigerung`;

const DigitalizationAdvisor: React.FC<DigitalizationAdvisorProps> = ({ projectNode }) => {
  const [partnerDescription, setPartnerDescription] = useState(EXAMPLE_PARTNER_DESCRIPTION);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleAnalyze = useCallback(async () => {
    if (!projectNode || !partnerDescription) return;

    setIsLoading(true);
    setResponse('');

    const context = `
      KONTEXT:
      Du bist ein strategischer Berater für das Health-Tech Startup "Projekt Körperfluss".
      Die Kernidee des Startups ist: "${projectNode.details.description}".
      Das Ziel ist: "${projectNode.details.purpose}".

      AUFGABE:
      Analysiere das Potenzial für eine Digitalisierungspartnerschaft mit dem folgenden Unternehmen. 
      Evaluiere, welche konkreten Dienstleistungen oder Produkte "Projekt Körperfluss" anbieten kann, um deren Geschäft zu digitalisieren und zu verbessern.
      
      PARTNERBESCHREIBUNG:
      ---
      ${partnerDescription}
      ---
      
      ANWEISUNGEN:
      - Antworte als erfahrener Digitalisierungs- und Unternehmensberater.
      - Gib eine klare, strukturierte und handlungsorientierte Analyse auf Deutsch.
      - Formatiere deine Antwort mit Markdown (Überschriften, Listen, Fett).
      - Gliedere die Antwort in die folgenden Abschnitte:
        1.  **Zusammenfassung des Potenzials:** Kurze Einschätzung der Synergien.
        2.  **Konkrete Anknüpfungspunkte:** Wo hat der Partner die größten digitalen "Schmerzen"?
        3.  **Lösungsvorschläge durch "Projekt Körperfluss":** Welche Module/Features eurer Plattform helfen hier konkret?
        4.  **Strategische Vorteile für beide Seiten:** Was ist der Win-Win?
        5.  **Nächste Schritte:** Konkrete Handlungsempfehlungen für das erste Gespräch.
    `;

    try {
        const result = await generateText(context);
        setResponse(result);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        setResponse("Es ist ein Fehler bei der Analyse aufgetreten. Bitte versuchen Sie es später erneut.");
    } finally {
        setIsLoading(false);
    }
  }, [projectNode, partnerDescription]);

  if (!projectNode) {
      return (
        <div className="h-full flex items-center justify-center p-8 text-center bg-transparent">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 backdrop-blur-3xl p-12 rounded-sm border border-white/10 max-w-md shadow-2xl"
          >
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white/20 mx-auto mb-6">
                <InformationCircleIcon className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-serif italic text-white tracking-tight">Projekt_wählen</h4>
            <p className="text-white/40 font-mono text-xs mt-4 leading-relaxed uppercase tracking-wider">Bitte wählen Sie ein Projekt im Dashboard aus, um die Digitalisierungs-Analyse zu starten.</p>
          </motion.div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-transparent p-6 space-y-6 overflow-hidden">
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-3xl p-8 rounded-sm border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-brand-primary">
            <ChartBarIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl font-serif italic text-white tracking-tight">Digitalisierungs_Check</h3>
            <p className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mt-1">Partnership Potential Analysis • Loki v2.5</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-sm">
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-lg shadow-brand-primary/50" />
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Aktiv: {projectNode.label}</span>
        </div>
      </motion.header>

      <main className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <h4 className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-3">
                <UserGroupIcon className="w-5 h-5 text-brand-primary" />
                Partner_Kundenprofil
              </h4>
              <motion.button 
                whileHover={{ y: -1, color: "var(--brand-primary)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPartnerDescription(EXAMPLE_PARTNER_DESCRIPTION)}
                className="text-[10px] font-mono text-white/20 uppercase tracking-widest transition-all"
              >
                Beispiel_laden
              </motion.button>
            </div>
            <div className="relative group">
              <textarea
                id="partner-description"
                value={partnerDescription}
                onChange={(e) => setPartnerDescription(e.target.value)}
                placeholder="Beschreiben Sie hier den potenziellen Partner, seine Herausforderungen und Ziele..."
                className="w-full h-64 px-8 py-8 bg-white/5 border border-white/10 rounded-sm text-white font-mono text-sm focus:ring-1 focus:ring-brand-primary/40 focus:border-brand-primary/40 focus:outline-none transition-all resize-none shadow-2xl placeholder:text-white/20"
                disabled={isLoading}
              />
              <div className="absolute bottom-6 right-6">
                <motion.button 
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnalyze} 
                  disabled={isLoading || !partnerDescription.trim()} 
                  className="px-10 py-4 bg-brand-primary text-white rounded-sm flex items-center gap-3 shadow-xl shadow-brand-primary/20 disabled:bg-white/5 disabled:text-white/20 disabled:shadow-none transition-all"
                >
                  {isLoading ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    <SparklesIcon className="w-5 h-5" />
                  )}
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Analyse_starten</span>
                </motion.button>
              </div>
            </div>
          </motion.section>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-16 bg-black/40 border border-white/10 rounded-sm flex flex-col items-center justify-center space-y-8 shadow-2xl"
              >
                <div className="relative">
                    <div className="w-16 h-16 border border-white/5 border-t-brand-primary rounded-full animate-spin" />
                    <ChartBarIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-primary animate-pulse" />
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-serif italic text-white tracking-tight">Strategische Analyse läuft</h4>
                  <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-2">Loki evaluiert Synergie-Potenziale</p>
                </div>
              </motion.div>
            ) : response && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 px-2">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-brand-primary">
                    <LightBulbIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Analyseergebnis</h4>
                </div>
                
                <div className="bg-black/40 border border-white/10 p-12 rounded-sm shadow-2xl">
                  <div className="prose prose-invert max-w-none prose-p:text-white/60 prose-p:text-xs prose-p:font-mono prose-p:leading-relaxed prose-strong:text-brand-primary prose-strong:font-mono prose-strong:font-bold prose-h2:text-xl prose-h2:font-serif prose-h2:italic prose-h2:text-white prose-h2:tracking-tight prose-h2:mt-10 prose-h2:mb-6 prose-ul:space-y-3 prose-li:text-white/60 prose-li:text-xs prose-li:font-mono">
                    <ReactMarkdown>{response}</ReactMarkdown>
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <motion.button 
                    whileHover={{ y: -1, color: "white" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setResponse('')}
                    className="px-10 py-4 bg-white/5 border border-white/10 text-white/40 rounded-sm text-[10px] font-mono uppercase tracking-widest hover:bg-white/10 transition-all shadow-sm"
                  >
                    Neue_Analyse
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default DigitalizationAdvisor;

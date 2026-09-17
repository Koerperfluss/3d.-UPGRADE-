
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { FundingNode, FundingLink } from '../types';
import { generateText } from '../services/geminiService';
import { 
  SparklesIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  LightBulbIcon,
  DocumentTextIcon,
  InformationCircleIcon
} from './Icons';

interface AIAdvisorProps {
  nodes: FundingNode[];
  links: FundingLink[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ nodes, links }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('Basierend auf der aktuellen Situation, was sind die drei größten Risiken für Phase 1 und wie kann ich sie mitigieren?');
  const [response, setResponse] = useState('');

  const handleAskAI = useCallback(async (overrideQuestion?: string) => {
    setIsLoading(true);
    setResponse('');
    
    const currentQuestion = overrideQuestion || question;

    const cleanNodes = nodes.map(({ id, label, type, status, group, details }) => ({
      id,
      label,
      type,
      status,
      group,
      details: {
        description: details.description,
        amount: details.amount,
        timeline: details.timeline,
        requirements: details.requirements,
        purpose: details.purpose
      }
    }));

    const simplifiedLinks = links.map(link => ({
        source: typeof link.source === 'object' ? link.source.id : link.source,
        target: typeof link.target === 'object' ? link.target.id : link.target,
        type: link.type,
    }));
    
    const context = `
      <SYSTEM_ROLE>
      Du bist Loki, ein hochkritischer, analytischer Förder-Stratege für Startups in Österreich. 
      Dein Fokus liegt auf harter Realität, Risikominimierung und maximaler Hebelwirkung.
      Deine Antworten sind extrem präzise, handlungsorientiert (ADHS-freundlich) und beziehen sich strikt auf die bereitgestellten Daten.
      </SYSTEM_ROLE>

      <CONTEXT>
      Ich bin ein KI-Startup in Österreich namens "Projekt Körperfluss". 
      Wir entwickeln ein KI-gestütztes Ausbildungstool für Physiotherapie.
      </CONTEXT>
      
      <DATA>
      GRAPH_NODES (Die Elemente meines Ökosystems):
      ${JSON.stringify(cleanNodes, null, 2)}
      
      GRAPH_LINKS (Die Beziehungen/Abhängigkeiten):
      ${JSON.stringify(simplifiedLinks, null, 2)}
      </DATA>
      
      <USER_QUERY>
      ${currentQuestion}
      </USER_QUERY>
      
      <GUIDELINES>
      1. ANALYSE: Identifiziere sofort Blocker und kritische Pfade (z.B. 'action_required', 'prerequisite').
      2. LOGIK: Wenn nach nächsten Schritten gefragt wird, nenne nur die 1-2 wichtigsten, sofort umsetzbaren Aktionen.
      3. FORMAT: Nutze Markdown. Verwende Emojis für visuelle Struktur (z.B. 🎯 Ziel, 🚧 Blocker, 👣 Schritte).
      4. TONALITÄT: Direkt, pragmatisch, ohne Füllwörter (BLUF - Bottom Line Up Front).
      5. BEZUG: Referenziere explizit die Namen der Knoten aus den Daten.
      6. RISIKEN: Wenn die Frage auf Risiken abzielt, konzentriere die Analyse auf die wichtigsten drei Risiken und deren konkrete Minderungsstrategien.
      </GUIDELINES>
    `;
    
    try {
      const result = await generateText(context, true, true);
      setResponse(result);
    } catch (error) {
      console.error("AI Advisor Error:", error);
      setResponse("Entschuldigung, bei der Analyse ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setIsLoading(false);
    }
  }, [nodes, links, question]);

  const handleSummarize = () => {
      const summaryPrompt = "Bitte fasse die aktuelle Fördersituation (Knoten und Links) in einer prägnanten, strategisch relevanten Textbeschreibung zusammen. Fokus auf den aktuellen Status, wichtige Abhängigkeiten und die nächsten strategischen Schritte.";
      setQuestion(summaryPrompt);
      handleAskAI(summaryPrompt);
  };

  const handleSuggestFunding = () => {
      const suggestPrompt = "Basierend auf der Nutzerhistorie und dem aktuellen Projektkontext ('Körperfluss' - KI-gestütztes Ausbildungstool für Physiotherapie), schlage proaktiv 3-5 konkrete Förderprogramme vor, die für das Projekt relevant sein könnten, aber noch nicht im Graph existieren. Zeige sie als Liste mit kurzer Begründung an.";
      setQuestion(suggestPrompt);
      handleAskAI(suggestPrompt);
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-black font-mono font-bold rounded-sm shadow-xl hover:bg-brand-accent/90 transition-all uppercase text-[10px] tracking-widest"
      >
        <SparklesIcon className="w-4 h-4" />
        <span>AI_ADVISOR_M4</span>
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-3xl bg-black/90 backdrop-blur-3xl rounded-sm border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-mono"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-accent/20 text-brand-accent rounded-sm flex items-center justify-center border border-brand-accent/30">
                    <SparklesIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif italic text-white">STRATEGIC_AI_ADVISOR</h3>
                    <p className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest">Loki v2.5 • ANALYTICAL_STRATEGY_ENGINE</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-1.5 hover:bg-white/10 rounded-sm transition-colors border border-white/5"
                >
                  <XMarkIcon className="w-5 h-5 text-white/30 hover:text-white" />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-4 space-y-4 flex-grow overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label htmlFor="ai-question" className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest">QUERY_INPUT</label>
                  <div className="relative">
                    <textarea
                      id="ai-question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="ENTER_STRATEGIC_QUERY..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-sm text-[10px] font-mono text-white focus:ring-1 focus:ring-brand-accent outline-none transition-all min-h-[80px] resize-none uppercase tracking-wider"
                      disabled={isLoading}
                    />
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAskAI()}
                        disabled={isLoading || !question.trim()}
                        className="p-1.5 bg-brand-accent text-black rounded-sm shadow-lg disabled:bg-white/10 disabled:text-white/20 transition-all"
                      >
                        <PaperAirplaneIcon className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleSummarize} 
                    disabled={isLoading} 
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white/60 rounded-sm text-[9px] font-mono font-bold hover:bg-white/10 border border-white/5 transition-all disabled:opacity-50 uppercase tracking-widest"
                  >
                    <DocumentTextIcon className="w-3.5 h-3.5" />
                    SUMMARY
                  </button>
                  <button 
                    onClick={handleSuggestFunding} 
                    disabled={isLoading} 
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 text-white/60 rounded-sm text-[9px] font-mono font-bold hover:bg-white/10 border border-white/5 transition-all disabled:opacity-50 uppercase tracking-widest"
                  >
                    <LightBulbIcon className="w-3.5 h-3.5" />
                    PROACTIVE_SUGGESTIONS
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex flex-col items-center justify-center py-10 space-y-3"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 border border-brand-accent/20 border-t-brand-accent rounded-sm animate-spin"></div>
                        <SparklesIcon className="absolute inset-0 m-auto w-4 h-4 text-brand-accent animate-pulse" />
                      </div>
                      <p className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest animate-pulse">ANALYZING_GRAPH_DATA...</p>
                    </motion.div>
                  ) : response ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 p-4 rounded-sm border border-white/10"
                    >
                      <div className="prose prose-invert prose-xs max-w-none font-mono text-[10px] text-white/70 leading-relaxed prose-strong:text-brand-accent prose-strong:font-bold">
                        <ReactMarkdown>{response}</ReactMarkdown>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
              
              {/* Footer */}
              <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex items-center gap-3">
                <InformationCircleIcon className="w-3 h-3 text-white/20" />
                <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">
                  AI_GENERATED_STRATEGY • VERIFY_CRITICALLY • TIMESTAMP: {new Date().toLocaleDateString('de-DE')}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAdvisor;


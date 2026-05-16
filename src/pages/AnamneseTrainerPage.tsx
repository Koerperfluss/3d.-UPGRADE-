import React, { useState, useRef, useEffect } from 'react';
import { generateClinicalContent } from '../services/aiService';
import { safetyGuard } from '../services/safetyGuard';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { 
  RobotIcon, 
  MicrophoneIcon, 
  StopIcon, 
  BrainCircuitIcon, 
  CheckCircleIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  SparklesIcon,
  DownloadIcon,
  WarningIcon
} from '../components/IconComponents';
import { SHOWCASE_CASES, simulateLmsExport, downloadAsPdf } from '../utils/demoFeatures';
import { useClinicalContext } from '../context/ClinicalContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isAudio?: boolean;
}

export const AnamneseTrainerPage: React.FC = () => {
  const { visionData, addCotStep, updateCotStep, setCotMode } = useClinicalContext();

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hallo! Ich bin LUMI. Bitte schildere mir deinen Patientenfall. Wie genau kann ich dir helfen, ohne die Lösung vorwegzunehmen?' }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Phase 2: Hypothesis
  const [hypothesisInput, setHypothesisInput] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isBugSprint, setIsBugSprint] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Stepper state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showToast, setShowToast] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
     // Auto-enable CoT for demo
     setCotMode(true);
  }, []);

  useEffect(() => {
    const handleDemo = () => {
      // automatically populate the Anamnesetrainer
      if (messages.length === 1) {
         loadDemoCase();
      }
    };
    window.addEventListener('demo-step-anamnese-trainer', handleDemo);
    return () => window.removeEventListener('demo-step-anamnese-trainer', handleDemo);
  }, [messages]);

  const loadDemoCase = () => {
    const showcase = SHOWCASE_CASES.LWS_ANAMNESE;
    setMessages([
      { role: 'assistant', content: 'Hallo! Ich bin LUMI. Bitte schildere mir deinen Patientenfall.' },
      { 
        role: 'user', 
        content: showcase.title + "\n\n" + 
          Object.entries(showcase.slots)
            .map(([k, v]) => `* ${k}: ${v}`)
            .join('\n')
      },
      { role: 'assistant', content: 'Ich habe genug Informationen gesammelt. Bitte formuliere nun deine klinische Hypothese (Ursache -> Pathomechanismus -> Symptom).' }
    ]);
    
    addCotStep({
        phase: 'Parsing',
        description: 'LUMI hat demografische Daten (Alter, Beruf) und Hauptbeschwerde (LWS) in den internen Knowledge-Graph extrahiert.',
        confidence: 0.98,
        status: 'complete'
    });

    setCurrentStep(2);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);

    let stepId = addCotStep({
        phase: 'Parsing',
        description: 'Analysiere studentische Anfrage (Sokratik-Modus)...',
        confidence: 0,
        status: 'active'
    });

    try {
      const history = messages.map(m => `${m.role === 'user' ? 'Student' : 'Bot'}: ${m.content}`).join('\n');
      
      const prompt = `
        Du bist der "LUMI" Bot (Digitaler Mentor). Der Student exploriert einen klinischen Fall im "Exploration-Modus".
        Regeln für dich:
        - Reagiere STRENG sokratisch. Keine direkte Hilfe bei vagen Fragen!
        - Zwinge den Studenten, präzise nach Red Flags, Schmerzcharakter, etc. zu fragen.
        - Gib keine Diagnosen vor.
        - Wenn du meinst, er hat genug systematisch erfragt (oder wenn er explizit nach Hypothesenbildung fragt), antworte EXAKT mit dem Satz: "Ich habe genug Informationen gesammelt. Bitte formuliere nun deine klinische Hypothese (Ursache -> Pathomechanismus -> Symptom)."
        
        Klinischer Kontext aus dem Skills Lab (Sensordaten/Ganganalyse):
        ${visionData ? JSON.stringify(visionData) : "Keine vorherigen Skills Lab Daten vorhanden."}
        
        Verlauf:
        ${history}
        
        Eingabe des Studenten:
        ${userMessage}
      `;

      const response = await generateClinicalContent(prompt, 'gemini-3.1-pro-preview');
      const botReply = response.text || "Bitte präsiziere deine Frage.";

      updateCotStep(stepId, {
          description: botReply.includes("Ursache -> Pathomechanismus") ? 
             "LUMI identifiziert, dass genug anamnestische Daten erhoben wurden. Wechsel zur Hypothesen-Ebene." :
             "LUMI generiert sokratische Gegenfrage zur gezielten Führung des Clinical Reasonings.",
          confidence: 0.90,
          status: 'complete'
      });

      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);

      if (botReply.includes("Hypothese (Ursache -> Pathomechanismus -> Symptom)")) {
        setCurrentStep(2);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      updateCotStep(stepId, {
          description: 'LLM Error bei Sokratik-Generierung.',
          confidence: 0,
          status: 'error'
      });
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ein Analyse-Fehler ist aufgetreten.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHypothesisSubmit = async () => {
    if (!hypothesisInput.trim()) return;
    setIsProcessing(true);
    
    try {
      // 1. Safety Guard Check with CoT Dispatch
      const guardResult = await safetyGuard.validateHypothesis(hypothesisInput, addCotStep, updateCotStep);
      
      let evalStepId = addCotStep({
          phase: 'Logik-Check',
          description: 'Überprüfung der didaktischen Kausalkette (Ursache -> Pathomech -> Symptom)...',
          confidence: 0,
          status: 'active'
      });

      // 2. AI Reasoning Evaluation
      const prompt = `
        Bewerte folgende studentische Hypothese für einen LWS-Fall:
        "${hypothesisInput}"
        Nutze strenges Deep Reasoning (Chain of Thought).
        Antworte im JSON-Format:
        {
          "isValid": boolean (true wenn die Kausalkette grob stimmt, false bei gefährlichen Behandlungsfehlern oder falschen Annahmen),
          "feedback": "string",
          "isCriticalBug": boolean (true wenn z.B. bei Fraktur/Tumorverdacht manipulativ behandelt werden soll)
        }
      `;
      const response = await generateClinicalContent(prompt, 'gemini-3.1-pro-preview', { responseMimeType: "application/json" });
      const analysis = JSON.parse(response.text || "{}");

      updateCotStep(evalStepId, {
          description: analysis.isCriticalBug ? 
              "Kritischer Denkfehler (Red Flag Violation) in der Kausalkette erkannt. Bug-Sprint wird getriggert." : 
              (analysis.isValid ? "Kausalkette biomechanisch und klinisch konsistent." : "Hypothese weist logische Lücken auf."),
          confidence: 0.95,
          status: analysis.isCriticalBug ? 'error' : 'complete'
      });

      const finalFeedback = guardResult.isSafe ? analysis.feedback : guardResult.feedback;
      
      if (!guardResult.isSafe) {
          addCotStep({
              phase: 'MDR-Filter',
              description: 'Hypothese wurde aufgrund mangelnder Leitlinien-Evidenz (S3) vom Safety Guard blockiert.',
              confidence: 1.0,
              status: 'error'
          });
      }

      setEvaluation({
        ...analysis,
        feedback: finalFeedback,
        logs: guardResult.logs
      });

      if (analysis.isCriticalBug) {
        setIsBugSprint(true);
        setCurrentStep(3);
      } else if (analysis.isValid) {
        setCurrentStep(3);
      }
    } catch (error) {
      console.error("Evaluation Error");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInput("Ich vermute eine lumbale Instabilität. Können wir die Hypothese bilden?");
      }, 2000);
    }
  };

  const steps = [
    { num: 1, title: 'Exploration' },
    { num: 2, title: 'Hypothese' },
    { num: 3, title: 'Bug-Sprint' }
  ];

  return (
    <div className="min-h-screen bg-transparent pt-8 pb-20 relative font-sans text-white">
      {/* Toast */}
      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[200] bg-brand-success/90 border border-brand-success text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.3)] flex items-center gap-3 backdrop-blur-md"
        >
          <CheckCircleIcon className="w-6 h-6" />
          <span className="text-sm font-bold tracking-wide">Report wurde exportiert! (LTI 1.3 Sync)</span>
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-bold font-serif uppercase tracking-tight mb-2">Clinical Reasoning <span className="text-brand-primary lowercase font-light italic">Hub</span></h1>
            <p className="text-zinc-500 font-light text-xl">3-Phasen-Simulation nach dem Masterplan Model.</p>
          </div>
          {/* Stepper UI */}
          <div className="flex items-center gap-4">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className={`flex flex-col items-center gap-1 ${currentStep >= step.num ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-colors ${currentStep >= step.num ? 'bg-[#C9A84C] border-[#C9A84C] text-black shadow-glow' : 'border-white/20 text-white/50'}`}>
                    {step.num}
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-center">{step.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-12 h-[2px] transition-colors ${currentStep > step.num ? 'bg-[#C9A84C]' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Sokratischer Mentor Sidebar */}
          <div className="lg:col-span-3 space-y-6">
             <Card className="p-6 bg-brand-primary/5 border border-brand-primary/20 h-full">
               <div className="flex items-center gap-3 mb-6">
                 <AcademicCapIcon className="w-6 h-6 text-brand-primary" />
                 <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary">Digitaler Mentor</h3>
               </div>
               <p className="text-xs text-white/60 mb-6 leading-relaxed">
                 Explorations-Modus aktiv. Ich gebe keine direkten Antworten, sondern führe dich sokratisch durch die Befunderhebung.
               </p>
             </Card>
          </div>

          {/* Main Area based on Step */}
          <div className="lg:col-span-9 h-[600px] flex flex-col">
            {currentStep === 1 && (
              <Card className="flex flex-col h-full bg-black/40 border-white/5 relative z-10 transition-all duration-500 hover:border-white/10">
                <div className="flex justify-between items-center mb-6 pl-6 pt-6 pr-6">
                  <h3 className="text-xl font-bold font-serif flex items-center gap-2 uppercase tracking-tight">
                    <RobotIcon className="w-6 h-6 text-brand-primary" /> LUMI Dialog
                  </h3>
                  <Button onClick={loadDemoCase} variant="outline" size="sm" className="text-[10px] py-2 border-white/10 bg-white/5 hover:bg-white/10 shadow-lg flex items-center gap-2 text-brand-primary">
                    <SparklesIcon className="w-4 h-4" /> Demo
                  </Button>
                </div>
                <div className="flex-grow overflow-y-auto px-6 pb-6 space-y-4 custom-scrollbar">
                  {messages.map((msg, i) => (
                    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-brand-primary text-black rounded-br-sm font-medium' : 'bg-white/5 text-white rounded-bl-sm border border-white/10'} shadow-sm`}>
                        <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.content }} />
                      </div>
                    </motion.div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 p-4 rounded-2xl rounded-bl-sm border border-white/10">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest animate-pulse">Denkt nach...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-white/5 bg-black/60 rounded-b-3xl">
                  <div className="flex gap-2">
                    <button 
                      onClick={toggleRecording}
                      aria-label={isRecording ? "Aufnahme stoppen" : "Sprachaufnahme starten"}
                      tabIndex={0}
                      className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse border border-red-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'}`}
                    >
                      {isRecording ? <StopIcon className="w-5 h-5" aria-hidden="true" /> : <MicrophoneIcon className="w-5 h-5" aria-hidden="true" />}
                    </button>
                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Stelle eine präzise sokratische Frage..."
                      aria-label="Nachricht an den digitalen Mentor"
                      tabIndex={0}
                      className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-primary/50 text-white placeholder-white/30 transition-colors"
                      disabled={isRecording || isProcessing}
                    />
                    <Button onClick={handleSend} disabled={!input.trim() || isProcessing} variant="primary" className="px-6 rounded-xl" aria-label="Nachricht senden" tabIndex={0}>Senden</Button>
                  </div>
                </div>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="p-8 h-full bg-brand-primary/5 border border-brand-primary/20 animate-fadeInUp flex flex-col">
                <h3 className="text-2xl font-bold font-serif mb-4 flex items-center gap-3 text-white uppercase tracking-tight">
                  <BrainCircuitIcon className="w-8 h-8 text-brand-primary" />
                  Hypothesen-Editor
                </h3>
                <p className="text-sm text-zinc-400 mb-6">Bitte formuliere deine klinische Argumentationskette (Ursache &rarr; Pathomechanismus &rarr; Symptom) auf Basis der gesammelten Informationen.</p>
                
                <textarea 
                  value={hypothesisInput}
                  onChange={e => setHypothesisInput(e.target.value)}
                  className="w-full flex-grow bg-black/40 border border-white/10 rounded-2xl p-6 text-white placeholder-white/30 focus:border-brand-primary/50 outline-none resize-none custom-scrollbar mb-6"
                  placeholder="Bsp: Die Hebebewegung (Ursache) hat zu einer Protrusion des Anulus fibrosus (Pathomechanismus) geführt, was die Duralscheide L5 mechanisch reizt und den Schmerz (Symptom) auslöst."
                />
                <Button onClick={handleHypothesisSubmit} disabled={!hypothesisInput.trim() || isProcessing} variant="primary" className="w-full py-4 text-xs font-black uppercase tracking-[0.2em]">
                   {isProcessing ? 'Validierung läuft...' : 'Hypothese validieren'}
                </Button>
              </Card>
            )}

            {currentStep === 3 && evaluation && (
              <Card className={`p-8 h-full animate-fadeInUp flex flex-col ${isBugSprint ? 'bg-red-500/10 border-red-500/30' : 'bg-brand-success/10 border-brand-success/30'}`}>
                <h3 className="text-2xl font-bold font-serif mb-6 flex items-center gap-3 text-white uppercase tracking-tight">
                  {isBugSprint ? <WarningIcon className="w-8 h-8 text-red-500" /> : <CheckCircleIcon className="w-8 h-8 text-brand-success" />}
                  {isBugSprint ? 'Bug-Sprint Triggered!' : 'Validierung Erfolgreich'}
                </h3>
                
                <div className="flex-grow space-y-6">
                  <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
                    <p className="text-sm text-white/80 leading-relaxed font-light">{evaluation.feedback}</p>
                  </div>

                  {evaluation.logs && evaluation.logs.length > 0 && (
                     <div className="mt-8">
                       <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-3">S3-Leitlinien Guard (Neuro-Symbolic Middleware)</h4>
                       {evaluation.logs.map((log: any, i: number) => (
                         <div key={i} className="flex gap-3 text-xs items-center bg-black/20 p-3 rounded-lg border border-white/5 mb-2">
                           <span className={log.status === 'approved' ? 'text-brand-success' : 'text-brand-primary'}>[{log.source}]</span>
                           <span className="text-white/60">{log.reasoning}</span>
                         </div>
                       ))}
                     </div>
                  )}

                  {isBugSprint && (
                    <div className="mt-8 p-6 bg-red-500/20 border border-red-500/30 rounded-2xl flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📺</span>
                      </div>
                      <h4 className="text-lg font-bold text-red-400 mb-2">Pflicht-Video: Fraktur & Red Flags LWS</h4>
                      <p className="text-xs text-red-200/80 mb-4">Die Simulation wurde unterbrochen, da eine sicherheitskritische Fehlentscheidung getroffen wurde.</p>
                      <Button variant="outline" className="border-red-500/30 text-red-400">Micro-Learning ansehen</Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-6">
                   <Button onClick={async () => {
                       await simulateLmsExport('Clinical-Reasoning-Hub');
                       setShowToast(true);
                       setTimeout(() => setShowToast(false), 3000);
                   }} variant="primary" className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest">
                       LTI Sync (Moodle)
                   </Button>
                   <Button onClick={() => window.location.reload()} variant="outline" className="flex-1 border-white/10 py-4 text-[10px] font-black uppercase tracking-widest">
                       Neuer Fall
                   </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


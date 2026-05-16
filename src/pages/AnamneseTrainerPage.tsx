import React, { useState, useRef, useEffect } from 'react';
import { generateClinicalContent } from '../services/aiService';
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
  AcademicCapIcon
} from '../components/IconComponents';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isAudio?: boolean;
}

export const AnamneseTrainerPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hallo! Ich bin der Anamnese-Bot. Bitte schildere mir den Fall deines Patienten. Du kannst tippen oder die Spracheingabe nutzen.' }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<any>(null);
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

  const loadHexenschussCase = () => {
    setMessages([
      { role: 'assistant', content: 'Hallo! Ich bin der Anamnese-Bot. Bitte schildere mir den Fall deines Patienten. Du kannst tippen oder die Spracheingabe nutzen.' },
      { 
        role: 'user', 
        content: `Name: Thomas Müller, 45 Jahre, männlich
Beschwerde: Akute Lumbago mit Ausstrahlung ins rechte Bein seit 3 Tagen
VAS Schmerzskala: 7/10
Beruf: Bürotätigkeit (8h/Tag sitzend)
(Hinweis: Red Flags wurden noch nicht dokumentiert)`
      },
      { role: 'assistant', content: 'Verstehe. Hast du bereits auf Red Flags (z.B. plötzliche Inkontinenz oder neurologische Defizite) geprüft?' }
    ]);
    setInput('Nein, das habe ich noch nicht geprüft.');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);

    try {
      const history = messages.map(m => `${m.role === 'user' ? 'Student' : 'Bot'}: ${m.content}`).join('\n');
      
      const prompt = `
        Du bist ein erfahrener Physiotherapie-Dozent, der einen Studenten im Clinical Reasoning trainiert.
        Der Student schildert einen Patientenfall.
        
        Bisheriger Verlauf:
        ${history}
        
        Neue Eingabe des Studenten:
        ${userMessage}
        
        Deine Aufgabe:
        1. Wenn noch wichtige Informationen fehlen (Red Flags, Schmerzcharakter, Dauer, Auslöser), stelle EINE gezielte Rückfrage.
        2. Wenn du genug Informationen hast, beende den Dialog mit dem exakten Satz: "Ich habe genug Informationen für eine Diagnose." und generiere im Hintergrund den Report.
        
        Antworte kurz, prägnant und im sokratischen Dialogstil (führe den Studenten, gib nicht sofort die Lösung).
      `;

      const response = await generateClinicalContent(prompt, 'gemini-2.5-flash');
      const botReply = response.text || "Ich habe das nicht ganz verstanden.";

      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);

      if (botReply.includes("Ich habe genug Informationen für eine Diagnose.")) {
        setCurrentStep(2);
        generateReport(history + "\nStudent: " + userMessage);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Entschuldigung, es gab einen technischen Fehler.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateReport = async (fullHistory: string) => {
    setIsProcessing(true);
    try {
      const prompt = `
        Basierend auf dem folgenden Anamnese-Gespräch, erstelle einen strukturierten klinischen Report.
        
        Gespräch:
        ${fullHistory}
        
        Erstelle ein JSON-Objekt mit folgender Struktur:
        {
          "hypotheses": ["Hypothese 1", "Hypothese 2"],
          "redFlags": ["Mögliche Red Flag 1", "Mögliche Red Flag 2"],
          "recommendedTests": ["Test 1", "Test 2"],
          "reasoning": "Kurze Erklärung, wie du zu diesen Schlüssen gekommen bist."
        }
      `;

      const response = await generateClinicalContent(prompt, 'gemini-2.5-flash', { responseMimeType: "application/json" });
      const reportData = JSON.parse(response.text || "{}");
      setReport(reportData);
      setCurrentStep(3);
    } catch (error) {
      console.error("Report Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInput("Er hat außerdem eine leichte Beinlängendifferenz.");
      }, 2000);
    }
  };

  const steps = [
    { num: 1, title: 'Anamnese' },
    { num: 2, title: 'Hypothesen' },
    { num: 3, title: 'ICF-Assessment' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-brand-background text-white pt-24 pb-20 relative">
      {/* Success Toast */}
      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[200] bg-brand-success/90 border border-brand-success text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.3)] flex items-center gap-3 backdrop-blur-md"
        >
          <CheckCircleIcon className="w-6 h-6" />
          <span className="text-sm font-bold tracking-wide">Befund wurde an den Educator Workspace übermittelt!</span>
        </motion.div>
      )}

      <div className="container mx-auto px-4">
        
        {/* Stepper UI */}
        <div className="mb-12 flex items-center justify-center">
          <div className="flex items-center gap-4 w-full max-w-3xl">
            {steps.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className={`flex flex-col items-center gap-2 ${currentStep >= step.num ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${currentStep >= step.num ? 'bg-[#C9A84C] border-[#C9A84C] text-black shadow-glow' : 'border-white/20 text-white/50'}`}>
                    {step.num}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-center">{step.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-[2px] transition-colors ${currentStep > step.num ? 'bg-[#C9A84C]' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Sokratischer Mentor Sidebar */}
          <div className="lg:col-span-3 space-y-6">
             <Card className="p-6 bg-brand-primary/5 border border-brand-primary/20 h-full max-h-[600px] overflow-y-auto">
               <div className="flex items-center gap-3 mb-6">
                 <AcademicCapIcon className="w-6 h-6 text-brand-primary" />
                 <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary">Sokratischer Mentor</h3>
               </div>
               <p className="text-xs text-white/60 mb-6 leading-relaxed">
                 Ich beobachte deine Anamnese und gebe dir Hinweise, worauf du bei diesem Fall besonders achten solltest.
               </p>
               
               <div className="space-y-4">
                 {messages.length > 2 && (
                   <motion.div initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} className="bg-black/40 p-4 rounded-xl border border-white/5">
                     <p className="text-xs text-brand-secondary italic">"💡 Hast du die neurologische Komponente (Reflexe, Sensibilität) bereits geprüft?"</p>
                   </motion.div>
                 )}
                 {messages.length > 4 && (
                   <motion.div initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} className="bg-black/40 p-4 rounded-xl border border-white/5">
                     <p className="text-xs text-brand-secondary italic">"🧐 Frag gerne genauer nach dem Unfallmechanismus. Das 'Kistenheben' könnte uns Hinweise auf die betroffene Struktur geben."</p>
                   </motion.div>
                 )}
               </div>
             </Card>
          </div>

          {/* Chat Area */}
          <Card className="lg:col-span-5 flex flex-col h-[600px] bg-black/40 border-white/5 relative z-10 transition-all duration-500 hover:border-white/10">
              <div className="flex justify-between items-center mb-6 pl-2">
                <h3 className="text-xl font-bold font-serif flex items-center gap-2">
                  <RobotIcon className="w-6 h-6 text-brand-primary" /> Dialog
                </h3>
                <Button onClick={loadHexenschussCase} variant="outline" size="sm" className="text-[10px] py-2 border-white/10 bg-white/5 hover:bg-white/10 shadow-lg">▶️ Beispiel-Fall laden: Herr Müller (45, LWS)</Button>
              </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20 rounded-xl border border-white/5 shadow-inner">
              {messages.map((msg, i) => (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-brand-primary text-brand-secondary rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm border border-white/5'} shadow-sm`}>
                    <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C9A84C]">$1</strong>') }} />
                  </div>
                </motion.div>
              ))}
              {isProcessing && !report && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-4 rounded-2xl rounded-bl-sm flex gap-3 items-center border border-white/5">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none mt-0.5">KI analysiert klinisches Bild...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-black/60 rounded-b-3xl">
              <div className="flex gap-2">
                <button 
                  onClick={toggleRecording}
                  className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse border border-red-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'}`}
                >
                  {isRecording ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
                </button>
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Beschreibe den Fall..."
                  className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-primary/50 text-white placeholder-white/30 transition-colors"
                  disabled={isRecording || isProcessing || report !== null}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!input.trim() || isProcessing || report !== null}
                  variant="primary"
                  className="px-6 rounded-xl"
                >
                  Senden
                </Button>
              </div>
            </div>
          </Card>

          {/* Report Area */}
          <div className="lg:col-span-4 h-full">
            {report ? (
              <Card className="p-8 h-full bg-brand-primary/5 border border-brand-primary/20 animate-fadeInUp flex flex-col">
                <h3 className="text-2xl font-bold font-serif mb-6 flex items-center gap-3 text-white">
                  <DocumentTextIcon className="w-8 h-8 text-brand-primary" />
                  Klinischer Report
                </h3>
                
                <div className="space-y-6 flex-grow overflow-y-auto custom-scrollbar pr-2">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-3">Hypothesen</h4>
                    <ul className="space-y-2">
                      {report.hypotheses.map((h: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                          <CheckCircleIcon className="w-5 h-5 text-brand-primary flex-shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {report.redFlags && report.redFlags.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-3">Red Flags</h4>
                      <ul className="space-y-2">
                        {report.redFlags.map((r: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-red-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-3">Empfohlene Tests</h4>
                    <div className="flex flex-wrap gap-2">
                      {report.recommendedTests.map((t: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/80">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 bg-black/40 rounded-xl border border-white/10 shadow-inner">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                      <BrainCircuitIcon className="w-4 h-4 text-brand-primary" /> Reasoning
                    </h4>
                    <p className="text-sm text-white/80 italic leading-relaxed">
                      "{report.reasoning}"
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 mt-6 border-t border-white/10 pt-6">
                     <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">Aktionen & Export</p>
                     <Button onClick={handlePrint} variant="primary" className="w-full text-[10px] py-4 uppercase tracking-[0.2em] flex justify-center items-center gap-2">
                         <DocumentTextIcon className="w-4 h-4" /> PDF-Report generieren
                     </Button>
                     <Button onClick={handleSubmit} variant="outline" className="w-full text-[10px] py-4 uppercase tracking-[0.2em] flex justify-center items-center gap-2">
                         <CheckCircleIcon className="w-4 h-4" /> Befund an Dozenten einreichen
                     </Button>
                  </div>
                </div>

                <Button 
                  onClick={() => { setReport(null); setCurrentStep(1); setMessages([{ role: 'assistant', content: 'Lass uns einen neuen Fall besprechen.' }]); }}
                  variant="outline"
                  className="w-full mt-6 bg-white/5"
                >
                  Neuen Fall starten
                </Button>
              </Card>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 border border-dashed border-white/20 rounded-[32px] p-12 text-center bg-black/20">
                <RobotIcon className="w-16 h-16 mb-6 text-brand-primary/50" />
                <h3 className="text-lg font-bold mb-2">Warte auf Anamnese</h3>
                <p className="text-xs max-w-[200px] leading-relaxed">Führe das Gespräch, bis der Bot genügend Informationen für den Report gesammelt hat.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


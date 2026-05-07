import React, { useState, useRef, useEffect } from 'react';
import { generateClinicalContent } from '../services/aiService';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  RobotIcon, 
  MicrophoneIcon, 
  StopIcon, 
  BrainCircuitIcon, 
  CheckCircleIcon,
  DocumentTextIcon,
  ArrowRightIcon
} from '../components/IconComponents';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isAudio?: boolean;
}

export const DiagnostikBotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hallo! Ich bin der Diagnostik-Bot. Bitte schildere mir den Fall deines Patienten. Du kannst tippen oder die Spracheingabe nutzen.' }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadDemoCase = (type: 'lws' | 'cervical') => {
    if (type === 'lws') {
      setMessages([
        { role: 'assistant', content: 'Hallo! Ich bin der Diagnostik-Bot. Bitte schildere mir den Fall deines Patienten. Du kannst tippen oder die Spracheingabe nutzen.' },
        { role: 'user', content: 'Patient, 45, klagt über tiefe Rückenschmerzen seit 3 Wochen.' },
        { role: 'assistant', content: 'Gibt es Ausstrahlungen in die Beine oder neurologische Ausfallerscheinungen (z.B. Taubheit, Schwäche)?' },
        { role: 'user', content: 'Ja, Ausstrahlung an der lateralen Wade rechts und Schwäche beim Fersenstand.' }
      ]);
      setInput('Er hat ausserdem nachts verstärkt Schmerzen, die nicht lagungsabhängig sind.');
    }
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
        2. Wenn du genug Informationen hast, beende den Dialog mit dem exakten Satz: "Ich habe genug Informationen für eine Diagnose." und generiere im Hintergrund den Report (dieser wird separat getriggert).
        
        Antworte kurz, prägnant und im sokratischen Dialogstil (führe den Studenten, gib nicht sofort die Lösung).
      `;

      const response = await generateClinicalContent(prompt, 'gemini-2.0-flash');
      const botReply = response.text || "Ich habe das nicht ganz verstanden.";

      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);

      if (botReply.includes("Ich habe genug Informationen für eine Diagnose.")) {
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

      const response = await generateClinicalContent(prompt, 'gemini-2.0-flash', { responseMimeType: "application/json" });
      const reportData = JSON.parse(response.text || "{}");
      setReport(reportData);
    } catch (error) {
      console.error("Report Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    // Placeholder for actual Web Speech API or MediaRecorder implementation
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate recording start
      setTimeout(() => {
        setIsRecording(false);
        setInput("Der Patient ist 45 Jahre alt, klagt über stechende Schmerzen in der LWS, ausstrahlend ins rechte Bein bis zum Knie. Schmerz verstärkt sich beim Husten und Niesen.");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background text-white">
      <Section 
        title="Diagnostik-Bot" 
        subtitle="Trainiere deine Anamnese-Fähigkeiten im interaktiven Dialog."
      />

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-2 gap-8">
        {/* Chat Area */}
        <Card className="flex flex-col h-[600px] bg-black/40 border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-serif flex items-center gap-2">
                <RobotIcon className="w-6 h-6 text-brand-primary" /> Anamnese Chat
              </h3>
              <div className="flex gap-2">
                <Button onClick={() => loadDemoCase('lws')} variant="outline" size="sm" className="text-[10px] py-1 border-white/20">Demo LWS</Button>
              </div>
            </div>
          <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20 rounded-xl border border-white/5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-brand-primary text-brand-secondary rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isProcessing && !report && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-4 rounded-2xl rounded-bl-sm flex gap-2 items-center">
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/5 bg-black/60 rounded-b-3xl">
            <div className="flex gap-2">
              <button 
                onClick={toggleRecording}
                className={`p-4 rounded-xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
              >
                {isRecording ? <StopIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
              </button>
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Beschreibe den Fall..."
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-brand-primary/50"
                disabled={isRecording || isProcessing || report !== null}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isProcessing || report !== null}
                variant="primary"
                className="px-6"
              >
                Senden
              </Button>
            </div>
          </div>
        </Card>

        {/* Report Area */}
        <div className="space-y-6">
          {report ? (
            <Card className="p-8 bg-brand-primary/5 border-brand-primary/20 animate-fadeInUp">
              <h3 className="text-2xl font-bold font-serif mb-6 flex items-center gap-3">
                <DocumentTextIcon className="w-8 h-8 text-brand-primary" />
                Klinischer Report
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-brand-primary mb-3">Hypothesen</h4>
                  <ul className="space-y-2">
                    {report.hypotheses.map((h: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircleIcon className="w-5 h-5 text-brand-primary flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {report.redFlags && report.redFlags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-red-400 mb-3">Red Flags</h4>
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
                  <h4 className="text-xs font-black uppercase tracking-widest text-brand-primary mb-3">Empfohlene Tests</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.recommendedTests.map((t: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 flex items-center gap-2">
                    <BrainCircuitIcon className="w-4 h-4" /> Reasoning
                  </h4>
                  <p className="text-sm text-white/80 italic leading-relaxed">
                    "{report.reasoning}"
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => { setReport(null); setMessages([{ role: 'assistant', content: 'Lass uns einen neuen Fall besprechen.' }]); }}
                variant="outline"
                className="w-full mt-8"
              >
                Neuen Fall starten
              </Button>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/20 rounded-3xl p-12 text-center">
              <RobotIcon className="w-24 h-24 mb-6" />
              <h3 className="text-xl font-bold mb-2">Warte auf Anamnese</h3>
              <p className="text-sm">Führe das Gespräch auf der linken Seite, bis der Bot genügend Informationen für einen Report gesammelt hat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

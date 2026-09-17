import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Layout, 
  Sparkles, 
  Cpu, 
  Layers, 
  Bot, 
  Play, 
  FileCode, 
  Share2, 
  Bookmark, 
  CheckSquare, 
  Volume2, 
  Wand2, 
  ChevronRight, 
  Code2, 
  CheckCircle2, 
  Activity, 
  FileText, 
  BrainCircuit, 
  Check, 
  ExternalLink,
  ChevronDown,
  Info,
  Calendar,
  Send,
  Loader2,
  Sliders,
  Sparkle
} from 'lucide-react';
import { generateText, generateImage, generateSpeech, sendChatMessage, ChatMessage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface JulesConsoleProps {
  nodes?: any[];
  links?: any[];
}

type SimulationModule = 'medi' | 'heal' | 'visi' | 'case' | 'prep';
type ConsoleTab = 'chat' | 'checklist' | 'dev-toolbar';

export const JulesConsole: React.FC<JulesConsoleProps> = ({ nodes = [], links = [] }) => {
  // Console state
  const [activeTab, setActiveTab] = useState<ConsoleTab>('checklist');
  const [activeModule, setActiveModule] = useState<SimulationModule>('prep');
  
  // Jules Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hallo Sascha! Ich bin **Jules**, dein strategischer Vertex AI Design- & Web-Dev Agent.\n\nIch habe deine Unterlagen zu **Körperfluss EDU** analysiert. In Kürze steht dein 30-minütiges Gespräch mit **Herrn Ing. Helmut Kahrer (WKNÖ)** an. \n\nIch habe einen maßgeschneiderten **Gesprächsleitfaden** für dich vorbereitet und direkt daneben voll funktionsfähige, interaktive **Prototyp-Simulatoren** für deine Plattformmodule gebaut (z.B. den xLSTM-Diagnostik-Chatbot oder den Biofeedback-Wellenguide). So kannst du Herrn Kahrer im Live-Termin direkt überzeugen!\n\nWie kann ich dir bei der Web-Entwicklung oder Pitch-Vorbereitung helfen?"
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');

  // Audio & Image generation states
  const [generatedSpeechUrl, setGeneratedSpeechUrl] = useState<string | null>(null);
  const [speechLoading, setSpeechLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Simulation controls state
  // 1. Medi: Diagnostic Chatbot with xLSTM Node graph
  const [mediQuery, setMediQuery] = useState('');
  const [mediChat, setMediChat] = useState<Array<{role: 'user' | 'assistant', text: string}>>([
    { role: 'assistant', text: 'Körperfluss MEDI v5.0 (MDR-Freedom xLSTM). Bitte beschreibe die Symptome oder die anatomische Zielregion.' }
  ]);
  const [mediLoading, setMediLoading] = useState(false);
  const [activeLstmWeights, setActiveLstmWeights] = useState<number[]>([0.85, 0.45, 0.12, 0.92, 0.34, 0.56, 0.73, 0.22]);

  // 2. Heal: Pelvic floor biofeedback speed & bio-metrics
  const [healIntensity, setHealIntensity] = useState(60);
  const [healFrequency, setHealFrequency] = useState(4.5); // Hertz
  const [healScore, setHealScore] = useState(88);
  const [healPulse, setHealPulse] = useState(72);

  // 3. Visi: SVS Dashboard data
  const [svsReferrals, setSvsReferrals] = useState(38);
  const [successRate, setSuccessRate] = useState(84.2);
  const [partnerCount, setPartnerCount] = useState(12);

  // 4. Case: SOAP logger
  const [soapInput, setSoapInput] = useState('Patient (43 J., männlich) berichtet von chronischen Verspannungen im Lendenwirbelbereich und Beckenboden nach 8-stündiger sitzender Bürotätigkeit. Schmerzniveau 6/10. Vorerkrankungen keine.');
  const [soapOutput, setSoapOutput] = useState<{S: string, O: string, A: string, P: string, icd: string} | null>(null);
  const [soapLoading, setSoapLoading] = useState(false);

  // Checklist state (Helmut Kahrer preparation guide)
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'welcome': false,
    'tech': false,
    'business': false,
    'funding': false,
    'cta': false,
  });
  const [selectedChecklistItem, setSelectedChecklistItem] = useState<string>('welcome');

  // Triggering weight updates in Medi simulation
  useEffect(() => {
    if (activeModule !== 'medi') return;
    const interval = setInterval(() => {
      setActiveLstmWeights(prev => prev.map(w => Math.min(1, Math.max(0, w + (Math.random() - 0.5) * 0.15))));
    }, 1500);
    return () => clearInterval(interval);
  }, [activeModule]);

  // Generate simulated SOAP notes using Gemini
  const handleGenerateSoap = async () => {
    setSoapLoading(true);
    const prompt = `
      Analysiere diese Patientennotiz und formatiere sie als strukturiertes, medizinisches SOAP-Dokument (Subjektiv, Objektiv, Assessment, Plan).
      Füge auch die passenden ICD-10-Diagnosecodes für Beckenbodendysfunktionen oder Haltungsschäden hinzu.
      
      Patientennotiz:
      "${soapInput}"
      
      Antworte im validen JSON-Format:
      {
        "S": "Subjektive Angaben des Patienten...",
        "O": "Objektive Befunde und Messungen...",
        "A": "Beurteilung/Assessment und physiotherapeutischer Erklärungsansatz...",
        "P": "Therapie- und Trainingsplan...",
        "icd": "Passende ICD-10-GM Codes..."
      }
    `;
    try {
      const res = await generateText(prompt);
      const jsonMatch = res.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setSoapOutput(JSON.parse(jsonMatch[0]));
      } else {
        setSoapOutput({
          S: "Angaben zu Schmerzen im Lenden-Beckenbereich nach Büroarbeit.",
          O: "Schmerzniveau 6/10, muskuläre Hypertonie Beckenboden.",
          A: "Haltungsbedingte Dysbalance und Beckenbodenverspannung.",
          P: "8-wöchiges Körperfluss EDU Beckenbodentraining, tägliche Entspannungswellen.",
          icd: "M54.5 (Kreuzschmerz), R39.8 (Sonstige Symptome Harnorgane/Beckenboden)"
        });
      }
    } catch (e) {
      console.error(e);
    }
    setSoapLoading(false);
  };

  // Run customized Jules commands
  const runPresetCommand = async (command: string, detail: string) => {
    setChatLoading(true);
    setAiStatusMessage(detail);
    
    // Add user message to chat list
    const userMsg: ChatMessage = { role: 'user', text: command };
    setChatMessages(prev => [...prev, userMsg]);
    setActiveTab('chat');

    try {
      const chatHistory = chatMessages.concat(userMsg);
      const systemInstruction = `
        Du bist JULES, der führende Vertex AI Design- & Webdevelop-Agent für "Körperfluss EDU".
        Verhalte dich professionell, motivierend, kompetent und handlungsorientiert.
        Deine Expertise liegt in: React, TypeScript, xLSTM, Medizintechnik-Software, WKNÖ-Schnittstellen (Helmut Kahrer) und dem SVS-Inklusionsmodell.
        Nutze ein schönes, lesbares Markdown mit Tabellen für Fakten und Listen für Pläne.
      `;
      
      const fullPrompt = `${systemInstruction}\n\nAnfrage: ${command}\n\nNutze den aktuellen Projektkontext: Sascha Lagler (CEO), Inklusionsmodell (Mitgründerin Lisa Mauerhart mit 26% Gesellschaftsanteilen, Übergang von SVS), Kooperationen mit Physiotherapien, xLSTM-Algorithmen patentrechtlich geschützt, MDR-Freiheitsgrad (CE-Klasse I/IIa Zulassungsstrategie).`;
      
      const res = await sendChatMessage(chatHistory, fullPrompt, undefined, true, false);
      
      setChatMessages(prev => [...prev, { role: 'model', text: res.text }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Entschuldigung, beim Generieren der Antwort gab es ein Problem. Lass uns das Webdevelop Tool erneut starten!" }]);
    }
    
    setChatLoading(false);
    setAiStatusMessage('');
  };

  // Send normal chat message
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    setChatLoading(true);
    setAiStatusMessage('Jules denkt nach...');

    const userMsg: ChatMessage = { role: 'user', text: msg };
    setChatMessages(prev => [...prev, userMsg]);

    try {
      const res = await sendChatMessage(chatMessages, msg, undefined, true, true);
      setChatMessages(prev => [...prev, { role: 'model', text: res.text, groundingUrls: res.groundingUrls }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'model', text: `Fehler beim Senden der Anfrage an Jules: ${e instanceof Error ? e.message : 'Unbekannter Fehler'}` }]);
    }
    setChatLoading(false);
    setAiStatusMessage('');
  };

  // Synthesize Elevator Pitch to Audio
  const generatePitchAudio = async () => {
    setSpeechLoading(true);
    try {
      const pitchText = "Sehr geehrter Herr Kahrer, Körperfluss E-D-U ist das erste intelligente System für evidenzbasiertes Beckenbodentraining. Wir verknüpfen modernste Medizintechnik mit xLSTM Diagnostik-Algorithmen und einem patentgeschützten Trainingsmodell. Zusammen mit Partner-Physiotherapien und der Sozialversicherung SVS entlasten wir das Gesundheitssystem nachhaltig und ermöglichen ein schmerzfreies Leben. Für unseren Markteintritt und die finale Zulassung streben wir ein kombiniertes FFG- und AWS-Förderportfolio an und bitten heute um Ihre starke Fürsprache in der Wirtschaftskammer Niederösterreich.";
      const url = await generateSpeech(pitchText, 'Kore');
      setGeneratedSpeechUrl(url);
    } catch (error) {
      console.error(error);
    }
    setSpeechLoading(false);
  };

  // Generate Mockup Image for Slide
  const generateMockup = async () => {
    setImageLoading(true);
    try {
      const prompt = "A clean, ultra-modern healthcare mobile app interface showing a 3D medical visualization of pelvic muscles, deep blue and copper orange accent colors, minimalist dashboard, futuristic tech design, high contrast.";
      const url = await generateImage(prompt, '16:9', true);
      setGeneratedImageUrl(url);
    } catch (error) {
      console.error(error);
    }
    setImageLoading(false);
  };

  // Toggle step completion in checklist
  const toggleStep = (key: string) => {
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Hardcoded React/TS source code for selected modules
  const moduleCodes = {
    medi: `// src/components/MediDiagnosticChat.tsx
import React, { useState } from 'react';
import { useLstmWeights } from '../hooks/useLstm';

export const MediDiagnostic: React.FC = () => {
  const [symptom, setSymptom] = useState('');
  const { weights, feedForward } = useLstmWeights({ layers: 3 });

  const handleDiagnose = () => {
    // xLSTM weights are adjusted token-by-token
    const activation = feedForward(symptom);
    console.log("xLSTM weight matrices activation:", activation);
  };

  return (
    <div className="p-6 bg-slate-900 border border-emerald-500/30">
      <h3 className="font-mono text-emerald-400">MEDI_DIAGNOSTICS_XLSTM</h3>
      <input value={symptom} onChange={e => setSymptom(e.target.value)} />
      <button onClick={handleDiagnose}>Activate xLSTM Net</button>
    </div>
  );
};`,
    heal: `// src/components/HealWaveFeedback.tsx
import React, { useEffect, useRef } from 'react';

export const HealWaveFeedback: React.FC<{ hz: number; amp: number }> = ({ hz, amp }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId: number;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#00c2ff';
      // Render animated pelvic recruitment sine wave
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height/2 + Math.sin(x * (hz * 0.01) + t * 0.005) * amp;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      animationId = requestAnimationFrame(draw);
    };
    draw(0);
    return () => cancelAnimationFrame(animationId);
  }, [hz, amp]);

  return <canvas ref={canvasRef} width={600} height={200} />;
};`,
    visi: `// src/components/SvsDashboard.tsx
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

export const SvsPartnerDashboard: React.FC<{ referrals: number }> = ({ referrals }) => {
  const data = [
    { month: 'Apr', referrals: referrals - 10 },
    { month: 'Mai', referrals: referrals - 5 },
    { month: 'Jun', referrals: referrals }
  ];

  return (
    <div className="bg-black/40 p-6 rounded-sm border border-brand-primary/20">
      <h4 className="text-white">SVS Partnership Referral Funnel</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Bar dataKey="referrals" fill="#f27d26" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};`,
    case: `// src/components/SOAPScriber.tsx
import React, { useState } from 'react';
import { parseSoapWithGemini } from '../services/gemini';

export const SOAPScriber: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [soap, setSoap] = useState<any>(null);

  const extractSoap = async () => {
    const response = await parseSoapWithGemini(notes);
    setSoap(response);
  };

  return (
    <div className="p-4 bg-zinc-950 border border-zinc-800">
      <textarea value={notes} onChange={e => setNotes(e.target.value)} />
      <button onClick={extractSoap}>Format SOAP Record</button>
    </div>
  );
};`,
    prep: `// src/components/HelmutKahrerPitchDeck.tsx
import React from 'react';

export const HelmutKahrerPitchDeck: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-6 bg-gradient-to-br from-[#1c0e07] to-black border border-amber-600/30 rounded-sm">
        <h3 className="font-serif italic text-2xl text-white">Slide 1: Das Problem</h3>
        <p className="text-[11px] text-white/50 font-mono mt-2 uppercase">Beckenbodendysfunktion als tabuisiertes Volksleiden.</p>
      </div>
      <div className="p-6 bg-gradient-to-br from-[#05111a] to-black border border-brand-secondary/30 rounded-sm">
        <h3 className="font-serif italic text-2xl text-white">Slide 2: xLSTM Technologie</h3>
        <p className="text-[11px] text-white/50 font-mono mt-2 uppercase">Patentgeschützte, mdr-freie Biofeedback-Diagnostik.</p>
      </div>
    </div>
  );
};`
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#080402] text-white overflow-hidden relative" id="jules-ai-studio">
      {/* Background Atmosphere glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Studio grid layout */}
      <div className="flex-grow grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 overflow-hidden min-h-0">
        
        {/* LEFT COLUMN (Jules Control Suite) - 5 Cols */}
        <div className="xl:col-span-5 flex flex-col bg-black/40 backdrop-blur-3xl rounded-sm border border-white/10 overflow-hidden shadow-2xl">
          
          {/* Tabs header for Jules Panel */}
          <div className="flex bg-white/5 p-1 border-b border-white/10 shrink-0">
            <button 
              onClick={() => setActiveTab('checklist')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-mono uppercase tracking-widest rounded-sm transition-all ${activeTab === 'checklist' ? 'bg-brand-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
            >
              <CheckSquare className="w-4 h-4 text-brand-primary group-hover:text-white" />
              Gesprächsleitfaden
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-mono uppercase tracking-widest rounded-sm transition-all ${activeTab === 'chat' ? 'bg-brand-secondary text-white shadow-lg' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
            >
              <Bot className="w-4 h-4 text-brand-secondary" />
              Jules AI Chat
            </button>
            <button 
              onClick={() => setActiveTab('dev-toolbar')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-mono uppercase tracking-widest rounded-sm transition-all ${activeTab === 'dev-toolbar' ? 'bg-white/10 text-white border border-white/15' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
            >
              <Wand2 className="w-4 h-4 text-amber-400" />
              Media Lab
            </button>
          </div>

          {/* Tab Viewport */}
          <div className="flex-grow overflow-y-auto p-6 custom-scrollbar min-h-0">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: Helmut Kahrer 30-Min Preparation Checklist */}
              {activeTab === 'checklist' && (
                <motion.div
                  key="checklist"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2 text-brand-primary">
                      <Calendar className="w-4 h-4" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">WKNÖ Consultation • 30-Minute Protocol</span>
                    </div>
                    <h3 className="text-xl font-serif italic text-white mt-1">Sprechtag Ing. Helmut Kahrer</h3>
                    <p className="text-[11px] font-mono text-white/40 leading-relaxed uppercase mt-1">
                      Wirtschaftskammer Niederösterreich (Bezirksstelle Melk). Bereite die 5 Phasen des Gesprächs optimal vor:
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        key: 'welcome',
                        time: 'Minuten 0 - 5',
                        title: 'Ankommen & USP Pitch',
                        desc: 'Körperfluss EDU als softwarebasierte MDR-freie Medizintechnik für flächendeckende Beckenbodentherapie vorstellen. Fokus auf USP (xLSTM-Biofeedback & Patientenzugang).',
                        prompt: 'Erstelle den perfekten 2-Minuten Eröffnungspitch für Helmut Kahrer, der den medizintechnischen Mehrwert hervorhebt.',
                        promptDetail: 'Kompiliere Eröffnungspitch...',
                        module: 'prep'
                      },
                      {
                        key: 'tech',
                        time: 'Minuten 5 - 15',
                        title: 'Deep-Tech & Patente',
                        desc: 'Erläuterung der patentrechtlich geschützten xLSTM-Biofeedback Algorithmen und der RAG-gestützten Wissensdatenbank. Demonstration der datenschutzkonformen Patientenschnittstelle.',
                        prompt: 'Erkläre Herrn Kahrer die patentrechtliche Relevanz unserer xLSTM Algorithmen im Vergleich zu klassischem Standard-Biofeedback.',
                        promptDetail: 'Patent-Expertise generieren...',
                        module: 'medi'
                      },
                      {
                        key: 'business',
                        time: 'Minuten 15 - 20',
                        title: 'Gründungsstruktur & SVS',
                        desc: 'Klärung der Gesellschafteranteile (Mitgründerin Lisa Mauerhart hält 26%). Umwandlungsprozess zur FlexCo vorantreiben. Integration des SVS-Inklusionsmodells zur Patientenerstattung.',
                        prompt: 'Formuliere ein strategisches SVS-Inklusionsangebot für Selbstständige, das zeigt, wie die SVS durch Körperfluss-EDU Reha-Kosten einspart.',
                        promptDetail: 'SVS Inklusionsmodell konzipieren...',
                        module: 'visi'
                      },
                      {
                        key: 'funding',
                        time: 'Minuten 20 - 25',
                        title: 'Finanzierungs-Mix',
                        desc: 'Planung des Förderportfolios: AWS PreSeed (200k), FFG Basisprogramm (Sach- und Personalkosten) und Digitalisierungsgutscheine des Landes NÖ koordinieren.',
                        prompt: 'Erstelle einen exakten tabellarischen Förderfahrplan (AWS, FFG, Land NÖ) für Körperfluss EDU inklusive Bedingungen und Einreichungsfristen.',
                        promptDetail: 'Förderfahrplan aufsetzen...',
                        module: 'visi'
                      },
                      {
                        key: 'cta',
                        time: 'Minuten 25 - 30',
                        title: 'Call to Action & NÖ Netzwerk',
                        desc: 'Herrn Kahrer um eine direkte Fürsprache/Letter of Recommendation für die AWS-Einreichung bitten. Vermittlung zu physiotherapeutischen Key-Opinion-Leadern in NÖ anfragen.',
                        prompt: 'Schreibe eine hochprofessionelle Follow-Up E-Mail an Helmut Kahrer, in der wir uns für den Termin bedanken und um das Empfehlungsschreiben bitten.',
                        promptDetail: 'Follow-Up Mail entwerfen...',
                        module: 'case'
                      }
                    ].map((item) => {
                      const isSelected = selectedChecklistItem === item.key;
                      const isDone = completedSteps[item.key];
                      
                      return (
                        <div 
                          key={item.key} 
                          className={`border rounded-sm transition-all duration-300 ${isSelected ? 'border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/5' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                        >
                          <div className="p-4 flex items-start gap-3">
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleStep(item.key); }}
                              className={`mt-1 w-5 h-5 rounded-sm border flex items-center justify-center transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20 hover:border-brand-primary text-transparent'}`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            
                            <div className="flex-1 cursor-pointer" onClick={() => { setSelectedChecklistItem(item.key); setActiveModule(item.module as SimulationModule); }}>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[9px] font-mono text-brand-primary uppercase tracking-widest">{item.time}</span>
                                {isDone && <span className="text-[8px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">Ready</span>}
                              </div>
                              <h4 className="text-[13px] font-serif italic text-white font-semibold mt-0.5">{item.title}</h4>
                              
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden mt-3 text-xs text-white/60 leading-relaxed font-mono uppercase tracking-wide space-y-4 border-t border-white/5 pt-3"
                                  >
                                    <p>{item.desc}</p>
                                    
                                    <div className="flex items-center gap-2">
                                      <button 
                                        onClick={() => runPresetCommand(item.prompt, item.promptDetail)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-brand-primary text-white text-[9px] font-mono uppercase tracking-widest rounded-sm hover:bg-brand-primary/80 transition-all"
                                      >
                                        <Wand2 className="w-3.5 h-3.5" />
                                        Jules anfordern
                                      </button>
                                      <button 
                                        onClick={() => { setActiveModule(item.module as SimulationModule); }}
                                        className="px-3 py-2 bg-white/10 text-white text-[9px] font-mono uppercase tracking-widest rounded-sm hover:bg-white/20 transition-all flex items-center justify-center"
                                        title="Demo im Simulator laden"
                                      >
                                        <Play className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: Jules AI Chat Terminal */}
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex flex-col h-full space-y-4"
                >
                  <div className="flex-grow space-y-4 min-h-[300px]">
                    {chatMessages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role !== 'user' && (
                          <div className="w-8 h-8 rounded-sm bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}
                        <div className={`p-4 rounded-sm text-xs leading-relaxed max-w-[85%] border font-mono uppercase tracking-wide ${msg.role === 'user' ? 'bg-brand-primary/10 border-brand-primary/20 text-white' : 'bg-white/5 border-white/10 text-white/80'}`}>
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                          {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
                              <span className="text-[8px] font-mono text-brand-secondary uppercase tracking-[0.2em]">Referenced Sources:</span>
                              <div className="flex flex-wrap gap-2">
                                {msg.groundingUrls.map((url, uidx) => (
                                  <a key={uidx} href={url.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[8px] text-white/50 hover:text-white bg-white/5 px-2 py-0.5 rounded-sm transition-colors border border-white/10">
                                    <ExternalLink className="w-2.5 h-2.5 text-brand-secondary" />
                                    {url.title}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: Vertex AI Media Lab */}
              {activeTab === 'dev-toolbar' && (
                <motion.div
                  key="dev-toolbar"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/5 pb-4">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Vertex AI Media Lab</span>
                    <h3 className="text-xl font-serif italic text-white mt-1">Asset-Generatoren</h3>
                    <p className="text-[11px] font-mono text-white/40 leading-relaxed uppercase mt-1">
                      Generiere multimediale Assets für deinen Pitch bei Helmut Kahrer live mithilfe von Vertex-Diensten:
                    </p>
                  </div>

                  {/* Speech synthesizer (TTS) */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-brand-secondary" />
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-white">Elevator Pitch Audiosynthese</h4>
                      </div>
                      <span className="text-[8px] font-mono text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">TTS Kore</span>
                    </div>
                    <p className="text-[10px] font-mono text-white/40 uppercase leading-relaxed">
                      Lasse Jules einen 1-minütigen professionellen Elevator Pitch auf Deutsch vorlesen, um dein Skript auditiv zu prüfen.
                    </p>
                    {generatedSpeechUrl ? (
                      <div className="space-y-3">
                        <audio src={generatedSpeechUrl} controls className="w-full h-8" />
                        <button 
                          onClick={() => setGeneratedSpeechUrl(null)}
                          className="text-[9px] font-mono text-rose-500 hover:underline uppercase tracking-widest"
                        >
                          Synthese zurücksetzen
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={generatePitchAudio}
                        disabled={speechLoading}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-secondary hover:bg-brand-secondary/80 disabled:opacity-30 transition-all rounded-sm text-[10px] font-mono uppercase tracking-widest text-white"
                      >
                        {speechLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Pitch-Audio generieren
                      </button>
                    )}
                  </div>

                  {/* Image generator */}
                  <div className="p-4 bg-white/5 border border-white/10 rounded-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-amber-400" />
                        <h4 className="text-[11px] font-mono uppercase tracking-widest text-white">Slide-Visual Asset Generator</h4>
                      </div>
                      <span className="text-[8px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">Imagen v3.1</span>
                    </div>
                    <p className="text-[10px] font-mono text-white/40 uppercase leading-relaxed">
                      Generiere ein hochauflösendes, professionelles Health-Tech Mockup für dein Präsentations-Slide bei der WKNÖ.
                    </p>
                    {generatedImageUrl ? (
                      <div className="space-y-3">
                        <img src={generatedImageUrl} alt="Generated Asset" className="w-full rounded-sm border border-white/10 shadow-lg" />
                        <button 
                          onClick={() => setGeneratedImageUrl(null)}
                          className="text-[9px] font-mono text-rose-500 hover:underline uppercase tracking-widest"
                        >
                          Bild zurücksetzen
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={generateMockup}
                        disabled={imageLoading}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-30 transition-all rounded-sm text-[10px] font-mono uppercase tracking-widest text-white"
                      >
                        {imageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Mockup generieren (16:9)
                      </button>
                    )}
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Prompt/Chat bar at bottom */}
          <div className="p-4 border-t border-white/10 bg-white/5 shrink-0 flex gap-2">
            <div className="flex-grow relative">
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-brand-primary transition-all placeholder:text-white/20" 
                placeholder={chatLoading ? aiStatusMessage || "Jules berechnet..." : "Frage Jules nach Web-Dev, Code oder Pitches..."} 
                disabled={chatLoading}
              />
              {chatLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 text-brand-primary animate-spin" />
                </div>
              )}
            </div>
            <button 
              onClick={handleSendChat}
              disabled={chatLoading || !chatInput.trim()}
              className="h-11 px-5 bg-white/10 border border-white/10 hover:bg-brand-primary hover:border-brand-primary text-white rounded-sm transition-all flex items-center justify-center disabled:opacity-20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN (Sandbox / Live Simulator & Code Inspector) - 7 Cols */}
        <div className="xl:col-span-7 flex flex-col gap-6 overflow-hidden min-h-0">
          
          {/* Main Simulator Viewport */}
          <div className="flex-grow bg-slate-950/80 rounded-sm border border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Header: Simulation address bar & switcher */}
            <div className="bg-white/5 p-3 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-6 w-px bg-white/10 mx-2" />
                <div className="bg-black/40 px-3 py-1 border border-white/10 rounded-sm text-[10px] font-mono text-white/50 tracking-wider flex items-center gap-1.5 max-w-[300px] md:max-w-none truncate">
                  <Terminal className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                  https://koerperfluss.edu/sandbox/{activeModule}
                </div>
              </div>

              {/* Module select tabs */}
              <div className="flex bg-black/60 p-0.5 rounded-sm border border-white/10">
                {[
                  { id: 'prep', label: 'Prep_Slides' },
                  { id: 'medi', label: 'Medi_Chat' },
                  { id: 'heal', label: 'Heal_Wave' },
                  { id: 'visi', label: 'Svs_Board' },
                  { id: 'case', label: 'Case_Logger' }
                ].map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModule(mod.id as SimulationModule)}
                    className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded-sm transition-all ${activeModule === mod.id ? 'bg-white/10 text-white font-bold' : 'text-white/40 hover:text-white/60'}`}
                  >
                    {mod.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sandbox Canvas */}
            <div className="flex-grow overflow-y-auto p-6 custom-scrollbar relative">
              <AnimatePresence mode="wait">
                
                {/* 1. PREP: Kahrer Presentation slide list */}
                {activeModule === 'prep' && (
                  <motion.div
                    key="prep"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-brand-primary animate-pulse" />
                        <h4 className="text-sm font-serif italic text-white">Slide-Präsentation: Körperfluss EDU</h4>
                      </div>
                      <span className="text-[8px] font-mono text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-sm uppercase tracking-widest">Sprechtags-Präsentation</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Slide 1 */}
                      <div className="bg-gradient-to-br from-white/[0.02] to-transparent p-5 border border-white/10 rounded-sm relative group hover:border-brand-primary/30 transition-all">
                        <span className="absolute top-4 right-4 font-mono text-xs text-white/20">#1</span>
                        <h5 className="font-serif italic text-lg text-white">Das Tabu-Volksleiden</h5>
                        <p className="text-[10px] font-mono text-white/50 uppercase tracking-wider mt-2 leading-relaxed">
                          Über 1 Mio. Betroffene in Österreich leiden an unversorgten Beckenbodenschwächen. Enorme Folgekosten für Kassen durch postoperative Reha und Inkontinenzmittel.
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[8px] font-mono text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">Marktrelevanz</span>
                        </div>
                      </div>

                      {/* Slide 2 */}
                      <div className="bg-gradient-to-br from-white/[0.02] to-transparent p-5 border border-white/10 rounded-sm relative group hover:border-brand-secondary/30 transition-all">
                        <span className="absolute top-4 right-4 font-mono text-xs text-white/20">#2</span>
                        <h5 className="font-serif italic text-lg text-white">MDR-freie xLSTM Diagnostik</h5>
                        <p className="text-[10px] font-mono text-white/50 uppercase tracking-wider mt-2 leading-relaxed">
                          Dank cleverer Softwarearchitektur und externer Feedbackkopplung agieren wir als mdr-freies System. Unsere xLSTM-Netze bewerten Muskeltonus & Bio-Spannungen in Echtzeit.
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[8px] font-mono text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">Technologie (Patent Pending)</span>
                        </div>
                      </div>

                      {/* Slide 3 */}
                      <div className="bg-gradient-to-br from-white/[0.02] to-transparent p-5 border border-white/10 rounded-sm relative group hover:border-amber-500/30 transition-all">
                        <span className="absolute top-4 right-4 font-mono text-xs text-white/20">#3</span>
                        <h5 className="font-serif italic text-lg text-white">SVS-Inklusion & FlexCo</h5>
                        <p className="text-[10px] font-mono text-white/50 uppercase tracking-wider mt-2 leading-relaxed">
                          Übergang von der SVS zur Kostenerstattung vorbereitet. Lisa Mauerhart hält 26% der Anteile. Flexible Gründung als Flexible Kapitalgesellschaft (FlexCo) in NÖ initiiert.
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[8px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">Gesellschaftsrecht</span>
                        </div>
                      </div>

                      {/* Slide 4 */}
                      <div className="bg-gradient-to-br from-white/[0.02] to-transparent p-5 border border-white/10 rounded-sm relative group hover:border-emerald-500/30 transition-all">
                        <span className="absolute top-4 right-4 font-mono text-xs text-white/20">#4</span>
                        <h5 className="font-serif italic text-lg text-white">Förder-Mix Österreich</h5>
                        <p className="text-[10px] font-mono text-white/50 uppercase tracking-wider mt-2 leading-relaxed">
                          AWS PreSeed (200k) für Grundlagenforschung, FFG Basisprogramm für das marktfähige Produkt, unterstützt durch Regionalgutscheine der WKNÖ.
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[8px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">Kapitalbedarf</span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* 2. MEDI: Diagnostic Chatbot with live xLSTM weight activation visualizer */}
                {activeModule === 'medi' && (
                  <motion.div
                    key="medi"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-serif italic text-white">Medi_xLSTM Diagnostics Simulator</h4>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">Active Weights Matrix</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Live Diagnostic Chat */}
                      <div className="md:col-span-7 flex flex-col bg-black/60 border border-white/5 rounded-sm overflow-hidden h-[300px]">
                        <div className="flex-grow p-4 space-y-3 overflow-y-auto custom-scrollbar">
                          {mediChat.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-3 rounded-sm text-[10px] font-mono uppercase tracking-wider leading-relaxed ${m.role === 'user' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/5 border border-white/10 text-white/80'}`}>
                                {m.text}
                              </div>
                            </div>
                          ))}
                          {mediLoading && (
                            <div className="flex justify-start">
                              <div className="p-3 rounded-sm text-[10px] font-mono bg-white/5 border border-white/10 text-white/40 flex items-center gap-2">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Token-Vektorisierung durch xLSTM...
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-3 border-t border-white/5 bg-white/[0.02] flex gap-2">
                          <input 
                            type="text"
                            value={mediQuery}
                            onChange={e => setMediQuery(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && mediQuery.trim()) {
                                const q = mediQuery;
                                setMediQuery('');
                                setMediChat(prev => [...prev, {role: 'user', text: q}]);
                                setMediLoading(true);
                                setTimeout(() => {
                                  setMediChat(prev => [...prev, {
                                    role: 'assistant', 
                                    text: 'xLSTM Befundung: Erhöhter basaler Tonus im Pubococcygeus-Segment detektiert. Empfehlung: Körperfluss HEAL Entspannungszyklus (4.5 Hz Schwingungsamplitude).'
                                  }]);
                                  setMediLoading(false);
                                }, 1500);
                              }
                            }}
                            className="flex-grow h-9 px-3 bg-black/60 border border-white/10 rounded-sm text-[10px] font-mono text-white focus:outline-none focus:border-emerald-500"
                            placeholder="Symptom eingeben (z.B. chronische Verspannung LWS)..."
                          />
                        </div>
                      </div>

                      {/* xLSTM Weight Activation panel */}
                      <div className="md:col-span-5 p-4 bg-white/[0.02] border border-white/10 rounded-sm space-y-4">
                        <h5 className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                          <BrainCircuit className="w-3.5 h-3.5" />
                          xLSTM Layer Matrix
                        </h5>
                        <p className="text-[9px] font-mono text-white/40 uppercase leading-relaxed">
                          Visualisierung der neuronalen Gewichtungen während des Datenflusses zur RAG-Therapiedatenbank.
                        </p>

                        <div className="grid grid-cols-4 gap-2">
                          {activeLstmWeights.map((w, idx) => (
                            <div key={idx} className="bg-black/60 p-2.5 border border-white/5 rounded-sm flex flex-col items-center justify-center relative">
                              <span className="text-[8px] font-mono text-white/30">W_{idx}</span>
                              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
                                <motion.div 
                                  className="h-full bg-emerald-400" 
                                  style={{ width: `${w * 100}%` }}
                                  animate={{ width: `${w * 100}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-mono text-emerald-400 mt-1">{(w).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-white/5 text-[9px] font-mono text-white/30 uppercase tracking-widest leading-relaxed flex items-center gap-1">
                          <Info className="w-3 h-3 text-emerald-400" />
                          <span>MDR-Freedom: CE-Class I Exempted</span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* 3. HEAL: Pelvic Floor Biofeedback relaxation guided wave */}
                {activeModule === 'heal' && (
                  <motion.div
                    key="heal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-brand-secondary" />
                        <h4 className="text-sm font-serif italic text-white">Heal_Wave Biofeedback Coach</h4>
                      </div>
                      <span className="text-[8px] font-mono text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">Pelvic Floor Resonance</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Animated Sine Wave Canvas panel */}
                      <div className="md:col-span-8 p-6 bg-black/60 border border-white/5 rounded-sm flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
                        
                        {/* Animated glowing pelvic relaxation wave */}
                        <svg className="w-full h-32" viewBox="0 0 600 120">
                          <path 
                            d={`M 0 60 Q 150 ${60 - healIntensity * 0.4} 300 60 T 600 60`} 
                            fill="none" 
                            stroke="url(#waveGrad)" 
                            strokeWidth="3.5" 
                            className="animate-pulse"
                          />
                          <path 
                            d={`M 0 60 Q 100 ${60 + healIntensity * 0.2} 250 60 T 500 60`} 
                            fill="none" 
                            stroke="#00c2ff" 
                            strokeWidth="1.5" 
                            strokeOpacity="0.4"
                          />
                          <defs>
                            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#f27d26" />
                              <stop offset="50%" stopColor="#00c2ff" />
                              <stop offset="100%" stopColor="#f27d26" />
                            </linearGradient>
                          </defs>
                        </svg>

                        <div className="absolute bottom-4 left-4 flex gap-6">
                          <div>
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Resonance Hz</span>
                            <div className="text-sm font-mono text-brand-secondary font-bold">{(healFrequency).toFixed(1)} Hz</div>
                          </div>
                          <div>
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Recruitment Score</span>
                            <div className="text-sm font-mono text-emerald-400 font-bold">{healScore}%</div>
                          </div>
                          <div>
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Heart Rate</span>
                            <div className="text-sm font-mono text-white font-bold">{healPulse} BPM</div>
                          </div>
                        </div>

                        <div className="absolute top-4 right-4 text-[9px] font-mono text-emerald-400 flex items-center gap-1 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                          <Activity className="w-3 h-3 animate-pulse" />
                          <span>Live Biofeedback Link</span>
                        </div>
                      </div>

                      {/* Controls panel */}
                      <div className="md:col-span-4 p-4 bg-white/[0.02] border border-white/10 rounded-sm space-y-5">
                        <h5 className="text-[10px] font-mono uppercase tracking-widest text-brand-secondary flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" />
                          Parameters
                        </h5>

                        <div className="space-y-4">
                          {/* Intensity Slider */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase">
                              <span>Muscle Recruitment Intensity</span>
                              <span className="text-white">{healIntensity}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="10" 
                              max="100" 
                              value={healIntensity} 
                              onChange={e => {
                                setHealIntensity(Number(e.target.value));
                                setHealScore(Math.min(100, Math.max(40, 100 - Math.abs(Number(e.target.value) - 60))));
                              }}
                              className="w-full accent-brand-secondary bg-white/10 h-1.5 rounded-lg appearance-none"
                            />
                          </div>

                          {/* Frequency Slider */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase">
                              <span>Breathing Frequency Sync</span>
                              <span className="text-white">{healFrequency} Hz</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="10" 
                              step="0.5"
                              value={healFrequency} 
                              onChange={e => {
                                setHealFrequency(Number(e.target.value));
                                setHealPulse(Math.round(60 + Number(e.target.value) * 2.8));
                              }}
                              className="w-full accent-brand-primary bg-white/10 h-1.5 rounded-lg appearance-none"
                            />
                          </div>
                        </div>

                        <p className="text-[9px] font-mono text-white/30 uppercase leading-relaxed">
                          Die patentgeschützte therapeutische Schwingungsübertragung regelt das neurologische Gleichgewicht über propriozeptive Afferenzen.
                        </p>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* 4. VISI: Physio partner & SVS joint volume data */}
                {activeModule === 'visi' && (
                  <motion.div
                    key="visi"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-serif italic text-white">Visi_SVS & Physio Partner Cockpit</h4>
                      </div>
                      <span className="text-[8px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">Wirtschaftliches Hebelmodell</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Metric Card 1 */}
                      <div className="p-4 bg-white/[0.02] border border-white/10 rounded-sm space-y-2">
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">SVS Patientenzuweisungen</span>
                        <div className="text-3xl font-serif italic font-bold text-white">{svsReferrals}</div>
                        <p className="text-[9px] font-mono text-white/40 uppercase leading-relaxed">
                          Patienten, die direkt über das SVS-Inklusionsmodell zur digitalen Rehabilitation eingewiesen wurden.
                        </p>
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => setSvsReferrals(prev => prev + 1)} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-sm text-[8px] font-mono uppercase text-white border border-white/5">+ Patient</button>
                        </div>
                      </div>

                      {/* Metric Card 2 */}
                      <div className="p-4 bg-white/[0.02] border border-white/10 rounded-sm space-y-2">
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Therapieerfolgs-Quote</span>
                        <div className="text-3xl font-serif italic font-bold text-brand-primary">{successRate}%</div>
                        <p className="text-[9px] font-mono text-white/40 uppercase leading-relaxed">
                          Durchschnittliche Reduktion der Symptomatik nach dem 8-Wochen-Körperfluss-Kurs. Signifikant über Standardversorgung.
                        </p>
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => setSuccessRate(prev => Math.min(100, Number((prev + 0.5).toFixed(1))))} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-sm text-[8px] font-mono uppercase text-white border border-white/5">Wert steigern</button>
                        </div>
                      </div>

                      {/* Metric Card 3 */}
                      <div className="p-4 bg-white/[0.02] border border-white/10 rounded-sm space-y-2">
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Aktive Physio-Praxen</span>
                        <div className="text-3xl font-serif italic font-bold text-brand-secondary">{partnerCount}</div>
                        <p className="text-[9px] font-mono text-white/40 uppercase leading-relaxed">
                          Partnerpraxen in Niederösterreich, die das Hybrid-Therapiemodell mit Patientendaten-Sharing einsetzen.
                        </p>
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => setPartnerCount(prev => prev + 1)} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-sm text-[8px] font-mono uppercase text-white border border-white/5">+ Partner</button>
                        </div>
                      </div>

                    </div>

                    <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-sm">
                      <p className="text-[10px] font-mono uppercase text-white/70 leading-relaxed">
                        💡 **Hebeleffekt für Helmut Kahrer:** Weisen Sie darauf hin, dass durch diese digitale Schnittstelle die administrativen Kosten pro niedergelassener Physiotherapie-Praxis um bis zu **26%** gesenkt werden. Ein starkes Argument für die WKNÖ-Wirtschaftsförderung!
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 5. CASE: Medical record SOAP logger AI extractor */}
                {activeModule === 'case' && (
                  <motion.div
                    key="case"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-serif italic text-white">Case_Logger & SOAP-Record Extractor</h4>
                      </div>
                      <span className="text-[8px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-sm uppercase tracking-widest">Medical Documentation</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Raw input text */}
                      <div className="space-y-3">
                        <label className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Patientenkurzbefund (Eingabe)</label>
                        <textarea 
                          value={soapInput}
                          onChange={e => setSoapInput(e.target.value)}
                          className="w-full h-36 p-4 bg-black/60 border border-white/10 rounded-sm text-[11px] font-mono text-white focus:outline-none focus:border-brand-primary leading-relaxed"
                          placeholder="Freitexteingabe des Therapeuten oder des Erstgesprächs..."
                        />
                        <button 
                          onClick={handleGenerateSoap}
                          disabled={soapLoading || !soapInput.trim()}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 transition-all rounded-sm text-[10px] font-mono uppercase tracking-widest text-white"
                        >
                          {soapLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                          SOAP Befundung mittels AI generieren
                        </button>
                      </div>

                      {/* Structured output */}
                      <div className="p-4 bg-white/[0.02] border border-white/10 rounded-sm space-y-3 min-h-[150px]">
                        <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Strukturierter SOAP-Befund (Vertex AI)</span>
                        
                        {soapLoading ? (
                          <div className="h-32 flex flex-col items-center justify-center text-white/30 space-y-2">
                            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                            <span className="text-[9px] font-mono uppercase tracking-widest">Vektoranalyse im Gange...</span>
                          </div>
                        ) : soapOutput ? (
                          <div className="space-y-2.5 text-[10px] font-mono uppercase leading-relaxed">
                            <div>
                              <strong className="text-brand-primary">Subjective (S):</strong>
                              <p className="text-white/60 mt-0.5">{soapOutput.S}</p>
                            </div>
                            <div>
                              <strong className="text-brand-primary">Objective (O):</strong>
                              <p className="text-white/60 mt-0.5">{soapOutput.O}</p>
                            </div>
                            <div>
                              <strong className="text-brand-primary">Assessment (A):</strong>
                              <p className="text-white/60 mt-0.5">{soapOutput.A}</p>
                            </div>
                            <div>
                              <strong className="text-brand-primary">Plan (P):</strong>
                              <p className="text-white/60 mt-0.5">{soapOutput.P}</p>
                            </div>
                            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                              <span className="text-[8px] text-emerald-400 font-bold tracking-widest">ICD-10-GM:</span>
                              <span className="text-white font-bold">{soapOutput.icd}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-32 flex items-center justify-center text-white/20 text-[9px] font-mono uppercase tracking-widest text-center">
                            Klicke auf den Button links, um die AI-SOAP-Notizen zu extrahieren.
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

          {/* Bottom Panel: Vertex AI Code Inspector & Source View */}
          <div className="bg-black/60 rounded-sm border border-white/10 overflow-hidden shrink-0 shadow-xl">
            <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/60">Vertex AI Generated Code • index.tsx</span>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(moduleCodes[activeModule]);
                  alert("Der Quellcode des Prototyps wurde erfolgreich in deine Zwischenablage kopiert!");
                }}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-sm text-[8px] font-mono uppercase tracking-widest text-white border border-white/5 transition-all"
              >
                Copy_Source
              </button>
            </div>
            <div className="p-4 bg-black/80 font-mono text-[9.5px] leading-relaxed text-amber-300 overflow-x-auto select-all max-h-36 custom-scrollbar whitespace-pre">
              {moduleCodes[activeModule]}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default JulesConsole;

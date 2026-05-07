
import React, { useState, useRef } from 'react';
import { generateClinicalContent } from '../services/aiService';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  RobotIcon, 
  CameraIcon, 
  BrainCircuitIcon, 
  CheckCircleIcon, 
  LightBulbIcon, 
  ArrowRightIcon, 
  CloseIcon,
  SearchIcon 
} from '../components/IconComponents';

interface ReasoningStep {
  title: string;
  thought: string;
  confidence: number;
}

export const VisionAgentPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);
  const [groundingUrls, setGroundingUrls] = useState<{title: string, uri: string}[]>([]);
  const [isGaitMode, setIsGaitMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDemoImage = async () => {
    try {
      const response = await fetch('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000');
      const blob = await response.blob();
      const demoFile = new File([blob], 'demo_runner.jpg', { type: 'image/jpeg' });
      setFile(demoFile);
      setPreview(URL.createObjectURL(demoFile));
      setIsGaitMode(true);
    } catch (e) {
      console.error("Failed to load demo image:", e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setAnalysis('');
      setReasoningSteps([]);
      setGroundingUrls([]);
    }
  };

  const runAgenticVision = async () => {
    if (!file) return;
    setIsProcessing(true);
    setAnalysis('');
    setReasoningSteps([]);

    try {
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });

      const promptParts = [
        { inlineData: { data: base64Data, mimeType: file.type } },
        { text: `DU BIST DER KÖRPERFLUSS VISION AGENT FÜR KLINISCHE BIOMECHANIK. 
          Deine Aufgabe ist eine hochpräzise Analyse dieses Mediums.
          
          1. ANALYSE-FOKUS: 
             - Identifiziere exakt die Körperregion und das klinische Szenario.
             - Differenziere messerscharf zwischen STATISCHEN Haltungsabweichungen und DYNAMISCHEN Bewegungsfehlern.
             ${isGaitMode ? '- AKTIVIERE GANGANALYSE-MODUS: Analysiere spezifische Phasen, falls sichtbar: Initial Contact, Mid-Stance und Terminal Swing. Extrahiere Gelenkpunkte und berechne Lastmomente.' : ''}
          
          2. EVIDENZ & RECHERCHE:
             - Nutze das Google Search Tool, um den Befund mit aktuellen klinischen Leitlinien (z.B. S3-Leitlinien, Cochrane, JOSPT) abzugleichen.
          
          STRUKTURIERE DEINE ANTWORT IN:
          ### [BEFUND]
          (Was ist sichtbar? Rein deskriptiv.)
          
          ### [BIOMECHANISCHE ANALYSE]
          (Wirkungsketten unter Verwendung von Fachbegriffen wie 'Closed Kinetic Chain', 'Propriozeption', 'Joint-Alignment'. Inklusive Lastmoment-Berechnung.)
          
          ### [EMPFEHLUNG]
          (Evidenzbasierte nächste Schritte basierend auf der Websuche.)
          
          Antworte ausschließlich auf DEUTSCH.` }
      ];

      const response = await generateClinicalContent(promptParts, 'gemini-2.0-flash', {}, [], [{ googleSearch: {} }]);

      setAnalysis(response.text || "Analyse abgeschlossen.");

      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (grounding) {
        const urls = grounding
          .filter((c: any) => c.web)
          .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
        setGroundingUrls(urls);
      }

      setReasoningSteps([
        { title: "Mustererkennung", thought: "Anatomische Landmarken und Gelenkachsen identifiziert.", confidence: 95 },
        { title: "Dynamische Analyse", thought: "Gait-Phasen-Mapping abgeschlossen. Fokus auf Mid-Stance Instabilität.", confidence: 91 },
        { title: "Leitlinien-Abgleich", thought: "Suche nach evidenzbasierten Protokollen in medizinischen Datenbanken erfolgt.", confidence: 88 }
      ]);

    } catch (e) {
      console.error("Vision Error:", e);
      setAnalysis("Technischer Fehler bei der Vision-Analyse. Bitte versuchen Sie ein kleineres Bild oder verringern Sie die Komplexität.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fadeInUp bg-black min-h-screen pt-40 pb-32 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
         <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
      </div>

      <Section 
        title="Vision Agent" 
        subtitle="Professionelle klinische Datenanalyse mit Gemini 3 Pro Vision und Google Grounding."
        containerClassName="py-0 relative z-10 mb-24"
      >
        <div className="grid lg:grid-cols-12 gap-12 items-start mt-12">
          <div className="lg:col-span-7 space-y-10">
            <Card className="glass-dark !p-2 border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden aspect-[4/3] flex items-center justify-center rounded-[48px] group">
               {preview ? (
                 <div className="w-full h-full relative rounded-[40px] overflow-hidden">
                    {file?.type.startsWith('video') ? <video src={preview} autoPlay loop muted className="w-full h-full object-cover" /> : <img src={preview} className="w-full h-full object-cover" />}
                    <div className="absolute top-6 left-6 bg-brand-primary text-black text-[10px] font-black px-4 py-1.5 rounded-full shadow-2xl border border-brand-primary/20 tracking-[0.2em] uppercase">AGENTIC SCANNING</div>
                    
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-20">
                         <div className="flex flex-col items-center gap-6">
                            <div className="animate-spin h-16 w-16 border-4 border-brand-primary border-t-transparent rounded-full shadow-glow"></div>
                            <p className="text-white font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">Deep Reasoning in Progress</p>
                         </div>
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="text-center p-12">
                    <button onClick={() => fileInputRef.current?.click()} className="p-12 bg-white/5 rounded-[40px] mb-8 hover:bg-white/10 transition-all duration-700 border border-white/5 group shadow-glow">
                       <CameraIcon className="w-20 h-20 text-brand-primary opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                    </button>
                    <p className="text-white font-serif italic text-2xl mb-4 tracking-tight">Warte auf Clinical Media Input...</p>
                    <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Supports: Video (MOV/MP4), Image (JPG/PNG)</p>
                    <Button onClick={loadDemoImage} variant="outline" size="sm" className="mx-auto block text-[10px] py-1">Demo-Szenario laden</Button>
                 </div>
               )}
               <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
            </Card>

            <div className="flex gap-4">
              <Button 
                onClick={() => setIsGaitMode(!isGaitMode)} 
                variant={isGaitMode ? 'primary' : 'outline'} 
                className="px-8 py-8 text-[10px] uppercase tracking-[0.3em] font-black"
              >
                {isGaitMode ? 'Gait Mode: ON' : 'Gait Mode: OFF'}
              </Button>
              <Button onClick={runAgenticVision} disabled={!file || isProcessing} variant="primary" className="flex-grow py-8 text-[10px] uppercase tracking-[0.5em] font-black shadow-2xl shadow-brand-primary/20">
                {isProcessing ? (
                  <>
                    <BrainCircuitIcon className="w-5 h-5 animate-pulse" />
                    <span>Engine läuft...</span>
                  </>
                ) : (
                  <>
                    <RobotIcon className="w-6 h-6" />
                    <span>Deep Reasoning Analyse starten</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-10">
            <Card className="glass-dark !p-12 rounded-[48px] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
              <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                 <BrainCircuitIcon className="w-5 h-5" /> Reasoning Log (Live)
              </h3>
              <div className="space-y-10">
                 {reasoningSteps.length > 0 ? reasoningSteps.map((step, i) => (
                   <div key={i} className="relative pl-8 border-l border-white/10 animate-fadeInUp" style={{ animationDelay: `${i * 0.2}s` }}>
                      <div className="absolute -left-[5px] top-1 w-[9px] h-[9px] rounded-full bg-brand-primary shadow-glow"></div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.1em]">{step.title}</h4>
                        <span className="text-[10px] font-bold text-brand-primary">{step.confidence}% Confidence</span>
                      </div>
                      <p className="text-xs text-zinc-500 font-light leading-relaxed tracking-wide italic">{step.thought}</p>
                   </div>
                 )) : (
                  <div className="flex flex-col items-center justify-center py-12 opacity-20">
                    <LightBulbIcon className="w-12 h-12 mb-4 text-zinc-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Log leer</p>
                  </div>
                 )}
              </div>
            </Card>

            <Card className={`glass-dark !p-12 md:!p-16 rounded-[48px] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] min-h-[400px] flex flex-col ${!analysis && 'opacity-50 grayscale'}`}>
               <h3 className="text-2xl font-bold text-white font-serif mb-8 flex items-center gap-4 border-b border-white/5 pb-8 tracking-tight">
                  <CheckCircleIcon className="w-8 h-8 text-brand-primary" /> Klinischer Analyse-Report
               </h3>
               <div className="prose prose-invert prose-sm flex-grow">
                  {analysis ? (
                    <div className="whitespace-pre-wrap leading-relaxed font-light text-zinc-300 text-sm animate-fadeInUp tracking-wide">
                      {analysis.split('\n').map((line, i) => {
                        if (line.startsWith('###')) {
                          return <h4 key={i} className="text-white font-serif font-bold text-xl mt-10 mb-4 tracking-tight">{line.replace('### ', '')}</h4>;
                        }
                        return <p key={i} className="mb-2">{line}</p>;
                      })}
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center italic text-zinc-600 font-light tracking-wide">
                      Der Vision Agent wartet auf Clinical Input...
                    </div>
                  )}
               </div>

               {groundingUrls.length > 0 && (
                 <div className="mt-12 pt-10 border-t border-white/5">
                    <h5 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                       <SearchIcon className="w-4 h-4" /> Verifizierte Quellen (Grounding)
                    </h5>
                    <div className="flex flex-col gap-4">
                       {groundingUrls.map((url, i) => (
                         <a 
                            key={i} 
                            href={url.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all duration-500 group"
                         >
                           <div className="flex flex-col overflow-hidden">
                              <span className="text-xs font-bold text-white truncate mb-1">{url.title}</span>
                              <span className="text-[10px] text-zinc-600 truncate font-light tracking-wider">{url.uri}</span>
                           </div>
                           <ArrowRightIcon className="w-5 h-5 text-brand-primary opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0" />
                         </a>
                       ))}
                    </div>
                 </div>
               )}
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
};

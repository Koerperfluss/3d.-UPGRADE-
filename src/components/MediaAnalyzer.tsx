
import React, { useState, useRef } from 'react';
import { generateClinicalContent } from '../services/aiService';
import { Card } from './Card';
import { Button } from './Button';
import { 
  CameraIcon, 
  VideoLibraryIcon, 
  DocumentScannerIcon, 
  BrainCircuitIcon, 
  SimulationIcon, 
  ArrowRightIcon,
  WarningIcon,
  SearchIcon,
  CloudUploadIcon,
  SaveIcon,
  DocumentTextIcon,
  LightBulbIcon,
  AcademicCapIcon
} from './IconComponents';

type AnalysisType = 'gait' | 'posture' | 'exercise' | 'skillcheck';
type ViewMode = 'patient' | 'pro';
type ReasoningMode = 'chain' | 'explanation';

export const MediaAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [contextFiles, setContextFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('gait');
  const [viewMode, setViewMode] = useState<ViewMode>('pro');
  const [reasoningMode, setReasoningMode] = useState<ReasoningMode>('chain');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [groundingLinks, setGroundingLinks] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contextInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 30 * 1024 * 1024) {
        setErrorMessage("Video sehr groß. Analyse könnte länger dauern oder abbrechen. Empfehlung: < 10 Sek.");
      } else {
        setErrorMessage(null);
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setGroundingLinks([]);
    }
  };

  const handleContextFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        setContextFiles(prev => [...prev, ...files]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const runAnalysis = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setResult(null);
    setErrorMessage(null);
    setGroundingLinks([]);

    try {
      const mediaBase64 = await fileToBase64(file);
      
      const contextParts = await Promise.all(contextFiles.map(async (f) => ({
          inlineData: {
              data: await fileToBase64(f),
              mimeType: f.type || 'application/pdf'
          }
      })));

      // --- LOGIC SWITCH BASED ON REASONING MODE ---
      let reasoningInstruction = "";
      if (reasoningMode === 'chain') {
          reasoningInstruction = `
            MODUS: WIRKUNGSKETTEN-ANALYSE (DEEP REASONING).
            Ziel: Erstelle eine KAUSALE KETTE. Nicht nur beschreiben, sondern herleiten.
            Struktur der Findings:
            1. Ursache (Root Cause, z.B. eingeschränkte Dorsalextension)
            2. Kompensations-Mechanismus (z.B. Valgus-Kollaps Knie)
            3. Resultierende Symptomatik/Belastung.
            Verbinde entfernte Körperregionen (z.B. Fuß -> LWS).
          `;
      } else {
          reasoningInstruction = `
            MODUS: BIOMECHANISCHE ERKLÄRUNG & IMBALANCEN.
            Ziel: Deskriptive Analyse des Ist-Zustands.
            Fokus auf:
            1. Statik & Achsenabweichungen.
            2. Muskel-Dysbalancen (Agonist vs. Antagonist).
            3. Sichtbare Bewegungseinschränkungen.
            Erkläre "Was" und "Wie", weniger das komplexe "Warum" der Historie.
          `;
      }

      let specificInstructions = "";
      if (analysisType === 'gait') {
        specificInstructions = `
          FOKUS: KLINISCHE GANGANALYSE.
          ${reasoningInstruction}
          Achte auf: Initial Contact, Mid-Stance, Terminal Swing.
        `;
      } else if (analysisType === 'posture') {
        specificInstructions = `
          FOKUS: STATISCHE HALTUNGSANALYSE.
          ${reasoningInstruction}
          Achte auf: Lotlinie, Beckenstand, Schulterhöhe.
        `;
      } else if (analysisType === 'skillcheck') {
        specificInstructions = `
          FOKUS: PRAKTISCHER SKILL-CHECK (GRIFFTECHNIK/MANUELLE THERAPIE).
          ${reasoningInstruction}
          Achte auf: Handplatzierung, Kraftvektor, Geschwindigkeit, Ergonomie des Therapeuten.
          Gib konstruktives Feedback zur Verbesserung der Technik.
        `;
      } else {
        specificInstructions = `
          FOKUS: BEWEGUNGSQUALITÄT.
          ${reasoningInstruction}
          Achte auf: Ausweichbewegungen, Zittern, Asymmetrie.
        `;
      }

      const prompt = `
        AGIERE ALS LEITENDER PHYSIOTHERAPEUT UND BIOMECHANIKER.
        
        ${contextFiles.length > 0 ? `WICHTIG: Nutze für deine Analyse und Empfehlungen EXPLIZIT das Wissen aus den angehängten PDF-Studien.` : ''}
        
        ${specificInstructions}
        
        AUFGABE: Erstelle einen strukturierten JSON-Bericht.
        STRUKTUR (JSON):
        {
          "header": { "title": "Klinischer Befund", "status": "Auffällig" | "Kritisch" | "Unauffällig" },
          "professional_report": {
            "summary": "Prägnante Zusammenfassung (Fachsprache).",
            "findings": [{ "point": "Struktur/Bereich", "severity": "high"|"medium"|"low", "logic": "Der Inhalt der Analyse basierend auf dem gewählten Modus." }]
          },
          "patient_report": {
            "summary": "Verständliche Erklärung ohne Fachjargon.",
            "findings": [{ "point": "Beobachtung", "logic": "Einfache Erklärung." }]
          },
          "action_plan": [{ "step": "Maßnahme", "reason": "Begründung." }]
        }
      `;

      const promptParts = [
        { inlineData: { data: mediaBase64, mimeType: file.type } },
        ...contextParts,
        { text: prompt }
      ];

      const response = await generateClinicalContent(
        promptParts, 
        'gemini-2.0-flash', 
        {
          thinkingConfig: reasoningMode === 'chain' ? { thinkingBudget: 16000 } : undefined,
          responseMimeType: "application/json"
        },
        [],
        [{ googleSearch: {} }]
      );

      const responseText = response.text || "{}";
      setResult(JSON.parse(responseText));
      
      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (grounding) {
        setGroundingLinks(grounding.filter((c: any) => c.web).map((c: any) => c.web));
      }

    } catch (e: any) {
      console.error("Analysis Error:", e);
      setErrorMessage("Ein Fehler ist aufgetreten. Bitte prüfen Sie API-Key oder Dateigröße.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveReport = () => {
      if (!result) return;
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Analyse_Bericht_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const currentReport = viewMode === 'pro' ? result?.professional_report : result?.patient_report;

  return (
    <div className="space-y-6">
      {/* Controls Container */}
      <div className="flex flex-col gap-4">
        
        {/* Row 1: Analysis Type */}
        <div className="flex gap-2 p-1.5 bg-brand-secondary/5 rounded-2xl border border-brand-border/40 overflow-x-auto">
          {[
            { id: 'gait', label: 'Ganganalyse', icon: <VideoLibraryIcon /> },
            { id: 'posture', label: 'Haltung', icon: <DocumentScannerIcon /> },
            { id: 'exercise', label: 'Übung', icon: <SimulationIcon /> },
            { id: 'skillcheck', label: 'Skill-Check', icon: <AcademicCapIcon /> }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setAnalysisType(type.id as AnalysisType)}
              className={`flex-1 min-w-[100px] p-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${analysisType === type.id ? 'bg-brand-secondary text-brand-primary shadow-lg' : 'text-brand-text-on-light-secondary hover:bg-white/60'}`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Row 2: Reasoning Mode & View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Reasoning Mode Toggle */}
            <div className="flex bg-white border border-brand-border rounded-xl p-1 shadow-sm">
                <button 
                    onClick={() => setReasoningMode('chain')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${reasoningMode === 'chain' ? 'bg-brand-primary text-brand-secondary shadow-sm' : 'text-brand-text-on-light-secondary hover:bg-brand-background'}`}
                >
                    <BrainCircuitIcon className="w-4 h-4" />
                    Wirkungskette
                </button>
                <button 
                    onClick={() => setReasoningMode('explanation')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${reasoningMode === 'explanation' ? 'bg-brand-primary text-brand-secondary shadow-sm' : 'text-brand-text-on-light-secondary hover:bg-brand-background'}`}
                >
                    <LightBulbIcon className="w-4 h-4" />
                    Biomechanik
                </button>
            </div>

            {/* View Mode Toggle (Only visible if result exists) */}
            {result && (
            <div className="flex bg-brand-primary/10 p-1 rounded-xl border border-brand-primary/20 self-start md:self-auto">
                <button onClick={() => setViewMode('patient')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'patient' ? 'bg-brand-primary text-brand-secondary shadow-md' : 'text-brand-primary/60'}`}>Patient</button>
                <button onClick={() => setViewMode('pro')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'pro' ? 'bg-brand-primary text-brand-secondary shadow-md' : 'text-brand-primary/60'}`}>Pro</button>
            </div>
            )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Input Area */}
        <div className="space-y-4">
          <Card className="p-1 bg-brand-secondary border-none shadow-2xl relative overflow-hidden aspect-[4/3] flex items-center justify-center rounded-3xl group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {preview ? (
              <div className="w-full h-full relative">
                {file?.type.startsWith('video') 
                  ? <video src={preview} className="w-full h-full object-cover" autoPlay loop muted playsInline /> 
                  : <img src={preview} className="w-full h-full object-cover" alt="Vorschau" />
                }
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-brand-secondary/80 backdrop-blur-[4px] flex flex-col items-center justify-center z-10">
                     <BrainCircuitIcon className="w-16 h-16 text-brand-primary animate-pulse mb-6" />
                     <p className="text-white font-black uppercase text-sm tracking-widest mb-2">
                         {reasoningMode === 'chain' ? 'Analysiere Wirkungsketten...' : 'Analysiere Imbalancen...'}
                     </p>
                     <p className="text-white/60 text-xs font-mono">Gemini 3.0 Pro Reasoning</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-12">
                <CameraIcon className="w-16 h-16 text-brand-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Video/Bild hochladen</p>
                <p className="text-white/30 text-[8px] mt-2 italic">Empfohlen: 5-10 Sek. Video</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
          </Card>

          {/* Expert Context Upload */}
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm">
             <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-brand-secondary flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4 text-brand-primary" /> Wissens-Kontext (RAG)
                </h4>
                <button onClick={() => contextInputRef.current?.click()} className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1">
                    <CloudUploadIcon className="w-3 h-3" /> PDF hinzufügen
                </button>
             </div>
             {contextFiles.length > 0 ? (
                 <div className="space-y-2">
                     {contextFiles.map((f, i) => (
                         <div key={i} className="flex items-center justify-between bg-brand-background px-3 py-2 rounded-lg border border-brand-border/50 text-xs">
                             <span className="truncate max-w-[200px] text-brand-text-on-light">{f.name}</span>
                             <span className="text-[9px] text-brand-text-on-light-secondary font-mono">{(f.size/1024).toFixed(0)}KB</span>
                         </div>
                     ))}
                 </div>
             ) : (
                 <p className="text-[10px] text-brand-text-on-light-secondary italic text-center py-2">
                     Laden Sie Studien oder Leitlinien (PDF) hoch, damit die KI diese für die Analyse nutzt.
                 </p>
             )}
             <input type="file" ref={contextInputRef} className="hidden" onChange={handleContextFilesChange} accept="application/pdf" multiple />
          </div>

          <Button onClick={runAnalysis} disabled={!file || isAnalyzing} variant="primary" className="w-full py-5 shadow-glow">
             {isAnalyzing ? "Analysiere..." : "Analyse starten"}
          </Button>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-fadeInUp">
                <WarningIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700 font-bold leading-relaxed">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Dashboard Output */}
        <Card className="bg-white border-brand-border/40 shadow-xl rounded-[2rem] min-h-[500px] p-0 overflow-hidden flex flex-col relative">
          <header className="bg-brand-background border-b border-brand-border/30 p-6 flex justify-between items-center">
              <div>
                <h3 className="text-brand-secondary font-bold font-serif text-xl">Ergebnis</h3>
                <span className="text-[9px] font-black uppercase text-brand-primary tracking-wider">
                    {viewMode === 'pro' ? (reasoningMode === 'chain' ? 'Wirkungskette' : 'Biomechanik') : 'Patienten-Information'}
                </span>
              </div>
              {result && (
                 <div className="flex gap-2">
                     <button onClick={saveReport} className="p-2 bg-brand-surface rounded-full border border-brand-border hover:border-brand-primary transition-colors" title="In Drive speichern (Download)">
                        <SaveIcon className="w-4 h-4 text-brand-secondary" />
                     </button>
                     <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border flex items-center ${result.header.status === 'Unauffällig' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200 animate-pulse'}`}>
                        {result.header.status}
                     </span>
                 </div>
              )}
          </header>

          <div className="p-8 flex-grow overflow-y-auto custom-scrollbar">
            {!result && !isAnalyzing && (
              <div className="h-64 flex flex-col items-center justify-center opacity-20 text-center">
                <SimulationIcon className="w-16 h-16 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">Warte auf Clinical Input</p>
              </div>
            )}

            {result && (
              <div className="space-y-8 animate-fadeInUp">
                <div className={`p-5 rounded-2xl border shadow-inner ${result.header.status !== 'Unauffällig' ? 'bg-red-50/50 border-red-100' : 'bg-brand-background border-brand-border'}`}>
                  <h4 className="text-[10px] font-black uppercase text-brand-primary mb-2">Befund-Zusammenfassung</h4>
                  <p className="text-sm font-bold text-brand-secondary leading-relaxed">{currentReport.summary}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-brand-text-on-light-secondary border-b border-brand-border pb-2">
                      {viewMode === 'pro' ? (reasoningMode === 'chain' ? 'Kausale Kette' : 'Beobachtungen') : 'Erklärung'}
                  </h4>
                  {currentReport.findings.map((f: any, i: number) => (
                    <div key={i} className="p-4 bg-brand-surface rounded-xl border border-brand-border/50 shadow-sm hover:border-brand-primary/30 transition-colors">
                       <div className="flex justify-between items-start mb-2">
                          <span className="font-black text-[11px] text-brand-secondary uppercase tracking-wide">{f.point}</span>
                          {f.severity && <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${f.severity === 'high' ? 'bg-red-100 text-red-700' : f.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{f.severity} Priority</div>}
                       </div>
                       <p className="text-[11px] text-brand-text-on-light leading-relaxed font-medium">{f.logic}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-brand-text-on-light-secondary border-b border-brand-border pb-2">
                      {viewMode === 'pro' ? 'Interventionen' : 'Nächste Schritte'}
                  </h4>
                  <div className="grid gap-3">
                    {result.action_plan.map((step: any, i: number) => (
                      <div key={i} className="flex gap-4 p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                        <div className="w-6 h-6 bg-brand-primary text-brand-secondary rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 shadow-sm">{i+1}</div>
                        <div>
                          <p className="text-xs font-black text-brand-secondary">{step.step}</p>
                          <p className="text-[10px] text-brand-text-on-light-secondary mt-1">{step.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {groundingLinks.length > 0 && (
                  <div className="pt-6 border-t border-brand-border">
                    <h4 className="text-[10px] font-black uppercase text-brand-primary mb-4 flex items-center gap-2">
                       <SearchIcon className="w-3 h-3" /> Evidenzbasis (Quellen)
                    </h4>
                    <div className="grid gap-2">
                      {groundingLinks.map((link, i) => (
                        <a key={i} href={link.uri} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white border border-brand-border rounded-xl hover:border-brand-primary hover:bg-brand-primary/5 transition-all group">
                          <span className="text-[10px] font-bold text-brand-secondary truncate pr-4">{link.title}</span>
                          <ArrowRightIcon className="w-3 h-3 text-brand-primary group-hover:translate-x-1 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FDE68A; border-radius: 10px; }
      `}} />
    </div>
  );
};

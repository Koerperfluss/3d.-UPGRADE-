
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
  CheckCircleIcon,
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
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contextInputRef = useRef<HTMLInputElement>(null);

  const loadDemoVideo = () => {
    setIsDemoMode(true);
    setPreview('demo_placeholder');
    setResult(null);
    setErrorMessage(null);
    
    // Auto start analysis after 1 second of loading demo video
    setTimeout(() => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setResult({
                isSimulated: true,
                header: { title: "Klinischer Befund: Kniebeuge", status: "Korrekturbedarf" },
                professional_report: {
                    summary: "Die Patientin zeigt bei der Kniebeuge eine leichte Valgusabweichung sowie eine übermäßige Rumpfvorneigung. Zudem fällt eine Innenrotation des rechten Fußes auf.",
                    findings: [
                        { point: "Knieachse", severity: "low", logic: "Wird weitgehend stabil gehalten. Leichter Valgus-Kollaps < 5° in der tiefsten Phase der Flexion. (Gut)", chain_of_thought: { cause: "Leichte Schwäche Gluteus Medius", compensation: "Tibianrotation", symptom: "Patellafehlgleiten" }, coordinates: { x: 45, y: 70 } },
                        { point: "Rumpfneigung", severity: "medium", logic: "Signifikante Rumpfvorneigung gemessen bei 34° (Norm: < 25°). Deutet auf Schwäche im M. gluteus maximus oder eingeschränkte Sprunggelenksbeweglichkeit hin. (Optimierungsbedarf)", chain_of_thought: { cause: "Eingeschränkte Plantarflexion OSG", compensation: "Verstärkte Hüftflexion", symptom: "Überlastung der lumbalen Erektoren" }, coordinates: { x: 50, y: 35 } },
                        { point: "Fußstellung", severity: "high", logic: "Deutliche Innenrotation des rechten Fußes während der exzentrischen Phase. (Korrekturbedarf)", chain_of_thought: { cause: "Eingeschränkte Dorsalextension", compensation: "Eversion / Pronation", symptom: "Tibialis Posterior Insuffizienz" }, coordinates: { x: 40, y: 90 } }
                    ]
                },
                action_plan: [
                    { step: "Lokalspezifisches Screening", reason: "Beweglichkeitstests für das obere Sprunggelenk (Dorsalextension) beidseits." },
                    { step: "Kräftigung", reason: "Isolierte Aktivierung der Hüftabduktoren und Außenrotatoren rechts." }
                ]
            });
        }, 3000);
    }, 500);
  };

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
        
        AUFGABE: Erstelle einen strukturierten JSON-Bericht. Generiere für jede erkannte Abweichung eine detaillierte biomechanische 'Wirkungskette' (Ursache -> Kompensation -> Symptom), inklusive möglicher Erklärungen. Diese Kette soll als 'chain_of_thought' im Report dargestellt werden.
        STRUKTUR (JSON):
        {
          "header": { "title": "Klinischer Befund", "status": "Auffällig" | "Kritisch" | "Unauffällig" },
          "professional_report": {
            "summary": "Prägnante Zusammenfassung (Fachsprache).",
            "findings": [{ "point": "Struktur/Bereich", "severity": "high"|"medium"|"low", "logic": "Der Inhalt der Analyse, sowie mögliche Erklärungen für die Abweichungen.", "chain_of_thought": { "cause": "Ursache der Abweichung", "compensation": "Kompensationsmechanismus", "symptom": "symptomatische Ausprägung" }, "coordinates": { "x": 50, "y": 50 } }]
            // coordinates: x / y in Prozent (0-100), positioniert die Abweichung auf dem Bild/Video für visuelle Overlays. E.g. Valgus knee at x: 45, y: 70
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
        'gemini-2.5-flash', 
        {
          thinkingConfig: reasoningMode === 'chain' ? { thinkingBudget: 16000 } : undefined,
          responseMimeType: "application/json"
        }
      );

      const responseText = response.text || "{}";
      setResult(JSON.parse(responseText));
      
      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (grounding) {
        setGroundingLinks(grounding.filter((c: any) => c.web).map((c: any) => c.web));
      }

    } catch (e: any) {
      console.error("Analysis Error:", e);
      if (e?.isTrusted || e instanceof ProgressEvent) {
          setErrorMessage("Die Mediendatei konnte nicht geladen werden oder ist zu groß. Bitte verwenden Sie ein kürzeres Video (max. 10 Sekunden) oder ein kleineres Bild.");
      } else {
          setErrorMessage(e?.message || "Ein Fehler ist aufgetreten. Bitte prüfen Sie API-Key oder Dateigröße.");
      }
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
          <Card className={`p-1 bg-brand-secondary border-none shadow-2xl relative overflow-hidden aspect-[4/3] flex items-center justify-center rounded-3xl group ${!isDemoMode ? 'cursor-pointer' : ''}`} onClick={() => !isDemoMode && fileInputRef.current?.click()}>
            {preview ? (
              <div className={`w-full h-full relative ${preview === 'demo_placeholder' ? 'flex flex-col items-center justify-center bg-zinc-800 rounded-[30px]' : ''}`}>
                {preview === 'demo_placeholder' ? (
                  <div className="flex flex-col items-center justify-center">
                    <VideoLibraryIcon className="w-16 h-16 text-zinc-500 mb-4" />
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center px-4">Demo: Student führt Kniebeuge aus</span>
                  </div>
                ) : file?.type.startsWith('video') 
                  ? <video src={preview} className="w-full h-full object-cover" autoPlay loop muted playsInline /> 
                  : <img src={preview} className="w-full h-full object-cover" alt="Vorschau" />
                }
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-brand-secondary/80 backdrop-blur-[4px] flex flex-col items-center justify-center z-10">
                     <BrainCircuitIcon className="w-16 h-16 text-brand-primary animate-pulse mb-6" />
                     <p className="text-white font-black uppercase text-sm tracking-widest mb-2">
                         KI analysiert klinisches Bild...
                     </p>
                     <p className="text-white/60 text-xs font-mono">Gemini 3.0 Pro Reasoning</p>
                  </div>
                )}
                {!isAnalyzing && result?.professional_report?.findings && (
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    {result.professional_report.findings.map((finding: any, idx: number) => {
                      if (!finding.coordinates || typeof finding.coordinates.x !== 'number' || typeof finding.coordinates.y !== 'number') return null;
                      return (
                        <div 
                          key={idx}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto group cursor-help z-30"
                          style={{ left: `${finding.coordinates.x}%`, top: `${finding.coordinates.y}%` }}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.5)] animate-pulse flex items-center justify-center ${finding.severity === 'high' ? 'bg-red-500' : finding.severity === 'medium' ? 'bg-amber-500' : 'bg-brand-primary'}`}>
                             <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/90 backdrop-blur-xl text-white text-[10px] p-3 rounded-xl border border-white/10 shadow-2xl w-56 text-center pointer-events-none absolute top-full">
                             <strong className={`block mb-1 uppercase tracking-widest ${finding.severity === 'high' ? 'text-red-400' : finding.severity === 'medium' ? 'text-amber-400' : 'text-brand-primary'}`}>{finding.point}</strong>
                             <span className="font-light leading-relaxed opacity-90">{finding.logic}</span>
                          </div>
                        </div>
                      );
                    })}
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
          
          <Button onClick={loadDemoVideo} variant="outline" className="w-full py-3 text-[10px] uppercase tracking-widest border-brand-border/40 hover:bg-brand-background text-brand-text-on-light">
             ▶️ Demo-Video laden: Kniebeuge-Analyse
          </Button>

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
             <div className="flex items-center space-x-2">
                {isAnalyzing ? <div className="animate-spin h-5 w-5 border-2 border-brand-secondary border-t-transparent rounded-full" /> : <BrainCircuitIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />}
                <span>{isAnalyzing ? "KI analysiert klinisches Bild..." : "Analyse starten"}</span>
             </div>
          </Button>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-fadeInUp">
                <WarningIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700 font-bold leading-relaxed">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Dashboard Output */}
        <Card className="bg-white border-brand-border/40 shadow-xl rounded-[2rem] h-full min-h-[500px] max-h-[85vh] p-0 overflow-hidden flex flex-col relative w-full">
          <header className="bg-brand-background border-b border-brand-border/30 p-6 md:p-8 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-brand-secondary font-bold font-serif text-2xl mb-1">Ergebnis</h3>
                <span className="text-[10px] font-black uppercase text-brand-primary tracking-widest">
                    {viewMode === 'pro' ? (reasoningMode === 'chain' ? 'Wirkungskette' : 'Biomechanik') : 'Patienten-Information'}
                </span>
              </div>
              {result && (
                 <div className="flex gap-3">
                     <button onClick={saveReport} className="p-3 bg-white rounded-full border border-brand-border/50 hover:bg-brand-background hover:scale-105 transition-all shadow-sm" title="In Drive speichern (Download)">
                        <SaveIcon className="w-5 h-5 text-brand-secondary" />
                     </button>
                     <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-full border flex items-center shadow-sm ${result?.header?.status === 'Unauffällig' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200 animate-pulse'}`}>
                        {result?.header?.status}
                     </span>
                 </div>
              )}
          </header>

          <div className="p-6 md:p-10 flex-grow overflow-y-auto custom-scrollbar">
            {!result && !isAnalyzing && (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center opacity-30 text-center">
                <SimulationIcon className="w-20 h-20 mb-6" />
                <p className="text-sm font-black uppercase tracking-[0.2em]">Warte auf Clinical Input</p>
              </div>
            )}

            {result && (
              <div className="space-y-10 animate-fadeInUp w-full">
                <div className={`p-6 md:p-8 rounded-3xl border shadow-sm ${result?.header?.status !== 'Unauffällig' ? 'bg-red-50/40 border-red-100' : 'bg-brand-background/40 border-brand-border/50'}`}>
                  <h4 className="text-xs font-black uppercase tracking-widest text-brand-primary mb-4 flex items-center gap-2">
                     <DocumentTextIcon className="w-4 h-4" /> Befund-Zusammenfassung
                  </h4>
                  <p className="text-base md:text-lg font-medium text-brand-secondary leading-relaxed md:leading-loose">{currentReport?.summary}</p>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-brand-text-on-light-secondary border-b border-brand-border/60 pb-3 flex items-center gap-2">
                      <BrainCircuitIcon className="w-4 h-4" /> {viewMode === 'pro' ? (reasoningMode === 'chain' ? 'Kausale Kette' : 'Beobachtungen') : 'Erklärung'}
                  </h4>
                  {currentReport?.findings?.map((f: any, i: number) => (
                    <div key={i} className="p-6 md:p-8 bg-white rounded-3xl border border-brand-border/40 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all group">
                       <div className="flex justify-between items-start mb-4">
                          <span className="font-black text-[12px] md:text-sm text-brand-secondary uppercase tracking-widest flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${f.severity === 'high' ? 'bg-red-500' : f.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                             {f.point}
                          </span>
                          {f.severity && <div className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${f.severity === 'high' ? 'bg-red-50 text-red-700 border border-red-100' : f.severity === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>{f.severity} Priority</div>}
                       </div>
                       <p className="text-[14px] md:text-base text-brand-text-on-light leading-relaxed font-medium mb-5">{f.logic}</p>
                       
                       {f.chain_of_thought && viewMode === 'pro' && reasoningMode === 'chain' && (
                          <div className="mt-5 pt-5 border-t border-brand-border/30 grid grid-cols-1 gap-4 relative">
                             <div className="absolute top-6 bottom-6 left-3 w-[2px] bg-brand-primary/20 rounded-full"></div>
                             
                             <div className="relative pl-10">
                                <div className="absolute left-[9px] top-2 w-2 h-2 rounded-full bg-red-400 ring-4 ring-red-400/20"></div>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-brand-text-on-light-secondary mb-1">Ursache</span>
                                <span className="text-[13px] md:text-sm font-medium text-brand-secondary leading-relaxed block">{f.chain_of_thought.cause}</span>
                             </div>

                             <div className="relative pl-10">
                                <div className="absolute left-[9px] top-2 w-2 h-2 rounded-full bg-amber-400 ring-4 ring-amber-400/20"></div>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-brand-text-on-light-secondary mb-1">Kompensation</span>
                                <span className="text-[13px] md:text-sm font-medium text-brand-secondary leading-relaxed block">{f.chain_of_thought.compensation}</span>
                             </div>

                             <div className="relative pl-10">
                                <div className="absolute left-[9px] top-2 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"></div>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-brand-text-on-light-secondary mb-1">Symptomatik</span>
                                <span className="text-[13px] md:text-sm font-medium text-brand-secondary leading-relaxed block">{f.chain_of_thought.symptom}</span>
                             </div>
                          </div>
                       )}
                    </div>
                  ))}
                  
                  {result.isSimulated && (
                    <div className="p-6 mt-8 bg-zinc-50 rounded-2xl border border-zinc-200/60 flex flex-col md:flex-row items-start gap-4 shadow-inner">
                      <div className="p-2 bg-zinc-200/50 rounded-full shrink-0">
                         <BrainCircuitIcon className="w-5 h-5 text-zinc-500" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-1">Simulation Info</h4>
                        <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                          Dies ist ein <strong className="text-zinc-700">simulierter Beispiel-Report</strong>. Um echte Analysen durchzuführen, fügen Sie einen gültigen API Key (Server) hinzu oder deaktivieren Sie den Demo-Modus.
                        </p>
                      </div>
                    </div>
                  )}
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

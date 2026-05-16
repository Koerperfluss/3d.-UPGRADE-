
import React, { useState, useRef, useEffect } from 'react';
import { generateClinicalContent } from '../services/aiService';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RobotIcon, 
  CameraIcon, 
  BrainCircuitIcon, 
  CheckCircleIcon, 
  LightBulbIcon, 
  ArrowRightIcon, 
  SearchIcon,
  WarningIcon,
  SparklesIcon,
  DownloadIcon,
  EyeIcon
} from '../components/IconComponents';
import { SHOWCASE_CASES, simulateLmsExport, downloadAsPdf } from '../utils/demoFeatures';
import { useClinicalContext } from '../context/ClinicalContext';

interface ReasoningStep {
  title: string;
  thought: string;
  confidence: number;
}

export const VisionAgentPage: React.FC = () => {
  const { setVisionData, addCotStep, setCotMode } = useClinicalContext();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);
  const [groundingUrls, setGroundingUrls] = useState<{title: string, uri: string}[]>([]);
  
  // Ganganalyse 2.0 States
  const [isGaitMode, setIsGaitMode] = useState(false);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [simulatedGaitData, setSimulatedGaitData] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showToast, setShowToast] = useState(false);

  const loadDemoGait = () => {
    setIsGaitMode(true);
    setCotMode(true); // Auto-enable CoT for demo
    setPreview('demo_gait_placeholder');
    setAnalysis(`### [BEFUND]\nDynamischer Knie-Valgus rechts bei Initial Contact.\n\n### [BIOMECHANISCHE ANALYSE]\nEingeschränkte Hüftextension führt zu vorzeitigem Heel-Off (Kompensation). Vektor-Berechnung zeigt Varus-Thrust-Moment (+12Nm).\n\n### [EMPFEHLUNG]\nFokus auf Psoas-Längentraining und Kontrolle der Becken-Rotation in der Transversalebene.`);
    
    setSimulatedGaitData({
        parameters: [
            { name: 'Knie-Valgus-Winkel', current: '18°', target: '< 5°', status: 'warning' },
            { name: 'Becken-Rotation', current: '+12°', target: '4-8°', status: 'warning' },
            { name: 'Bodenreaktionskraft (GRF)', current: '112% BW', target: '100% BW', status: 'ok' },
            { name: 'Schrittlänge', current: '0.68m', target: '0.70-0.80m', status: 'ok' }
        ]
    });

    setVisionData({
      kneeAngleDegrees: 18,
      pelvicDropDegrees: 12,
      notes: "Dynamischer Knie-Valgus rechts, eingeschränkte Hüftextension."
    });
    
    setGroundingUrls([{ title: "JOSPT 2024: Gait Analysis Patterns", uri: "#" }]);
    
    addCotStep({
        phase: 'Parsing',
        description: 'Skelett-Overlay (PoseNet): Gelenkachsen für Becken und Knie via Vektormathematik berechnet.',
        confidence: 0.98,
        status: 'complete'
    });
    addCotStep({
        phase: 'Logik-Check',
        description: 'Kinematische Extraktion: Valgus-Vektor bei +18° detektiert. Kritischer Schwellenwert überschritten.',
        confidence: 0.94,
        status: 'complete'
    });
    addCotStep({
        phase: 'Evidenz-Mapping',
        description: 'Vergleich mit Gold-Standard JOSPT 2024: Gait Analysis Patterns erfolgreich.',
        confidence: 0.91,
        sources: [{ title: 'JOSPT 2024: Gait Analysis Patterns', url: 'https://www.jospt.org/' }],
        status: 'complete'
    });
  };

  const enableComparison = () => {
    setIsComparisonMode(true);
    loadDemoGait();
    setComparisonData({
      studentScore: 65,
      expertScore: 98,
      deviations: [
        "Knie-Valgus (+15° Diff)",
        "Becken-Drop contralateral"
      ]
    });
    setShowSkeleton(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setAnalysis('');
      setReasoningSteps([]);
      setGroundingUrls([]);
      setSimulatedGaitData(null);
      setComparisonData(null);
      setShowSkeleton(false);
    }
  };

  const runAgenticVision = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      loadDemoGait();
      setIsProcessing(false);
      setShowSkeleton(true);
    }, 2500);
  };

  useEffect(() => {
    const handleDemo = () => {
      if (!isProcessing && !preview) {
        runAgenticVision();
      }
    };
    window.addEventListener('demo-step-vision', handleDemo);
    return () => window.removeEventListener('demo-step-vision', handleDemo);
  }, [isProcessing, preview]);

  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-4 pb-32 relative text-white">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[200] bg-brand-success/90 border border-brand-success text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.3)] flex items-center gap-3 backdrop-blur-md animate-fadeInUp">
          <CheckCircleIcon className="w-6 h-6" />
          <span className="text-sm font-bold tracking-wide">Report wurde an Moodle übermittelt!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-10 mt-8">
        <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold font-serif uppercase tracking-tight mb-2">Skills Lab <span className="text-brand-primary lowercase font-light italic">Gait 2.0</span></h1>
            <p className="text-zinc-500 font-light text-xl">Skelett-Overlay, Vektor-Metriken & Dozenten-Vergleich</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start mt-8">
          <div className="lg:col-span-7 space-y-8">
             <Card className="bg-black/40 p-4 border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center rounded-[32px] group">
               {/* Viewer */}
               <div className="w-full flex gap-4 min-h-[400px]">
                 {preview ? (
                   <div className="relative flex-1 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 flex items-center justify-center">
                     {preview === 'demo_gait_placeholder' ? (
                        <div className="text-center relative w-full h-full flex items-center justify-center">
                            <RobotIcon className="w-16 h-16 text-brand-primary/50" />
                            {showSkeleton && (
                                <svg className="absolute inset-0 w-full h-full pointer-events-none scale-150 opacity-60" viewBox="0 0 100 100">
                                   <line x1="50" y1="20" x2="50" y2="45" stroke="#D4AF37" strokeWidth="1.5" />
                                   <line x1="35" y1="25" x2="65" y2="25" stroke="#D4AF37" strokeWidth="1.5" />
                                   <line x1="40" y1="45" x2="60" y2="45" stroke="#D4AF37" strokeWidth="1.5" />
                                   {/* Valgus error right leg */}
                                   <line x1="40" y1="45" x2="48" y2="70" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2,1" /> 
                                   <line x1="48" y1="70" x2="40" y2="95" stroke="#f43f5e" strokeWidth="1.5" />
                                   {/* Healthy left leg */}
                                   <line x1="60" y1="45" x2="60" y2="70" stroke="#10b981" strokeWidth="1.5" />
                                   <line x1="60" y1="70" x2="60" y2="95" stroke="#10b981" strokeWidth="1.5" />
                                </svg>
                            )}
                            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded text-[10px] font-bold text-brand-primary">Student</div>
                        </div>
                     ) : file?.type.startsWith('video') ? <video src={preview} autoPlay loop muted className="w-full h-full object-cover" /> : <img src={preview} className="w-full h-full object-cover" />}
                     <div className="absolute top-4 left-4 bg-brand-primary text-black text-[10px] font-black px-3 py-1 rounded shadow-lg tracking-widest uppercase">Gait Scan</div>
                   </div>
                 ) : (
                   <div className="flex-1 flex flex-col items-center justify-center p-12 border border-dashed border-white/20 rounded-2xl bg-white/5">
                      <button onClick={() => fileInputRef.current?.click()} aria-label="Kamera Datei-Upload öffnen" tabIndex={0} className="p-8 bg-black/40 rounded-[32px] mb-6 hover:bg-black/60 border border-white/5 transition-all outline-none focus:ring-2 focus:ring-brand-primary">
                         <CameraIcon className="w-12 h-12 text-brand-primary opacity-60" aria-hidden="true" />
                      </button>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Warte auf Video...</p>
                   </div>
                 )}

                 {isComparisonMode && (
                   <div className="relative flex-1 rounded-2xl overflow-hidden bg-zinc-900 border border-brand-success flex items-center justify-center">
                     <div className="text-center relative w-full h-full flex flex-col items-center justify-center">
                        <RobotIcon className="w-16 h-16 text-brand-success/50" />
                        {showSkeleton && (
                            <svg className="absolute inset-0 w-full h-full pointer-events-none scale-150 opacity-40" viewBox="0 0 100 100">
                               <line x1="50" y1="20" x2="50" y2="45" stroke="#D4AF37" strokeWidth="1" />
                               <line x1="35" y1="25" x2="65" y2="25" stroke="#D4AF37" strokeWidth="1" />
                               <line x1="40" y1="45" x2="60" y2="45" stroke="#D4AF37" strokeWidth="1" />
                               {/* Gold Standard legs */}
                               <line x1="40" y1="45" x2="40" y2="70" stroke="#10b981" strokeWidth="1" /> 
                               <line x1="40" y1="70" x2="40" y2="95" stroke="#10b981" strokeWidth="1" />
                               <line x1="60" y1="45" x2="60" y2="70" stroke="#10b981" strokeWidth="1" />
                               <line x1="60" y1="70" x2="60" y2="95" stroke="#10b981" strokeWidth="1" />
                            </svg>
                        )}
                        <div className="absolute bottom-4 left-4 bg-brand-success text-black px-3 py-1 rounded text-[10px] font-bold">Gold Standard (Dozent)</div>
                     </div>
                   </div>
                 )}
               </div>

               <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
             </Card>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button onClick={() => setShowSkeleton(!showSkeleton)} variant="outline" className="text-[10px] capitalize tracking-widest font-bold py-4">
                    <EyeIcon className="w-4 h-4 mr-2 inline" /> Skelett {showSkeleton ? 'OFF' : 'ON'}
                </Button>
                <Button onClick={runAgenticVision} disabled={!preview || isProcessing} variant="primary" className="text-[10px] uppercase tracking-widest font-black py-4">
                    Scan starten
                </Button>
                <Button onClick={enableComparison} variant="outline" className="text-[10px] uppercase tracking-widest font-black py-4 text-brand-primary border-brand-primary/30">
                    <SparklesIcon className="w-4 h-4 mr-2 inline" /> Dozenten-Vergleich
                </Button>
                <Button onClick={loadDemoGait} variant="outline" className="text-[10px] capitalize tracking-widest py-4 border-white/10 hover:bg-white/5">
                    Demo Laden
                </Button>
             </div>
             
             {isProcessing && (
                <div className="bg-brand-primary/10 border border-brand-primary/20 p-4 rounded-xl flex items-center justify-center gap-4 animate-pulse">
                     <BrainCircuitIcon className="w-5 h-5 text-brand-primary" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">LUMI Vektor-Engine berechnet...</span>
                </div>
             )}
          </div>

          <div className="lg:col-span-5 space-y-6">
             {comparisonData && (
                 <Card className="glass-dark p-6 border-brand-primary/20 rounded-2xl mb-6">
                    <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] mb-4">Skill-Check Report</h3>
                    <div className="flex items-center gap-6 mb-6">
                        <div className="flex-1 text-center bg-black/40 p-4 rounded-xl border border-white/5">
                            <div className="text-3xl font-serif text-white mb-1">{comparisonData.studentScore}%</div>
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Student</div>
                        </div>
                        <div className="flex-1 text-center bg-brand-success/10 p-4 rounded-xl border border-brand-success/20">
                            <div className="text-3xl font-serif text-brand-success mb-1">{comparisonData.expertScore}%</div>
                            <div className="text-[10px] uppercase tracking-widest text-brand-success font-bold">Dozent</div>
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Kritische Abweichungen (Vektoren):</span>
                        <ul className="mt-2 space-y-2">
                            {comparisonData.deviations.map((d: string, idx: number) => (
                                <li key={idx} className="bg-red-500/10 text-red-400 text-xs py-2 px-3 rounded border border-red-500/20">{d}</li>
                            ))}
                        </ul>
                    </div>
                 </Card>
             )}

            <Card className={`glass-dark p-8 rounded-3xl border-white/5 shadow-2xl flex flex-col ${!analysis && 'opacity-50 grayscale'}`}>
               <h3 className="text-xl font-bold text-white font-serif mb-6 flex items-center gap-3 border-b border-white/5 pb-4 tracking-tight">
                  <RobotIcon className="w-6 h-6 text-brand-primary" /> Kinematische Parameter
               </h3>
               
               {simulatedGaitData ? (
                    <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-4 text-xs animate-fadeInUp">
                        <div className="text-[9px] uppercase font-black tracking-widest text-zinc-500 pb-2 border-b border-white/10">Metrik</div>
                        <div className="text-[9px] uppercase font-black tracking-widest text-zinc-500 pb-2 border-b border-white/10 text-right">Student</div>
                        <div className="text-[9px] uppercase font-black tracking-widest text-zinc-500 pb-2 border-b border-white/10 text-center">Toleranz</div>
                        
                        {simulatedGaitData.parameters.map((p: any, idx: number) => (
                        <React.Fragment key={idx}>
                            <div className="text-zinc-300 font-medium">{p.name}</div>
                            <div className={`text-right font-bold ${p.status === 'warning' ? 'text-red-400' : 'text-emerald-400'}`}>{p.current}</div>
                            <div className="text-zinc-500 text-center">{p.target}</div>
                        </React.Fragment>
                        ))}
                    </div>
               ) : (
                   <p className="text-xs text-zinc-500 italic py-4">Keine Vektordaten extrahiert.</p>
               )}

               <div className="mt-8 border-t border-white/5 pt-6">
                  {analysis ? (
                    <div className="whitespace-pre-wrap leading-relaxed font-light text-zinc-300 text-xs animate-fadeInUp">
                      {analysis.split('\n').map((line, i) => {
                        if (line.startsWith('###')) {
                          return <h4 key={i} className="text-white font-sans font-bold text-sm mt-6 mb-2 tracking-wide">{line.replace('### ', '')}</h4>;
                        }
                        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C9A84C]">$1</strong>');
                        return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
                      })}
                    </div>
                  ) : (
                    <div className="italic text-zinc-600 font-light tracking-wide text-xs">
                      Warte auf Live-Scan...
                    </div>
                  )}
               </div>

                <div className="flex gap-4 mt-8 lg:mt-auto pt-6">
                    <Button onClick={async () => {
                        await simulateLmsExport('Ganganalyse-2.0');
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                    }} variant="primary" className="flex-1 text-[10px] py-4 uppercase tracking-[0.2em]">
                        Sync to Moodle
                    </Button>
                    <Button onClick={downloadAsPdf} variant="outline" className="flex-1 border-white/10 text-[10px] py-4 uppercase tracking-[0.2em]">
                        PDF Export
                    </Button>
                </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

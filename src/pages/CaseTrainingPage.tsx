
import React, { useState } from 'react';
import { Type } from '@google/genai';
import { generateClinicalContent, ai } from '../services/aiService';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { EnvelopeIcon, CheckCircleIcon, ArrowRightIcon, LightBulbIcon, SimulationIcon, FilterIcon, BrainCircuitIcon, CameraIcon } from '../components/IconComponents';
import { CaseStudy } from '../types';
import { literatureData } from '../data/literatureData';

// --- GENERATOR COMPONENT ---

interface GeneratorInput {
  fachbereich: string;
  difficultyValue: number; // 1-3
  lernziele: string;
  zeitbudget: number;
  tutorMood: string;
  patientData: string;
  mainComplaint: string;
  medicalHistory: string;
}

const PRESETS = [
  {
    label: "Anfänger: Anamnese & Befund",
    description: "Fokus auf Gesprächsführung und Basis-Tests",
    data: {
      fachbereich: 'Physiotherapie - Orthopädie',
      difficultyValue: 1,
      lernziele: 'Anamnese, Erste Befunderhebung, Hypothesenbildung',
      zeitbudget: 20,
      tutorMood: 'Supportiv',
      patientData: '45-jährige Büroangestellte',
      mainComplaint: 'Unspezifischer Rückenschmerz',
      medicalHistory: 'Keine Auffälligkeiten'
    }
  },
  {
    label: "Sport: Akutes Knie-Trauma",
    description: "Stabilitätstests und Akutversorgung",
    data: {
      fachbereich: 'Sportphysiotherapie',
      difficultyValue: 2,
      lernziele: 'Stabilitäts-Tests, Wundheilungsphasen, PECH-Schema',
      zeitbudget: 25,
      tutorMood: 'Prüfer',
      patientData: '22-jähriger Fußballspieler',
      mainComplaint: 'Knieschmerz nach Verdrehtrauma',
      medicalHistory: 'Z.n. VKB-Ruptur kontralateral'
    }
  },
  {
    label: "Neuro: Schlaganfall Akut",
    description: "Handling und Mobilisation",
    data: {
      fachbereich: 'Neurologie',
      difficultyValue: 2,
      lernziele: 'Tonusregulation, Bobath-Konzept, Transfer',
      zeitbudget: 30,
      tutorMood: 'Supportiv',
      patientData: '72-jähriger Patient',
      mainComplaint: 'Hemiparese nach Ischämie',
      medicalHistory: 'Hypertonie, Diabetes Mellitus II'
    }
  },
  {
    label: "Experte: Widersprüchliche Befunde",
    description: "Komplexe DDx & Therapie-Adaption",
    data: {
      fachbereich: 'Muskuloskelettal / Komplex',
      difficultyValue: 3,
      lernziele: 'Interpretation widersprüchlicher Tests, Management von Yellow Flags, Therapie-Adaption',
      zeitbudget: 45,
      tutorMood: 'Sokratisch',
      patientData: '55-jähriger Handwerker',
      mainComplaint: 'Ausstrahlende Schulterschmerzen, Kribbeln',
      medicalHistory: 'Depression, Diabetes, Z.n. Schulterluxation'
    }
  }
];

const CaseGenerator: React.FC<{ onCaseGenerated: (caseStudy: CaseStudy, tutorMood: string) => void }> = ({ onCaseGenerated }) => {
  const [input, setInput] = useState<GeneratorInput>({ ...PRESETS[0].data, tutorMood: 'Supportiv' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const applyPreset = (presetData: Omit<GeneratorInput, 'tutorMood'> & { tutorMood?: string }) => {
    setInput({
        ...input,
        ...presetData,
        tutorMood: presetData.tutorMood || 'Supportiv'
    });
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');

    try {
      const promptInput = {
        fachbereich: input.fachbereich,
        schwierigkeitsgrad: input.difficultyValue === 1 ? 'Anfänger' : input.difficultyValue === 2 ? 'Fortgeschritten' : 'Experte',
        patientendaten: input.patientData,
        hauptbeschwerde: input.mainComplaint,
        vorerkrankungen: input.medicalHistory,
        lernziele: input.lernziele.split(',').map(s => s.trim()),
        zeitbudget_minuten: input.zeitbudget
      };

      // UPDATED PROMPT FOR GEMINI 3.1 PRO + SOURCES
      const prompt = `
ROLLE: Physiotherapie-Ausbilder & Fall-Ersteller
MODEL: Gemini 3.1 Pro (Deep Reasoning Mode)

INPUT (JSON):
${JSON.stringify(promptInput, null, 2)}

LITERATUR-DATENBANK FÜR EVIDENZ-BASIERUNG:
${JSON.stringify(literatureData, null, 2)}

AUFGABE:
Generiere einen realistisch strukturierten Patientenfall (Case Study) zur Übung.
Der Fall soll interaktiv sein und den Studierenden durch den Clinical Reasoning Prozess führen.

ANFORDERUNGEN AN DEN INHALT:
1.  **Schwierigkeitsgrad beachten:** 
    *   Bei "Anfänger": Nutze klare Symptome, fokussiere auf Basis-Anamnese (VAS, Red Flags) und Standard-Funktionstests.
    *   Bei "Fortgeschritten/Experte": Baue widersprüchliche Befunde, psychosoziale Faktoren (Yellow Flags) oder komplexe Pathologien ein.
2.  **Struktur:**
    *   Schritt 1: Intro & Anamnese.
    *   Schritt 2: Inspektion & Palpation.
    *   Schritt 3: Funktionsprüfung.
    *   Schritt 4: Diagnose & Therapieplan.
3.  **Quellen/Evidenz:**
    *   Jeder Fall MUSS auf den bereitgestellten LITERATUR-DATENBANK-Einträgen basieren.
    *   Nenne die zugrunde liegende Quelle am Ende der "model_answer" um "Auditierbarkeit" zu gewährleisten.

OUTPUT SCHEMA (JSON):
Antworte bitte ausschließlich im folgenden JSON-Format:
{
  "title": "Prägnanter Titel des Falls",
  "patient_intro": "Detaillierte Vorstellung (Alter, Beruf, Hauptbeschwerde) - bildhaft für Video-Generierung geeignet...",
  "steps": [
    {
      "titel": "Phase",
      "inhalt": "Informationen für den Student...",
      "reflexionsfrage": "Frage an den Studenten",
      "model_answer": "Musterlösung inklusive Evidenz-Quelle/Leitlinie"
    }
  ],
  "learning_goals": ["Ziel 1", "Ziel 2"]
}
`;

      const response = await generateClinicalContent(prompt, 'gemini-3.1-pro-preview', {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            patient_intro: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  titel: { type: Type.STRING },
                  inhalt: { type: Type.STRING },
                  reflexionsfrage: { type: Type.STRING },
                  model_answer: { type: Type.STRING }
                }
              }
            },
            learning_goals: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      
      if (data && data.steps) {
        const newCase: CaseStudy = {
          id: `CASE_${Date.now()}`,
          title: data.title,
          patient_intro: data.patient_intro,
          steps: data.steps,
          difficulty: input.difficultyValue === 1 ? 'Anfänger' : input.difficultyValue === 2 ? 'Fortgeschritten' : 'Experte',
          learning_goals: data.learning_goals || []
        };
        onCaseGenerated(newCase, input.tutorMood);
      } else {
        throw new Error("Ungültiges Antwortformat von der KI");
      }

    } catch (e) {
      console.error(e);
      setError("Fehler bei der Fall-Erstellung. Bitte API-Key prüfen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-brand-surface border-2 border-brand-primary/20">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-brand-primary/10 p-3 rounded-full">
           <EnvelopeIcon className="w-8 h-8 text-brand-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-brand-secondary">KI-Fall-Generator</h3>
          <p className="text-sm text-brand-text-on-light-secondary">Erstellen Sie realistische, evidenzbasierte Patientenfälle (Deep Reasoning).</p>
        </div>
      </div>

      {/* Presets Section */}
      <div className="mb-8">
        <p className="text-xs font-bold text-brand-text-on-light-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
            <FilterIcon className="w-4 h-4" /> Schnellwahl-Szenarien
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESETS.map((preset, idx) => (
                <button
                    key={idx}
                    onClick={() => applyPreset(preset.data)}
                    className={`text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        JSON.stringify({ ...input, tutorMood: preset.data.tutorMood || 'Supportiv' }) === JSON.stringify({ ...preset.data, tutorMood: preset.data.tutorMood || 'Supportiv' })
                        ? 'bg-brand-primary/10 border-brand-primary ring-1 ring-brand-primary' 
                        : 'bg-brand-background border-brand-border hover:border-brand-primary/50'
                    }`}
                >
                    <div className="font-semibold text-brand-secondary text-sm mb-1">{preset.label}</div>
                    <div className="text-xs text-brand-text-on-light-secondary">{preset.description}</div>
                </button>
            ))}
        </div>
      </div>

      <div className="space-y-6 bg-brand-background p-6 rounded-xl border border-brand-border/50">
        <h4 className="font-bold text-brand-secondary text-sm mb-2">Individuelle Konfiguration</h4>
        
        {/* Difficulty Slider */}
        <div className="bg-brand-surface p-4 rounded-lg border border-brand-border">
            <div className="flex justify-between items-end mb-4">
                <label className="block text-xs font-bold text-brand-secondary uppercase tracking-widest">Schwierigkeitsgrad</label>
                <span className="text-xs font-medium text-brand-primary">
                    {input.difficultyValue === 1 ? 'Anfänger (Fokus Basics)' : input.difficultyValue === 2 ? 'Fortgeschritten (Komplex)' : 'Experte (Red Flags)'}
                </span>
            </div>
            <div className="relative pt-1">
               <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="1"
                  value={input.difficultyValue}
                  onChange={(e) => setInput({...input, difficultyValue: parseInt(e.target.value)})}
                  className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
               />
               <div className="flex justify-between text-[10px] text-brand-text-on-light-secondary mt-2 px-1">
                  <span>Level 1</span>
                  <span>Level 2</span>
                  <span>Level 3</span>
               </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-medium text-brand-text-on-light-secondary mb-1">Patientendaten (Alter, Beruf, etc.)</label>
                <input 
                    type="text" 
                    value={input.patientData || ''}
                    onChange={(e) => setInput({...input, patientData: e.target.value})}
                    placeholder="z.B. 45-jährige Büroangestellte"
                    className="w-full p-2.5 bg-brand-surface border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-brand-text-on-light-secondary mb-1">Hauptbeschwerde</label>
                <input 
                    type="text" 
                    value={input.mainComplaint || ''}
                    onChange={(e) => setInput({...input, mainComplaint: e.target.value})}
                    placeholder="z.B. Schulterschmerz rechts"
                    className="w-full p-2.5 bg-brand-surface border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
            <div>
                <label className="block text-xs font-medium text-brand-text-on-light-secondary mb-1">Vorerkrankungen / Relevante Anamnese</label>
                <input 
                    type="text" 
                    value={input.medicalHistory || ''}
                    onChange={(e) => setInput({...input, medicalHistory: e.target.value})}
                    placeholder="z.B. Z.n. VKB-Plastik, Hypertonie"
                    className="w-full p-2.5 bg-brand-surface border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-medium text-brand-text-on-light-secondary mb-1">Fachbereich / Setting</label>
                <input 
                    type="text" 
                    value={input.fachbereich}
                    onChange={(e) => setInput({...input, fachbereich: e.target.value})}
                    className="w-full p-2.5 bg-brand-surface border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-brand-text-on-light-secondary mb-1">Lernziele (Kommagetrennt)</label>
                <input 
                    type="text" 
                    value={input.lernziele}
                    onChange={(e) => setInput({...input, lernziele: e.target.value})}
                    className="w-full p-2.5 bg-brand-surface border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none text-sm"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-medium text-brand-text-on-light-secondary mb-1">Tutor-Stil (Mood)</label>
                <select 
                    value={input.tutorMood}
                    onChange={(e) => setInput({...input, tutorMood: e.target.value})}
                    className="w-full p-2.5 bg-brand-surface border border-brand-border rounded-lg outline-none text-sm cursor-pointer font-medium text-brand-primary"
                >
                    <option value="Supportiv">🤝 Supportiv (Coach)</option>
                    <option value="Sokratisch">🤔 Sokratisch (Gegenfragen)</option>
                    <option value="Prüfer">⚖️ Strenger Prüfer (Fakten)</option>
                </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-text-on-light-secondary mb-1">Zeitbudget (Min)</label>
              <input 
                type="number" 
                value={input.zeitbudget}
                onChange={(e) => setInput({...input, zeitbudget: parseInt(e.target.value)})}
                className="w-full p-2.5 bg-brand-surface border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none text-sm"
              />
            </div>
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-100">{error}</p>}

        <Button 
          onClick={handleGenerate} 
          disabled={isLoading} 
          variant="primary" 
          className="w-full flex justify-center items-center mt-4 transition-transform hover:scale-[1.02]"
        >
          {isLoading ? 'KI erstellt Fallstudie (Deep Reasoning)...' : 'Fall generieren starten'}
          {!isLoading && <ArrowRightIcon className="w-5 h-5 ml-2" />}
        </Button>
      </div>
    </Card>
  );
};

// --- INTERACTIVE SESSION COMPONENT ---

interface EvaluationResult {
    score: number;
    feedback_text: string;
    missing_concepts: string[];
    next_step_hint: string;
}

const CaseSession: React.FC<{ caseStudy: CaseStudy, tutorMood: string, onReset: () => void }> = ({ caseStudy, tutorMood, onReset }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userNotes, setUserNotes] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  
  // Video State
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [generatingVideo, setGeneratingVideo] = useState(false);

  const currentStep = caseStudy.steps[currentStepIndex];
  const isLastStep = currentStepIndex === caseStudy.steps.length - 1;

  const handleGenerateVideo = async () => {
      setGeneratingVideo(true);
      try {
          if (!window.aistudio?.hasSelectedApiKey) {
              // Assuming a polyfill or window extension for the challenge context
              alert('Bitte wählen Sie zuerst einen API-Key für die Video-Generierung aus (siehe Prompt-Instruktionen).');
              await window.aistudio?.openSelectKey();
          }
          if (await window.aistudio?.hasSelectedApiKey()) {
              let operation = await ai.models.generateVideos({
                  model: 'veo-3.1-fast-generate-preview',
                  prompt: `Cinematic medical simulation shot of: ${caseStudy.patient_intro}. Professional lighting, 4k resolution, medical educational context.`,
                  config: {
                      numberOfVideos: 1,
                      resolution: '720p', // Fast preview
                      aspectRatio: '16:9'
                  }
              });

              while (!operation.done) {
                  await new Promise(resolve => setTimeout(resolve, 5000));
                  operation = await ai.operations.getVideosOperation({operation: operation});
              }

              if (operation.response?.generatedVideos?.[0]?.video?.uri) {
                  const downloadLink = operation.response.generatedVideos[0].video.uri;
                  // In a real app we'd fetch this blob, here we simulate setting the URI
                  // For the mock/prototype, we'd assume the URI is directly playable or fetchable
                  setVideoUri(`${downloadLink}&key=${process.env.GEMINI_API_KEY}`);
              }
          }
      } catch (e) {
          console.error("Video generation failed", e);
          alert("Video-Generierung fehlgeschlagen. Bitte versuchen Sie es später.");
      } finally {
          setGeneratingVideo(false);
      }
  };

  const handleEvaluate = async () => {
    if (!userNotes.trim()) return;
    setIsEvaluating(true);

    try {
        const moodInstructions: {[key: string]: string} = {
            'Supportiv': "Sei ein empathischer, motivierender Coach. Lob viel, formuliere Kritik sanft als 'Tipp'.",
            'Sokratisch': "Sei ein philosophischer Mentor. Gib niemals die direkte Antwort. Stelle Gegenfragen, die den Studenten zur Erkenntnis führen.",
            'Prüfer': "Sei ein strenger, sachlicher Prüfer. Fokus auf Fakten, Präzision und medizinische Korrektheit. Keine Weichspülerei."
        };

        const prompt = `
ROLLE: Klinischer Tutor für Physiotherapie.
MODUS/TONALITÄT: ${moodInstructions[tutorMood] || moodInstructions['Supportiv']}
MODEL: Gemini 3.0 Pro (Deep Reasoning Mode)

AUFGABE: Bewerte die Antwort des Studenten im Kontext des aktuellen Fallschritts.

CONTEXT:
Fall: ${caseStudy.title}
Aktueller Schritt: ${currentStep.titel}
Situation/Input: ${currentStep.inhalt}
Frage an Student: ${currentStep.reflexionsfrage}
Musterlösung: ${currentStep.model_answer}

STUDENTEN-ANTWORT:
"${userNotes}"

ANALYSE & STUCK_LEVEL:
Bewerte die Antwort auf einer Skala von 0-100 (Score).
- Score < 40 (High Stuck Level): Student hat das Konzept nicht verstanden.
- Score 40-75 (Medium Stuck Level): Student ist auf dem richtigen Weg, vergisst aber wichtige Details.
- Score > 75 (Low Stuck Level): Sehr gute Antwort.

OUTPUT JSON:
{
    "score": 85,
    "feedback_text": "[Dein Feedback im gewählten Tonfall]",
    "missing_concepts": ["Liste", "der", "fehlenden", "Aspekte"],
    "next_step_hint": "[Ein Hinweis für den nächsten Schritt]"
}
`;

        const response = await generateClinicalContent(prompt, 'gemini-3.1-pro-preview', {
            thinkingConfig: { thinkingBudget: 8000 },
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.NUMBER },
                    feedback_text: { type: Type.STRING },
                    missing_concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
                    next_step_hint: { type: Type.STRING }
                }
            }
        });

        const result = JSON.parse(response.text || "{}");
        setEvaluation(result);

    } catch (e) {
        console.error("Evaluation error", e);
    } finally {
        setIsEvaluating(false);
    }
  };
  
  const handleNext = () => {
    setEvaluation(null);
    setUserNotes('');
    setCurrentStepIndex(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
        {/* Header: Case Info */}
        <div className="mb-8 bg-brand-secondary text-brand-text-on-dark p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-bold font-serif mb-1">{caseStudy.title}</h2>
                    <div className="flex gap-2 text-xs opacity-80">
                        <span className="bg-white/20 px-2 py-1 rounded">{caseStudy.difficulty}</span>
                        {caseStudy.learning_goals.map((g, i) => <span key={i} className="bg-white/20 px-2 py-1 rounded">{g}</span>)}
                        <span className="bg-brand-primary/80 text-brand-secondary px-2 py-1 rounded font-bold flex items-center gap-1">
                            <BrainCircuitIcon className="w-3 h-3" /> Tutor: {tutorMood}
                        </span>
                    </div>
                </div>
                <Button onClick={onReset} variant="outline" size="sm" className="!border-white/30 !text-white hover:!bg-white/10">
                    Beenden
                </Button>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg border border-white/10 relative">
                <p className="font-semibold text-brand-primary mb-1">Patienten-Profil:</p>
                <p className="leading-relaxed opacity-90">{caseStudy.patient_intro}</p>
                
                {/* Video Generation Button */}
                <div className="mt-4 border-t border-white/10 pt-4">
                    {!videoUri ? (
                        <button 
                            onClick={handleGenerateVideo} 
                            disabled={generatingVideo}
                            className="flex items-center gap-2 text-xs bg-brand-primary text-brand-secondary px-3 py-1.5 rounded hover:bg-brand-primary-dark transition-colors disabled:opacity-50"
                        >
                            <CameraIcon className="w-4 h-4" /> 
                            {generatingVideo ? 'Generiere Szenario-Video...' : 'Patienten-Video generieren (Veo)'}
                        </button>
                    ) : (
                        <div className="mt-2 rounded-lg overflow-hidden border border-white/20">
                            <video src={videoUri} controls className="w-full max-h-[300px] object-cover" />
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6 px-2">
            {caseStudy.steps.map((_, idx) => (
                <div key={idx} className={`h-2 rounded-full flex-1 transition-colors ${idx <= currentStepIndex ? 'bg-brand-primary' : 'bg-brand-border'}`} />
            ))}
        </div>

        {/* Active Step Card */}
        <Card className="bg-brand-background p-6 md:p-8 min-h-[500px] flex flex-col shadow-xl border border-brand-border/60">
            <div className="flex items-center gap-3 mb-6 border-b border-brand-border pb-4">
                <div className="bg-brand-primary/20 text-brand-secondary w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {currentStepIndex + 1}
                </div>
                <h3 className="text-xl font-bold text-brand-secondary">{currentStep.titel}</h3>
            </div>

            <div className="prose prose-brand max-w-none text-brand-text-on-light-secondary mb-8">
                <p className="whitespace-pre-line">{currentStep.inhalt}</p>
            </div>

            <div className="mt-auto bg-brand-surface p-5 rounded-xl border border-brand-border/50">
                <div className="flex items-start gap-3 mb-4">
                    <LightBulbIcon className="w-6 h-6 text-brand-primary flex-shrink-0 mt-1" />
                    <div className="w-full">
                        <h4 className="font-bold text-brand-secondary">Reflexionsfrage</h4>
                        <p className="text-sm text-brand-text-on-light-secondary">{currentStep.reflexionsfrage}</p>
                    </div>
                </div>

                {!evaluation ? (
                    <div className="space-y-4">
                        <textarea 
                            value={userNotes}
                            onChange={(e) => setUserNotes(e.target.value)}
                            placeholder="Ihre Antwort... (Nutzen Sie Fachbegriffe)"
                            className="w-full p-3 rounded-lg border border-brand-border bg-white focus:ring-2 focus:ring-brand-primary outline-none text-sm min-h-[120px] whitespace-pre-line"
                        />
                        <Button onClick={handleEvaluate} disabled={isEvaluating || !userNotes.trim()} variant="primary" className="w-full flex justify-center items-center">
                             {isEvaluating ? 'KI analysiert Antwort (Deep Reasoning)...' : 'Antwort überprüfen'}
                             {!isEvaluating && <BrainCircuitIcon className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>
                ) : (
                    <div className="animate-fadeInUp space-y-4">
                        {/* AI Feedback Card */}
                        <div className={`p-4 rounded-lg border ${evaluation.score >= 75 ? 'bg-green-50 border-green-200' : evaluation.score >= 40 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                             <div className="flex justify-between items-start mb-2">
                                <h5 className="font-bold text-brand-secondary flex items-center gap-2">
                                    <BrainCircuitIcon className="w-5 h-5" /> KI-Feedback ({tutorMood})
                                </h5>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${evaluation.score >= 75 ? 'bg-green-200 text-green-800' : evaluation.score >= 40 ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                                    Score: {evaluation.score}%
                                </span>
                             </div>
                             <p className="text-sm text-brand-text-on-light mb-3 italic leading-relaxed whitespace-pre-line">"{evaluation.feedback_text}"</p>
                             
                             {evaluation.missing_concepts && evaluation.missing_concepts.length > 0 && (
                                 <div className="mb-3">
                                     <p className="text-xs font-semibold text-brand-secondary mb-1">Das hat noch gefehlt:</p>
                                     <ul className="list-disc list-inside text-xs text-brand-text-on-light-secondary">
                                         {evaluation.missing_concepts.map((c, i) => <li key={i}>{c}</li>)}
                                     </ul>
                                 </div>
                             )}
                             <div className="text-xs italic text-brand-text-on-light-secondary border-t border-black/5 pt-2">
                                 💡 Tipp: {evaluation.next_step_hint}
                             </div>
                        </div>

                        {/* Model Answer (Accordion style or direct) */}
                        <div className="bg-white border border-brand-border rounded-lg p-4 opacity-90 hover:opacity-100 transition-opacity">
                             <h5 className="font-bold text-brand-secondary mb-2 text-sm flex items-center gap-2">
                                <CheckCircleIcon className="w-4 h-4 text-brand-primary" /> Vollständige Musterlösung & Evidenz
                            </h5>
                            <p className="text-brand-text-on-light-secondary text-sm leading-relaxed whitespace-pre-line">
                                {currentStep.model_answer}
                            </p>
                        </div>
                        
                        <div className="flex justify-end">
                            {!isLastStep ? (
                                <Button onClick={handleNext} variant="secondary" className="flex items-center">
                                    Nächster Schritt <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button onClick={onReset} variant="primary">
                                    Falltraining abschließen
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    </div>
  );
};

// --- MAIN PAGE ---

export const CaseTrainingPage: React.FC = () => {
  const [activeCase, setActiveCase] = useState<CaseStudy | null>(null);
  const [tutorMood, setTutorMood] = useState<string>('Supportiv');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const handleDemo = () => {
      setToastMessage("Demo Mode: Case Library geladen. Hier trainieren Sie am interaktiven Patientenbeispiel.");
      setTimeout(() => setToastMessage(null), 4000);
    };
    window.addEventListener('demo-step-case-training', handleDemo);
    return () => window.removeEventListener('demo-step-case-training', handleDemo);
  }, []);

  return (
    <div className="animate-fadeInUp bg-black min-h-screen pt-40 pb-32 relative overflow-hidden">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-fadeInUp">
          <div className="bg-[#C9A84C]/20 border border-[#C9A84C]/50 text-[#C9A84C] backdrop-blur-xl px-6 py-3 rounded-full text-sm font-medium shadow-[0_0_20px_rgba(201,168,76,0.3)]">
            {toastMessage}
          </div>
        </div>
      )}
      <div className="relative z-10">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
         <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
      </div>

      <Section 
        title="Fall-Trainings (Case-Based Learning)"
        subtitle="Trainieren Sie klinisches Reasoning an realistischen, KI-generierten Patientenfällen. Deep Reasoning mit Gemini 3.0."
        containerClassName="py-0 relative z-10 mb-24"
      />

      <Section containerClassName="pt-0 pb-16 md:pb-24 relative z-10">
        {!activeCase ? (
             <div className="max-w-4xl mx-auto">
                <CaseGenerator onCaseGenerated={(c, m) => { setActiveCase(c); setTutorMood(m); }} />
                
                <div className="mt-24 grid md:grid-cols-3 gap-12 text-center">
                    <div className="group">
                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 mx-auto mb-6 group-hover:bg-brand-primary/10 transition-all duration-700 shadow-glow">
                            <SimulationIcon className="w-8 h-8 text-brand-primary opacity-60 group-hover:opacity-100" />
                        </div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-[0.2em] mb-3">Unendliche Fälle</h4>
                        <p className="text-xs text-zinc-500 font-light tracking-wide leading-relaxed">Jeder Fall ist einzigartig generiert.</p>
                    </div>
                     <div className="group">
                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 mx-auto mb-6 group-hover:bg-brand-primary/10 transition-all duration-700 shadow-glow">
                            <CheckCircleIcon className="w-8 h-8 text-brand-primary opacity-60 group-hover:opacity-100" />
                        </div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-[0.2em] mb-3">Sofortiges Feedback</h4>
                        <p className="text-xs text-zinc-500 font-light tracking-wide leading-relaxed">Vergleich mit Musterlösungen.</p>
                    </div>
                     <div className="group">
                        <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10 mx-auto mb-6 group-hover:bg-brand-primary/10 transition-all duration-700 shadow-glow">
                            <LightBulbIcon className="w-8 h-8 text-brand-primary opacity-60 group-hover:opacity-100" />
                        </div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-[0.2em] mb-3">Klinisches Denken</h4>
                        <p className="text-xs text-zinc-500 font-light tracking-wide leading-relaxed">Fördert Hypothesenbildung.</p>
                    </div>
                </div>
             </div>
        ) : (
            <CaseSession caseStudy={activeCase} tutorMood={tutorMood} onReset={() => setActiveCase(null)} />
        )}
      </Section>
      </div>
    </div>
  );
};

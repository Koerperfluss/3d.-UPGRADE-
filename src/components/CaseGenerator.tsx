import React, { useState } from 'react';
import { Type } from '@google/genai';
import { generateClinicalContent } from '../services/aiService';
import { Card } from './Card';
import { Button } from './Button';
import { EnvelopeIcon, ArrowRightIcon, FilterIcon } from './IconComponents';
import { CaseStudy } from '../types';
import { literatureData } from '../data/literatureData';

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

export const CaseGenerator: React.FC<{ onCaseGenerated: (caseStudy: CaseStudy, tutorMood: string) => void }> = ({ onCaseGenerated }) => {
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

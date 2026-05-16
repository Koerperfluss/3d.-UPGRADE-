import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  BrainCircuitIcon, AcademicCapIcon, SimulationIcon, 
  CameraIcon, ArrowRightIcon, CheckCircleIcon, 
  LightBulbIcon, FilterIcon, SearchIcon, WarningIcon 
} from '../components/IconComponents';

type TabType = 'matrix' | 'catalog' | 'workflow';

export const CurriculumPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('matrix');

  const systems = [
    { id: 1, name: 'Anamnese & Intake', modules: ['Anamnese Trainer', 'Fall-Simulator'], route: '/anamnese-trainer', prereq: 'Basis Anatomie', link: 'Trainiert das Erstgespräch und Triage mit virtuellen Patienten.' },
    { id: 2, name: 'Befund & Analyse', modules: ['Vision Agent', 'Skill-Check', 'Media Analyzer'], route: '/vision-agent', prereq: 'Funktionelle Anatomie, Biomechanik', link: 'KI-gestützte Bewegungs- und Haltungsanalyse via Video/Foto.' },
    { id: 3, name: 'Clinical Reasoning', modules: ['Wirkungsketten', 'Hypothesen-Tester'], route: '/case-training', prereq: 'Physiologie', link: 'Leitet Studierende von isolierten Symptomen zur Diagnose.' },
    { id: 4, name: 'Manuelle Therapie der HWS', modules: ['Skill-Check Video', 'Clinical Reasoning'], route: '/labor', prereq: 'Funktionelle Anatomie, Neurologie-Basics', link: 'Fokus auf zervikale Untersuchung, Instabilitätstests (Sharp-Purser) und Mobilisationstechniken. Lernziele: Sichere Erkennung von Red Flags, korrekte Grifftechnik.' },
    { id: 5, name: 'Propriozeptives Training für Sprunggelenksverletzungen', modules: ['Vision Agent', 'Leitlinien-RAG'], route: '/vision-agent', prereq: 'Biomechanik, Trainingslehre', link: 'Rehabilitation nach Supinationstrauma. Lernziele: Phasenadaptierte Belastungssteigerung, neuromuskuläre Kontrolle, Return-to-Sport Kriterien.' },
    { id: 6, name: 'Evidenz & Therapie', modules: ['Leitlinien-RAG', 'Compliance-Filter'], route: '/literatur', prereq: 'Wissenschaftliches Arbeiten', link: 'Sichert Therapiepläne mit aktuellen Med-Datenbanken (AWMF) ab.' },
    { id: 7, name: 'Assessment & Note', modules: ['Freitext-Korrektur', 'Lernpfad-KI'], route: '/assessment-center', prereq: 'Alle Theorie-Module', link: 'Automatisierte Bewertung der Transferleistung und Examina.' },
    { id: 8, name: 'Dozenten-Workspace', modules: ['LUMI-Config', 'Content-Generator'], route: '/educator-workspace', prereq: 'Dozenten-Zugang', link: 'Das Administrations-Cockpit für Unterrichtsvorbereitung und Analytics.' },
  ];

  const tools = [
    { name: 'Wirkungsketten Analyser', function: 'Deep Reasoning Pathomechanik', model: 'Gemini 3.1 Pro', usage: 'Clinical Reasoning', prereq: 'Biomechanik & Pathophysiologie', route: '/clinical-hub' },
    { name: 'Vision Agent', function: 'Bild/Video Ganganalyse', model: 'Gemini Vision', usage: 'Bewegungsanalyse', prereq: 'Funktionelle Anatomie', route: '/vision-agent' },
    { name: 'Case Training', function: 'Patienten-Simulation', model: 'Gemini 3.0 Pro', usage: 'Anamnese-Training', prereq: 'Kommunikation', route: '/case-training' },
    { name: 'Exam Simulation', function: 'Freitext-Korrektur', model: 'Gemini Flash', usage: 'Prüfungsvorbereitung', prereq: 'Fachwissen', route: '/exam-simulation' },
    { name: 'Media Analyzer', function: 'Skill-Check Video', model: 'Gemini Vision', usage: 'Grifftechnik-Check', prereq: 'Praktische Grundlagen', route: '/labor' },
    { name: 'Literatur-RAG', function: 'Semantische Suche', model: 'Embedding + Flash', usage: 'Evidenz-Check', prereq: 'Wiss. Arbeiten', route: '/literatur' },
    { name: 'Creative Lab', function: 'Anatomie-Generierung', model: 'Imagen + Veo', usage: 'Lehrmittel', prereq: '- (Dozenten)', route: '/labor' },
    { name: 'Anamnese Trainer', function: 'Anamnese + Red Flags', model: 'Gemini Flash', usage: 'Intake-Triage', prereq: 'Anatomie I', route: '/anamnese-trainer' },
    { name: 'Clinical Reasoning Hub', function: 'Vollständige Pipeline', model: 'Gemini 3.1 Pro', usage: 'Komplexe Fälle', prereq: 'Alle Theorie-Module', route: '/clinical-hub' },
  ];

  return (
    <div className="min-h-screen bg-brand-background text-white">
      <Section 
        title="KI-Didaktik Matrix" 
        subtitle="Die Integration der 18 KI-Tools in reale Unterrichts- und Praxis-Szenarien der medizinischen Lehre."
      />

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {(['matrix', 'catalog', 'workflow'] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === t 
                  ? 'bg-brand-primary text-brand-secondary shadow-lg shadow-brand-primary/20' 
                  : 'bg-brand-secondary/50 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {t === 'matrix' ? 'System-Matrix' : t === 'catalog' ? 'Tool-Katalog' : 'Workflow-Demo'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'matrix' && (
            <motion.div 
              key="matrix"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {systems.map((s) => (
                <Card key={s.id} className="group hover:border-brand-primary/50 transition-all duration-500">
                  <div className="text-brand-primary text-4xl font-serif mb-4 opacity-20 group-hover:opacity-100 transition-opacity">
                    0{s.id}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {s.modules.map(m => (
                      <span key={m} className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded border border-brand-primary/20">
                        {m}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-white/60 mb-4 leading-relaxed">{s.link}</p>
                  <div className="text-[10px] text-white/40 mb-6">
                    <strong>Voraussetzung:</strong> {s.prereq}
                  </div>
                  <Button to={s.route} variant="outline" className="w-full text-xs">
                    Demo starten <ArrowRightIcon className="w-3 h-3 ml-2" />
                  </Button>
                </Card>
              ))}
            </motion.div>
          )}

          {activeTab === 'catalog' && (
            <motion.div 
              key="catalog"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-brand-primary text-xs uppercase tracking-widest">
                    <th className="py-4 px-4">Tool</th>
                    <th className="py-4 px-4">Funktion</th>
                    <th className="py-4 px-4">Modell</th>
                    <th className="py-4 px-4">Einsatz</th>
                    <th className="py-4 px-4">Voraussetzung</th>
                    <th className="py-4 px-4">Aktion</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {tools.map((t, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-bold">{t.name}</td>
                      <td className="py-4 px-4 text-white/60">{t.function}</td>
                      <td className="py-4 px-4 text-brand-primary/80">{t.model}</td>
                      <td className="py-4 px-4 text-white/60">{t.usage}</td>
                      <td className="py-4 px-4 text-white/40 text-xs">{t.prereq}</td>
                      <td className="py-4 px-4">
                        <Button to={t.route} variant="outline" className="px-3 py-1 text-[10px]">
                          Demo
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'workflow' && (
            <motion.div 
              key="workflow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="space-y-12 relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-primary/50 to-transparent" />
                
                {[
                  { step: 1, title: 'Befund aufnehmen', desc: 'Anamnese Trainer erhebt Anamnese & Red Flags', route: '/anamnese-trainer', icon: SearchIcon },
                  { step: 2, title: 'Wirkungskette herleiten', desc: 'Reasoning Hub analysiert Pathomechanik', route: '/clinical-hub', icon: BrainCircuitIcon },
                  { step: 3, title: 'Evidenz prüfen', desc: 'Literatur-RAG validiert Hypothesen', route: '/literatur', icon: LightBulbIcon },
                  { step: 4, title: 'Simulation absolvieren', desc: 'Case Training trainiert Clinical Reasoning', route: '/case-training', icon: SimulationIcon },
                  { step: 5, title: 'Wissen prüfen', desc: 'Exam Simulation korrigiert Freitext', route: '/exam-simulation', icon: AcademicCapIcon },
                ].map((s) => (
                  <div key={s.step} className="flex gap-8 items-start relative">
                    <div className="w-16 h-16 rounded-2xl bg-brand-secondary border border-brand-primary/30 flex items-center justify-center flex-shrink-0 z-10 shadow-xl">
                      <s.icon className="w-8 h-8 text-brand-primary" />
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-brand-primary font-serif text-xl">0{s.step}</span>
                        <h3 className="text-xl font-bold">{s.title}</h3>
                      </div>
                      <p className="text-white/60 text-sm mb-4">{s.desc}</p>
                      <Button to={s.route} variant="primary" className="text-xs">
                        Demo starten
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

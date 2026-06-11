import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from './Card';
import { Button } from './Button';
import { CloseIcon, BackArrowIcon, ArrowRightIcon } from './IconComponents';
import { AITool, User, Lecturer, UserRole } from '../types';

interface AIToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  lecturer: Lecturer | null;
}

const aiTools: AITool[] = [
  {
    id: 'soap_note',
    title: 'Klinische Dokumentation (SOAP)',
    description: 'Generieren Sie eine umfassende klinische SOAP-Notiz mit detaillierten subjektiven und objektiven Befunden.',
    systemInstruction: 'You are a medical documentation assistant. Your task is to generate a comprehensive clinical SOAP note based on the user\'s input. Structure the output clearly with Subjective, Objective, Assessment, and Plan sections. Use professional medical terminology. The output must be in German.',
    placeholder: 'Geben Sie hier die relevanten Patienteninformationen, Beobachtungen und Gesprächsnotizen ein...',
    allowedRoles: ['patient', 'student', 'dozent']
  },
  {
    id: 'case_gen',
    title: 'Fall-Generator (Master-Class)',
    description: 'Erstellen Sie komplexe, evidenzbasierte Patientenbeispiele für die Lehre oder das Selbststudium.',
    systemInstruction: 'You are an expert medical educator. Generate a complex, evidence-based clinical case study for physiotherapy students. Include patient history, physical examination findings, and clinical reasoning challenges. The output must be in German.',
    placeholder: 'Thema oder Krankheitsbild für den Fall (z.B. "Vordere Kreuzbandruptur nach 6 Monaten")...',
    allowedRoles: ['student', 'dozent']
  },
  {
    id: 'diag_codes',
    title: 'Diagnose- & Behandlungscodes',
    description: 'Generiert empfohlene Diagnose-, Behandlungs- und Funktionsbewertungscodes basierend auf Ihren klinischen Notizen.',
    systemInstruction: 'You are an AI assistant for medical coding. Based on the user\'s clinical notes, generate recommended diagnostic codes (ICD-10-CM) and treatment codes (CPT, ICF). Provide a rationale for each suggested code. The output must be in German.',
    placeholder: 'Fügen Sie hier die klinischen Notizen ein, um Code-Empfehlungen zu erhalten...',
    allowedRoles: ['student', 'dozent']
  },
  {
    id: 'diff_diag',
    title: 'Differenzialdiagnose',
    description: 'Analysieren Sie Patientensymptome, um eine priorisierte Liste möglicher Diagnosen zu erstellen und klinische Entscheidungen zu unterstützen.',
    systemInstruction: 'You are a clinical decision support AI. Your task is to generate a prioritized list of possible differential diagnoses based on the provided patient symptoms and clinical notes. For each diagnosis, provide a brief rationale and suggest potential next steps or assessments. The output must be in German and clearly structured.',
    placeholder: 'Beschreiben Sie die Symptome, Anamnese und Befunde des Patienten...',
    allowedRoles: ['student', 'dozent']
  },
  {
    id: 'discharge_report',
    title: 'Entlassungsbericht',
    description: 'Entwerfen Sie einen zusammenfassenden Bericht über den Fortschritt, die Behandlungsergebnisse und Empfehlungen des Patienten.',
    systemInstruction: 'You are a medical report generation assistant. Your task is to draft a concise discharge report summarizing a patient\'s progress, treatment outcomes, and recommendations for follow-up care based on the provided information. The report must be in German and follow a professional format.',
    placeholder: 'Fassen Sie den Behandlungsverlauf und die Ergebnisse zusammen...',
    allowedRoles: ['patient', 'student', 'dozent']
  },
];

type ModalStep = 'selection' | 'input' | 'loading' | 'result';

export const AIToolsModal: React.FC<AIToolsModalProps> = ({ isOpen, onClose, user, lecturer }) => {
  const [step, setStep] = useState<ModalStep>('selection');
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [userInput, setUserInput] = useState('');
  const [generatedResult, setGeneratedResult] = useState('');
  const [error, setError] = useState('');

  const currentRole: UserRole = lecturer ? 'dozent' : (user?.role || 'patient');
  const filteredTools = aiTools.filter(tool => !tool.allowedRoles || tool.allowedRoles.includes(currentRole));

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('selection');
      setSelectedTool(null);
      setUserInput('');
      setGeneratedResult('');
      setError('');
    }, 300);
  };

  const handleToolSelect = (tool: AITool) => {
    setSelectedTool(tool);
    setStep('input');
  };

  const handleBack = () => {
    if (step === 'input' || step === 'result') {
      setStep('selection');
      setUserInput('');
      setGeneratedResult('');
      setError('');
    }
  };

  const handleGenerate = async () => {
    if (!userInput.trim() || !selectedTool) return;
    setStep('loading');
    setError('');
    setGeneratedResult('');

    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error("API key is not configured.");
      }
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userInput,
        config: {
          systemInstruction: selectedTool.systemInstruction,
          temperature: 0.5,
        }
      });
      
      setGeneratedResult(response.text);
      setStep('result');
    } catch (e) {
      console.error("Error generating AI content:", e);
      setError('Bei der Kommunikation mit der AI ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
      setStep('input');
    }
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (step) {
      case 'selection':
        return (
          <div className="space-y-4">
            {filteredTools.map((tool) => (
              <div key={tool.id} onClick={() => handleToolSelect(tool)} className="p-4 border border-brand-border rounded-lg hover:bg-brand-surface hover:border-brand-primary transition-all cursor-pointer group">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-lg text-brand-secondary group-hover:text-brand-primary-dark">{tool.title}</h4>
                    <p className="text-sm text-brand-text-on-light-secondary mt-1">{tool.description}</p>
                  </div>
                  <ArrowRightIcon className="w-6 h-6 text-brand-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'input':
      case 'loading':
        return (
          <div>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={selectedTool?.placeholder}
              className="w-full h-64 p-3 bg-brand-surface border border-brand-border text-brand-text-on-light rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm leading-relaxed resize-none placeholder-gray-400"
              disabled={step === 'loading'}
            />
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
             {step === 'loading' && (
                <div className="text-center p-4 mt-4 bg-brand-surface rounded-md animate-pulse">
                    <p className="font-semibold text-brand-primary">KI analysiert Ihre Eingabe...</p>
                </div>
            )}
          </div>
        );
       case 'result':
        const htmlContent = generatedResult
            .replace(/### (.*)/g, '<h3 class="text-xl font-semibold font-sans text-brand-secondary mt-6 mb-3">$1</h3>')
            .replace(/## (.*)/g, '<h2 class="text-2xl font-bold font-serif text-brand-secondary mt-8 mb-4">$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C9A84C]">$1</strong>')
            .replace(/\* (.*?)(?=\n|\* |$)/g, '<li class="ml-4 mb-1">$1</li>')
            .replace(/(\n)/g, '<br />')
            .replace(/(<br \/>\s*){2,}/g, '<br /><br />');

        return (
            <div className="prose prose-lg max-w-none text-brand-text-on-light-secondary leading-relaxed bg-brand-surface p-4 rounded-md border border-brand-border max-h-96 overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        );
    }
  };

  const getTitle = () => {
    if (step === 'selection' || !selectedTool) return 'KI-Werkzeuge auswählen';
    if (step === 'result') return `Ergebnis für: ${selectedTool.title}`;
    return selectedTool.title;
  };
  
  const showBackButton = step === 'input' || step === 'result';
  const showGenerateButton = step === 'input' || step === 'loading';

  return (
    <div className="fixed inset-0 bg-brand-secondary/80 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 animate-fadeInUp" role="dialog" aria-modal="true" aria-labelledby="ai-tools-heading">
      <Card className="flex flex-col w-full max-w-2xl h-auto max-h-[90vh] shadow-2xl bg-brand-background !p-0 rounded-xl overflow-hidden">
        <header className="bg-brand-surface p-4 flex justify-between items-center flex-shrink-0 border-b border-brand-border">
          <div className="flex items-center gap-4">
             {showBackButton && (
              <button onClick={handleBack} className="p-1 text-brand-secondary hover:text-brand-primary transition-colors" aria-label="Zurück">
                <BackArrowIcon className="w-6 h-6" />
              </button>
            )}
            <h2 id="ai-tools-heading" className="text-xl font-semibold font-serif text-brand-secondary">{getTitle()}</h2>
          </div>
          <button onClick={handleClose} aria-label="Schließen" className="text-brand-secondary hover:text-brand-primary transition-colors p-1 rounded-md">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-grow p-6 overflow-y-auto">
          {renderContent()}
        </div>

        <footer className="flex-shrink-0 bg-brand-surface p-4 flex justify-end items-center rounded-b-xl border-t border-brand-border">
          {step === 'result' ? (
              <Button onClick={() => navigator.clipboard.writeText(generatedResult)} variant="secondary" size="sm">
                Ergebnis kopieren
              </Button>
          ) : showGenerateButton ? (
            <Button onClick={handleGenerate} disabled={step === 'loading' || !userInput.trim()} variant="primary" size="sm">
              {step === 'loading' ? 'KI analysiert klinisches Bild...' : 'Generieren'}
            </Button>
          ) : null}
        </footer>
      </Card>
    </div>
  );
};
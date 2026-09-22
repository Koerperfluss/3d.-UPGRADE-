import React, { useState } from 'react';
import { Type } from '@google/genai';
import { generateClinicalContent, ai } from '../services/aiService';
import { Card } from './Card';
import { Button } from './Button';
import { CheckCircleIcon, ArrowRightIcon, LightBulbIcon, BrainCircuitIcon, CameraIcon } from './IconComponents';
import { CaseStudy } from '../types';

interface EvaluationResult {
    score: number;
    feedback_text: string;
    missing_concepts: string[];
    next_step_hint: string;
}

export const CaseSession: React.FC<{ caseStudy: CaseStudy, tutorMood: string, onReset: () => void }> = ({ caseStudy, tutorMood, onReset }) => {
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
                  setVideoUri(`${downloadLink}&key=${import.meta.env.VITE_GEMINI_API_KEY}`);
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

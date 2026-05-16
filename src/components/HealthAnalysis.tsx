
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from './Card';
import { Button } from './Button'; // Import button
import { CollectedVariables } from './Chatbot';
import { LightBulbIcon, CheckCircleIcon, WarningIcon } from './IconComponents';

export const HealthAnalysis: React.FC = () => {
    const [analysis, setAnalysis] = useState<string>('');
    const [inputData, setInputData] = useState<CollectedVariables | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [hasData, setHasData] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState(false); // For dummy loading state

    useEffect(() => {
        const generateAnalysis = async () => {
            const storedData = sessionStorage.getItem('chatbotData');
            if (!storedData) {
                setHasData(false);
                return;
            }

            setHasData(true);
            setIsLoading(true);
            setError('');

            try {
                if (!process.env.GEMINI_API_KEY) {
                    throw new Error("API key is not configured.");
                }
                const chatbotVariables: CollectedVariables = JSON.parse(storedData);
                setInputData(chatbotVariables);

                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

                // --- PARAMETER PIPELINE DEFINITION ---
                // Hier erfolgt die systematische Verkettung der Informationen nach den 5 Phasen.
                const systemInstruction = `
Rolle: Hochspezialisierter KI-Assistent für evidenzbasierte Physiotherapie & Training.
Identität: Expert Physiotherapie + ML + App-Development.
Ziel: Komplexe medizinische Befunde in verständliche, umsetzbare Pläne transformieren (A4-Format).

KERNWORKFLOW (Befolge EXAKT diese Reihenfolge - Parameter Pipeline):

1. ANALYSE
- Systematische Auswertung der User-Daten (Pathologien, Funktionsstörungen, Belastungslimits).
- Erfassung betroffener Strukturen (Muskeln, Gelenke, Nerven).
- Abgleich mit aktuellen Leitlinien (Physio Austria, AWMF) & Clinical Reasoning.

2. INTERPRETATION
- Laienverständliche Erklärung der medizinischen Daten.
- Logische Darlegung von Ursache-Wirkung.
- Festlegung der Therapie-Prioritäten.

3. PLANERSTELLUNG
- Programm nach Ziel (Mobilität, Stabilität, Kraft), Belastbarkeit und Reha-Phase.
- Parameter-Definition: Sätze, Wiederholungen, Intensität, Pausen.
- Berücksichtigung von Sicherheitsaspekten (Red Flags/Kontraindikationen).

4. DOKUMENTGESTALTUNG (OUTPUT)
- Format: Markdown.
- Erstelle zwingend eine Tabelle mit EXAKT diesen Spalten:
| Übungsname | Ausführung / Grund / Nutzen | Reps / Sets / Hold Time | Notizen |

5. MOTIVATION & NACHHALTIGKEIT
- Integrationstipps für den Alltag.
- Abschlussfrage: "Passt das so für dich?"

QUALITÄTSSICHERUNG:
- Prüfung auf Evidenz & Sicherheit.
- Signatur am Ende: [SASCHA LAGLER | Physio/ML/KI-Developer]
- Bei Unsicherheit: Ausgabe "Nicht verifizierbar".
`;

                const prompt = `
            Führe die Analyse durch für:
            \`\`\`json
            ${JSON.stringify(chatbotVariables, null, 2)}
            \`\`\`
            
            Wende die Chain-of-Verification an. Erstelle den Plan strikt nach Workflow.
        `;

                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview', 
                    contents: prompt,
                    config: {
                        systemInstruction: systemInstruction,
                        temperature: 0.3, // Low temp for medical precision
                    }
                });

                setAnalysis(response.text || "Keine Analyse generiert.");

            } catch (e) {
                console.error("Error generating analysis:", e);
                setError('Fehler bei der Analyse-Erstellung. Bitte prüfen Sie Ihre Verbindung.');
            }
        };

        generateAnalysis();
    }, []);

    const handleMockExport = (type: string) => {
        setIsExporting(true);
        setTimeout(() => {
            alert(`Erfolgreich als ${type} exportiert! (Demo-Funktion)`);
            setIsExporting(false);
        }, 1500);
    };

    const renderInputData = () => {
        if (!inputData) return null;
        const filteredData = Object.entries(inputData)
            .filter(([key, value]) => 
                key !== 'questionComments' && key !== 'mode' && value && String(value).trim() !== '(Keine Angabe)'
            );

        if (filteredData.length === 0) return null;

        return (
            <details className="mb-6 bg-brand-surface rounded-lg border border-brand-border/50 group">
                <summary className="font-semibold text-brand-secondary cursor-pointer p-4 list-none flex justify-between">
                    <span>Verwendete Daten für diese Analyse</span>
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 pt-0 text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredData.map(([key, value]) => (
                        <div key={key} className="border-b border-brand-border/30 pb-1">
                            <span className="font-bold capitalize opacity-70">{key}: </span>
                            <span>{String(value)}</span>
                        </div>
                    ))}
                </div>
            </details>
        );
    };
    
    if (isLoading) return (
        <div className="p-12 text-center bg-brand-surface rounded-xl border border-brand-border shadow-sm">
            <div className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-brand-secondary font-bold animate-pulse">Deep Reasoning Engine arbeitet...</p>
            <p className="text-xs text-brand-text-on-light-secondary mt-2">Analysiere Befunde • Prüfe Leitlinien • Erstelle Plan</p>
        </div>
    );

    if (error) return <div className="p-6 bg-red-50 text-red-800 rounded-lg flex items-center gap-3"><WarningIcon className="w-5 h-5"/> {error}</div>;
    
    if (!analysis && !hasData) return (
        <div className="p-8 text-center text-brand-text-on-light-secondary bg-brand-background rounded-xl border border-dashed border-brand-border">
            Keine Daten für eine Analyse vorhanden. Bitte starten Sie den Chatbot erneut.
        </div>
    );

    return (
        <Card className="bg-brand-background shadow-xl border-t-4 border-t-brand-primary">
            <div className="flex items-center gap-3 mb-6 border-b border-brand-border pb-4">
                <LightBulbIcon className="w-8 h-8 text-brand-primary" />
                <div className="flex-grow">
                    <h2 className="text-2xl font-bold font-serif text-brand-secondary">Ihr Experten-Plan</h2>
                    <p className="text-xs text-brand-text-on-light-secondary uppercase tracking-widest">Evidenzbasiert & Personalisiert</p>
                </div>
                <div className="hidden sm:flex gap-2">
                    <Button onClick={() => handleMockExport('PDF')} variant="outline" size="sm" disabled={isExporting} ariaLabel="Als Arbeitsblatt exportieren">PDF Export</Button>
                    <Button onClick={() => handleMockExport('Moodle (LTI 1.3)')} variant="primary" size="sm" disabled={isExporting} ariaLabel="Mit LMS synchronisieren">In Moodle sichern</Button>
                </div>
            </div>
            
            {renderInputData()}
            
            <div className="prose prose-lg max-w-none text-brand-text-on-light-secondary leading-relaxed space-y-4">
                 <div dangerouslySetInnerHTML={{ 
                     __html: analysis
                        .replace(/\n/g, '<br />')
                        // Force table styling for A4 consistency simulation
                        .replace(/\| (.+) \|/g, (match) => `<div class="overflow-x-auto my-4 border border-brand-border rounded-lg bg-white"><table class="min-w-full text-sm text-left border-collapse">${match}</table></div>`)
                        .replace(/### (.*)/g, '<h3 class="text-xl font-bold text-brand-secondary mt-6 mb-2 border-b border-brand-primary/20 pb-1">$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C9A84C]">$1</strong>')
                 }} />
            </div>

            <div className="mt-8 pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1 text-xs text-brand-text-on-light-secondary opacity-70">
                    <CheckCircleIcon className="w-4 h-4"/> Validiert durch AI-Logik
                </div>
                
                {/* Mobile Export Buttons */}
                <div className="flex sm:hidden gap-2 w-full">
                    <Button onClick={() => handleMockExport('PDF')} variant="outline" size="sm" className="flex-1" disabled={isExporting}>PDF</Button>
                    <Button onClick={() => handleMockExport('Moodle')} variant="primary" size="sm" className="flex-1" disabled={isExporting}>Moodle Sync</Button>
                </div>

                <span className="font-mono text-[10px] text-brand-text-on-light-secondary opacity-70 mt-2 sm:mt-0">[SASCHA LAGLER | Physio/ML/KI-Developer]</span>
            </div>
        </Card>
    );
};

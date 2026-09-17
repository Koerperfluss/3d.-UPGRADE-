import React, { useState, useCallback } from 'react';
import { Type } from '@google/genai';
import { FundingAnalysisResult } from '../types';
import { generateStructuredText, generateFundingSuggestions } from '../services/geminiService';
import { LightBulbIcon, SparklesIcon, InformationCircleIcon, DocumentTextIcon, CheckBadgeIcon, MagnifyingGlassIcon, LinkIcon, ArrowPathIcon } from './Icons';
import { motion, AnimatePresence } from 'motion/react';

const fundingAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        fundingType: { type: Type.STRING, description: "Type of funding (e.g., Grant, Loan, Subsidy, Venture Capital)." },
        targetGroup: { type: Type.STRING, description: "The intended audience for this funding (e.g., Startups, SMEs, Researchers)." },
        eligibilityCriteria: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key eligibility criteria." },
        applicationProcess: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of typical steps in the application process." },
        sources: {
            type: Type.ARRAY,
            description: "List of relevant source links.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Title of the source webpage." },
                    url: { type: Type.STRING, description: "URL of the source webpage." }
                }
            }
        }
    },
    required: ['fundingType', 'targetGroup', 'eligibilityCriteria', 'applicationProcess']
};

const FundingScanner: React.FC = () => {
    const [programName, setProgramName] = useState('FFG Basisprogramm');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<FundingAnalysisResult | null>(null);
    const [groundingSources, setGroundingSources] = useState<Array<{ web?: { title?: string; uri?: string } }>>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [error, setError] = useState<string>('');
    const [validationError, setValidationError] = useState<string>('');

    const handleAnalyze = useCallback(async () => {
        if (!programName.trim()) {
            setValidationError('Bitte geben Sie den Namen einer Förderung ein.');
            return;
        }
        setValidationError('');

        setIsLoading(true);
        setError('');
        setAnalysisResult(null);
        setGroundingSources([]);
        setSuggestions([]);

        const prompt = `Please provide a detailed analysis of the following funding program: "${programName}". Research it online using your search tool and provide the information in the requested JSON format. The JSON schema to follow is: ${JSON.stringify(fundingAnalysisSchema)}. If the program doesn't seem to exist or is not a funding program, please indicate that clearly in the response fields.`;

        try {
            const [response, suggestionsResult] = await Promise.all([
                generateStructuredText(prompt),
                generateFundingSuggestions(programName)
            ]);
            
            const resultJson = JSON.parse(response.text);
            setAnalysisResult(resultJson);
            setSuggestions(suggestionsResult);

            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            setGroundingSources(sources);

        } catch (err: unknown) {
            console.error("Error calling Gemini API:", err);
            setError("Die Analyse konnte nicht durchgeführt werden. Bitte überprüfen Sie den Programmnamen oder versuchen Sie es später erneut.");
        } finally {
            setIsLoading(false);
        }
    }, [programName]);

    const handleProgramNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProgramName(e.target.value);
        if (validationError) {
            setValidationError('');
        }
    };
    
    const ResultCard: React.FC<{title: string; icon: React.ReactNode; children: React.ReactNode; delay?: number}> = ({ title, icon, children, delay = 0 }) => (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="bg-white/5 border border-white/10 p-8 rounded-sm h-full hover:border-brand-primary/40 transition-all duration-300 group"
        >
            <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                    <div className="w-5 h-5">{icon}</div>
                </div>
                <h4 className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">{title}</h4>
            </div>
            <div className="text-white/70 leading-relaxed">
                {children}
            </div>
        </motion.div>
    );

    return (
        <div className="flex flex-col h-full bg-transparent p-6 space-y-6 overflow-hidden">
            <motion.header 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 backdrop-blur-3xl p-8 rounded-sm border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-2xl"
            >
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-brand-primary">
                        <MagnifyingGlassIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-serif italic text-white tracking-tight">Opportunity_Scanner</h3>
                        <p className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mt-1">Global Funding Intelligence • Loki v2.5</p>
                    </div>
                </div>

                <div className="flex-1 max-w-2xl relative group">
                    <input
                        type="text"
                        value={programName}
                        onChange={handleProgramNameChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                        placeholder="z.B. Horizon Europe, AWS Seedfinancing..."
                        className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-sm text-white font-mono text-sm focus:ring-1 focus:ring-brand-primary/40 focus:border-brand-primary/40 focus:outline-none transition-all placeholder:text-white/20"
                        disabled={isLoading}
                    />
                    <motion.button
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAnalyze}
                        disabled={isLoading || !programName.trim()}
                        className="absolute right-2 top-2 h-12 px-8 bg-brand-primary text-white rounded-sm flex items-center gap-2 shadow-xl shadow-brand-primary/20 disabled:bg-white/5 disabled:text-white/20 disabled:shadow-none transition-all"
                    >
                        {isLoading ? (
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        ) : (
                            <SparklesIcon className="w-4 h-4" />
                        )}
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Scan</span>
                    </motion.button>
                    {validationError && (
                        <motion.p 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-6 left-6 text-[9px] font-mono text-rose-500 uppercase tracking-widest"
                        >
                            {validationError}
                        </motion.p>
                    )}
                </div>
            </motion.header>

            <main className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center space-y-8"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 border border-white/5 border-t-brand-primary rounded-full animate-spin" />
                                <SparklesIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-primary animate-pulse" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-2xl font-serif italic text-white tracking-tight">Analysiere Fördermöglichkeit</h4>
                                <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mt-2">KI-Recherche in Echtzeit</p>
                            </div>
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-lg mx-auto p-12 bg-black/40 border border-rose-500/20 rounded-sm text-center shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-sm flex items-center justify-center text-rose-500 mx-auto mb-8">
                                <InformationCircleIcon className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-serif italic text-rose-500 tracking-tight">Scan fehlgeschlagen</h4>
                            <p className="text-white/40 mt-4 text-sm font-mono leading-relaxed">{error}</p>
                            <motion.button 
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAnalyze}
                                className="mt-10 px-8 py-3 bg-white/5 border border-white/10 text-white rounded-sm text-[10px] font-mono uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Erneut_versuchen
                            </motion.button>
                        </motion.div>
                    ) : analysisResult ? (
                        <motion.div 
                            key="results"
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto pb-12"
                        >
                            <ResultCard title="Fördertyp" icon={<InformationCircleIcon className="w-5 h-5" />} delay={0.1}>
                                <p className="text-xl font-serif italic text-white tracking-tight">{analysisResult.fundingType}</p>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Klassifizierung</p>
                                </div>
                            </ResultCard>

                            <ResultCard title="Zielgruppe" icon={<LightBulbIcon className="w-5 h-5" />} delay={0.2}>
                                <p className="text-xl font-serif italic text-white tracking-tight">{analysisResult.targetGroup}</p>
                                <div className="flex items-center gap-2 mt-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Berechtigte Entitäten</p>
                                </div>
                            </ResultCard>

                            <ResultCard title="Zulassungskriterien" icon={<CheckBadgeIcon className="w-5 h-5" />} delay={0.3}>
                                <ul className="space-y-4">
                                    {analysisResult.eligibilityCriteria.map((item, index) => (
                                        <li key={index} className="flex items-start gap-4 text-xs font-mono text-white/60 group/item">
                                            <div className="w-5 h-5 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-brand-primary group-hover/item:border-brand-primary transition-all duration-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary group-hover/item:bg-white" />
                                            </div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </ResultCard>

                            <ResultCard title="Bewerbungsprozess" icon={<DocumentTextIcon className="w-5 h-5" />} delay={0.4}>
                                <div className="space-y-5">
                                    {analysisResult.applicationProcess.map((item, index) => (
                                        <div key={index} className="flex gap-4 group/step">
                                            <span className="text-[10px] font-mono font-bold text-brand-primary bg-white/5 border border-white/10 w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 group-hover/step:bg-brand-primary group-hover/step:text-white transition-all duration-300">
                                                {index + 1}
                                            </span>
                                            <p className="text-xs font-mono text-white/60 leading-relaxed">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </ResultCard>

                            {suggestions.length > 0 && (
                                <div className="md:col-span-2">
                                    <ResultCard title="Ähnliche Förderungen" icon={<SparklesIcon className="w-5 h-5" />} delay={0.5}>
                                        <div className="flex flex-wrap gap-3">
                                            {suggestions.map((suggestion, index) => (
                                                <motion.button 
                                                    key={index} 
                                                    whileHover={{ y: -1 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setProgramName(suggestion)}
                                                    className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-sm text-[11px] font-mono text-white/40 hover:text-white hover:bg-brand-primary hover:border-brand-primary transition-all"
                                                >
                                                    {suggestion}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </ResultCard>
                                </div>
                            )}

                            {(analysisResult.sources?.length > 0 || groundingSources.length > 0) && (
                                <div className="md:col-span-2">
                                    <ResultCard title="Verifizierte Quellen" icon={<LinkIcon className="w-5 h-5" />} delay={0.6}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {analysisResult.sources?.map((source, index) => (
                                                <motion.a 
                                                    key={`s-${index}`}
                                                    whileHover={{ y: -2 }}
                                                    href={source.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-sm hover:border-brand-primary/40 transition-all group"
                                                >
                                                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white/20 group-hover:text-brand-primary transition-colors">
                                                        <LinkIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-xs font-serif italic text-white/80 truncate">{source.title || source.url}</span>
                                                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest mt-1">Direktlink</span>
                                                    </div>
                                                </motion.a>
                                            ))}
                                            {groundingSources.map((source, index) => (
                                                source.web && (
                                                    <motion.a 
                                                        key={`gs-${index}`}
                                                        whileHover={{ y: -2 }}
                                                        href={source.web.uri} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-sm hover:border-brand-primary/40 transition-all group"
                                                    >
                                                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white/20 group-hover:text-brand-primary transition-colors">
                                                            <MagnifyingGlassIcon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-xs font-serif italic text-white/80 truncate">{source.web.title || source.web.uri}</span>
                                                            <span className="text-[9px] font-mono text-brand-primary uppercase tracking-widest mt-1">KI-Recherche</span>
                                                        </div>
                                                    </motion.a>
                                                )
                                            ))}
                                        </div>
                                    </ResultCard>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-8"
                        >
                            <div className="relative">
                                <div className="w-32 h-32 bg-white/5 backdrop-blur-2xl rounded-sm border border-white/10 flex items-center justify-center text-white/10 shadow-2xl">
                                    <MagnifyingGlassIcon className="w-16 h-16" />
                                </div>
                                <motion.div 
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute -top-4 -right-4 w-12 h-12 bg-brand-primary text-white rounded-sm flex items-center justify-center shadow-xl shadow-brand-primary/20"
                                >
                                    <SparklesIcon className="w-6 h-6" />
                                </motion.div>
                            </div>
                            <div>
                                <h4 className="text-3xl font-serif italic text-white tracking-tight">Bereit für den Scan</h4>
                                <p className="text-white/40 mt-4 text-sm font-mono leading-relaxed uppercase tracking-wider">
                                    Geben Sie den Namen eines Förderprogramms ein, um eine detaillierte KI-Analyse der Kriterien und Prozesse zu erhalten.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default FundingScanner;

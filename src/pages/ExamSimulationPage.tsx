import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/Section';
import { ArrowLeftIcon } from '../components/IconComponents';
import { ExamGenerator } from '../components/ExamGenerator';
import { ExamSession } from '../components/ExamSession';
import { Exam } from '../types';

export const ExamSimulationPage: React.FC = () => {
  const [activeExam, setActiveExam] = useState<Exam | null>(null);

  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-40 pb-32 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
         <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20 mb-12">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 hover:text-brand-primary transition-all group">
          <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Zurück zum Dashboard
        </Link>
      </div>

      <Section 
        title="Prüfungs-Simulation Pro"
        subtitle="Realistische Examensvorbereitung mit Zeitdruck, gemischten Fragenformaten und intelligenter KI-Korrektur für Freitext-Antworten."
        containerClassName="py-0 relative z-10 mb-24"
      />

      <div className="container mx-auto px-4 relative z-10">
        {!activeExam ? (
            <ExamGenerator onExamGenerated={setActiveExam} />
        ) : (
            <ExamSession exam={activeExam} onExit={() => setActiveExam(null)} />
        )}
      </div>
    </div>
  );
};

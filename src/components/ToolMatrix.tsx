import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ScannerIcon, BrainCircuitIcon, CreativeIcon, LabIcon,
  LiteratureIcon, SimulationIcon, AcademicCapIcon, 
  BrainIcon, CheckCircleIcon, DocumentTextIcon,
  SearchIcon, LightBulbIcon, CameraIcon, MessageCircleIcon,
  RobotIcon, ShieldCheckIcon, ChartBarIcon, ClipboardIcon
} from './IconComponents';

const tools = [
  { name: 'Körper-Scanner', type: 'Analyse', icon: ScannerIcon, link: '/analyse' },
  { name: 'Deep Reasoning', type: 'Analyse', icon: BrainCircuitIcon, link: '/education' },
  { name: 'Vision Agent', type: 'Analyse', icon: CameraIcon, link: '/vision' },
  { name: 'Anamnese Trainer', type: 'Triage', icon: SearchIcon, link: '/anamnese-trainer' },
  { name: 'Clinical Hub', type: 'Reasoning', icon: BrainCircuitIcon, link: '/education' },
  { name: 'Case Training', type: 'Training', icon: SimulationIcon, link: '/case-training' },
  { name: 'Exam Simulation', type: 'Training', icon: AcademicCapIcon, link: '/exam-simulation' },
  { name: 'Quiz AI', type: 'Training', icon: BrainIcon, link: '/quiz' },
  { name: 'Creative Lab', type: 'Kreation', icon: CreativeIcon, link: '/creative-lab' },
  { name: 'Labor / Labs', type: 'Forschung', icon: LabIcon, link: '/labor' },
  { name: 'Literatur-RAG', type: 'Wissen', icon: LiteratureIcon, link: '/literatur' },
  { name: 'Fall Generator', type: 'Dozenten', icon: DocumentTextIcon, link: '/educator' },
  { name: 'Handout Builder', type: 'Dozenten', icon: LightBulbIcon, link: '/educator' },
  { name: 'SOAP-Note Gen', type: 'Dokumentation', icon: ClipboardIcon, link: '/assessment' },
  { name: 'Diagnose Codes', type: 'Billing', icon: ShieldCheckIcon, link: '/assessment' },
  { name: 'Bericht-KI', type: 'Entlassung', icon: DocumentTextIcon, link: '/assessment' },
  { name: 'Mindmap Engine', type: 'Lernen', icon: SimulationIcon, link: '/education' },
  { name: '24/7 Mentor', type: 'Support', icon: MessageCircleIcon, link: '/' }
];

export const ToolMatrix: React.FC = () => {
  return (
    <div className="space-y-12 relative z-10 w-full mb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
            <AcademicCapIcon className="w-8 h-8 text-brand-primary" />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white tracking-tighter uppercase">KI-Werkzeuge & <span className="text-gradient-gold italic font-light lowercase">Tools</span></h2>
            <p className="text-zinc-500 text-sm tracking-[0.2em] uppercase font-bold mt-1">Die 18 Kern-Bereiche der Körperfluss Intelligenz</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {tools.map((tool, idx) => (
          <Link key={idx} to={tool.link} className="block group">
            <div className="glass-dark aspect-square p-6 rounded-[30px] border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center hover:bg-brand-primary/10 hover:border-brand-primary/40 transition-all duration-500 cursor-pointer backdrop-blur-xl">
              <div className="w-12 h-12 rounded-[15px] bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 group-hover:bg-brand-primary/20">
                <tool.icon className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-white font-bold text-xs mb-1 line-clamp-2">{tool.name}</h3>
              <p className="text-[8px] uppercase tracking-[0.2em] font-black text-zinc-500 group-hover:text-brand-primary transition-colors">{tool.type}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

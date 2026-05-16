import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ScannerIcon, BrainCircuitIcon, CreativeIcon, LabIcon,
  LiteratureIcon, SimulationIcon, AcademicCapIcon, 
  BrainIcon, CheckCircleIcon, DocumentTextIcon,
  SearchIcon, LightBulbIcon, CameraIcon
} from './IconComponents';

const tools = [
  { name: 'Körper-Scanner', type: 'Analyse', icon: ScannerIcon, link: '/analyse' },
  { name: 'Deep Reasoning', type: 'Analyse', icon: BrainCircuitIcon, link: '/education' },
  { name: 'Creative Lab', type: 'Kreation', icon: CreativeIcon, link: '/creative-lab' },
  { name: 'Labor', type: 'Forschung', icon: LabIcon, link: '/labor' },
  { name: 'Literatur', type: 'Wissen', icon: LiteratureIcon, link: '/literatur' },
  { name: 'Case Training', type: 'Training', icon: SearchIcon, link: '/case-training' },
  { name: 'Exam Simulation', type: 'Training', icon: AcademicCapIcon, link: '/exam-simulation' },
  { name: 'Quiz', type: 'Training', icon: BrainIcon, link: '/quiz' },
  { name: 'Vision Agent', type: 'Analyse', icon: CameraIcon, link: '/vision' },
  { name: 'Fall Generator', type: 'Kreation', icon: DocumentTextIcon, link: '/educator' },
  { name: 'Handout Builder', type: 'Kreation', icon: LightBulbIcon, link: '/educator' },
  { name: 'Exam Assistant', type: 'Training', icon: CheckCircleIcon, link: '/assessment' },
  { name: 'Mindmap Engine', type: 'Kreation', icon: SimulationIcon, link: '/education' }
];

export const ToolMatrix: React.FC = () => {
  return (
    <div className="space-y-12 relative z-10 w-full mb-32">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
          <AcademicCapIcon className="w-8 h-8 text-brand-primary" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold font-serif text-white tracking-tighter uppercase">KI-Werkzeuge & <span className="text-gradient-gold italic font-light lowercase">Tools</span></h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tools.map((tool, idx) => (
          <Link key={idx} to={tool.link} className="block group">
            <div className="glass-dark aspect-square p-8 rounded-[40px] border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all duration-500 cursor-pointer">
              <div className="w-16 h-16 rounded-[20px] bg-brand-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <tool.icon className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{tool.name}</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 group-hover:text-brand-primary transition-colors">{tool.type}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

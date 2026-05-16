
import React from 'react';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, Lecturer } from '../types';
import { HealthAnalysis } from '../components/HealthAnalysis';
import { 
  ConsultingIcon, 
  CreditCardIcon, 
  ArrowRightIcon, 
  EducationIcon, 
  AnalyticsIcon, 
  CreativeIcon,
  BrainIcon,
  ScannerIcon,
  LabIcon,
  LiteratureIcon,
  AcademicCapIcon,
  DocumentTextIcon
} from '../components/IconComponents';
import { CreativeLab } from '../components/CreativeLab';
import { MediaAnalyzer } from '../components/MediaAnalyzer';

interface DashboardPageProps {
  user: User | null;
  lecturer: Lecturer | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, lecturer }) => {
  const role = lecturer ? 'dozent' : (user?.role || 'patient');
  const name = lecturer ? lecturer.name : (user?.name || 'Gast');

  const renderPatientView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
      {/* Main Content: Personal Report */}
      <div className="lg:col-span-8 space-y-12">
         <div className="glass-dark rounded-[48px] overflow-hidden shadow-[0_60px_150px_rgba(0,0,0,0.9)] border border-white/5 backdrop-blur-3xl">
           <HealthAnalysis />
         </div>
         
         <div className="glass-dark group relative overflow-hidden p-12 md:p-16 rounded-[48px] border border-white/5 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:bg-brand-primary/10 transition-colors duration-1000"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
                  <ConsultingIcon className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-4xl font-bold font-serif text-white tracking-tight uppercase">Ihr Handlungsplan</h3>
              </div>
              <p className="text-zinc-400 mb-16 text-xl font-light leading-relaxed max-w-3xl tracking-wide">
                  Basierend auf Ihrer <span className="text-white font-medium italic">KI-gestützten Haltungsanalyse</span> haben wir folgende personalisierte Ressourcen für Sie zusammengestellt.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between bg-white/[0.03] p-8 rounded-[32px] border border-white/5 hover:border-brand-primary/30 transition-all group/item cursor-pointer backdrop-blur-xl">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-xl tracking-tight">PDF Handout</span>
                        <span className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black mt-2">Vollversion (Evidenz)</span>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/item:border-brand-primary group-hover/item:bg-brand-primary/10 transition-all">
                        <ArrowRightIcon className="w-5 h-5 text-zinc-500 group-hover/item:text-brand-primary" />
                      </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/[0.03] p-8 rounded-[32px] border border-white/5 hover:border-brand-primary/30 transition-all group/item cursor-pointer backdrop-blur-xl">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-xl tracking-tight">Rechnungsbeleg</span>
                        <span className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-black mt-2">Steuerlich absetzbar</span>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover/item:border-brand-primary group-hover/item:bg-brand-primary/10 transition-all">
                        <ArrowRightIcon className="w-5 h-5 text-zinc-500 group-hover/item:text-brand-primary" />
                      </div>
                  </div>
              </div>
            </div>
         </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4 space-y-10">
         <div className="glass-dark !bg-gradient-to-br from-brand-primary/10 to-transparent relative overflow-hidden group p-12 rounded-[48px] border border-white/10 shadow-2xl">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <h3 className="font-bold font-serif text-3xl mb-12 text-white tracking-tight uppercase">Mitgliedschaft</h3>
            <div className="flex items-center gap-6 mb-16">
                <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
                    <CreditCardIcon className="w-8 h-8 text-brand-primary" />
                </div>
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-black mb-2 opacity-60">Aktueller Status</p>
                    <p className="font-serif font-bold text-3xl text-white tracking-tight">{user?.plan?.name || 'Premium Access'}</p>
                </div>
            </div>
            <Button to="/angebote" variant="primary" className="w-full !rounded-[24px] !py-6 text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-brand-primary/20 hover:shadow-brand-primary/40 transform hover:-translate-y-2 transition-all">
                Plan verwalten
            </Button>
         </div>

         <div className="glass-dark group p-12 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -ml-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <h3 className="font-bold font-serif text-2xl text-white mb-6 tracking-tight uppercase">Support & Coaching</h3>
            <p className="text-zinc-500 text-lg font-light leading-relaxed mb-12 tracking-wide">
                Haben Sie Fragen zu Ihrer Analyse? Unsere Experten begleiten Sie auf Ihrem Weg zum <span className="text-white italic">Körperfluss</span>.
            </p>
            <Button to="/kontakt" variant="outline" size="sm" className="w-full !rounded-[20px] flex justify-center items-center gap-4 py-5 border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 transition-all uppercase text-[10px] font-black tracking-[0.3em]">
                Experten kontaktieren <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Button>
         </div>
      </div>
    </div>
  );

  const renderStudentView = () => (
    <div className="space-y-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Hub 1: Clinical Reasoning Hub */}
        <div className="glass-dark group hover:scale-[1.02] transition-all duration-1000 p-12 rounded-[48px] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-8 mb-10">
            <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors border border-brand-primary/20 shadow-glow">
              <BrainIcon className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-3xl font-bold font-serif text-white tracking-tight uppercase">Clinical Reasoning <span className="text-gradient-gold italic font-light lowercase">Hub</span></h3>
          </div>
          <p className="text-zinc-500 text-lg mb-12 font-light leading-relaxed tracking-wide">
            Nahtlose Pipeline: Visuelle Befundung → Anamnese → Pathomechanismus-Herleitung.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Button to="/anamnese-trainer" variant="outline" size="sm" className="text-[10px] uppercase tracking-[0.2em] font-black py-4 border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 !rounded-[20px]">Anamnese Trainer</Button>
            <Button to="/vision-agent" variant="outline" size="sm" className="text-[10px] uppercase tracking-[0.2em] font-black py-4 border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 !rounded-[20px]">Vision Agent</Button>
            <Button to="/case-training" variant="outline" size="sm" className="text-[10px] uppercase tracking-[0.2em] font-black py-4 border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 !rounded-[20px]">Case Training</Button>
            <Button to="/education" variant="outline" size="sm" className="text-[10px] uppercase tracking-[0.2em] font-black py-4 border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 !rounded-[20px]">Wirkungsketten</Button>
          </div>
        </div>

        {/* Hub 2: Assessment Center */}
        <div className="glass-dark group hover:scale-[1.02] transition-all duration-1000 p-12 rounded-[48px] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-8 mb-10">
            <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors border border-brand-primary/20 shadow-glow">
              <EducationIcon className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-3xl font-bold font-serif text-white tracking-tight uppercase">Assessment <span className="text-gradient-gold italic font-light lowercase">Center</span></h3>
          </div>
          <p className="text-zinc-500 text-lg mb-12 font-light leading-relaxed tracking-wide">
            Formative & summative Prüfung: Faktenwissen plus KI-Korrektur komplexer Freitexte.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Button to="/assessment-center" variant="primary" size="sm" className="text-[10px] uppercase tracking-[0.4em] font-black py-4 !rounded-[20px]">Hub öffnen</Button>
            <Button to="/quiz" variant="outline" size="sm" className="text-[10px] uppercase tracking-[0.4em] font-black py-4 border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 !rounded-[20px]">Quiz Engine</Button>
            <Button to="/exam-simulation" variant="outline" size="sm" className="text-[10px] uppercase tracking-[0.4em] font-black py-4 border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 !rounded-[20px]">Exam Simulation</Button>
          </div>
        </div>

        {/* Hub 3: System Overview (New) */}
        <div className="glass-dark group hover:scale-[1.02] transition-all duration-1000 p-12 rounded-[48px] border border-white/5 shadow-2xl bg-brand-primary/5">
          <div className="flex items-center gap-8 mb-10">
            <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors border border-brand-primary/20 shadow-glow">
              <AcademicCapIcon className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-3xl font-bold font-serif text-white tracking-tight uppercase">Intelligence <span className="text-gradient-gold italic font-light lowercase">Suite</span></h3>
          </div>
          <p className="text-zinc-500 text-lg mb-12 font-light leading-relaxed tracking-wide">
            Verstehe die interdisziplinäre Verknüpfung deiner Lehrinhalte und die System-Logik.
          </p>
          <Button to="/curriculum?tab=matrix" variant="primary" className="w-full text-[10px] uppercase tracking-[0.4em] font-black py-6 shadow-glow !rounded-[24px]">Matrix & Tool-Katalog öffnen</Button>
        </div>
      </div>

      <div className="glass-dark rounded-[60px] p-16 md:p-24 shadow-[0_60px_150px_rgba(0,0,0,0.9)] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 blur-[150px] rounded-full -mr-300 -mt-300 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <h3 className="text-4xl md:text-6xl font-bold font-serif text-white mb-16 flex items-center gap-10 tracking-tighter relative z-10 uppercase">
          <div className="w-20 h-20 rounded-[28px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
            <ScannerIcon className="w-10 h-10 text-brand-primary" />
          </div>
          MediaAnalyzer <span className="text-gradient-gold italic font-light lowercase">Deep Reasoning</span>
        </h3>
        <div className="relative z-10">
          <MediaAnalyzer />
        </div>
      </div>
    </div>
  );

  const renderDozentView = () => (
    <div className="space-y-16 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {[
          { label: 'Aktive Kurse', value: '12' },
          { label: 'Studierende', value: '482' },
          { label: 'KI-Analysen', value: '1.2k' },
          { label: 'Feedback-Score', value: '4.9' }
        ].map((stat, i) => (
          <div key={i} className="glass-dark p-12 text-center group hover:scale-[1.05] transition-all duration-700 rounded-[40px] border border-white/5 shadow-xl">
            <p className="text-brand-primary text-[11px] uppercase tracking-[0.5em] font-black mb-6 opacity-80">{stat.label}</p>
            <p className="text-7xl font-bold font-serif text-white tracking-tighter group-hover:text-gradient-gold transition-all duration-700">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Hub 3: Educator Workspace */}
      <div className="glass-dark p-16 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 blur-[150px] rounded-full -mr-400 -mt-400 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <h3 className="text-4xl md:text-6xl font-bold font-serif text-white mb-12 flex items-center gap-8 tracking-tight relative z-10 uppercase">
          <div className="w-20 h-20 rounded-[28px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
            <CreativeIcon className="w-10 h-10 text-brand-primary" />
          </div>
          Educator <span className="text-gradient-gold italic font-light lowercase">Workspace</span>
        </h3>
        <p className="text-zinc-500 text-2xl mb-16 font-light leading-relaxed tracking-wide relative z-10 max-w-4xl">
          Isolierte Dozenten-Umgebung zur Fallerstellung, Leistungsüberwachung und Chatbot-Konfiguration.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
          {/* Analytics */}
          <div className="glass-dark p-10 rounded-[32px] border border-white/5 hover:border-brand-primary/30 transition-all">
            <h4 className="text-xl font-bold font-serif text-white mb-8 tracking-tight uppercase flex items-center gap-4">
              <AnalyticsIcon className="w-6 h-6 text-brand-primary" /> Analytics
            </h4>
            <div className="space-y-6">
              <div className="p-6 bg-white/[0.02] rounded-[24px] border border-white/5">
                <p className="text-white font-bold mb-4 text-xs tracking-tight uppercase">Häufigste Fehlkonzepte</p>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-primary h-full w-[65%] shadow-[0_0_20px_rgba(212,175,55,0.6)]"></div>
                </div>
              </div>
              <div className="p-6 bg-white/[0.02] rounded-[24px] border border-white/5">
                <p className="text-white font-bold mb-4 text-xs tracking-tight uppercase">Prüfungsreife</p>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-success h-full w-[82%] shadow-[0_0_20px_rgba(16,185,129,0.6)]"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Button to="/curriculum?tab=matrix" variant="outline" className="w-full text-[10px] uppercase tracking-[0.3em] font-black py-4 border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 !rounded-[20px]">System-Matrix</Button>
              <Button to="/educator-workspace" variant="outline" className="w-full text-[10px] uppercase tracking-[0.3em] font-black py-4 border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 !rounded-[20px]">Vollständige Analytik</Button>
            </div>
          </div>

          {/* Config / LUMI */}
          <div className="glass-dark p-10 rounded-[32px] border border-white/5 hover:border-brand-primary/30 transition-all">
            <h4 className="text-xl font-bold font-serif text-white mb-8 tracking-tight uppercase flex items-center gap-4">
              <BrainIcon className="w-6 h-6 text-brand-primary" /> Chatbot-Config
            </h4>
            <p className="text-zinc-500 mb-8 text-sm font-light leading-relaxed">
              Steuern Sie Ihre KI-Assistenten und passen Sie die Reasoning-Tiefe für Ihre Studierenden an.
            </p>
            <div className="space-y-4">
              <Button to="/educator-workspace" variant="primary" className="w-full text-[10px] uppercase tracking-[0.3em] font-black py-4 shadow-2xl shadow-brand-primary/20 !rounded-[20px]">LUMI Konfigurieren</Button>
              <Button to="/educator-workspace" variant="outline" className="w-full text-[10px] uppercase tracking-[0.3em] font-black py-4 border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 !rounded-[20px]">Logs einsehen</Button>
            </div>
          </div>

          {/* Creative Lab */}
          <div className="glass-dark p-10 rounded-[32px] border border-white/5 hover:border-brand-primary/30 transition-all">
            <h4 className="text-xl font-bold font-serif text-white mb-8 tracking-tight uppercase flex items-center gap-4">
              <LabIcon className="w-6 h-6 text-brand-primary" /> Creative Lab
            </h4>
            <p className="text-zinc-500 mb-8 text-sm font-light leading-relaxed">
              Generieren Sie neue Fallbeispiele, Bilder und Videos mit Vertex AI 4K.
            </p>
            <Button to="/educator-workspace" variant="primary" className="w-full text-[10px] uppercase tracking-[0.3em] font-black py-4 shadow-2xl shadow-brand-primary/20 !rounded-[20px]">Labor öffnen</Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative animate-fadeInUp bg-transparent min-h-screen pt-48 pb-32 overflow-hidden font-sans">
      <Section containerClassName="py-0 relative z-10">
        {/* Welcome Header */}
        <div className="mb-32 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-10 mb-16">
              <div className="relative">
                <div className="absolute -inset-6 bg-brand-primary/20 blur-3xl rounded-full animate-pulse"></div>
                <img src="/Körperfluss Logo - Angepasst .png" alt="Körperfluss Logo" className="relative w-28 h-28 rounded-full border border-white/10 shadow-glow object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-brand-primary uppercase tracking-[0.6em] mb-4 opacity-80">
                   {role === 'dozent' ? 'Dozenten Portal' : role === 'student' ? 'Studenten Hub' : 'Patienten Bereich'}
                </span>
                <div className="h-[1px] w-24 bg-brand-primary/40"></div>
              </div>
            </div>
            <h1 className="text-7xl md:text-9xl font-bold font-serif text-white tracking-tighter leading-[0.8] mb-12 uppercase">
              Willkommen, <br/><span className="text-gradient-gold italic font-light lowercase">{name.split(' ')[0]}</span>
            </h1>
            <p className="text-zinc-500 max-w-4xl leading-relaxed text-3xl font-light mx-auto md:mx-0 tracking-wide">
              {role === 'dozent' 
                ? 'Verwalten Sie Ihre akademischen Ressourcen und analysieren Sie den Fortschritt Ihrer Studierenden mit adaptiver Intelligenz.' 
                : role === 'student'
                ? 'Optimieren Sie Ihren Lernprozess. Nutzen Sie unsere Reasoning-Tools für eine evidenzbasierte Ausbildung.'
                : 'Ihre personalisierte Reise zum Körperfluss. Entdecken Sie Ihre Analysen und optimierten Therapiepläne.'}
            </p>
        </div>

        {role === 'dozent' ? renderDozentView() : role === 'student' ? renderStudentView() : renderPatientView()}
      </Section>
    </div>
  );
};


import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Lecturer, StudentDifficulty } from '../types';
import { EnvelopeIcon, SimulationIcon, CheckCircleIcon, CommunityIcon, WarningIcon, LightBulbIcon, VideoLibraryIcon, CameraIcon, BrainCircuitIcon, AcademicCapIcon } from '../components/IconComponents';

interface DozentenDashboardPageProps {
  lecturer: Lecturer;
}

const WelcomeBanner: React.FC<{ name: string; institution: string }> = ({ name, institution }) => (
  <div className="glass-dark rounded-[60px] p-16 md:p-24 shadow-[0_40px_120px_rgba(0,0,0,0.8)] mb-24 relative overflow-hidden group border border-white/5">
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] -mr-96 -mt-96 group-hover:bg-brand-primary/10 transition-colors duration-1000"></div>
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px] -ml-64 -mb-64 opacity-30"></div>
    
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end relative z-10">
        <div className="mb-12 md:mb-0">
            <div className="flex items-center gap-8 mb-12">
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-primary/30 blur-3xl rounded-full animate-pulse"></div>
                <img src="/Körperfluss Logo - Angepasst .png" alt="Körperfluss Logo" className="relative w-24 h-24 rounded-full border border-white/10 shadow-glow object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em] border border-brand-primary/20 bg-brand-primary/5 px-6 py-3 rounded-full opacity-80 w-fit">Education Admin</span>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-6">Verified Partner</span>
              </div>
            </div>
            <h1 className="text-7xl md:text-9xl font-bold font-serif text-white tracking-tighter leading-[0.8] mb-4">Hallo, <br/><span className="text-gradient-gold italic font-light">Prof. {name.split(' ').pop()}</span></h1>
            <p className="mt-8 text-2xl text-zinc-500 font-light tracking-wide max-w-xl leading-relaxed">{institution} — <span className="italic text-zinc-600">Fakultät für Gesundheitswissenschaften</span></p>
        </div>
        <div className="text-left md:text-right glass-dark p-12 rounded-[48px] border border-white/10 shadow-2xl backdrop-blur-3xl hover:border-brand-primary/30 transition-all duration-700">
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.5em] font-black mb-6">Akademisches Jahr 2025/26</p>
            <div className="space-y-2">
                <p className="font-serif font-bold text-5xl text-white tracking-tighter">Laufende Kurse: <span className="text-brand-primary italic">3</span></p>
                <p className="text-sm text-zinc-500 font-light tracking-wide">Nächste Vorlesung: <span className="text-white font-medium">14:00 Uhr</span></p>
            </div>
        </div>
    </div>
  </div>
);

// Mock Data
const mockDifficulties: StudentDifficulty[] = [
  { id: '1', caseTitle: 'LWS Akut', stepTitle: 'Red Flags', difficultyRate: 68, commonIssue: 'Cauda-Symptomatik übersehen', affectedStudents: 14, priority: 'high' },
  { id: '2', caseTitle: 'VKB Post-OP', stepTitle: 'Reha-Planung', difficultyRate: 42, commonIssue: 'Belastung zu hoch', affectedStudents: 9, priority: 'medium' },
];

const curriculumData = [
    { module: 'Anatomie in Vivo', status: 'Aktiv', progress: 75 },
    { module: 'Klinisches Reasoning I', status: 'Aktiv', progress: 40 },
    { module: 'Biomechanik & Ganganalyse', status: 'Geplant', progress: 0 },
];export const DozentenDashboardPage: React.FC<DozentenDashboardPageProps> = ({ lecturer }) => {
  return (
    <div className="relative animate-fadeInUp bg-transparent min-h-screen pt-48 pb-32 overflow-hidden font-sans">
      
      <Section containerClassName="py-0 relative z-10">
        <WelcomeBanner name={lecturer.name} institution={lecturer.institution} />

        {/* --- SECTION 1: PROFESSIONAL TOOLS (AREA 2 CORE) --- */}
        <div className="mb-32">
            <div className="flex items-center gap-8 mb-16">
              <div className="w-16 h-16 rounded-[24px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
                <AcademicCapIcon className="w-8 h-8 text-brand-primary" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold font-serif text-white tracking-tighter uppercase">Dozenten-Tools & <span className="text-gradient-gold italic font-light lowercase">Labs</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                
                {/* Scanner Tool */}
                <Link to="/analyse" className="block group">
                    <div className="glass-dark h-full group hover:scale-[1.02] transition-all duration-1000 p-12 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="bg-brand-primary/10 w-20 h-20 rounded-[28px] flex items-center justify-center mb-10 text-brand-primary group-hover:bg-brand-primary/20 transition-all duration-1000 border border-brand-primary/20 shadow-glow">
                            <VideoLibraryIcon className="w-10 h-10" />
                        </div>
                        <h3 className="font-bold font-serif text-3xl text-white mb-6 tracking-tight uppercase">Körper-Scanner</h3>
                        <p className="text-zinc-500 font-light leading-relaxed text-lg tracking-wide">LiDAR & Videoanalyse für Ganganalyse und Haltung. <span className="text-white italic">(Forensik-Modus)</span></p>
                    </div>
                </Link>

                {/* Reasoning Engine */}
                <Link to="/education" className="block group">
                    <div className="glass-dark h-full group hover:scale-[1.02] transition-all duration-1000 p-12 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="bg-brand-primary/10 w-20 h-20 rounded-[28px] flex items-center justify-center mb-10 text-brand-primary group-hover:bg-brand-primary/20 transition-all duration-1000 border border-brand-primary/20 shadow-glow">
                            <BrainCircuitIcon className="w-10 h-10" />
                        </div>
                        <h3 className="font-bold font-serif text-3xl text-white mb-6 tracking-tight uppercase">Deep Reasoning</h3>
                        <p className="text-zinc-500 font-light leading-relaxed text-lg tracking-wide">Fall-Generator für klinische Wirkungsketten <span className="text-white italic">(Ursache-Wirkung)</span>.</p>
                    </div>
                </Link>

                {/* Creative Lab */}
                <Link to="/labor" className="block group">
                    <div className="glass-dark h-full group hover:scale-[1.02] transition-all duration-1000 p-12 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="bg-brand-primary/10 w-20 h-20 rounded-[28px] flex items-center justify-center mb-10 text-brand-primary group-hover:bg-brand-primary/20 transition-all duration-1000 border border-brand-primary/20 shadow-glow">
                            <CameraIcon className="w-10 h-10" />
                        </div>
                        <h3 className="font-bold font-serif text-3xl text-white mb-6 tracking-tight uppercase">Creative Lab</h3>
                        <p className="text-zinc-500 font-light leading-relaxed text-lg tracking-wide">Generierung von Lehrmaterial (Bild/Video) mit <span className="text-white italic">Nano Banana Pro & Veo</span>.</p>
                    </div>
                </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* --- SECTION 2: CURRICULUM & VERWALTUNG --- */}
          <div className="lg:col-span-2 space-y-16">
            <div className="glass-dark p-16 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex justify-between items-center mb-16 border-b border-white/5 pb-10">
                    <h2 className="text-4xl font-bold font-serif text-white tracking-tight uppercase">Curriculum <span className="text-gradient-gold italic font-light lowercase">Übersicht</span></h2>
                    <Button to="#" variant="outline" size="sm" className="text-[10px] uppercase tracking-[0.4em] font-black py-4 border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 !rounded-[20px]">Bearbeiten</Button>
                </div>
                <div className="space-y-8">
                    {curriculumData.map((c, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-8 bg-white/[0.02] rounded-[32px] border border-white/5 hover:border-brand-primary/30 transition-all group/item cursor-pointer backdrop-blur-xl">
                            <div className="mb-8 sm:mb-0">
                                <p className="font-bold text-white text-2xl tracking-tight uppercase">{c.module}</p>
                                <p className="text-[11px] uppercase tracking-[0.4em] font-black text-zinc-600 mt-3">Status: <span className="text-brand-primary">{c.status}</span></p>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-brand-primary shadow-[0_0_20px_rgba(212,175,55,0.6)]" style={{ width: `${c.progress}%` }}></div>
                                </div>
                                <span className="text-sm font-black w-12 text-right text-brand-primary tracking-tighter">{c.progress}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-dark p-16 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 border-b border-white/5 pb-10 gap-10">
                    <h2 className="text-4xl font-bold font-serif text-white tracking-tight uppercase">Studenten-Schwächen & <span className="text-gradient-gold italic font-light lowercase">Analytics</span></h2>
                    <span className="text-[10px] bg-red-950/30 text-red-400 border border-red-500/20 px-6 py-3 rounded-full font-black tracking-[0.4em] uppercase">2 Kritische Bereiche</span>
                </div>
                <div className="space-y-8">
                    {mockDifficulties.map((issue) => (
                        <div key={issue.id} className="p-8 bg-white/[0.02] border-l-8 border-red-500/50 rounded-r-[32px] rounded-l-sm flex justify-between items-center hover:bg-white/[0.04] transition-all group/item cursor-pointer backdrop-blur-xl">
                            <div>
                                <h4 className="font-bold text-2xl text-white tracking-tight uppercase">{issue.caseTitle}: <span className="font-light italic text-zinc-500 lowercase">{issue.stepTitle}</span></h4>
                                <p className="text-sm text-red-400/70 mt-4 flex items-center gap-4 font-light tracking-wide uppercase"><WarningIcon className="w-5 h-5"/> Problem: {issue.commonIssue}</p>
                            </div>
                            <div className="text-right bg-red-500/5 p-6 rounded-[24px] border border-red-500/10">
                                <span className="block text-5xl font-bold text-red-500 tracking-tighter">{issue.difficultyRate}%</span>
                                <span className="text-[10px] text-red-500/50 uppercase tracking-[0.4em] font-black">Fehlerrate</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* --- SECTION 3: QUICK ACTIONS --- */}
          <div className="lg:col-span-1 space-y-16">
             <div className="glass-dark p-12 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden group">
                <h3 className="font-bold font-serif text-3xl text-white mb-12 flex items-center gap-8 tracking-tight uppercase">
                  <div className="w-12 h-12 rounded-[18px] bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 shadow-glow">
                    <CommunityIcon className="w-6 h-6 text-brand-primary" />
                  </div>
                  Klasse Verwalten
                </h3>
                <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-center p-8 bg-white/[0.02] rounded-[32px] border border-white/5 backdrop-blur-xl">
                        <span className="text-zinc-600 text-[11px] uppercase tracking-[0.4em] font-black">Eingeschrieben:</span> <span className="font-bold text-white text-4xl tracking-tighter">28</span>
                    </div>
                    <div className="flex justify-between items-center p-8 bg-white/[0.02] rounded-[32px] border border-white/5 backdrop-blur-xl">
                        <span className="text-zinc-600 text-[11px] uppercase tracking-[0.4em] font-black">Aktive Fälle:</span> <span className="font-bold text-white text-4xl tracking-tighter">12</span>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="w-full py-5 text-[10px] uppercase tracking-[0.4em] font-black border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 !rounded-[24px]">Studenten-Liste öffnen</Button>
             </div>

             <div className="glass-dark p-12 rounded-[48px] !bg-gradient-to-br from-brand-primary/15 to-transparent relative overflow-hidden group border border-brand-primary/20 shadow-2xl">
                 <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-primary/20 rounded-full blur-[120px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                 <h3 className="font-bold font-serif text-4xl mb-6 text-white tracking-tight uppercase">Prüfungs <span className="text-gradient-gold italic font-light lowercase">Simulator</span></h3>
                 <p className="text-zinc-500 text-lg mb-12 leading-relaxed font-light tracking-wide">Erstellen Sie Mock-Exams mit <span className="text-white italic">KI-Korrektur</span> und <span className="text-white italic">Deep Reasoning</span>.</p>
                 <Button to="/exam-simulation" variant="primary" size="sm" className="w-full py-6 text-[11px] uppercase tracking-[0.4em] font-black shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] transition-all !rounded-[24px]">
                    Simulator starten
                 </Button>
             </div>
          </div>

        </div>
      </Section>
    </div>
  );
};

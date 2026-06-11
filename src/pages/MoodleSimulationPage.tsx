import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, GraduationCapIcon, 
  BookOpenIcon, ClipboardListIcon, 
  UserGroupIcon, SettingsIcon,
  ArrowRightIcon 
} from '../components/IconComponents';

export const MoodleSimulationPage: React.FC = () => {
  const [isLtiLaunching, setIsLtiLaunching] = useState(false);
  const navigate = useNavigate();

  const handleLaunchLti = () => {
    setIsLtiLaunching(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-sans">
      {/* Fake Moodle Top Header */}
      <div className="bg-[#003561] text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center font-bold">M</div>
          <span className="font-bold tracking-tight">eCampus / FH St. Pölten</span>
        </div>
        <div className="flex items-center gap-6 text-sm opacity-80">
          <span>Meine Kurse</span>
          <span>Dashboard</span>
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-xs">SL</div>
        </div>
      </div>

      {/* Moodle Layout */}
      <div className="flex max-w-[1400px] mx-auto min-h-[calc(100vh-56px)]">
        
        {/* Sidebar Blocks */}
        <aside className="w-64 border-r border-slate-200 p-6 hidden lg:block bg-white">
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] uppercase font-black text-slate-400 mb-4 tracking-widest">Navigation</h4>
              <nav className="space-y-2">
                <div className="flex items-center gap-3 text-sm p-2 bg-slate-100 rounded-lg text-slate-900 font-bold">
                  <GraduationCapIcon className="w-4 h-4" /> Startseite
                </div>
                <div className="flex items-center gap-3 text-sm p-2 hover:bg-slate-50 transition-colors cursor-pointer">
                  <BookOpenIcon className="w-4 h-4" /> Meine Kurse
                </div>
              </nav>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <h5 className="text-xs font-bold text-blue-900 mb-2">Aktuelle Mitteilungen</h5>
              <p className="text-[10px] text-blue-700 leading-relaxed">
                Prüfungstermine für PT3-Anatomie sind jetzt online verfügbar.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 md:p-12">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <nav className="flex gap-2 text-xs text-slate-400 mb-4">
              <span>Meine Kurse</span> / <span>Physiotherapie</span> / <span className="text-blue-600 font-bold">PT3 Clinical Reasoning</span>
            </nav>
            <h1 className="text-3xl font-serif font-black text-slate-900">PT3: Angewandte Physiotherapie & Clinical Reasoning</h1>
          </motion.div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold">Lernaktivitäten: Woche 12</h2>
            </div>
            <div className="divide-y divide-slate-100">
              
              {/* Standard PDF Link */}
              <div className="p-6 flex items-center gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                  <ClipboardListIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Vorlesungsskript: CMD Grundlagen</h4>
                  <p className="text-xs text-slate-500">PDF Dokument, 4.2 MB</p>
                </div>
              </div>

              {/* KÖRPERFLUSS LTI Integration */}
              <div 
                onClick={handleLaunchLti}
                className="p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-white to-brand-primary/5 hover:to-brand-primary/10 transition-all cursor-pointer border-l-8 border-brand-primary group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-brand-primary text-brand-secondary text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-lg group-hover:scale-110 transition-transform">
                    LTI 1.3 Advantage
                  </span>
                </div>
                
                <div className="w-20 h-20 bg-brand-secondary rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                  <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center font-serif text-brand-secondary font-black">K</div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                    Körperfluss Simulation: Patientin Anna M. (CMD)
                  </h4>
                  <p className="text-sm text-slate-500 max-w-lg mt-2 leading-relaxed">
                    Starten Sie die generative Clinical Reasoning Simulation. Ihre Ergebnisse werden automatisch an das Moodle-Notenbuch übertragen.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-brand-primary font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    Simulation in Moodle starten <ArrowRightIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Forum Link */}
              <div className="p-6 flex items-center gap-6 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <UserGroupIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Diskussionsforum: CMD Wirkungsketten</h4>
                  <p className="text-xs text-slate-500">3 neue Beiträge</p>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* LTI Handshake Animation Overlay */}
      <AnimatePresence>
        {isLtiLaunching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] bg-brand-secondary flex flex-col items-center justify-center p-12 text-center"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-24 h-24 border-4 border-brand-primary/20 border-t-brand-primary rounded-full mb-8"
            />
            <h2 className="text-3xl font-serif text-white mb-4 italic">Körperfluss Intelligence Layer</h2>
            <div className="flex flex-col gap-2 max-w-sm">
              <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-brand-primary">
                <span>Authenticating LTI 1.3...</span>
                <span className="text-white">SUCCESS</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-brand-primary">
                <span>Syncing Roster (NRPS)...</span>
                <span className="text-white">SUCCESS</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-brand-primary">
                <span>Connecting Safety Guard...</span>
                <span className="text-white">SUCCESS</span>
              </div>
            </div>
            <p className="text-white/40 text-xs mt-12 animate-pulse">
              Redirecting to secure training environment...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pitch Dashboard Return Link */}
      <Link to="/pitch-deck" className="fixed bottom-6 left-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/40 hover:text-white px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all backdrop-blur-md border border-white/10">
        <ArrowLeftIcon className="w-3 h-3" /> Zurück zum Pitch Deck
      </Link>
    </div>
  );
};

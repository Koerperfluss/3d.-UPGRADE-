import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  ShieldCheckIcon, ChartBarIcon, 
  MessageCircleIcon, ArrowRightIcon, GraduationCapIcon,
  SparklesIcon
} from '../components/IconComponents';
import { Link } from 'react-router-dom';

export const PitchDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-background text-white p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-bold font-serif text-brand-primary mb-4 uppercase tracking-tighter">
          Executive <span className="italic font-light text-white lowercase">Pitch Center</span>
        </h1>
        <p className="text-zinc-500 uppercase tracking-[0.3em] text-sm font-black">
          Sniper-Marketing Control Room
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* MDR Compliance Shield */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-all border-2">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                <ShieldCheckIcon className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">MDR-Abstand Sicher</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Reine didaktische Simulationsumgebung. Keine Diagnose-Software nach MPG. 
                <span className="block mt-2 font-bold text-green-400 underline decoration-dotted">100% Haftungsfrei für FH-Träger</span>
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-500/20 rounded-full text-[10px] uppercase font-black text-green-500 border border-green-500/30">Verified</span>
                <span className="px-3 py-1 bg-green-500/20 rounded-full text-[10px] uppercase font-black text-green-500 border border-green-500/30">Education-Only</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full border-brand-primary/30 bg-brand-primary/5">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold">ROI & Effizienz</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/60">Zeitersparnis (Korrektur)</span>
                    <span className="text-brand-primary font-bold">4.5h / Woche</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      className="h-full bg-brand-primary shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="text-2xl font-bold text-brand-primary">€ 157</div>
                    <div className="text-[10px] text-white/40 uppercase font-black">Pro Student / Jahr</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="text-2xl font-bold text-brand-primary">{">"} 90%</div>
                    <div className="text-[10px] text-white/40 uppercase font-black">Amortisation</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Safety Guard Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full border-blue-500/30 bg-blue-500/5">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center relative">
                  <MessageCircleIcon className="w-6 h-6 text-blue-400" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                </div>
                <h3 className="text-xl font-bold">Safety Guard AI</h3>
              </div>
              <p className="text-sm text-white/60 mb-6 italic">
                "Neuro-Symbolischer Abgleich gegen klinische Leitlinien (AWMF/Cochrane) in Echtzeit."
              </p>
              <div className="mt-auto space-y-2">
                <div className="flex items-center gap-3 text-xs bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Gemini 3.1 Pro: ACTIVE</span>
                </div>
                <div className="flex items-center gap-3 text-xs bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>xLSTM Reasoning: STABLE</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Moodle LTI Simulation Trigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2"
        >
          <Card className="bg-gradient-to-r from-blue-900/20 to-brand-primary/10 border-blue-500/40">
            <div className="flex flex-col md:flex-row items-center gap-8 p-8">
              <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center flex-shrink-0 shadow-2xl overflow-hidden border-4 border-blue-600">
                <img src="https://upload.wikimedia.org/wikipedia/de/thumb/8/8c/Moodle-logo.svg/2000px-Moodle-logo.svg.png" alt="Moodle" className="w-16 grayscale opacity-30 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Moodle LTI 1.3 Advantage</h3>
                <p className="text-white/60 text-sm mb-6 max-w-xl">
                  Nahtlose Einbettung als "Intelligence Layer". Kein Systemwechsel nötig. Automatischer Grade-Sync und NRPS Roster Integration.
                </p>
                <div className="flex gap-4">
                  <Link to="/moodle-simulation">
                    <Button variant="primary" className="shadow-lg shadow-blue-500/20">
                      Live Demo starten <ArrowRightIcon className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/virtual-classroom">
                    <Button variant="outline">
                      Virtueller Lernraum <GraduationCapIcon className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* BFSG 2025 Accessibility Module */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full border-brand-primary/20 bg-brand-secondary/40 backdrop-blur-xl border-t-4 border-t-brand-primary">
            <div className="p-6">
              <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-brand-primary mb-6">BFSG 2025 Compliance</h4>
              <div className="space-y-4">
                <p className="text-xs text-white/70 italic mb-4">
                  "Barrierefreiheitsstärkungsgesetz konforme Architektur für öffentliche Träger."
                </p>
                <div className="grid grid-cols-1 gap-2">
                   <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg text-[10px]">
                      <span>Screen-Reader Ready</span>
                      <span className="text-brand-primary font-bold">100%</span>
                   </div>
                   <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg text-[10px]">
                      <span>High-Contrast Mode</span>
                      <span className="text-brand-primary font-bold">Inkl.</span>
                   </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

      </div>
      
      {/* Return to Dashboard */}
      <Link to="/dashboard" className="fixed bottom-6 left-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/40 hover:text-white px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all backdrop-blur-md border border-white/10">
        <ArrowRightIcon className="w-3 h-3 rotate-180" /> Zum Dashboard
      </Link>
    </div>
  );
};

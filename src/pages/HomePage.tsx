
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/Logo';

interface HomePageProps {
  onStartChat: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartChat }) => {
  const navigate = useNavigate();

  const handleScrollToFeatures = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const features = [
    { title: 'AI-Assistent', desc: 'Sokratischer Dialog für Clinical Reasoning.', icon: '🧠', link: '/analyse' },
    { title: '3D-Anatomie', desc: 'Interaktive Modelle und Schnittebenen.', icon: '🦴', link: '/dashboard' },
    { title: 'Quiz & Prüfungen', desc: 'Mock-Exams im NBP-Format mit KI-Evaluation.', icon: '📝', link: '/exam-simulation' },
    { title: 'Fallstudien', desc: 'Generative Patienten mit dynamischem Verlauf.', icon: '📂', link: '/case-training' },
    { title: 'Wirkungsketten', desc: 'Ursache-Wirkungs-Analyse und Deep Reasoning.', icon: '🔗', link: '/education' },
    { title: 'Chatbot & Audio', desc: 'Sprachsteuerung und multimodales Feedback.', icon: '🎙️', link: '/dashboard' },
  ];

  return (
    <div className="relative w-full overflow-x-hidden bg-transparent text-white font-sans">
      
      {/* SPLIT SCREEN HERO (100vh) */}
      <div className="relative w-full h-screen flex flex-col md:flex-row">
        {/* VIGNETTE / GRADIENT OVERLAY */}
        <div className="absolute inset-0 z-10 bg-gradient-radial from-transparent via-[#1a0f08]/10 to-[#0a0502]/60 pointer-events-none"></div>

        {/* CENTER LOGO */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none hidden md:flex flex-col items-center">
          <motion.div 
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.2, type: "spring" }}
              className="relative w-32 h-32 rounded-full border-4 border-[#0a0a0a] shadow-[0_0_40px_rgba(212,175,55,0.4)] bg-[#0a0a0a] flex items-center justify-center p-2 mb-8 pointer-events-auto"
          >
            <Logo className="w-full h-full rounded-full object-cover" />
          </motion.div>

          <div className="pointer-events-auto flex flex-col gap-4 items-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              onClick={handleScrollToFeatures}
              className="flex items-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] px-6 py-3 rounded-full uppercase tracking-widest text-[10px] font-black transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]"></span>
              </span>
              Plattform Entdecken
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              onClick={() => window.dispatchEvent(new Event('start-demo-tour'))}
              className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 border border-white/30 px-6 py-3 rounded-full uppercase tracking-widest text-[10px] font-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] backdrop-blur-md"
            >
              ▶ Live Demo Starten
            </motion.button>
          </div>
        </div>

        {/* LEFT SIDE - CAMPUS */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-20 flex-1 flex flex-col items-center justify-center p-10 group border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/5 transition-all duration-400 ease cursor-pointer backdrop-blur-[8px] hover:backdrop-blur-[20px] hover:-translate-y-2"
          onClick={() => navigate('/login')}
        >
          <div className="text-center mt-32 md:mt-0">
            <h2 className="text-4xl md:text-5xl font-sans font-light text-white tracking-[0.05em] mb-4 group-hover:text-[#d4af37] transition-colors duration-400">
              CAMPUS
            </h2>
            <div className="h-[1px] w-12 bg-[#d4af37]/40 mx-auto mb-4 group-hover:w-24 transition-all duration-400" />
            <p className="text-zinc-400 text-sm md:text-base font-light tracking-[0.3em] uppercase">
              Für Studenten
            </p>
          </div>
          <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 text-[10px] tracking-[0.2em] text-[#d4af37] uppercase font-bold">
            Ins Dashboard eintreten
          </div>
        </motion.div>

        {/* RIGHT SIDE - FACULTY */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-20 flex-1 flex flex-col items-center justify-center p-10 group hover:bg-white/5 transition-all duration-400 ease cursor-pointer backdrop-blur-[8px] hover:backdrop-blur-[20px] hover:-translate-y-2"
          onClick={() => navigate('/dozenten-login')}
        >
          <div className="text-center mt-32 md:mt-0">
            <h2 className="text-4xl md:text-5xl font-sans font-light text-white tracking-[0.05em] mb-4 group-hover:text-[#d4af37] transition-colors duration-400">
              FACULTY
            </h2>
            <div className="h-[1px] w-12 bg-[#d4af37]/40 mx-auto mb-4 group-hover:w-24 transition-all duration-400" />
            <p className="text-zinc-400 text-sm md:text-base font-light tracking-[0.3em] uppercase">
              Für Dozenten
            </p>
          </div>
          <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-400 text-[10px] tracking-[0.2em] text-[#d4af37] uppercase font-bold">
            Zum Educator Workspace
          </div>
        </motion.div>
      </div>

      {/* FEATURES SHOWCASE */}
      <div className="relative z-20 w-full min-h-screen bg-black/80 backdrop-blur-2xl py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
             <h2 className="text-sm font-black tracking-[0.5em] text-[#d4af37] uppercase mb-4">Plattform Features</h2>
             <p className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tighter">Alles in einem <span className="italic font-light text-zinc-500">Ökosystem</span></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                onClick={() => navigate(feat.link)}
                className="glass-dark p-10 rounded-[40px] border border-white/5 hover:border-[#d4af37]/30 transition-all duration-500 group cursor-pointer hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div className="text-5xl mb-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">{feat.icon}</div>
                <h3 className="text-2xl font-bold font-serif text-white mb-4 tracking-tight uppercase">{feat.title}</h3>
                <p className="text-zinc-500 font-light leading-relaxed tracking-wide">{feat.desc}</p>
                <div className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2">
                  Entdecken &rarr;
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};



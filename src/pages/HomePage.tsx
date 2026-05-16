
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HomePageProps {
  onStartChat: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartChat }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-transparent text-white flex flex-col md:flex-row font-sans">
      
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
          <img 
            src="/Körperfluss Logo - Angepasst .png" 
            alt="Körperfluss Logo" 
            className="w-full h-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          onClick={() => window.dispatchEvent(new Event('start-demo-tour'))}
          className="pointer-events-auto flex items-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] px-6 py-3 rounded-full uppercase tracking-widest text-[10px] font-black transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]"></span>
          </span>
          Live Platform Tour
        </motion.button>
      </div>

      {/* LEFT SIDE - CAMPUS */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-20 flex-1 flex flex-col items-center justify-center p-10 group border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/5 transition-all duration-400 ease cursor-pointer backdrop-blur-[8px] hover:backdrop-blur-[20px] hover:-translate-y-2"
        onClick={() => navigate('/login')}
      >
        <div className="text-center">
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
        <div className="text-center">
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
  );
};




import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/Logo';

interface HomePageProps {
  onStartChat: () => void;
}

export const HomePage: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();

  const handleScrollToFeatures = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-transparent text-white font-sans">
      
      {/* SPLIT SCREEN HERO (100vh) */}
      <div className="relative w-full h-screen flex flex-col md:flex-row overflow-hidden">
        {/* VIGNETTE / DYNAMIC GRADIENT OVERLAY */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)] opacity-40 pointer-events-none"></div>

        {/* CENTER LOGO - THE ICONIC STAND */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none hidden md:flex flex-col items-center">
          <motion.div 
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.8, duration: 1.5, type: "spring", stiffness: 50 }}
              className="relative w-40 h-40 rounded-full border border-white/10 shadow-[0_0_60px_rgba(212,175,55,0.3)] bg-black/40 backdrop-blur-2xl flex items-center justify-center p-3 mb-10 pointer-events-auto"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-primary/20 to-transparent animate-pulse" />
            <Logo className="w-full h-full rounded-full object-cover relative z-10" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="pointer-events-auto flex flex-col gap-5 items-center"
          >
            <button
              onClick={handleScrollToFeatures}
              className="group relative flex items-center gap-3 bg-brand-primary text-brand-secondary px-8 py-4 rounded-full uppercase tracking-[0.3em] text-[10px] font-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-secondary"></span>
              </span>
              <span className="relative">Plattform Entdecken</span>
            </button>

            <button
              onClick={() => window.dispatchEvent(new Event('start-demo-tour'))}
              className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-full uppercase tracking-[0.3em] text-[10px] font-black transition-all backdrop-blur-xl"
            >
              <span className="group-hover:translate-x-1 transition-transform">▶</span> Live Demo Starten
            </button>
          </motion.div>
        </div>

        {/* LEFT SIDE - CAMPUS */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-20 flex-1 flex flex-col items-center justify-center p-12 group cursor-pointer overflow-hidden"
          onClick={() => navigate('/login')}
        >
          {/* Reactive Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="text-center relative z-30 transform group-hover:scale-105 transition-transform duration-700">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-serif font-bold text-white tracking-[0.1em] mb-6 group-hover:text-brand-primary transition-colors duration-500 uppercase"
            >
              CAMPUS
            </motion.h2>
            <div className="h-[2px] w-16 bg-brand-primary/60 mx-auto mb-6 group-hover:w-32 transition-all duration-700" />
            <p className="text-zinc-500 text-sm md:text-lg font-light tracking-[0.4em] uppercase group-hover:text-white transition-colors duration-500">
              Der Athleten-Pfad
            </p>
          </div>
        </motion.div>

        {/* RIGHT SIDE - FAKULTÄT */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-20 flex-1 flex flex-col items-center justify-center p-12 group cursor-pointer overflow-hidden border-t md:border-t-0 md:border-l border-white/5"
          onClick={() => navigate('/dozenten-login')}
        >
          {/* Reactive Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-l from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="text-center relative z-30 transform group-hover:scale-105 transition-transform duration-700">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="text-5xl md:text-7xl font-serif font-bold text-white tracking-[0.1em] mb-6 group-hover:text-brand-primary transition-colors duration-500 uppercase"
            >
              FAKULTÄT
            </motion.h2>
            <div className="h-[2px] w-16 bg-brand-primary/60 mx-auto mb-6 group-hover:w-32 transition-all duration-700" />
            <p className="text-zinc-500 text-sm md:text-lg font-light tracking-[0.4em] uppercase group-hover:text-white transition-colors duration-500">
              Die Dozenten-Akademie
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface HomePageProps {
  onStartChat: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartChat }) => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-transparent text-white flex flex-col font-sans">
      
      {/* BACKGROUND LAYER - Anatomical Drawings with Parallax & Depth */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute inset-0 z-0 flex justify-between items-center px-4 md:px-20 pointer-events-none"
      >
        {/* Left Figure (Back) */}
        <motion.div 
          animate={{ 
            x: mousePos.x * -1.5, 
            y: mousePos.y * -1.5,
            rotateY: mousePos.x * 0.2,
            rotateX: mousePos.y * -0.2
          }}
          transition={{ type: "spring", stiffness: 40, damping: 25 }}
          className="hidden md:block w-1/3 h-full opacity-35"
          style={{ perspective: 1000 }}
        >
          <img 
            src="/Ebene 4.png" 
            alt="Anatomy Back" 
            className="w-full h-full object-contain object-left mix-blend-overlay filter brightness-90 contrast-150 saturate-0"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        {/* Right Figure (Full Body) */}
        <motion.div 
          animate={{ 
            x: mousePos.x * 1.5, 
            y: mousePos.y * 1.5,
            rotateY: mousePos.x * -0.2,
            rotateX: mousePos.y * 0.2
          }}
          transition={{ type: "spring", stiffness: 40, damping: 25 }}
          className="hidden md:block w-1/3 h-full opacity-35"
          style={{ perspective: 1000 }}
        >
          <img 
            src="/image.png" 
            alt="Anatomy Full Body" 
            className="w-full h-full object-contain object-right mix-blend-overlay filter brightness-90 contrast-150 saturate-0"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Mobile Background (Centered) */}
        <div className="md:hidden absolute inset-0 opacity-15">
           <img 
            src="/Ebene 4.png" 
            alt="Anatomy Mobile" 
            className="w-full h-full object-cover mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>

      {/* VIGNETTE / GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-10 bg-gradient-radial from-transparent via-[#1a0f08]/20 to-[#0a0502] pointer-events-none opacity-80"></div>

      {/* CENTRAL INTERACTIVE MODAL */}
      <main className="relative z-20 flex-grow flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            y: [0, -10, 0],
            scale: 1 
          }}
          transition={{ 
            opacity: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
            y: { 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            },
            scale: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
          }}
          className="w-full max-w-[500px] bg-[#2a1a0f]/40 backdrop-blur-[32px] border border-white/5 rounded-[32px] p-12 md:p-16 shadow-[0_60px_150px_rgba(0,0,0,0.9)] flex flex-col items-center text-center group"
        >
          {/* Logo Section */}
          <motion.div 
            initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 1.2, type: "spring" }}
            className="mb-12 relative"
          >
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border border-[#d4af37]/20 p-3 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
              <div className="absolute inset-0 bg-[#d4af37]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <img 
                src="/Körperfluss Logo - Angepasst .png" 
                alt="Körperfluss Logo" 
                className="w-full h-full rounded-full object-cover shadow-[0_0_40px_rgba(212,175,55,0.2)]"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Title Section */}
          <div className="mb-14">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-5xl md:text-6xl font-serif font-light text-white tracking-tight mb-6 leading-tight"
            >
              Willkommen bei <br/>
              <span className="italic text-[#d4af37] font-medium drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">Körperfluss</span>
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "60px" }}
              transition={{ delay: 1, duration: 1 }}
              className="h-[1px] bg-[#d4af37]/40 mx-auto mb-6"
            />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-zinc-400 text-xl font-light tracking-[0.15em] uppercase"
            >
              Leben in Bewegung.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-6">
            <motion.button 
              whileHover={{ scale: 1.03, backgroundColor: "#e5bf48" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="w-full bg-[#d4af37] text-black font-black py-6 rounded-2xl text-[13px] uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-300"
            >
              Anmelden
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/angebote')}
              className="w-full bg-white/5 border border-white/10 text-white font-black py-6 rounded-2xl text-[13px] uppercase tracking-[0.4em] transition-all duration-300"
            >
              Angebote
            </motion.button>
          </div>

          {/* Footer Links */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-16 flex items-center gap-8 text-[11px] uppercase tracking-[0.5em] font-black text-zinc-600"
          >
            <button className="hover:text-[#d4af37] transition-colors duration-300">Hilfe</button>
            <button className="hover:text-[#d4af37] transition-colors duration-300">Datenschutz</button>
            <button className="hover:text-[#d4af37] transition-colors duration-300">Impressum</button>
          </motion.div>
        </motion.div>
      </main>

      {/* BOTTOM BAR */}
      <footer className="relative z-20 px-12 py-8 flex justify-center md:justify-between items-center text-[11px] uppercase tracking-[0.5em] text-zinc-500 font-medium">
        <div className="hidden md:block opacity-40">English (United States)</div>
        <div className="flex gap-12 opacity-60">
          <span className="hover:text-white cursor-pointer transition-colors">Help</span>
          <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
        </div>
      </footer>

    </div>
  );
};


import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

export const IntroSplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // 1. Initial Logo Fade In (0 - 1s)
    // 2. Logo Pulse and Expansion (1 - 2.5s)
    // 3. Name Reveal (2.5 - 3.5s)
    // 4. Fade out entire screen (3.5 - 4.5s)
    
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Cinematic Particles Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Logo Glow */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1], scale: [0.5, 1.1, 1] }}
          transition={{ duration: 2, times: [0, 0.5, 1] }}
          className="w-40 h-40 relative z-10"
        >
          <Logo className="w-full h-full drop-shadow-[0_0_50px_rgba(212,175,55,0.6)]" />
          
          {/* Animated Gold Ring */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 border-2 border-brand-primary rounded-full"
          />
        </motion.div>

        {/* Text Reveal */}
        <div className="mt-12 overflow-hidden">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2, duration: 1, ease: "circOut" }}
            className="text-4xl md:text-6xl font-serif font-black text-white tracking-[0.2em] uppercase text-center"
          >
            KÖRP<span className="text-brand-primary">ER</span>FLUSS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 1 }}
            className="text-brand-primary text-[10px] md:text-sm tracking-[0.6em] uppercase font-black text-center mt-4"
          >
            Adaptive Intelligence
          </motion.p>
        </div>
      </div>

      {/* Progress Line */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "linear" }}
          className="h-full bg-brand-primary shadow-[0_0_15px_rgba(212,175,55,1)]"
        />
      </div>
    </motion.div>
  );
};

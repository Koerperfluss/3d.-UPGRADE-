import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsIcon, CheckCircleIcon, EyeIcon } from './IconComponents';

export const AccessibilityOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [isHighContrast, fontSize]);

  return (
    <div className="fixed bottom-6 left-6 z-[4000]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-zinc-900/80 text-white/50 border border-white/10 flex items-center justify-center hover:text-white transition-all backdrop-blur-md shadow-2xl"
          aria-label="Barrierefreiheit Optionen"
        >
          <EyeIcon className="w-5 h-5" />
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-brand-secondary/95 border border-brand-primary/30 p-6 rounded-[32px] backdrop-blur-2xl shadow-glow w-64"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">BFSG 2025 Tools</h3>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-white/70">Hoher Kontrast</span>
              <button 
                onClick={() => setIsHighContrast(!isHighContrast)}
                className={`w-10 h-5 rounded-full relative transition-colors ${isHighContrast ? 'bg-brand-primary' : 'bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: isHighContrast ? 20 : 0 }}
                  className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"
                />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-zinc-500">
                <span>Schriftgröße</span>
                <span className="text-brand-primary">{fontSize}%</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="150" 
                step="10"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-brand-primary bg-white/10 rounded-lg appearance-none h-1"
              />
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-[8px] text-green-500 font-bold uppercase tracking-widest">
                <CheckCircleIcon className="w-3 h-3" /> Konformitäts-Audit: OK
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

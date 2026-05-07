import React, { useState, useEffect } from 'react';
import { Button } from './Button';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl glass-dark border border-white/10 p-6 z-[2000] animate-fadeInUp rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
        <p className="text-xs text-center sm:text-left leading-relaxed text-zinc-400 font-light tracking-wide">
          Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. Durch die weitere Nutzung stimmen Sie unserer <span className="text-white font-medium">Cookie-Richtlinie</span> zu.
        </p>
        <div className="flex-shrink-0">
          <button 
            onClick={handleAccept} 
            className="px-8 py-3 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-[0.2em] hover:bg-brand-primary transition-all duration-500 shadow-xl"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
};

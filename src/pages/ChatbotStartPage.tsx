import React, { useEffect } from 'react';

interface ChatbotStartPageProps {
  onStartChat: () => void;
}

export const ChatbotStartPage: React.FC<ChatbotStartPageProps> = ({ onStartChat }) => {
  useEffect(() => {
    onStartChat();
  }, [onStartChat]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px] opacity-40"></div>
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-brand-primary/10 rounded-full blur-[200px] opacity-30"></div>

      <div className="max-w-md w-full glass-dark rounded-[48px] p-16 shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5 text-center relative z-10">
        <h2 className="text-3xl font-serif font-bold text-white mb-6 tracking-tight">Assistent wird gestartet...</h2>
        <p className="text-zinc-500 mb-10 font-light leading-relaxed tracking-wide">
          Bitte warten Sie einen Moment, während wir Ihren persönlichen KI-Assistenten vorbereiten.
        </p>
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto shadow-glow"></div>
      </div>
    </div>
  );
};

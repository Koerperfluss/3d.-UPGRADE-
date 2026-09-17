import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface SafetyGuardModalProps {
  onAccept?: () => void;
}

export const SafetyGuardModal: React.FC<SafetyGuardModalProps> = ({ onAccept }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('kf_safety_accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('kf_safety_accepted', 'true');
    setIsOpen(false);
    if (onAccept) onAccept();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl shadow-[0_0_80px_-20px_rgba(255,255,255,0.1)] z-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">Education-Only Notice</h2>
            </div>
            
            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed mb-8">
              <p>
                Welcome to the Körperfluss Platform. Please note that all 3D models, AI analysis, and reasoning paths provided by this software are for <strong className="text-white">educational purposes only</strong>.
              </p>
              <p>
                This application does not provide medical diagnoses, treatment plans, or clinical advice. Always consult a qualified healthcare professional for medical decisions.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleAccept}
                className="px-6 py-3 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-zinc-200 transition-colors shadow-xl"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

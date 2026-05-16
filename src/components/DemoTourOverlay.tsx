import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, PauseIcon, ChevronRightIcon, ChevronLeftIcon, XIcon } from 'lucide-react';

interface TourStep {
  path: string;
  title: string;
  text: string;
  delayMs?: number; // How long to stay on this step if auto-playing
}

const TOUR_STEPS: TourStep[] = [
  {
    path: '/',
    title: '1. Willkommen bei Körperfluss',
    text: 'Dies ist die interaktive 3D-Startseite. Hier beginnt die Reise in die Welt des klinischen Reasonings. Im Hintergrund sehen Sie unser prozedural generiertes 3D-Modell, das auf Mausbewegungen reagiert und die Verbindung zwischen Anatomie und digitaler Technologie symbolisiert.',
    delayMs: 7000,
  },
  {
    path: '/angebote',
    title: '2. Mitgliedschaften & Angebote',
    text: 'Hier sehen Sie unsere maßgeschneiderten Preismodelle für Privatnutzer und Dozenten. Von Premium Access bis hin zu Campus-Lizenzen ist alles transparent dargestellt.',
    delayMs: 6000,
  },
  {
    path: '/dozenten-login',
    title: '3. Dozenten-Bereich',
    text: 'Dozenten haben einen eigenen, geschützten Login-Bereich, der ihnen Zugang zu speziellen Vorbereitungs-Tools und Dashboards gibt.',
    delayMs: 5000,
  },
  {
    path: '/vision-agent',
    title: '4. Vision Agent',
    text: 'Ein Highlight: Die Veo Video Engine. Hier können klinische Medien hochgeladen und automatisch von unserer KI analysiert werden. Ideal für Bewegungsanalysen und radiologische Screenings.',
    delayMs: 8000,
  },
  {
    path: '/anamnese-trainer',
    title: '5. Anamnese Trainer',
    text: 'Ein interaktiver KI-Chatbot, der Studenten dabei hilft, Anamnesegespräche zu simulieren. Echtes Patientengesprächs-Training direkt im Browser.',
    delayMs: 8000,
  },
  {
    path: '/educator-workspace',
    title: '6. Educator Workspace',
    text: 'Im Workspace können Dozenten den Fortschritt ihrer Studenten überwachen, Fallstudien auswerten und zielgerichtet neues Wissen vermitteln. Vielen Dank für die Tour!',
    delayMs: 7000,
  }
];

export const DemoTourOverlay: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Expose a global method to start the tour so we can trigger it from anywhere
  useEffect(() => {
    const handleStartTour = () => {
      setIsActive(true);
      setCurrentStepIndex(0);
      setIsAutoPlay(true);
    };

    window.addEventListener('start-demo-tour', handleStartTour);
    return () => window.removeEventListener('start-demo-tour', handleStartTour);
  }, []);

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Navigate when step changes
  useEffect(() => {
    if (isActive && currentStep) {
      if (location.pathname !== currentStep.path) {
        navigate(currentStep.path);
      }
    }
  }, [isActive, currentStepIndex]); // removed dependencies to prevent rapid looping

  // Handle auto-play logic
  useEffect(() => {
    if (isActive && isAutoPlay && currentStep) {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        handleNext();
      }, currentStep.delayMs || 5000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, isAutoPlay, currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // End of tour
      setIsAutoPlay(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const stopTour = () => {
    setIsActive(false);
    setIsAutoPlay(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  if (!isActive || !currentStep) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-lg"
      >
        <div className="bg-black/80 backdrop-blur-xl border border-[#C9A84C]/30 rounded-2xl p-6 shadow-2xl shadow-[#C9A84C]/10 text-white relative flex flex-col gap-4">
          <button 
            onClick={stopTour}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-black">Live Demo Mode</span>
          </div>

          <div>
            <h3 className="text-xl font-bold font-serif mb-2 tracking-tight">{currentStep.title}</h3>
            <p className="text-sm font-light text-zinc-300 leading-relaxed font-sans">
              {currentStep.text}
            </p>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-white/10 rounded-full overflow-hidden relative mt-2">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[#C9A84C]"
              initial={{ width: '0%' }}
              animate={isAutoPlay ? { width: '100%' } : { width: '100%' }}
              transition={isAutoPlay ? { duration: (currentStep.delayMs || 5000) / 1000, ease: 'linear' } : { duration: 0 }}
              key={currentStepIndex + (isAutoPlay ? 'auto' : 'manual')}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-2">
              <button 
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C9A84C]/20 text-[#C9A84C] hover:bg-[#C9A84C]/30 transition-colors"
              >
                {isAutoPlay ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
              </button>
              <button 
                onClick={handleNext}
                disabled={currentStepIndex === TOUR_STEPS.length - 1}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-xs text-white/50 tracking-widest uppercase">
              {currentStepIndex + 1} / {TOUR_STEPS.length}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

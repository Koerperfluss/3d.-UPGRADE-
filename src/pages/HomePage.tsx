
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

  // A11Y (WCAG 2.1.1): Klick-Flächen auch per Tastatur aktivierbar (Enter/Leertaste)
  const activateWithKeyboard = (target: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(target);
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-transparent text-white font-sans">
      
      {/* SPLIT SCREEN HERO (100vh) */}
      <div className="relative w-full h-screen flex flex-col md:flex-row overflow-hidden">
        {/* VIGNETTE / DYNAMIC GRADIENT OVERLAY */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)] opacity-40 pointer-events-none"></div>

        {/* CENTER LOGO & ACTION BAR */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center pointer-events-none px-4 w-full max-w-md text-center">
          <motion.div 
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.5, duration: 1.2, type: "spring", stiffness: 50 }}
              className="relative w-28 h-28 md:w-36 md:h-36 rounded-full border border-white/10 shadow-[0_0_60px_rgba(212,175,55,0.3)] bg-black/60 backdrop-blur-2xl flex items-center justify-center p-3 mb-6 md:mb-8 pointer-events-auto"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-primary/20 to-transparent animate-pulse" />
            <Logo className="w-full h-full rounded-full object-cover relative z-10" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="pointer-events-auto flex flex-col sm:flex-row gap-3 md:gap-4 items-center justify-center w-full"
          >
            <button
              onClick={handleScrollToFeatures}
              className="group relative flex items-center justify-center gap-3 bg-brand-primary text-black px-6 md:px-8 py-3.5 md:py-4 rounded-full uppercase tracking-[0.25em] text-[10px] font-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] overflow-hidden w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
              </span>
              <span className="relative">Plattform Entdecken</span>
            </button>

            <button
              onClick={() => window.dispatchEvent(new Event('start-demo-tour'))}
              className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full uppercase tracking-[0.25em] text-[10px] font-black transition-all backdrop-blur-xl w-full sm:w-auto"
            >
              <span className="text-brand-primary group-hover:translate-x-1 transition-transform">▶</span> Live Tour
            </button>
          </motion.div>
        </div>

        {/* LEFT SIDE - CAMPUS */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative z-20 flex-1 flex flex-col items-center justify-center p-8 md:p-12 group cursor-pointer overflow-hidden"
          // USERFLOW (30.09.2026): Campus-Einstieg führt direkt in den Anamnese-Trainer (Kern-Tool Studierende)
          onClick={() => navigate('/anamnese-trainer')}
          role="link"
          tabIndex={0}
          aria-label="Campus — zum Anamnese-Trainer für Studierende"
          onKeyDown={activateWithKeyboard('/anamnese-trainer')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="text-center relative z-30 transform group-hover:scale-105 transition-transform duration-700">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white tracking-[0.1em] mb-4 md:mb-6 group-hover:text-brand-primary transition-colors duration-500 uppercase">
              CAMPUS
            </h2>
            <div className="h-[2px] w-12 md:w-16 bg-brand-primary/60 mx-auto mb-4 md:mb-6 group-hover:w-28 transition-all duration-700" />
            <p className="text-zinc-400 text-xs md:text-sm font-light tracking-[0.3em] uppercase group-hover:text-white transition-colors duration-500">
              Der Studenten-Pfad
            </p>
          </div>
        </motion.div>

        {/* RIGHT SIDE - FAKULTÄT */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative z-20 flex-1 flex flex-col items-center justify-center p-8 md:p-12 group cursor-pointer overflow-hidden border-t md:border-t-0 md:border-l border-white/5"
          onClick={() => navigate('/dozenten-login')}
          role="link"
          tabIndex={0}
          aria-label="Fakultät — zum Dozenten-Login"
          onKeyDown={activateWithKeyboard('/dozenten-login')}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="text-center relative z-30 transform group-hover:scale-105 transition-transform duration-700">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white tracking-[0.1em] mb-4 md:mb-6 group-hover:text-brand-primary transition-colors duration-500 uppercase">
              FAKULTÄT
            </h2>
            <div className="h-[2px] w-12 md:w-16 bg-brand-primary/60 mx-auto mb-4 md:mb-6 group-hover:w-28 transition-all duration-700" />
            <p className="text-zinc-400 text-xs md:text-sm font-light tracking-[0.3em] uppercase group-hover:text-white transition-colors duration-500">
              Die Dozenten-Akademie
            </p>
          </div>
        </motion.div>
      </div>

      {/* DIGIARK-INSPIRED DISCOVERY SECTION (BENTO GRID & TOOLS) */}
      <section className="relative z-30 py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-24">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.5em] text-brand-primary font-black">Evidenz · Didaktik · KI</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
            Die Next-Gen <span className="text-gradient-gold italic font-light lowercase">EdTech Suite</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Interaktive 3D-Anatomie, sokratische Fallsimulationen und rechtssichere MDR-Konformität für Hochschulen & Studierende.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div 
            onClick={() => navigate('/showcase')}
            role="link"
            tabIndex={0}
            aria-label="18 Klinische KI-Tools — zum DigiArk-Showcase"
            onKeyDown={activateWithKeyboard('/showcase')}
            className="glass-dark p-8 md:p-10 rounded-[32px] border border-white/10 hover:border-brand-primary/40 transition-all cursor-pointer group relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all" />
            <span className="text-3xl mb-6 block">🩺</span>
            <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-brand-primary transition-colors">18 Klinische KI-Tools</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed mb-6">
              Von sokratischer Anamnese bis zur automatisierten SOAP-Dokumentation im DigiArk-Showcase.
            </p>
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-black flex items-center gap-2">
              Showcase Ansehen ➔
            </span>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => navigate('/anamnese-trainer')}
            role="link"
            tabIndex={0}
            aria-label="LUMI Anamnese-Trainer — Patiententraining starten"
            onKeyDown={activateWithKeyboard('/anamnese-trainer')}
            className="glass-dark p-8 md:p-10 rounded-[32px] border border-white/10 hover:border-brand-primary/40 transition-all cursor-pointer group relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />
            <span className="text-3xl mb-6 block">🧠</span>
            <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-brand-primary transition-colors">LUMI Anamnese-Trainer</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed mb-6">
              Interaktive Patientengespräche mit Echtzeit-Evaluation von Red Flags und Leitsymptomen.
            </p>
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-black flex items-center gap-2">
              Patiententraining Starten ➔
            </span>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => navigate('/moodle-simulation')}
            role="link"
            tabIndex={0}
            aria-label="LTI 1.3 Hochschul-LMS — Moodle-Simulation öffnen"
            onKeyDown={activateWithKeyboard('/moodle-simulation')}
            className="glass-dark p-8 md:p-10 rounded-[32px] border border-white/10 hover:border-brand-primary/40 transition-all cursor-pointer group relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
            <span className="text-3xl mb-6 block">🎓</span>
            <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-brand-primary transition-colors">LTI 1.3 Hochschul-LMS</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed mb-6">
              Nahtlose Moodle 5.0 Integration mit Deep Linking und automatischem Noten-Rückkanal (AGS 2.0).
            </p>
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-black flex items-center gap-2">
              LMS-Simulation Öffnen ➔
            </span>
          </div>
        </div>

        {/* Safety Guard & Evidence Strip */}
        <div className="glass-dark p-8 md:p-12 rounded-[36px] border border-white/10 bg-gradient-to-r from-white/[0.02] to-brand-primary/[0.04] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-success font-black">100% MDR-Frei · Education-First</span>
            <h4 className="text-2xl md:text-3xl font-serif font-bold text-white">Neuro-Symbolischer Safety Guard</h4>
            <p className="text-zinc-400 text-sm font-light max-w-2xl leading-relaxed">
              Kuratierte Wissensbasis nach AWMF-S3-Leitlinien und WHO-ICF — evidenzgeprüfte, versionierte Quellensammlung. Medizinische Aussagen werden gegen die hinterlegte Evidenz validiert — ohne Heilaussagen.
            </p>
          </div>
          <button 
            onClick={() => navigate('/startup')}
            className="px-8 py-4 bg-white/10 hover:bg-brand-primary text-white hover:text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-full transition-all flex-shrink-0"
          >
            Startup & F&E Details
          </button>
        </div>
      </section>
    </div>
  );
};

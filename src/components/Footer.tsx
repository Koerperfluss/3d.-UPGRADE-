
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 text-zinc-600 py-48 relative z-10 overflow-hidden font-sans">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-primary/5 blur-[200px] rounded-full opacity-20 pointer-events-none"></div>
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="footer-grid-flex">
          <div className="md:col-span-2">
            <div className="footer-brand-flex">
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <img src="/logo.jpeg" alt="Körperfluss Logo" className="relative w-24 h-24 rounded-full border border-white/10 shadow-glow grayscale group-hover:grayscale-0 transition-all duration-1000 object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-bold font-serif text-white tracking-tighter uppercase">Körperfluss</span>
                <span className="text-[11px] uppercase tracking-[0.6em] text-brand-primary font-black opacity-80 mt-2">Adaptive Intelligence</span>
              </div>
            </div>
            <p className="text-2xl mt-8 text-zinc-500 leading-relaxed max-w-lg font-light tracking-wide">
              Interaktive, evidenzbasierte <span className="text-white italic">E-Learning- und Service-Plattform</span> für ganzheitliche Gesundheit und funktionelle Bewegung.
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white mb-12 opacity-80">Navigation</h3>
            <ul className="space-y-6 text-lg">
              <li><Link to="/ueber-uns" className="hover:text-brand-primary transition-colors duration-700 font-light tracking-wide">Über Uns</Link></li>
              <li><Link to="/angebote" className="hover:text-brand-primary transition-colors duration-700 font-light tracking-wide">Angebote</Link></li>
              <li><Link to="/blog" className="hover:text-brand-primary transition-colors duration-700 font-light tracking-wide">Blog</Link></li>
              <li><Link to="/kontakt" className="hover:text-brand-primary transition-colors duration-700 font-light tracking-wide">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white mb-12 opacity-80">Rechtliches</h3>
            <ul className="space-y-6 text-lg mb-20">
                <li><Link to="/impressum" className="hover:text-brand-primary transition-colors duration-700 font-light tracking-wide">Impressum</Link></li>
                <li><Link to="/datenschutz" className="hover:text-brand-primary transition-colors duration-700 font-light tracking-wide">Datenschutz</Link></li>
            </ul>
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white mb-12 opacity-80">Kontakt</h3>
            <address className="text-lg not-italic space-y-6 font-light tracking-wide">
              <p className="text-zinc-500">Bezirk Melk, Niederösterreich</p>
              <p>E-Mail: <a href="mailto:info@koerperfluss.at" className="hover:text-brand-primary transition-colors duration-700 italic">info@koerperfluss.at</a></p>
            </address>
          </div>
        </div>
        
        <div className="pt-20 border-t border-white/5 footer-bottom-flex text-[11px] uppercase tracking-[0.4em] font-black">
          <p className="text-zinc-700">&copy; {new Date().getFullYear()} Körperfluss. All Rights Reserved.</p>
          <div className="footer-links-flex">
            <span className="text-zinc-800">Est. 2024</span>
            <div className="h-px w-16 bg-zinc-900"></div>
            <span className="text-zinc-800">Vienna & Melk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

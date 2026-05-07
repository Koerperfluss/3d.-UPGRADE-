
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { User, Lecturer } from '../types';
import { Logo } from './Logo';
import { Button } from './Button';
import { ShoppingCartIcon, AcademicCapIcon, DocumentTextIcon, VideoLibraryIcon, CameraIcon, BrainIcon } from './IconComponents';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  user: User | null;
  lecturer: Lecturer | null;
  onLogout: () => void;
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, lecturer, onLogout, onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderNavLinks = () => {
    const role = lecturer ? 'dozent' : (user?.role || 'patient');

    if (role === 'dozent' || role === 'student') {
        return (
            <>
                <NavLink to="/dashboard" className={({ isActive }) => `text-[11px] uppercase tracking-[0.4em] font-black hover:text-brand-primary transition-all duration-700 ${isActive ? 'text-brand-primary' : 'text-zinc-500'}`}>
                    Dashboard
                </NavLink>
                <div className="h-3 w-px bg-white/10 mx-4"></div>
                <NavLink to="/analyse" className={({ isActive }) => `flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] font-black hover:text-brand-primary transition-all duration-700 ${isActive ? 'text-brand-primary' : 'text-zinc-500'}`}>
                    <VideoLibraryIcon className="w-4 h-4" /> Scanner
                </NavLink>
                <NavLink to="/labor" className={({ isActive }) => `flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] font-black hover:text-brand-primary transition-all duration-700 ${isActive ? 'text-brand-primary' : 'text-zinc-500'}`}>
                    <CameraIcon className="w-4 h-4" /> Labor
                </NavLink>
                <NavLink to="/education" className={({ isActive }) => `flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] font-black hover:text-brand-primary transition-all duration-700 ${isActive ? 'text-brand-primary' : 'text-zinc-500'}`}>
                    <BrainIcon className="w-4 h-4" /> Reasoning
                </NavLink>
                <NavLink to="/curriculum" className={({ isActive }) => `flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] font-black hover:text-brand-primary transition-all duration-700 ${isActive ? 'text-brand-primary' : 'text-zinc-500'}`}>
                    <AcademicCapIcon className="w-4 h-4" /> Matrix
                </NavLink>
                <NavLink to="/literatur" className={({ isActive }) => `flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] font-black hover:text-brand-primary transition-all duration-700 ${isActive ? 'text-brand-primary' : 'text-zinc-500'}`}>
                    <DocumentTextIcon className="w-4 h-4" /> Literatur
                </NavLink>
            </>
        );
    } else {
        return (
            <>
                <NavLink to="/" className={({ isActive }) => `text-[11px] uppercase tracking-[0.4em] font-black hover:text-brand-primary transition-all duration-700 ${isActive ? 'text-brand-primary' : 'text-zinc-500'}`}>
                    Start
                </NavLink>
                <NavLink to="/ueber-uns" className={({ isActive }) => `text-[11px] uppercase tracking-[0.4em] font-black hover:text-brand-primary transition-all duration-700 ${isActive ? 'text-brand-primary' : 'text-zinc-500'}`}>
                    Über Uns
                </NavLink>
                <NavLink to="/angebote" className={({ isActive }) => `text-[11px] uppercase tracking-[0.4em] font-black hover:text-brand-primary transition-all duration-700 ${isActive ? 'text-brand-primary' : 'text-zinc-500'}`}>
                    Angebote
                </NavLink>
                <NavLink to="/blog" className={({ isActive }) => `text-[11px] uppercase tracking-[0.4em] font-black hover:text-brand-primary transition-all duration-700 ${isActive ? 'text-brand-primary' : 'text-zinc-500'}`}>
                    Blog
                </NavLink>
                <NavLink to="/kontakt" className={({ isActive }) => `text-[11px] uppercase tracking-[0.4em] font-black hover:text-brand-primary transition-all duration-700 ${isActive ? 'text-brand-primary' : 'text-zinc-500'}`}>
                    Kontakt
                </NavLink>
            </>
        );
    }
  };

  return (
    <nav className={`fixed w-full top-0 z-[100] transition-all duration-1000 ${scrolled ? 'glass-dark py-3 shadow-[0_20px_80px_rgba(0,0,0,0.8)] border-b border-white/5' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 sm:px-8 lg:px-16">
        <div className="nav-flex-container">
          <Link to="/" className="flex items-center gap-6 group transition-all duration-700 hover:scale-[1.02]" onClick={() => setIsOpen(false)}>
            <div className="relative">
              <div className="absolute -inset-2 bg-brand-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img src="/Körperfluss Logo - Angepasst .png" alt="Körperfluss Logo" className="relative w-14 h-14 rounded-full border border-white/10 shadow-glow object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-2xl tracking-tighter text-white leading-none">
                  KÖRPERFLUSS
              </span>
              <span className="text-[8px] uppercase tracking-[0.4em] text-brand-primary font-black mt-1 opacity-80">EVIDENZ & INTELLIGENZ</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-14">
            <div className="nav-links-flex">
              {renderNavLinks()}
            </div>
            
            <div className="nav-actions-flex">
              <button onClick={onCartClick} className="relative p-3 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                <ShoppingCartIcon className="w-6 h-6 text-zinc-500 group-hover:text-brand-primary transition-colors duration-500" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-primary text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-2xl transform scale-110 animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {user || lecturer ? (
                <div className="flex items-center gap-6 pl-8 border-l border-white/10">
                  <div className="text-right hidden xl:block">
                    <p className="text-sm font-bold text-white tracking-tight">{lecturer ? lecturer.name : user?.name}</p>
                    <p className="text-[10px] text-brand-primary uppercase tracking-[0.25em] font-black mt-1 opacity-80">{lecturer ? 'Dozent' : 'Premium Member'}</p>
                  </div>
                  <button 
                    onClick={onLogout} 
                    className="px-6 py-2 text-[11px] font-black uppercase tracking-[0.3em] border border-white/10 rounded-full text-zinc-500 hover:text-white hover:bg-white/5 transition-all duration-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-white text-black font-black px-10 py-3 rounded-full text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:bg-brand-primary transition-all duration-700 transform hover:-translate-y-1">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden nav-mobile-flex">
             <button onClick={onCartClick} className="relative p-2">
                <ShoppingCartIcon className="w-6 h-6 text-brand-primary" />
                {totalItems > 0 && <span className="absolute top-0 right-0 bg-brand-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center text-black">{totalItems}</span>}
             </button>
             <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />}
                </svg>
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-3xl border-t border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.9)] p-8 flex flex-col gap-8 animate-fadeInUp">
           {(lecturer || user?.role === 'student' || user?.role === 'dozent') ? (
               <>
                <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className="text-[12px] uppercase tracking-[0.4em] font-black text-zinc-500 hover:text-brand-primary transition-all">Dashboard</NavLink>
                <NavLink to="/analyse" onClick={() => setIsOpen(false)} className="text-[12px] uppercase tracking-[0.4em] font-black text-zinc-500 hover:text-brand-primary transition-all">Scanner</NavLink>
                <NavLink to="/labor" onClick={() => setIsOpen(false)} className="text-[12px] uppercase tracking-[0.4em] font-black text-zinc-500 hover:text-brand-primary transition-all">Labor</NavLink>
                <NavLink to="/education" onClick={() => setIsOpen(false)} className="text-[12px] uppercase tracking-[0.4em] font-black text-zinc-500 hover:text-brand-primary transition-all">Reasoning</NavLink>
                <NavLink to="/curriculum" onClick={() => setIsOpen(false)} className="text-[12px] uppercase tracking-[0.4em] font-black text-zinc-500 hover:text-brand-primary transition-all">Matrix</NavLink>
                <NavLink to="/literatur" onClick={() => setIsOpen(false)} className="text-[12px] uppercase tracking-[0.4em] font-black text-zinc-500 hover:text-brand-primary transition-all">Literatur</NavLink>
               </>
           ) : (
               <>
                <NavLink to="/" onClick={() => setIsOpen(false)} className="text-[12px] uppercase tracking-[0.4em] font-black text-zinc-500 hover:text-brand-primary transition-all">Start</NavLink>
                <NavLink to="/ueber-uns" onClick={() => setIsOpen(false)} className="text-[12px] uppercase tracking-[0.4em] font-black text-zinc-500 hover:text-brand-primary transition-all">Über Uns</NavLink>
                <NavLink to="/angebote" onClick={() => setIsOpen(false)} className="text-[12px] uppercase tracking-[0.4em] font-black text-zinc-500 hover:text-brand-primary transition-all">Angebote</NavLink>
                <NavLink to="/blog" onClick={() => setIsOpen(false)} className="text-[12px] uppercase tracking-[0.4em] font-black text-zinc-500 hover:text-brand-primary transition-all">Blog</NavLink>
                <NavLink to="/kontakt" onClick={() => setIsOpen(false)} className="text-[12px] uppercase tracking-[0.4em] font-black text-zinc-500 hover:text-brand-primary transition-all">Kontakt</NavLink>
               </>
           )}
           <div className="border-t border-white/5 pt-8">
              {user || lecturer ? (
                  <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full py-4 text-[11px] uppercase tracking-[0.4em] font-black border border-white/10 rounded-[24px] text-zinc-500 hover:text-white hover:bg-white/5 transition-all">Abmelden</button>
              ) : (
                  <Link to="/login" className="block w-full py-4 text-center text-[11px] uppercase tracking-[0.4em] font-black bg-white text-black rounded-[24px] hover:bg-brand-primary transition-all" onClick={() => setIsOpen(false)}>Login</Link>
              )}
           </div>
        </div>
      )}
    </nav>
  );
};

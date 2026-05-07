import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Lecturer } from '../types';
import { Logo } from '../components/Logo';

// Mock lecturer database
const mockLecturers: Lecturer[] = [
  { id: 'lec1', name: 'Prof. Dr. Eva Meier', email: 'dozent@test.com', institution: 'FH Gesundheitsberufe' },
];

interface DozentenLoginPageProps {
  onLecturerLogin: (lecturer: Lecturer) => void;
}

export const DozentenLoginPage: React.FC<DozentenLoginPageProps> = ({ onLecturerLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const fromMessage = location.state?.message;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication logic
    const lecturer = mockLecturers.find((l) => l.email === email);
    if (lecturer && password === 'password') { // Simple password check for demo
      onLecturerLogin(lecturer);
      navigate('/dozenten-dashboard');
    } else {
      setError('Ungültige E-Mail-Adresse oder Passwort. (Tipp: dozent@test.com / password)');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 animate-fadeInUp relative overflow-hidden font-sans">
      <div className="w-full max-w-xl relative z-10">
        <Link to="/" className="flex flex-col items-center mb-16 group">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-brand-primary/20 blur-3xl rounded-full animate-pulse"></div>
              <img src="/Körperfluss Logo - Angepasst .png" alt="Logo" className="relative h-24 w-24 rounded-full border border-white/10 shadow-glow object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif font-bold text-3xl tracking-tighter text-white leading-none uppercase">KÖRPERFLUSS</span>
              <span className="text-[8px] uppercase tracking-[0.4em] text-brand-primary font-black mt-2">EVIDENZ & INTELLIGENZ</span>
            </div>
        </Link>
        <div className="glass-dark !p-16 border border-white/5 shadow-[0_60px_150px_rgba(0,0,0,0.9)] rounded-[48px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:bg-brand-primary/10 transition-colors duration-1000"></div>
          
          <h2 className="text-5xl font-bold font-serif text-white text-center mb-6 tracking-tight relative z-10">Dozenten-Login</h2>
          <p className="text-center text-zinc-500 text-xl mb-16 font-light tracking-wide leading-relaxed relative z-10">
            Exklusiver Zugang für Lehrende & <br/><span className="text-white font-medium italic">Bildungspartner</span>.
          </p>
          
          {fromMessage && (
            <div className="bg-brand-primary/10 border-l-4 border-brand-primary text-white p-8 mb-12 rounded-r-3xl animate-fadeInUp shadow-2xl relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.2em]">{fromMessage}</p>
            </div>
          )}

          {error && <p className="bg-red-950/30 border border-red-500/20 text-red-400 p-8 rounded-3xl text-xs mb-12 font-light animate-shake relative z-10">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            <div>
              <label htmlFor="email" className="block text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 ml-4">E-Mail Adresse</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-8 bg-black/40 border border-white/5 rounded-[32px] text-white placeholder:text-zinc-900 focus:border-brand-primary/30 transition-all outline-none backdrop-blur-xl"
                placeholder="dozent@test.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4 ml-4">Sicherheitsschlüssel</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-8 bg-black/40 border border-white/5 rounded-[32px] text-white placeholder:text-zinc-900 focus:border-brand-primary/30 transition-all outline-none backdrop-blur-xl"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center group cursor-pointer">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 bg-black border-white/10 rounded text-brand-primary focus:ring-brand-primary transition-all"
                />
                <label htmlFor="remember-me" className="ml-4 block text-xs text-zinc-500 font-light tracking-wide group-hover:text-white transition-colors">
                  Angemeldet bleiben
                </label>
              </div>

              <div className="text-xs">
                <Link to="/forgot-password" university-link="true" className="font-bold text-brand-primary hover:text-white transition-all tracking-tight">
                  Passwort vergessen?
                </Link>
              </div>
            </div>

            <div className="pt-10">
              <button 
                type="submit" 
                className="w-full py-8 bg-brand-primary text-black font-black rounded-[32px] text-[11px] uppercase tracking-[0.5em] shadow-2xl shadow-brand-primary/20 hover:bg-white hover:shadow-white/10 transition-all duration-700 transform hover:-translate-y-2"
              >
                Identität bestätigen
              </button>
            </div>
          </form>
          
          <div className="mt-16 pt-12 border-t border-white/5 text-center">
            <p className="text-sm text-zinc-600 font-light tracking-wide">
              Noch kein Partner-Konto?{' '}
              <Link to="/kontakt" className="font-bold text-brand-primary hover:text-white transition-all">
                Jetzt registrieren
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

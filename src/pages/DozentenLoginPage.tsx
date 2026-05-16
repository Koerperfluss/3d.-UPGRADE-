import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Lecturer } from '../types';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

interface DozentenLoginPageProps {
  onLecturerLogin: (lecturer: Lecturer) => void;
}

export const DozentenLoginPage: React.FC<DozentenLoginPageProps> = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const fromMessage = location.state?.message;
  const { signInWithGoogle, signInMockUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle('lecturer');
      navigate('/labor');
    } catch (e: any) {
      setError(e.message || 'Login fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'dozent@koerperfluss.at' && password === 'test123') {
        signInMockUser('lecturer');
        navigate('/labor');
    } else {
        setError('Ungültiges Passwort oder E-Mail. (Tipp: dozent@koerperfluss.at / test123)');
    }
  };

  useEffect(() => {
    const handleDemo = () => {
      setEmail('dozent@koerperfluss.at');
      setPassword('test123');
    };
    window.addEventListener('demo-step-dozenten-login', handleDemo);
    return () => window.removeEventListener('demo-step-dozenten-login', handleDemo);
  }, []);

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 animate-fadeInUp relative overflow-hidden font-sans">
      <div className="w-full max-w-xl relative z-10">
        <Link to="/" className="flex flex-col items-center mb-16 group">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-brand-primary/20 blur-3xl rounded-full animate-pulse"></div>
              <Logo className="relative h-24 w-24 rounded-full border border-white/10 shadow-glow object-cover" />
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
          
          <form className="space-y-10 relative z-10" onSubmit={handleSubmit}>
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
                placeholder="dozent@koerperfluss.at"
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
            
            <div className="pt-2 relative z-10 w-full mb-8">
              <button 
                type="submit"
                className="w-full py-6 bg-[#CFA84D] text-black font-black rounded-[24px] text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-[#CFA84D]/20 hover:bg-[#E0B645] hover:shadow-[#CFA84D]/40 transition-all duration-300"
              >
                Mit E-Mail anmelden
              </button>
            </div>

            <div className="flex flex-col gap-4 pt-8 border-t border-white/10 relative z-10">
                <button type="button" onClick={handleGoogleLogin} className="w-full py-5 bg-zinc-900 border border-white/10 text-white font-medium rounded-[20px] text-sm hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Mit Google authentifizieren
                </button>
                <button type="button" onClick={() => setError('LMS Integration in Arbeit')} className="w-full py-5 bg-[#f8812b]/10 border border-[#f8812b]/20 text-[#f8812b] font-medium rounded-[20px] text-sm hover:bg-[#f8812b] hover:text-white transition-colors flex items-center justify-center gap-3">
                    Lernplattform (LMS)
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

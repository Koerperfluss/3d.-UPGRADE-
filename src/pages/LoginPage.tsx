
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, MembershipTier, Lecturer } from '../types';
import { Logo } from '../components/Logo';
import { AcademicCapIcon, CheckCircleIcon, ArrowRightIcon } from '../components/IconComponents';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onLecturerLogin: (lecturer: Lecturer) => void;
}

export const LoginPage: React.FC<LoginPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'lecturer'>('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const fromMessage = location.state?.message;
  const { signInWithGoogle, signInMockUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle(activeTab);
      if (activeTab === 'student') {
        navigate('/dashboard');
      } else {
        navigate('/labor');
      }
    } catch (e: any) {
      setError(e.message || 'Login fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'student') {
      if (email === 'student@koerperfluss.at' && password === 'test123') {
        signInMockUser('student');
        navigate('/dashboard');
      } else {
        setError('Ungültiges Passwort oder E-Mail. (Tipp: student@koerperfluss.at / test123)');
      }
    } else {
      if (email === 'dozent@koerperfluss.at' && password === 'test123') {
        signInMockUser('lecturer');
        navigate('/labor');
      } else {
        setError('Ungültiges Passwort oder E-Mail. (Tipp: dozent@koerperfluss.at / test123)');
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 animate-fadeInUp relative overflow-hidden font-sans">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
        
        {/* Intro Column */}
        <div className="flex flex-col justify-center items-start lg:pr-16">
             <Link to="/" className="flex items-center gap-8 mb-24 group">
                <div className="relative">
                  <div className="absolute -inset-4 bg-brand-primary/20 blur-3xl rounded-full animate-pulse"></div>
                  <Logo className="relative h-28 w-28 rounded-full border border-white/10 shadow-glow object-cover" />
                </div>
                <div className="text-left">
                    <h1 className="text-5xl font-bold font-serif text-white tracking-tighter leading-none">Körperfluss</h1>
                    <p className="text-[10px] uppercase tracking-[0.6em] text-brand-primary font-black mt-2 opacity-80">Adaptive Intelligence</p>
                </div>
            </Link>
            <h2 className="text-7xl md:text-9xl font-bold font-serif text-white mb-12 tracking-tighter leading-[0.8]">
                Wählen Sie Ihren <br/><span className="text-gradient-gold italic font-light">Bereich</span>
            </h2>
            <p className="text-2xl text-zinc-500 mb-20 leading-relaxed font-light max-w-xl tracking-wide">
                Greifen Sie auf Ihr personalisiertes Gesundheits-Cockpit zu oder verwalten Sie als Bildungspartner Ihre Kurse und Inhalte.
            </p>
            <div className="space-y-8 w-full max-w-lg">
                <button 
                    onClick={() => { setActiveTab('student'); setError(''); }}
                    className={`w-full text-left p-12 rounded-[50px] border transition-all duration-1000 flex items-center justify-between group relative overflow-hidden ${activeTab === 'student' ? 'border-brand-primary/40 bg-brand-primary/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]' : 'border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40'}`}
                >
                    <div className="relative z-10">
                        <h3 className={`text-3xl font-bold tracking-tight transition-colors duration-700 ${activeTab === 'student' ? 'text-white' : 'text-zinc-600'}`}>Privatnutzer & Studenten</h3>
                        <p className="text-sm text-zinc-700 mt-3 font-light tracking-wide">Für Ihre persönliche Lern- & Gesundheitsreise</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-1000 relative z-10 ${activeTab === 'student' ? 'border-brand-primary bg-brand-primary/20 shadow-glow' : 'border-white/10'}`}>
                        {activeTab === 'student' && <div className="w-5 h-5 rounded-full bg-brand-primary shadow-glow animate-pulse" />}
                    </div>
                </button>

                <button 
                    onClick={() => { setActiveTab('lecturer'); setError(''); }}
                    className={`w-full text-left p-12 rounded-[50px] border transition-all duration-1000 flex items-center justify-between group relative overflow-hidden ${activeTab === 'lecturer' ? 'border-brand-primary/40 bg-brand-primary/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]' : 'border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40'}`}
                >
                    <div className="relative z-10">
                        <h3 className={`text-3xl font-bold tracking-tight transition-colors duration-700 ${activeTab === 'lecturer' ? 'text-white' : 'text-zinc-600'}`}>Bildungspartner & Dozenten</h3>
                        <p className="text-sm text-zinc-700 mt-3 font-light tracking-wide">Für Lehre, Case-Management & Prüfungen</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-1000 relative z-10 ${activeTab === 'lecturer' ? 'border-brand-primary bg-brand-primary/20 shadow-glow' : 'border-white/10'}`}>
                         {activeTab === 'lecturer' && <div className="w-5 h-5 rounded-full bg-brand-primary shadow-glow animate-pulse" />}
                    </div>
                </button>
            </div>
        </div>

        {/* Login Card Column */}
        <div className="flex items-center">
            <div className="glass-dark w-full !p-20 rounded-[60px] relative overflow-hidden group border border-white/5 shadow-[0_60px_150px_rgba(0,0,0,0.9)]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[150px] -mr-64 -mt-64 group-hover:bg-brand-primary/10 transition-colors duration-1000"></div>
                
                {error && (
                    <div className="glass border-l-8 border-red-500 text-red-500 p-6 mb-8 rounded-r-[20px] animate-fadeInUp shadow-2xl relative z-20">
                      <p className="text-sm">{error}</p>
                    </div>
                )}
                {fromMessage && !error && (
                    <div className="glass border-l-8 border-brand-primary text-brand-primary p-10 mb-16 rounded-r-[40px] animate-fadeInUp shadow-2xl relative z-20">
                      <p className="text-[10px] font-black tracking-[0.3em] uppercase">{fromMessage}</p>
                    </div>
                )}

                {activeTab === 'student' ? (
                    <div className="animate-fadeInUp relative z-10">
                        <div className="flex items-center gap-8 mb-12">
                             <div className="bg-brand-primary/10 p-6 rounded-3xl border border-brand-primary/20 shadow-glow">
                                 <CheckCircleIcon className="w-10 h-10 text-brand-primary" />
                             </div>
                             <h2 className="text-5xl font-bold font-serif text-white tracking-tight leading-none">Login <br/><span className="text-gradient-gold italic font-light">Studenten</span></h2>
                        </div>
                        
                        <p className="text-zinc-500 text-2xl mb-12 font-light leading-relaxed tracking-wide">
                             Melden Sie sich an, um auf Ihre Kurse, den KI-Coach und Ihr Dashboard zuzugreifen.
                        </p>

                        <form className="space-y-6" onSubmit={handleLoginSubmit}>
                             <div className="space-y-2">
                               <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-4">E-Mail</label>
                               <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="student@koerperfluss.at" className="w-full p-6 bg-black border border-white/10 rounded-[32px] text-white focus:border-brand-primary outline-none transition-colors" required />
                             </div>
                             <div className="space-y-2">
                               <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-4">Passwort</label>
                               <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="test123" className="w-full p-6 bg-black border border-white/10 rounded-[32px] text-white focus:border-brand-primary outline-none transition-colors" required />
                             </div>
                             <button type="submit" className="w-full mt-6 py-6 bg-white text-black font-black rounded-[32px] text-[10px] uppercase tracking-[0.4em] hover:bg-brand-primary hover:text-white transition-all duration-700 transform hover:-translate-y-2 shadow-[0_20px_60px_rgba(255,255,255,0.1)] hover:shadow-brand-primary/40 flex items-center justify-center">
                                Anmelden <ArrowRightIcon className="w-5 h-5 ml-4" />
                             </button>

                             <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-white/10">
                                 <button type="button" onClick={handleGoogleLogin} className="w-full py-4 bg-zinc-900 border border-white/10 text-white font-medium rounded-2xl text-xs hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3">
                                     <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                                     Mit Google anmelden
                                 </button>
                                 <button type="button" onClick={() => setError('Moodle Integration in Arbeit')} className="w-full py-4 bg-[#f8812b]/10 border border-[#f8812b]/20 text-[#f8812b] font-medium rounded-2xl text-xs hover:bg-[#f8812b] hover:text-white transition-colors flex items-center justify-center gap-3">
                                     Moodle (LMS)
                                 </button>
                             </div>
                         </form>
                    </div>
                ) : (
                    <div className="animate-fadeInUp relative z-10">
                         <div className="flex items-center gap-8 mb-12">
                             <div className="bg-brand-primary/10 p-6 rounded-3xl border border-brand-primary/20 shadow-glow">
                                 <AcademicCapIcon className="w-10 h-10 text-brand-primary" />
                             </div>
                             <h2 className="text-5xl font-bold font-serif text-white tracking-tight leading-none">Login <br/><span className="text-gradient-gold italic font-light">Dozenten</span></h2>
                        </div>
                        
                         <p className="text-zinc-500 text-2xl mb-12 font-light leading-relaxed tracking-wide">
                             Zugang zum Verwaltungstool für Fallstudien, Prüfungen und Studenten-Tracking.
                        </p>

                        <form className="space-y-6" onSubmit={handleLoginSubmit}>
                             <div className="space-y-2">
                               <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-4">E-Mail</label>
                               <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="dozent@koerperfluss.at" className="w-full p-6 bg-black border border-white/10 rounded-[32px] text-white focus:border-brand-primary outline-none transition-colors" required />
                             </div>
                             <div className="space-y-2">
                               <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-4">Passwort</label>
                               <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="test123" className="w-full p-6 bg-black border border-white/10 rounded-[32px] text-white focus:border-brand-primary outline-none transition-colors" required />
                             </div>
                             <button type="submit" className="w-full mt-6 py-6 bg-white text-black font-black rounded-[32px] text-[10px] uppercase tracking-[0.4em] hover:bg-brand-primary hover:text-white transition-all duration-700 transform hover:-translate-y-2 shadow-[0_20px_60px_rgba(255,255,255,0.1)] hover:shadow-brand-primary/40 flex items-center justify-center">
                                Anmelden <ArrowRightIcon className="w-5 h-5 ml-4" />
                             </button>

                             <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-white/10">
                                 <button type="button" onClick={handleGoogleLogin} className="w-full py-4 bg-zinc-900 border border-white/10 text-white font-medium rounded-2xl text-xs hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3">
                                     <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                                     Mit Google anmelden
                                 </button>
                                 <button type="button" onClick={() => setError('Bildungsportal Integration in Arbeit')} className="w-full py-4 bg-[#f8812b]/10 border border-[#f8812b]/20 text-[#f8812b] font-medium rounded-2xl text-xs hover:bg-[#f8812b] hover:text-white transition-colors flex items-center justify-center gap-3">
                                     Lernplattform (LMS)
                                 </button>
                             </div>
                        </form>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};

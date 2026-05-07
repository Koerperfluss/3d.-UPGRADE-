
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, MembershipTier, Lecturer } from '../types';
import { Logo } from '../components/Logo';
import { AcademicCapIcon, CheckCircleIcon, ArrowRightIcon } from '../components/IconComponents';

// Mock user database
const premiumPlan: MembershipTier = {
    id: 'premium',
    name: 'Premium: Den Zusammenhang erkennen',
    price: '99€',
    priceDetails: '/ Monat',
    description: 'Das ultimative Paket für maximale Autonomie und professionelle Werkzeuge zur Selbst-Analyse.',
    features: [],
    ctaText: 'Premium werden',
    ctaVariant: 'secondary',
};

const mockUser: User = { 
    id: '1', 
    name: 'Max Mustermann', 
    email: 'user@test.com', 
    plan: premiumPlan,
    role: 'patient'
};

const mockLecturer: Lecturer = { 
    id: 'lec1', 
    name: 'Prof. Dr. Eva Meier', 
    email: 'dozent@test.com', 
    institution: 'FH Gesundheitsberufe' 
};

interface LoginPageProps {
  onLogin: (user: User) => void;
  onLecturerLogin: (lecturer: Lecturer) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onLecturerLogin }) => {
  const [activeTab, setActiveTab] = useState<'user' | 'lecturer'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const fromMessage = location.state?.message;

  const handleUserLogin = (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    onLogin(mockUser);
  };

  const handleLecturerLogin = (e?: React.FormEvent) => {
     if(e) e.preventDefault();
     onLecturerLogin(mockLecturer);
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 animate-fadeInUp relative overflow-hidden font-sans">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
        
        {/* Intro Column */}
        <div className="flex flex-col justify-center items-start lg:pr-16">
             <Link to="/" className="flex items-center gap-8 mb-24 group">
                <div className="relative">
                  <div className="absolute -inset-4 bg-brand-primary/20 blur-3xl rounded-full animate-pulse"></div>
                  <img src="/Körperfluss Logo - Angepasst .png" alt="Logo" className="relative h-28 w-28 rounded-full border border-white/10 shadow-glow object-cover" referrerPolicy="no-referrer" />
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
                    onClick={() => setActiveTab('user')}
                    className={`w-full text-left p-12 rounded-[50px] border transition-all duration-1000 flex items-center justify-between group relative overflow-hidden ${activeTab === 'user' ? 'border-brand-primary/40 bg-brand-primary/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]' : 'border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40'}`}
                >
                    <div className="relative z-10">
                        <h3 className={`text-3xl font-bold tracking-tight transition-colors duration-700 ${activeTab === 'user' ? 'text-white' : 'text-zinc-600'}`}>Privatnutzer & Patienten</h3>
                        <p className="text-sm text-zinc-700 mt-3 font-light tracking-wide">Für Ihre persönliche Gesundheitsreise</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-1000 relative z-10 ${activeTab === 'user' ? 'border-brand-primary bg-brand-primary/20 shadow-glow' : 'border-white/10'}`}>
                        {activeTab === 'user' && <div className="w-5 h-5 rounded-full bg-brand-primary shadow-glow animate-pulse" />}
                    </div>
                </button>

                <button 
                    onClick={() => setActiveTab('lecturer')}
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
                
                {fromMessage && (
                    <div className="glass border-l-8 border-brand-primary text-brand-primary p-10 mb-16 rounded-r-[40px] animate-fadeInUp shadow-2xl">
                      <p className="text-[10px] font-black tracking-[0.3em] uppercase">{fromMessage}</p>
                    </div>
                )}

                {activeTab === 'user' ? (
                    <div className="animate-fadeInUp relative z-10">
                        <div className="flex items-center gap-8 mb-12">
                             <div className="bg-brand-primary/10 p-6 rounded-3xl border border-brand-primary/20 shadow-glow">
                                 <CheckCircleIcon className="w-10 h-10 text-brand-primary" />
                             </div>
                             <h2 className="text-5xl font-bold font-serif text-white tracking-tight leading-none">Login <br/><span className="text-gradient-gold italic font-light">Privatnutzer</span></h2>
                        </div>
                        
                        <p className="text-zinc-500 text-2xl mb-20 font-light leading-relaxed tracking-wide">
                             Melden Sie sich an, um auf Ihre Kurse, den KI-Coach und Ihr Dashboard zuzugreifen.
                        </p>

                        <div className="glass-dark p-12 rounded-[50px] mb-16 border border-white/5 group/demo transition-all duration-1000 hover:border-brand-primary/30 shadow-2xl">
                             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary mb-8 opacity-80">Evaluierungs-Modus</p>
                             <p className="text-zinc-500 mb-12 font-light text-xl leading-relaxed tracking-wide">Nutzen Sie den Demo-Zugang, um die Plattform als Premium-Kunde zu testen.</p>
                             <button 
                                onClick={() => handleUserLogin()} 
                                className="w-full flex justify-center items-center py-8 bg-white text-black font-black rounded-[32px] text-[10px] uppercase tracking-[0.4em] hover:bg-brand-primary transition-all duration-700 transform hover:-translate-y-2 shadow-[0_20px_60px_rgba(255,255,255,0.1)] hover:shadow-brand-primary/40"
                             >
                                Sofortzugriff (Demo) <ArrowRightIcon className="w-6 h-6 ml-6" />
                             </button>
                        </div>

                        <div className="relative my-16">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.5em] font-black">
                                <span className="px-8 bg-black text-zinc-800">oder klassisch</span>
                            </div>
                        </div>

                        <form className="space-y-8 opacity-20 pointer-events-none">
                             <input type="email" placeholder="E-Mail" className="w-full p-8 bg-black border border-white/5 rounded-[32px] text-white placeholder:text-zinc-900" disabled />
                             <input type="password" placeholder="Passwort" className="w-full p-8 bg-black border border-white/5 rounded-[32px] text-white placeholder:text-zinc-900" disabled />
                             <button className="w-full py-8 border border-white/5 rounded-[32px] text-zinc-900 font-black text-[10px] uppercase tracking-[0.4em]" disabled>Anmelden</button>
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
                        
                         <p className="text-zinc-500 text-2xl mb-20 font-light leading-relaxed tracking-wide">
                             Zugang zum Verwaltungstool für Fallstudien, Prüfungen und Studenten-Tracking.
                        </p>

                         <div className="glass-dark p-12 rounded-[50px] mb-16 border border-white/5 group/demo transition-all duration-1000 hover:border-brand-primary/30 shadow-2xl">
                             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary mb-8 opacity-80">Evaluierungs-Modus</p>
                             <p className="text-zinc-500 mb-12 font-light text-xl leading-relaxed tracking-wide">Testen Sie die Tools zur Erstellung von Lehrmaterial und KI-Fällen.</p>
                             <button 
                                onClick={() => handleLecturerLogin()} 
                                className="w-full flex justify-center items-center py-8 bg-brand-primary text-black font-black rounded-[32px] text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-all duration-700 transform hover:-translate-y-2 shadow-[0_20px_60px_rgba(212,175,55,0.2)] hover:shadow-brand-primary/40"
                             >
                                Sofortzugriff (Dozent) <ArrowRightIcon className="w-6 h-6 ml-6" />
                             </button>
                        </div>

                         <div className="relative my-16">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.5em] font-black">
                                <span className="px-8 bg-black text-zinc-800">oder Institution</span>
                            </div>
                        </div>

                         <form className="space-y-8 opacity-20 pointer-events-none">
                             <input type="email" placeholder="E-Mail (Institution)" className="w-full p-8 bg-black border border-white/5 rounded-[32px] text-white placeholder:text-zinc-900" disabled />
                             <input type="password" placeholder="Passwort" className="w-full p-8 bg-black border border-white/5 rounded-[32px] text-white placeholder:text-zinc-900" disabled />
                             <button className="w-full py-8 border border-white/5 rounded-[32px] text-zinc-900 font-black text-[10px] uppercase tracking-[0.4em]" disabled>Anmelden</button>
                        </form>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};

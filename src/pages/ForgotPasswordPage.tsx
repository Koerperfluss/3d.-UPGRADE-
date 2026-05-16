import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';

export const ForgotPasswordPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger an email. For now, it does nothing.
    // alert('Anweisungen zum Zurücksetzen des Passworts wurden (simuliert) gesendet.');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 animate-fadeInUp relative overflow-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-brand-primary/5 rounded-full blur-[150px] opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-brand-primary/10 rounded-full blur-[150px] opacity-20 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-xl relative z-10">
        <Link to="/" className="flex justify-center items-center mb-16 group">
            <div className="relative">
              <div className="absolute -inset-3 bg-brand-primary/20 blur-2xl rounded-full animate-pulse"></div>
              <Logo className="relative h-20 w-20 rounded-full border border-white/10 shadow-glow object-cover" />
            </div>
        </Link>
        <Card className="!p-16 glass-dark border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-[60px]">
          <h2 className="text-4xl font-bold font-serif text-white text-center mb-4 tracking-tight">Passwort vergessen?</h2>
          <p className="text-center text-zinc-500 text-lg mb-12 font-light tracking-wide leading-relaxed">
            Geben Sie Ihre E-Mail-Adresse ein, um Anweisungen zum Zurücksetzen Ihres Passworts zu erhalten.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="email" className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3 ml-2">E-Mail</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full p-6 bg-black border border-white/5 rounded-3xl text-white placeholder:text-zinc-900 focus:border-brand-primary/50 transition-all outline-none"
              />
            </div>
            <div className="pt-6">
              <Button type="submit" variant="primary" size="lg" className="w-full py-8 text-[10px] uppercase tracking-[0.4em] font-black shadow-2xl shadow-brand-primary/20">
                Anweisungen senden
              </Button>
            </div>
          </form>
          
          <p className="mt-12 text-center text-sm text-zinc-600 font-light tracking-wide">
            Zurück zum{' '}
            <Link to="/login" className="font-bold text-brand-primary hover:text-white transition-colors">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

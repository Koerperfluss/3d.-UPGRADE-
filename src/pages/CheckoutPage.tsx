import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { User, MembershipTier } from '../types';
import { CheckCircleIcon, CreditCardIcon } from '../components/IconComponents';
import { Logo } from '../components/Logo';

interface CheckoutPageProps {
  user: User;
  plan: MembershipTier;
  onPaymentSuccess: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ user, plan, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    // Simulate API call for payment
    setTimeout(() => {
      console.log('Payment processed for user:', user.email, 'Plan:', plan.name);
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-8 animate-fadeInUp relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
      <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">
        {/* Order Summary */}
        <div className="flex flex-col space-y-12">
           <Link to="/" className="flex justify-start items-center group space-x-6">
                <Logo className="h-20 w-20 text-white group-hover:text-brand-primary transition-all duration-700" />
                <span className="text-2xl font-serif font-bold text-white tracking-tighter">Körperfluss</span>
            </Link>
            <Card className="glass-dark !p-12 rounded-[48px] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                <h2 className="text-2xl font-bold font-serif text-white mb-8 border-b border-white/5 pb-8 tracking-tight">Bestellübersicht</h2>
                <div className="space-y-6 text-zinc-500 font-light tracking-wide">
                    <div className="flex justify-between items-center">
                        <span className="text-sm uppercase tracking-widest">Plan</span>
                        <span className="font-bold text-white text-lg">{plan.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm uppercase tracking-widest">Preis</span>
                        <span className="font-bold text-white text-lg">{plan.price}{plan.priceDetails}</span>
                    </div>
                     <div className="flex justify-between pt-8 border-t border-white/5 mt-8 items-center">
                        <span className="font-black text-brand-primary uppercase tracking-[0.3em] text-xs">Gesamt</span>
                        <span className="font-bold text-brand-primary text-3xl shadow-glow">{plan.price}</span>
                    </div>
                </div>
                <ul className="mt-12 space-y-4">
                    {plan.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start group">
                            <CheckCircleIcon className="w-5 h-5 text-brand-primary mr-4 mt-0.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                            <span className="text-zinc-400 text-sm font-light leading-relaxed">{feature}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>

        {/* Payment Form */}
        <Card className="glass-dark !p-12 md:!p-16 rounded-[48px] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
          <h2 className="text-3xl font-bold font-serif text-white text-center mb-4 tracking-tight">Sichere Zahlung</h2>
          <p className="text-center text-zinc-500 font-light text-sm mb-12 tracking-wide">
            Vervollständigen Sie Ihre exklusive Mitgliedschaft.
          </p>
          
          {error && <p className="bg-red-900/20 text-red-400 p-4 rounded-2xl text-xs mb-8 border border-red-900/50 text-center font-bold uppercase tracking-widest">{error}</p>}
          
          <form onSubmit={handlePayment} className="space-y-8">
            <div className="space-y-2">
              <label htmlFor="cardName" className="block text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] ml-2">Name auf der Karte</label>
              <input id="cardName" type="text" required defaultValue={user.name} className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all duration-500 font-light placeholder:text-zinc-700" />
            </div>
             <div className="space-y-2">
              <label htmlFor="cardNumber" className="block text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] ml-2">Kartennummer</label>
              <div className="relative">
                <input id="cardNumber" type="text" required placeholder="0000 0000 0000 0000" className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all duration-500 font-light placeholder:text-zinc-700" />
                <CreditCardIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600"/>
              </div>
            </div>
            <div className="flex gap-6">
                <div className="flex-1 space-y-2">
                    <label htmlFor="expiryDate" className="block text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] ml-2">Gültig bis</label>
                    <input id="expiryDate" type="text" required placeholder="MM/YY" className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all duration-500 font-light placeholder:text-zinc-700" />
                </div>
                <div className="flex-1 space-y-2">
                    <label htmlFor="cvc" className="block text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] ml-2">CVC</label>
                    <input id="cvc" type="text" required placeholder="123" className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all duration-500 font-light placeholder:text-zinc-700" />
                </div>
            </div>
            <div className="pt-8">
              <Button type="submit" variant="primary" className="w-full py-8 text-[10px] uppercase tracking-[0.5em] font-black shadow-glow" disabled={isProcessing}>
                {isProcessing ? 'Wird verarbeitet...' : `Jetzt sicher kaufen`}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

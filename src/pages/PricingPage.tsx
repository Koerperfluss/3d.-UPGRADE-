import React from 'react';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircleIcon } from '../components/IconComponents';
import { MembershipTier } from '../types';
import { Link } from 'react-router-dom';

const membershipTiers: MembershipTier[] = [
  {
    id: 'entdecker',
    name: 'Entdecker',
    price: '29€',
    priceDetails: '/ Monat',
    description: 'Der perfekte Einstieg in die Welt von Körperfluss mit Zugang zu unseren Kerninhalten und der Community.',
    features: [
      'Zugang zu allen Basis-Videokursen',
      'Umfangreiche Übungsbibliothek',
      'KI-Analyse-Report "Erster Schritt"',
      'Community-Zugang (Lesen & Schreiben)',
      'Monatlicher Newsletter mit Tipps',
    ],
    ctaText: 'Jetzt Entdecker werden',
    ctaVariant: 'secondary',
  },
  {
    id: 'athlet',
    name: 'Athlet',
    price: '79€',
    priceDetails: '/ Monat',
    description: 'Das umfassende Paket für alle, die ihre Gesundheit aktiv und personalisiert gestalten wollen.',
    features: [
      'Alle Vorteile des Entdecker-Pakets',
      'Zugang zu allen Premium-Videokursen',
      'Personalisierter digitaler Trainingsplan',
      'Fortschritts-Tracking Tools',
      'Monatliches Live Q&A mit Experten',
      'Exklusive Community-Bereiche',
    ],
    isPopular: true,
    ctaText: 'Athlet-Plan wählen',
    ctaVariant: 'primary',
  },
  {
    id: 'meister',
    name: 'Meister',
    price: '149€',
    priceDetails: '/ Monat',
    description: 'Die ultimative 1:1 Betreuung mit direktem Coaching für maximale und individuelle Ergebnisse.',
    features: [
      'Alle Vorteile des Athlet-Pakets',
      '1x 60 Min. Online Personal Coaching p.M.',
      'Regelmäßige Plan-Anpassungen',
      'Priorisierter E-Mail-Support',
      'Exklusive Workshop-Angebote',
    ],
    ctaText: 'Meister werden',
    ctaVariant: 'secondary',
  },
];

export const PricingPage: React.FC = () => {
  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-40 pb-32 relative overflow-hidden font-sans">
      
      <div className="container mx-auto px-8 relative z-10 mb-32 text-center">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-brand-primary mb-8 opacity-80">Mitgliedschaften</span>
          <div className="h-[1px] w-24 bg-brand-primary/30 mb-12"></div>
          <h1 className="text-6xl md:text-9xl font-bold font-serif text-white mb-10 tracking-tighter leading-[0.8] uppercase">
            Ihre Reise bei <br/><span className="text-gradient-gold italic font-light lowercase">Körperfluss</span>
          </h1>
          <p className="text-2xl md:text-3xl text-zinc-500 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
            Wählen Sie den Plan, der perfekt zu Ihren Zielen passt. <span className="text-white font-medium italic">Flexibel, transparent</span> und jederzeit anpassbar.
          </p>
        </div>
      </div>

      <Section containerClassName="pt-0 pb-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12 items-stretch max-w-7xl mx-auto">
          {membershipTiers.map((plan) => (
            <div key={plan.name} className={`flex flex-col p-12 md:p-16 relative group hover:scale-[1.02] transition-all duration-1000 rounded-[48px] border backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] ${plan.isPopular ? 'border-brand-primary/40 bg-brand-primary/5' : 'border-white/5 bg-white/[0.02]'}`}>
              {plan.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-brand-primary text-black text-[10px] font-black uppercase tracking-[0.5em] px-10 py-4 rounded-full shadow-glow">
                  Empfehlung
                </div>
              )}
              <h3 className="text-4xl font-bold font-serif text-white text-center mb-8 tracking-tight uppercase">{plan.name}</h3>
              <div className="text-center mb-12">
                <span className="text-7xl font-black text-white tracking-tighter">{plan.price}</span>
                <span className="text-xl font-light text-zinc-500 tracking-wide ml-3">{plan.priceDetails}</span>
              </div>
              <p className="text-center text-zinc-400 font-light leading-relaxed mb-16 min-h-[100px] text-lg tracking-wide">{plan.description}</p>
              
              <ul className="space-y-8 mb-20 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start group/item">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center mr-6 mt-1 flex-shrink-0 border border-brand-primary/20 group-hover/item:border-brand-primary/50 transition-all">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-brand-primary" />
                    </div>
                    <span className="text-base text-zinc-400 font-light leading-relaxed tracking-wide group-hover/item:text-white transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register" state={{ plan: plan }} className="w-full mt-auto">
                <button 
                  className={`w-full py-7 text-[11px] uppercase tracking-[0.5em] font-black rounded-[24px] transition-all duration-700 transform hover:-translate-y-2 shadow-2xl ${plan.ctaVariant === 'primary' ? 'bg-brand-primary text-black shadow-brand-primary/20 hover:bg-white hover:shadow-white/10' : 'bg-white/[0.05] text-white border border-white/10 hover:bg-white/10'}`}
                >
                  {plan.ctaText}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

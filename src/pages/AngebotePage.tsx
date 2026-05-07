
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircleIcon, BrainCircuitIcon } from '../components/IconComponents';
import { MembershipTier, PriceItem, PackageDeal, User } from '../types';
import { coreProduct, packageDeals } from '../data/products';
import { useCart } from '../context/CartContext';

interface AngebotePageProps {
  user: User | null;
  onOpenHealthCheck: () => void;
}

export const AngebotePage: React.FC<AngebotePageProps> = ({ user, onOpenHealthCheck }) => {
  const location = useLocation();
  const [analysisReady, setAnalysisReady] = useState(false);
  const { cart, addToCart } = useCart();

  useEffect(() => {
      if (location.state && location.state.analysisReady) {
          setAnalysisReady(true);
      }
  }, [location]);

  const handleAddToCart = (item: PriceItem | PackageDeal | MembershipTier) => {
    addToCart(item);
  };

  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-32 pb-24 overflow-hidden font-sans">
      
      {/* Dynamic Header based on Flow */}
      {analysisReady ? (
          <div className="relative py-24 md:py-40 text-center overflow-hidden">
              <div className="absolute inset-0 bg-brand-primary/5 blur-[150px] rounded-full -top-1/2 left-1/2 -translate-x-1/2 w-full h-full"></div>
              <div className="container mx-auto px-8 relative z-10">
                  <div className="inline-flex items-center gap-4 glass px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.5em] mb-12 text-brand-primary border border-brand-primary/30 shadow-glow animate-pulse backdrop-blur-2xl">
                      <BrainCircuitIcon className="w-5 h-5" /> Analyse Abgeschlossen
                  </div>
                  <h1 className="text-7xl md:text-9xl font-bold font-serif text-white mb-10 tracking-tighter leading-[0.8] uppercase">Ihr Report ist <br/><span className="text-gradient-gold italic font-light lowercase">bereit.</span></h1>
                  <p className="text-2xl md:text-3xl text-zinc-500 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
                      Wir haben Ihre Daten mit adaptiver Intelligenz ausgewertet. Sichern Sie sich jetzt Ihren personalisierten Plan für <span className="text-white font-medium italic">maximale Evidenz</span>.
                  </p>
              </div>
          </div>
      ) : (
          <div className="pt-40 pb-24 text-center container mx-auto px-8 relative z-10">
            <div className="flex flex-col items-center mb-16">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-brand-primary mb-6 opacity-80">Preisgestaltung</span>
              <div className="h-[1px] w-24 bg-brand-primary/30 mb-12"></div>
              <h1 className="text-7xl md:text-9xl font-bold font-serif text-white mb-10 tracking-tighter leading-[0.8] uppercase">Angebote & <br/><span className="text-gradient-gold italic font-light lowercase">Preise</span></h1>
              <p className="text-2xl md:text-3xl text-zinc-500 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">Transparente Pakete für Ihre Gesundheit und Ausbildung.</p>
            </div>
          </div>
      )}
      
      {/* Core Product Section - The "Solution" */}
      <Section containerClassName="pt-12 pb-40 relative z-10">
        <div className="glass-dark !p-0 overflow-hidden border border-white/5 shadow-[0_60px_150px_rgba(0,0,0,0.9)] group rounded-[48px] relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px] -mr-300 -mt-300 group-hover:bg-brand-primary/10 transition-colors duration-1000"></div>
            <div className="grid md:grid-cols-12 gap-0 items-stretch relative z-10">
                <div className="md:col-span-8 p-16 md:p-24">
                    <div className="relative">
                      <span className="text-[10px] font-black uppercase tracking-[0.6em] text-brand-primary mb-8 block opacity-80">Empfohlenes Ergebnis</span>
                      <h3 className="text-6xl md:text-8xl font-bold font-serif text-white mt-4 mb-16 tracking-tighter leading-none uppercase">{coreProduct.name}</h3>
                      <p className="text-zinc-500 mb-20 leading-relaxed text-2xl md:text-3xl font-light max-w-3xl tracking-wide">{coreProduct.description}</p>
                       <ul className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                          {coreProduct.features?.map((feature) => (
                            <li key={feature} className="flex items-start gap-8 group/item">
                              <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-1 border border-brand-primary/20 group-hover/item:border-brand-primary/50 transition-colors">
                                <CheckCircleIcon className="w-6 h-6 text-brand-primary" />
                              </div>
                              <span className="text-xl text-zinc-400 font-light tracking-wide group-hover/item:text-white transition-colors">{feature}</span>
                            </li>
                          ))}
                        </ul>
                    </div>
                </div>
                <div className="md:col-span-4 bg-white/[0.02] backdrop-blur-3xl p-16 md:p-24 flex flex-col justify-center items-center text-center border-l border-white/5">
                    <div className="mb-20">
                      <p className="text-9xl font-black text-white tracking-tighter mb-6">{coreProduct.price}</p>
                      <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.5em]">{coreProduct.priceSuffix}</p>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(coreProduct)} 
                      className={`w-full py-9 rounded-[32px] text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-1000 shadow-2xl transform hover:-translate-y-2 ${cart.some(i => i.id === coreProduct.id) ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30' : 'bg-white text-black hover:bg-brand-primary shadow-brand-primary/20 hover:shadow-brand-primary/40'}`}
                    >
                        {cart.some(i => i.id === coreProduct.id) ? 'Im Warenkorb ✓' : (analysisReady ? 'Report freischalten' : 'In den Warenkorb')}
                    </button>
                    {analysisReady && <p className="text-[10px] text-center mt-10 text-zinc-600 uppercase tracking-[0.5em] font-black opacity-60">Sofortiger digitaler Download</p>}
                </div>
            </div>
        </div>
      </Section>

      {/* Package Deals Section */}
      <Section containerClassName="py-40 bg-black/40 border-y border-white/5 relative z-10 backdrop-blur-sm">
        <div className="text-center mb-32">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-brand-primary mb-8 block opacity-80">Synergie-Effekte</span>
          <h2 className="text-6xl md:text-8xl font-serif font-bold text-white mb-8 tracking-tighter uppercase">Kombi-Pakete</h2>
          <p className="text-2xl text-zinc-500 font-light tracking-wide max-w-2xl mx-auto">Für den optimalen Start in Ihre Therapie oder Ausbildung.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 px-8">
            {packageDeals.map(deal => (
                <div key={deal.id} className="glass-dark group hover:scale-[1.02] !p-16 rounded-[48px] border border-white/5 transition-all duration-1000 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col h-full">
                        <div className="mb-16">
                          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary mb-6 block opacity-80">Best Value</span>
                          <h3 className="text-5xl font-bold font-serif text-white mt-2 mb-8 tracking-tight uppercase">{deal.name}</h3>
                          <p className="text-xl text-zinc-500 font-light leading-relaxed tracking-wide">{deal.description}</p>
                        </div>
                        <div className="mt-auto pt-12 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-baseline gap-6">
                                <span className="text-5xl font-black text-white tracking-tighter">{deal.price}</span>
                                <span className="text-lg text-zinc-700 line-through font-light tracking-wide">{deal.originalPrice}</span>
                            </div>
                            <button 
                              onClick={() => handleAddToCart(deal)} 
                              className={`px-12 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 border ${cart.some(i => i.id === deal.id) ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' : 'border-white/10 text-white hover:bg-white/5 hover:border-white/20'}`}
                            >
                                {cart.some(i => i.id === deal.id) ? 'Im Warenkorb ✓' : 'Wählen'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </Section>

      {!analysisReady && (
          <Section containerClassName="py-48 text-center relative z-10">
              <p className="text-zinc-700 uppercase tracking-[0.6em] text-[11px] font-black mb-16 opacity-60">Noch unsicher was Sie brauchen?</p>
              <button 
                onClick={onOpenHealthCheck} 
                className="px-20 py-8 rounded-full glass border border-white/10 text-white font-black uppercase tracking-[0.4em] text-[11px] hover:bg-white/5 transition-all duration-1000 transform hover:-translate-y-2 shadow-[0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
              >
                Kostenlose Analyse starten
              </button>
          </Section>
      )}
    </div>
  )
}


import React from 'react';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircleIcon, MassageIcon, TrainingIcon, BrainCircuitIcon } from '../components/IconComponents';
import { CartItem, PriceItem } from '../types';

const digitalServices: PriceItem[] = [
  { 
    id: 'digital-doc',
    name:'Dokument', 
    price:'49€', 
    priceSuffix: 'einmalig', 
    features:['Individuelles PDF-Handout','Kurzcheck & Plan','E-Mail Support (7 Tage)'] 
  },
  { 
    id: 'digital-member',
    name:'Mitgliederbereich', 
    price:'29€', 
    priceSuffix: '/ Monat', 
    features:['Dashboard & Bibliothek','Regelmäßige Updates','Community-Zugang'] 
  },
  { 
    id: 'digital-coach',
    name:'Coaching', 
    price:'ab 149€', 
    priceSuffix: '/ Monat', 
    features:['1:1 Coaching','Plan + Dashboard','Priorisierter Support'] 
  },
];

const massageData = {
  sections: [
    {
      title: 'Klassische / Sportmassage',
      items: [
        { id: 'massage-classic-25', name: '25 Min', price: '35 €' },
        { id: 'massage-classic-50', name: '50 Min', price: '65 €' },
        { id: 'massage-classic-75', name: '75 Min', price: '90 €' },
      ],
    },
    {
      title: 'Spezialbehandlungen',
      subtitle: '(Triggerpunkt, Faszien, Schröpfen, Narben)',
      items: [
        { id: 'massage-special-30', name: '30 Min', price: '45 €' },
        { id: 'massage-special-60', name: '60 Min', price: '80 €' },
      ],
    },
    {
      title: 'Pakete Massage',
      items: [
        { id: 'massage-pack-5', name: '5er-Block à 50 Min', price: '300 €', note: 'statt 325 €' },
        { id: 'massage-pack-10', name: '10er-Block à 50 Min', price: '580 €', note: 'statt 650 €' },
      ],
    },
    {
      title: 'Zusatzleistungen',
      items: [
        { id: 'massage-extra-visit', name: 'Hausbesuch (Umkreis 15 km)', price: '+15 €' },
        { id: 'massage-extra-tape', name: 'Tape-Anlage (Kinesio / klassisch)', price: '10 €' },
        { id: 'massage-extra-check', name: 'Kurz-Check & Übungsanleitung (15 Min)', price: '15 €' },
      ],
    },
  ],
};

const ptData = {
    sections: [
        {
            title: 'Einzeltraining',
            items: [
                { id: 'pt-single-60', name: '60 Min', price: '55 €' },
                { id: 'pt-single-90', name: '90 Min', price: '80 €' },
            ]
        },
        {
            title: 'Duo-Training (2 Personen)',
            items: [
                { id: 'pt-duo-60', name: '60 Min', price: '70 €', note: '35 € pro Person' },
                { id: 'pt-duo-90', name: '90 Min', price: '100 €', note: '50 € pro Person' },
            ]
        },
        {
            title: 'Pakete PT',
            items: [
                { id: 'pt-pack-5', name: '5er-Block à 60 Min', price: '260 €', note: 'statt 275 €' },
                { id: 'pt-pack-10', name: '10er-Block à 60 Min', price: '500 €', note: 'statt 550 €' },
            ]
        },
        {
            title: 'Zusatzleistungen',
            items: [
                { id: 'pt-extra-plan', name: 'Individueller Trainingsplan (PDF, 4 Wochen)', price: '40 €' },
                { id: 'pt-extra-tech', name: 'Technik-Check & Videoanalyse', price: '25 €' },
            ]
        }
    ]
};

type PriceListData = typeof massageData | typeof ptData;

interface ServicesPageProps {
  cart: CartItem[];
  onAddToCart: (item: PriceItem) => void;
}

const PriceList: React.FC<{ data: PriceListData; cart: CartItem[]; onAddToCart: (item: PriceItem) => void; }> = ({ data, cart, onAddToCart }) => {
  return (
    <div className="grid md:grid-cols-2 gap-x-8 gap-y-8">
      {data.sections.map((section) => (
        <div key={section.title}>
          <h3 className="font-semibold text-lg text-brand-secondary">{section.title}</h3>
          {section.subtitle && <p className="text-sm text-brand-text-on-light-secondary -mt-1">{section.subtitle}</p>}
          <ul className="mt-2 space-y-1.5 text-brand-text-on-light-secondary">
            {section.items.map((item) => {
              const isInCart = cart.some(ci => ci.id === item.id);
              const itemWithTitle = { ...item, name: `${section.title} - ${item.name}` };
              const isAddable = !item.price.startsWith('+');

              return (
              <li key={item.id} className="flex justify-between items-center border-b border-dashed border-brand-border/50 py-1.5 gap-2">
                <span className="mr-2 text-brand-text-on-light">
                  {item.name}
                  {item.note && <span className="text-brand-text-on-light-secondary ml-1 text-xs">({item.note})</span>}
                </span>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-right flex-shrink-0 text-brand-text-on-light">{item.price}</span>
                  {isAddable && (
                    <Button onClick={() => onAddToCart(itemWithTitle)} disabled={isInCart} size="sm" variant={isInCart ? 'secondary' : 'outline'} className="!px-3 !py-1.5 !text-xs !font-normal">
                      {isInCart ? '✓' : '+'}
                    </Button>
                  )}
                </div>
              </li>
            )})}
          </ul>
        </div>
      ))}
    </div>
  );
};

export const ServicesPage: React.FC<ServicesPageProps> = ({ cart, onAddToCart }) => {
  return (
    <div className="animate-fadeInUp bg-black min-h-screen pt-40 pb-32 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
         <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
      </div>

      <Section containerClassName="py-0 relative z-10 mb-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-white mb-8 tracking-tight leading-tight">Exklusive Leistungen</h1>
          <p className="text-xl md:text-2xl text-zinc-500 font-light leading-relaxed tracking-wide">
            Präzision in der Analyse, Exzellenz in der Therapie – digital, persönlich, kompromisslos.
          </p>
        </div>
      </Section>

      {/* Digital Offers Section */}
      <Section containerClassName="py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center gap-6 mb-20 text-center">
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 shadow-glow">
                    <BrainCircuitIcon className="w-12 h-12 text-brand-primary" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-white tracking-tight">Digital-Angebote</h2>
                <div className="h-1 w-24 bg-brand-primary/20 rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {digitalServices.map(p => {
                  const isInCart = cart.some(cartItem => cartItem.id === p.id);
                  return (
                    <Card key={p.id} className="glass-dark !p-12 rounded-[48px] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col group hover:border-brand-primary/20 transition-all duration-700">
                        <h3 className="font-serif text-2xl text-white tracking-tight mb-6 group-hover:text-brand-primary transition-colors">{p.name}</h3>
                        <div className="mb-10">
                          <span className="text-5xl font-bold text-white tracking-tighter">{p.price}</span>
                          <span className="text-zinc-500 font-light ml-2 text-sm uppercase tracking-widest">{p.priceSuffix}</span>
                        </div>
                        <ul className="space-y-5 text-sm flex-grow mb-12">
                        {p.features?.map(f => (
                            <li key={f} className="flex items-start gap-4 group/item">
                              <CheckCircleIcon className="w-5 h-5 text-brand-primary opacity-60 group-hover/item:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                              <span className="text-zinc-400 font-light leading-relaxed tracking-wide">{f}</span>
                            </li>
                        ))}
                        </ul>
                        <Button onClick={() => onAddToCart(p)} disabled={isInCart} variant={isInCart ? 'secondary' : 'primary'} className="w-full py-6 text-[10px] uppercase tracking-[0.5em] font-black shadow-glow">
                            {isInCart ? 'Im Warenkorb ✓' : 'Hinzufügen'}
                        </Button>
                    </Card>
                  )
                })}
            </div>
        </div>
      </Section>

      {/* Massage & Therapy Section */}
      <Section containerClassName="py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center gap-6 mb-20 text-center">
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 shadow-glow">
                    <MassageIcon className="w-12 h-12 text-brand-primary" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-white tracking-tight">Massage & Therapie</h2>
                <div className="h-1 w-24 bg-brand-primary/20 rounded-full"></div>
            </div>
            <Card className="glass-dark !p-12 md:!p-20 rounded-[60px] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                <PriceList data={massageData} cart={cart} onAddToCart={onAddToCart} />
            </Card>
        </div>
      </Section>
      
      {/* Personal Training Section */}
      <Section containerClassName="py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center gap-6 mb-20 text-center">
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/5 shadow-glow">
                    <TrainingIcon className="w-12 h-12 text-brand-primary" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-white tracking-tight">Personaltraining</h2>
                <div className="h-1 w-24 bg-brand-primary/20 rounded-full"></div>
            </div>
            <Card className="glass-dark !p-12 md:!p-20 rounded-[60px] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                <PriceList data={ptData} cart={cart} onAddToCart={onAddToCart} />
            </Card>
        </div>
      </Section>

    </div>
  )
}

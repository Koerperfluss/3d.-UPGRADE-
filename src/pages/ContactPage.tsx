import React, { useState } from 'react';
import { Section } from '../components/Section';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LocationInfo, ContactMethod } from '../types';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, CheckCircleIcon } from '../components/IconComponents';

const locations: LocationInfo[] = [
  {
    name: 'Hauptstandort & Coaching Studio',
    description: 'Moderne Räumlichkeiten für persönliche Therapie, Coaching und Kleingruppen-Workshops. Gut erreichbar im Bezirk Melk.',
    address: 'St. Leonhard am Forst, Niederösterreich (Beispieladresse)',
  },
  {
    name: 'Online-Plattform & Virtuelle Beratung',
    description: 'Zugang zu all unseren digitalen Angeboten, Online-Kursen und virtuellen Beratungsgesprächen – weltweit.',
    details: ['Globale Erreichbarkeit via Internet'],
  },
  {
    name: 'Mobile Services & Hausbesuche',
    description: 'Für maximale Flexibilität kommen wir im Bezirk Melk auch gerne zu Ihnen nach Hause oder an Ihren Wunschort.',
    details: ['Bezirk Melk und Umgebung', 'Individuelle Terminvereinbarung'],
  },
];

const contactMethods: ContactMethod[] = [
    { name: "E-Mail", details: "info@koerperfluss.at (Beispiel)", icon: EnvelopeIcon },
    { name: "Telefon", details: "+43 123 456789 (Beispiel)", icon: PhoneIcon },
];

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if(formData.name && formData.email && formData.subject && formData.message){
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
            return;
        }
        console.log('Form data submitted:', formData);
        setIsSubmitted(true);
    } else {
        setError("Bitte füllen Sie alle Pflichtfelder aus.");
    }
  };

  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-40 pb-32 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
         <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>
      </div>

      <Section 
        title="Kontaktieren Sie Uns"
        subtitle="Wir freuen uns auf Ihre Nachricht und darauf, Sie auf Ihrer Reise zu mehr Gesundheit und Wissen zu begleiten."
        containerClassName="py-0 relative z-10 mb-24"
      >
        <p className="text-center text-2xl md:text-3xl mb-12 max-w-4xl mx-auto text-zinc-500 font-light leading-relaxed tracking-wide">
            Haben Sie Fragen zu unseren Online-Kursen, persönlichen Dienstleistungen oder möchten ein kostenloses Kennenlerngespräch buchen? Nutzen Sie das Kontaktformular oder eine der untenstehenden Kontaktmöglichkeiten.
        </p>
      </Section>

      <Section containerClassName="pt-0 pb-16 md:pb-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
          <Card className="glass-dark !p-12 md:!p-16 border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-[60px]">
            <h3 className="text-3xl md:text-4xl font-bold font-serif text-white mb-12 tracking-tight">Schreiben Sie uns eine Nachricht</h3>
            {isSubmitted ? (
                <div className="text-center p-12 glass border border-brand-primary/20 rounded-[40px] shadow-glow">
                    <CheckCircleIcon className="w-20 h-20 text-brand-primary mx-auto mb-8 animate-pulse" />
                    <p className="text-3xl font-bold text-white mb-4 tracking-tight">Vielen Dank!</p>
                    <p className="text-zinc-400 leading-relaxed text-lg font-light tracking-wide">Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns so schnell wie möglich bei Ihnen melden.</p>
                </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && <p className="text-red-400 bg-red-950/30 p-6 rounded-3xl text-sm mb-8 border border-red-500/20 font-light tracking-wide">{error}</p>}
              <div>
                <label htmlFor="name" className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3 ml-2">Name <span className="text-brand-primary">*</span></label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required 
                       className="w-full p-6 bg-black border border-white/5 rounded-3xl text-white placeholder:text-zinc-900 focus:border-brand-primary/50 transition-all outline-none" />
              </div>
              <div>
                <label htmlFor="email" className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3 ml-2">E-Mail <span className="text-brand-primary">*</span></label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required 
                       className="w-full p-6 bg-black border border-white/5 rounded-3xl text-white placeholder:text-zinc-900 focus:border-brand-primary/50 transition-all outline-none" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3 ml-2">Betreff <span className="text-brand-primary">*</span></label>
                <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required 
                       className="w-full p-6 bg-black border border-white/5 rounded-3xl text-white placeholder:text-zinc-900 focus:border-brand-primary/50 transition-all outline-none" />
              </div>
              <div>
                <label htmlFor="message" className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3 ml-2">Nachricht <span className="text-brand-primary">*</span></label>
                <textarea name="message" id="message" value={formData.message} onChange={handleChange} rows={5} required 
                          className="w-full p-6 bg-black border border-white/5 rounded-3xl text-white placeholder:text-zinc-900 focus:border-brand-primary/50 transition-all outline-none resize-none"></textarea>
              </div>
              <div className="pt-6">
                <Button type="submit" variant="primary" size="lg" className="w-full py-8 text-[10px] uppercase tracking-[0.4em] font-black shadow-2xl shadow-brand-primary/20" ariaLabel="Nachricht senden">Nachricht senden</Button>
              </div>
            </form>
            )}
          </Card>

          <div className="space-y-12">
            <Card className="glass-dark !p-12 md:!p-16 border-white/5 rounded-[60px]">
                <h3 className="text-3xl font-bold font-serif text-white mb-12 tracking-tight">Direkter Kontakt</h3>
                {contactMethods.map(method => {
                    const Icon = method.icon;
                    if (!Icon) return null;
                    return (
                        <div key={method.name} className="flex items-center space-x-8 mb-8 group/item">
                            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 group-hover/item:bg-brand-primary/20 transition-all duration-700 shadow-glow">
                                <Icon className="w-8 h-8 text-brand-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-black mb-1">{method.name}</p>
                                <a href={method.name === "E-Mail" ? `mailto:${method.details}` : `tel:${method.details.replace(/\s/g, '')}`} className="text-white text-xl font-light tracking-wide hover:text-brand-primary transition-colors break-all">{method.details}</a>
                            </div>
                        </div>
                    );
                })}
                 <p className="mt-12 text-sm text-zinc-500 font-light leading-relaxed tracking-wide">
                    Weitere Kontaktmöglichkeiten finden Sie bald auch auf unseren Social Media Kanälen.
                </p>
            </Card>
            <Card className="glass-dark !p-12 md:!p-16 border-white/5 rounded-[60px]">
                <h3 className="text-3xl font-bold font-serif text-white mb-8 tracking-tight">Unser Kennenlernprozess</h3>
                <p className="text-zinc-400 mb-6 text-lg font-light leading-relaxed tracking-wide">
                    <strong className="text-white font-bold">Kostenloses Erstgespräch:</strong> Wir bieten ein kostenloses Kennenlerngespräch (online oder telefonisch) an, um Ihre Bedürfnisse zu verstehen und wie Körperfluss Sie unterstützen kann.
                </p>
                <p className="text-zinc-400 text-lg font-light leading-relaxed tracking-wide">
                    Anschließend erhalten Sie Vorschläge für passende Kurse, Pläne oder Coaching-Optionen.
                </p>
            </Card>
          </div>
        </div>
      </Section>

      <Section 
        title="Unsere Standorte & Erreichbarkeit" 
        subtitle="Finden Sie uns hier oder nutzen Sie unsere digitalen Angebote weltweit." 
        containerClassName="py-16 md:py-24 relative z-10"
      >
        <div className="grid md:grid-cols-3 gap-12">
          {locations.map((location) => (
            <Card key={location.name} className="flex flex-col glass-dark !p-10 border-white/5 rounded-[40px] hover:scale-[1.02] transition-all duration-1000">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 mr-4 shadow-glow">
                    <MapPinIcon className="w-6 h-6 text-brand-primary" />
                </div>
                <h4 className="text-xl font-bold font-serif text-white tracking-tight leading-tight">{location.name}</h4>
              </div>
              <p className="text-zinc-400 mb-6 flex-grow text-sm font-light leading-relaxed tracking-wide">{location.description}</p>
              {location.address && <p className="text-[10px] text-brand-primary uppercase tracking-[0.2em] font-black mb-4 opacity-60 italic">Ort: {location.address}</p>}
              {location.details && (
                <ul className="space-y-3">
                  {location.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-[10px] text-zinc-500 uppercase tracking-widest font-black">
                        <div className="w-1 h-1 bg-brand-primary rounded-full"></div>
                        {detail}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
         <div className="mt-20 text-center">
            <p className="text-zinc-500 text-xl font-light tracking-wide">Wir sind sowohl physisch im Bezirk Melk als auch digital weltweit für Sie da.</p>
        </div>
      </Section>
    </div>
  );
};

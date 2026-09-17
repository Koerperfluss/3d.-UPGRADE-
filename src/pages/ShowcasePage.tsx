import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/Section';

/**
 * ShowcasePage – DigiArk & F&E Demonstration Hub (/showcase)
 * ----------------------------------------------------------
 * Dedizierte Stakeholder-Schnittstelle für Daniel @ DigiArk.
 * Zeigt ALLE 18 klinischen Tools, gruppiert in 4 Kategorien
 * (Anamnese · Diagnostik · Lehre · Simulation), visualisiert den
 * Reifegrad je Tool und hebt die Einbindung ins FH-Lernökosystem hervor.
 *
 * Ehrlichkeit (bewusst): Reifegrad-Status (Live / Beta / Konzept) statt
 * erfundener Zahlen. Vision/Ganganalyse = Konzept (kein Echtzeit-Tracking).
 * Kein Hinweis auf Modell-/Cloud-Anbieter im Text. DigiArk ist Partner,
 * kein Geldgeber.
 */

type Status = 'live' | 'beta' | 'konzept';

interface Tool {
  name: string;
  desc: string;
  route: string;
  status: Status;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  blurb: string;
  grad: string;     // gradient bg
  border: string;   // border color
  accent: string;   // text accent
  tools: Tool[];
}

const categories: Category[] = [
  {
    id: 'anamnese',
    label: 'Anamnese',
    icon: '🩺',
    blurb: 'Erhebung & klinisches Denken – sokratisch geführt',
    grad: 'from-violet-500/15 to-purple-900/5',
    border: 'border-violet-500/20',
    accent: 'text-violet-400',
    tools: [
      { name: 'LUMI – Anamnese-Trainer', desc: 'Sokratischer KI-Dialog mit Red-Flag-Screening', route: '/anamnese-trainer', status: 'live' },
      { name: '24/7 KI-Mentor', desc: 'Klinischer Chat-Assistent, jederzeit erreichbar', route: '/', status: 'live' },
      { name: 'Deep Reasoning', desc: 'Kausalketten & Pathomechanismus-Herleitung', route: '/education', status: 'live' },
      { name: 'Clinical Hub', desc: 'Geführte Reasoning-Pipeline für komplexe Fälle', route: '/education', status: 'beta' },
    ],
  },
  {
    id: 'diagnostik',
    label: 'Diagnostik',
    icon: '📐',
    blurb: 'Befundung & Analyse – multimodal im Browser',
    grad: 'from-cyan-500/15 to-blue-900/5',
    border: 'border-cyan-500/20',
    accent: 'text-cyan-400',
    tools: [
      { name: 'Körper-Scanner', desc: 'Video-/Bild-Analyse zur Haltungs- & Bewegungsbefundung', route: '/analyse', status: 'live' },
      { name: 'Vision Agent (Ganganalyse)', desc: 'Bewegungsanalyse mit Skelett-Overlay', route: '/vision', status: 'konzept' },
      { name: 'SOAP-Note Generator', desc: 'Strukturierte klinische Dokumentation', route: '/assessment', status: 'beta' },
      { name: 'Diagnose-Codes', desc: 'Zuordnung von Diagnose-/ICD-Codes', route: '/assessment', status: 'beta' },
      { name: 'Bericht-KI', desc: 'Entlassungs- & Befundbericht-Generator', route: '/assessment', status: 'beta' },
    ],
  },
  {
    id: 'lehre',
    label: 'Lehre',
    icon: '🎓',
    blurb: 'Wissen, Material & Evidenz für Lehrende und Lernende',
    grad: 'from-amber-500/15 to-yellow-900/5',
    border: 'border-amber-500/20',
    accent: 'text-amber-400',
    tools: [
      { name: 'Literatur-RAG', desc: '234 kuratierte Quellen, semantisch durchsuchbar', route: '/literatur', status: 'live' },
      { name: 'Handout-Builder', desc: 'Therapie- & Übungspläne als Handout', route: '/educator', status: 'beta' },
      { name: 'Fall-Generator', desc: 'Evidenzbasierte Fälle für Dozent:innen', route: '/educator', status: 'beta' },
      { name: 'Mindmap-Engine', desc: 'Visuelle Wissensvernetzung von Symptomen & Pathologien', route: '/education', status: 'beta' },
      { name: 'Creative Lab', desc: 'Medien- & Bildgenerierung für Lehrinhalte', route: '/creative-lab', status: 'beta' },
      { name: 'Labor / Labs', desc: 'Content-Werkstatt für Lehrende', route: '/labor', status: 'beta' },
    ],
  },
  {
    id: 'simulation',
    label: 'Simulation',
    icon: '🧪',
    blurb: 'Üben & Prüfen in sicheren Szenarien',
    grad: 'from-emerald-500/15 to-green-900/5',
    border: 'border-emerald-500/20',
    accent: 'text-emerald-400',
    tools: [
      { name: 'Case Training', desc: 'KI-Fallsimulation mit interaktiver Bewertung', route: '/case-training', status: 'live' },
      { name: 'Exam Simulator', desc: 'Zeitprüfung mit KI-Freitext-Korrektur & Moodle-Export', route: '/exam-simulation', status: 'live' },
      { name: 'Quiz AI', desc: 'Adaptives Quiz mit Spaced-Repetition', route: '/quiz', status: 'beta' },
    ],
  },
];

const statusMeta: Record<Status, { label: string; dot: string; text: string; ring: string }> = {
  live:    { label: 'Live',    dot: 'bg-green-400',       text: 'text-green-400',       ring: 'border-green-400/30 bg-green-400/5' },
  beta:    { label: 'Beta',    dot: 'bg-brand-primary',   text: 'text-brand-primary',   ring: 'border-brand-primary/30 bg-brand-primary/5' },
  konzept: { label: 'Konzept', dot: 'bg-zinc-500',        text: 'text-zinc-400',        ring: 'border-white/10 bg-white/5' },
};

const fhPartners = [
  { name: 'FH Campus Wien', focus: 'Physiotherapie & Gesundheitswissenschaften' },
  { name: 'FH JOANNEUM', focus: 'Gesundheits- & Therapiewissenschaften (Graz)' },
  { name: 'FH Gesundheitsberufe OÖ', focus: 'Therapie-Ausbildung & Skill-Labs' },
  { name: 'Dr. Vodder Akademie', focus: 'Manuelle Lymphdrainage & Fortbildung' },
];

const rollout = [
  { step: '01', title: 'FH-Adoption via LTI 1.3', text: 'Direkt in Moodle/Ilias eingebettet – kein Systemwechsel für die Hochschule.' },
  { step: '02', title: 'B2B-SaaS pro Institution', text: 'Lizenzmodell je FH/Akademie – planbarer, wiederkehrender Umsatz.' },
  { step: '03', title: 'DACH-Rollout', text: 'Skalierung von Österreich nach Deutschland & Schweiz.' },
];

const funding = [
  { name: 'FFG', label: 'Kleinprojekt F&E', status: 'IN LETZTER PRÜFRUNDE', color: 'text-green-400' },
  { name: 'WAW', label: 'Wirtschaftsagentur Wien', status: 'IN BEARBEITUNG', color: 'text-brand-primary' },
  { name: 'WKNÖ TIPP', label: 'Niederösterreich (TIPP)', status: 'IN BEANTRAGUNG', color: 'text-brand-primary' },
];

const StatusPill: React.FC<{ status: Status }> = ({ status }) => {
  const m = statusMeta[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${m.ring} ${m.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
};

export const ShowcasePage: React.FC = () => {
  const total = categories.reduce((s, c) => s + c.tools.length, 0);
  const liveCount = categories.reduce((s, c) => s + c.tools.filter((t) => t.status === 'live').length, 0);

  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-32 pb-24 overflow-hidden font-sans text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-[150px] opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] opacity-20" />
      </div>

      {/* ===================== HERO ===================== */}
      <Section containerClassName="py-20 relative z-10 text-center">
        <div className="container mx-auto px-8">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-violet-400 mb-6 block">
            DigiArk · F&amp;E Demonstration Hub
          </span>
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-white mb-6 tracking-tighter leading-none">
            Die KI-Lernplattform für <span className="text-gradient-gold italic font-light">medizinische Ausbildung</span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-4">
            <strong className="text-white">18 klinische Tools</strong> entlang des gesamten Workflows — von Anamnese über
            Diagnostik bis Lehre &amp; Simulation. Live im Browser, ohne Login, DSGVO-konform und
            <strong className="text-white"> LTI-1.3-fähig</strong> für FH &amp; Moodle.
          </p>
          <p className="text-zinc-600 text-sm mb-12">{total} Tools · 4 Kategorien · {liveCount} sofort live nutzbar</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#tools" className="bg-violet-500 text-white font-black uppercase px-8 py-3 rounded-full text-xs tracking-widest hover:scale-105 transition-transform">
              Die 18 Tools ↓
            </a>
            <a href="#fh" className="border border-brand-primary/40 text-brand-primary font-black uppercase px-8 py-3 rounded-full text-xs tracking-widest hover:bg-brand-primary/10 transition-colors">
              FH-Integration ↓
            </a>
          </div>
        </div>
      </Section>

      {/* ===================== 18 TOOLS IN 4 KATEGORIEN ===================== */}
      <Section id="tools" containerClassName="py-24 bg-zinc-950/30 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
              18 Tools, <span className="text-gradient-gold italic font-light">4 Kategorien</span>
            </h2>
            <p className="text-zinc-500 text-sm max-w-2xl mx-auto font-light">
              Jede Karte öffnet das Tool direkt (ohne Login). Der Reifegrad ist ehrlich gekennzeichnet.
            </p>
          </div>

          {/* Reifegrad-Legende */}
          <div className="flex flex-wrap justify-center gap-4 mb-14">
            <span className="inline-flex items-center gap-2 text-xs text-zinc-400"><span className="w-2 h-2 rounded-full bg-green-400" /> <strong className="text-white">Live</strong> – sofort nutzbar</span>
            <span className="inline-flex items-center gap-2 text-xs text-zinc-400"><span className="w-2 h-2 rounded-full bg-brand-primary" /> <strong className="text-white">Beta</strong> – funktional, im Ausbau</span>
            <span className="inline-flex items-center gap-2 text-xs text-zinc-400"><span className="w-2 h-2 rounded-full bg-zinc-500" /> <strong className="text-white">Konzept</strong> – Prototyp / Roadmap</span>
          </div>

          <div className="space-y-12">
            {categories.map((cat) => {
              const live = cat.tools.filter((t) => t.status === 'live').length;
              return (
                <div key={cat.id} className={`rounded-3xl p-8 border bg-gradient-to-br ${cat.grad} ${cat.border}`}>
                  <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <h3 className={`text-2xl font-bold font-serif ${cat.accent}`}>{cat.label}</h3>
                        <p className="text-zinc-400 text-sm font-light">{cat.blurb}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                      {cat.tools.length} Tools · {live} live
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cat.tools.map((tool) => (
                      <Link
                        key={tool.name}
                        to={tool.route}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block glass-dark p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="text-white font-bold text-sm leading-tight group-hover:text-brand-primary transition-colors">{tool.name}</h4>
                          <StatusPill status={tool.status} />
                        </div>
                        <p className="text-zinc-500 text-xs font-light leading-relaxed">{tool.desc}</p>
                        <span className="mt-3 inline-block text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">
                          Öffnen →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ===================== FH-INTEGRATION / LERNÖKOSYSTEM ===================== */}
      <Section id="fh" containerClassName="py-24 relative z-10">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary mb-4 block">Lernökosystem</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
              Eingebettet in die <span className="text-gradient-gold italic font-light">FH-Ausbildung</span>
            </h2>
            <p className="text-zinc-500 text-sm max-w-2xl mx-auto font-light">
              Direkt in bestehende Lernmanagement-Systeme integrierbar – via <strong className="text-white">LTI 1.3</strong> in
              Moodle &amp; Ilias. Kein Systemwechsel, kein Tool-Bruch für die Hochschule.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fhPartners.map((p) => (
              <div key={p.name} className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-brand-primary/20 transition-all">
                <div className="text-2xl mb-3">🎓</div>
                <p className="text-white font-bold mb-1">{p.name}</p>
                <p className="text-zinc-500 text-xs font-light">{p.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===================== WIRTSCHAFTLICHER HEBEL ===================== */}
      <Section containerClassName="py-24 bg-zinc-950/30 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
              Wirtschaftlicher <span className="text-gradient-gold italic font-light">Hebel</span>
            </h2>
            <p className="text-zinc-500 text-sm max-w-2xl mx-auto font-light">Skalierung vom Pilot zur DACH-weiten Verbreitung – plus aktive Förderbasis.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {rollout.map((r) => (
              <div key={r.step} className="premium-card rounded-3xl p-8 border border-white/5">
                <span className="text-5xl font-black font-serif text-brand-primary/30 block mb-4">{r.step}</span>
                <h3 className="text-xl font-bold font-serif text-white mb-3">{r.title}</h3>
                <p className="text-zinc-400 text-sm font-light leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">Öffentliche Förderungen &amp; F&amp;E</p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {funding.map((f) => (
              <div key={f.name} className="glass-dark p-5 rounded-2xl border border-white/5 text-center">
                <p className="text-white font-bold text-sm mb-1">{f.name}</p>
                <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${f.color}`}>{f.status}</span>
                <p className="text-zinc-600 text-xs font-light">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===================== SECURITY & COMPLIANCE ===================== */}
      <Section containerClassName="py-20 relative z-10">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
              Sicherheit &amp; <span className="text-gradient-gold italic font-light">Compliance</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-dark p-8 rounded-2xl border border-white/5">
              <span className="text-2xl block mb-4">🛡️</span>
              <h3 className="font-bold text-white mb-3">MDR-Freiheit</h3>
              <p className="text-zinc-400 text-sm font-light">Education-Only-Ansatz. Kein Medizinprodukt, keine MDR-Hürden, keine Haftungsrisiken für Bildungsträger. <strong>Education-Only. Not a medical device. No diagnostic or therapeutic claims.</strong></p>
            </div>
            <div className="glass-dark p-8 rounded-2xl border border-white/5">
              <span className="text-2xl block mb-4">⚖️</span>
              <h3 className="font-bold text-white mb-3">BFSG &amp; Datenschutz</h3>
              <p className="text-zinc-400 text-sm font-light">WCAG 2.1 AA konform by Design. Demos laufen ohne Login, es werden keine Patientendaten gespeichert.</p>
            </div>
            <div className="glass-dark p-8 rounded-2xl border border-white/5">
              <span className="text-2xl block mb-4">🔗</span>
              <h3 className="font-bold text-white mb-3">LTI 1.3 Integration</h3>
              <p className="text-zinc-400 text-sm font-light">Direkt in Moodle &amp; Ilias integrierbar – Zero-Friction-Adoption für Institutionen.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ===================== KONTAKT ===================== */}
      <Section containerClassName="py-20 relative z-10 text-center">
        <div className="container mx-auto px-8 max-w-2xl">
          <h2 className="text-4xl font-bold font-serif text-white mb-4">Nächster Schritt</h2>
          <p className="text-zinc-400 mb-8 font-light">Für DigiArk: Demo-Session, Businessplan oder Distributions-Kooperation – ein Klick genügt.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:koerperfluss@gmail.com?subject=DigiArk%20%C3%97%20K%C3%B6rperfluss%20%E2%80%93%20Distribution%20%26%20Demo"
              className="inline-flex items-center gap-3 bg-brand-primary text-black font-black uppercase px-10 py-4 rounded-full text-xs tracking-widest hover:scale-105 transition-transform"
            >
              Gespräch vereinbaren
            </a>
            <Link
              to="/startup"
              className="inline-flex items-center gap-3 border border-white/20 text-white font-black uppercase px-8 py-4 rounded-full text-xs tracking-widest hover:bg-white/5 transition-colors"
            >
              Unternehmens-Info →
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/Section';

interface ProductModule {
  name: string;
  codename: string;
  status: 'MVP' | 'Beta' | 'Launched';
  trl: number;
  description: string;
  features: string[];
  demoPath: string;
}

const products: ProductModule[] = [
  {
    name: "LUMI – Sokratischer KI-Mentor",
    codename: "Lumi",
    status: "Beta",
    trl: 7,
    description: "Halluzinationsfreier KI-Tutor, der Studierende durch gezieltes Hinterfragen zum Clinical Reasoning anleitet. Kein direktes Antworten – Wissen durch Dialog.",
    features: [
      "Neuro-symbolische Antwortfilterung (kein Halluzinieren)",
      "AWMF/ICF-basierter Wissensfilter",
      "Context-Aware Fragensteuerung (Bloom Taxonomie)",
      "Datenschutzkonforme On-Device Verarbeitung"
    ],
    demoPath: "/anamnese-trainer"
  },
  {
    name: "Diagnostik-Chatbot (Anamnese Trainer)",
    codename: "Medi",
    status: "MVP",
    trl: 7,
    description: "Geführter, adaptiver Anamnese-Dialog zur Erfassung klinischer Statusangaben mit automatischem Red-Flag-Screening.",
    features: [
      "Red-Flag Algorithmus (24 Sicherheitsabfragen)",
      "Strukturierter klinischer Befundbogen",
      "Verbindung zum ICF Knowledge Graph",
      "Barrierefreier Dialog-Flow (WCAG 2.1 AA)"
    ],
    demoPath: "/anamnese-trainer"
  },
  {
    name: "Vision Agent (Ganganalyse)",
    codename: "Visi",
    status: "MVP",
    trl: 7,
    description: "Echtzeit-Ganganalyse und Haltungsbefundung via Pose-Estimation direkt im Browser – kein App-Download erforderlich.",
    features: [
      "Skelett-Overlay in Echtzeit (MediaPipe)",
      "Valgus-Deflektionsmessung (Warnung ab 18°)",
      "Side-by-Side Goldstandard-Vergleich",
      "Automatischer Befundbericht-Export"
    ],
    demoPath: "/vision"
  },
  {
    name: "Handout-Builder (Therapieplan)",
    codename: "Plan",
    status: "MVP",
    trl: 7,
    description: "One-Click Erstellung barrierefreier Therapie- und Trainingspläne nach BFSG/WCAG 2.1 AA Standard.",
    features: [
      "Automatische Dosierungsvorschläge (Cochrane-basiert)",
      "Screenreader-optimierter PDF-Export",
      "Multilinguale Ausgabe (DE/EN/TR/AR)",
      "Direktintegration in Moodle via LTI 1.3"
    ],
    demoPath: "/educator"
  },
  {
    name: "Exam Simulator & Auto-Grader",
    codename: "Exam",
    status: "MVP",
    trl: 7,
    description: "KI-gestützte e-Assessments mit automatischer Freitext-Korrektur nach Bloom'scher Taxonomie.",
    features: [
      "Automatische Notenvorschläge (Freitext)",
      "Lernstands-Dashboard für Dozenten",
      "Moodle LTI 1.3 Schnittstelle",
      "Plagiatsprüfung integriert"
    ],
    demoPath: "/exam-simulation"
  }
];

const team = [
  {
    name: "Sascha Lagler, BSc i.A.",
    role: "CEO & Clinical Lead",
    focus: "Physiotherapeut in Ausbildung, Clinical Reasoning Spezialist. Verantwortlich für Produktvision, klinische Validierung und Unternehmensleitung.",
    linkedin: "https://www.linkedin.com/in/sascha-lagler/"
  },
  {
    name: "Peter Fischer, BSc BSc",
    role: "CTO & Technical Lead",
    focus: "xLSTM-Architektur, Google Cloud Orchestrierung, MLOps, API-Security und neuro-symbolische Backend-Entwicklung.",
    linkedin: "https://www.linkedin.com/in/peter-fischer-dev/"
  },
  {
    name: "Lisa Mauerhart",
    role: "CDO – Design & UX/UI Lead",
    focus: "Barrierefreies Design (BFSG), anatomische Illustrationen, User Journeys und Frontend UI/UX für medizinische Fachbereiche.",
    linkedin: "https://www.linkedin.com/in/lisa-mauerhart/"
  }
];

const pilots = [
  { name: "FH Linz / FH Gesundheitsberufe OÖ", program: "Physiotherapie BSc", status: "Interesse gezeigt, in Verhandlung", note: "Anpassung erforderlich" },
  { name: "FH Campus Wien", program: "Physiotherapie / Gesundheit", status: "Primäre Zielgruppe", note: "Direktansprache geplant" },
  { name: "Dr. Vodder Akademie / Kneipp-Schule", program: "Med. Masseur, Heilmasseur, PT", status: "Sekundäre Zielgruppe", note: "DACH-Rollout Phase 2" }
];

const funding = [
  { name: "WAW Förderung", status: "AKTIV", detail: "Wirtschaftsagentur Wien – läuft" },
  { name: "FFG Kleinprojekt", status: "EINGEREICHT", detail: "F&E Antrag, Entscheidung ausstehend" },
  { name: "WKNÖ TIPP", status: "IN BEANTRAGUNG", detail: "Förderantrag in Vorbereitung" },
  { name: "DigiArk", status: "IN VERHANDLUNG", detail: "Support für Marktreife & Markteintritt" }
];

const techStack = [
  { label: "AI/ML", items: ["Gemini 2.0 Flash", "Gemini 2.5 Pro", "MediaPipe Pose", "xLSTM Filter"] },
  { label: "Cloud", items: ["Google Cloud Run", "Firebase Hosting", "Firestore", "Vertex AI Search"] },
  { label: "Frontend", items: ["React 18", "TypeScript 5", "Three.js / WebGL 3D", "Tailwind CSS 4"] },
  { label: "Standards", items: ["WCAG 2.1 AA / BFSG", "LTI 1.3 (Moodle)", "AWMF-Leitlinien", "ICF Klassifikation"] }
];

export const StartupPage: React.FC = () => {
  return (
    <div className="animate-fadeInUp bg-transparent min-h-screen pt-32 pb-24 overflow-hidden font-sans text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] opacity-30"></div>
      </div>

      {/* Header */}
      <Section containerClassName="py-20 relative z-10 text-center">
        <div className="container mx-auto px-8">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary mb-6 block">
            Google for Startups Cloud Program · Application
          </span>
          <h1 className="text-5xl md:text-8xl font-bold font-serif text-white mb-8 tracking-tighter leading-none">
            Körperfluss <span className="text-gradient-gold italic font-light">Technologies</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-2xl max-w-4xl mx-auto font-light leading-relaxed mb-4">
            KI-gestützte Lernplattform für medizinische Ausbildung · Österreich · TRL 3 ➔ Ziel TRL 7
          </p>
          <p className="text-zinc-500 text-sm max-w-2xl mx-auto mb-12">
            Halluzinationsfreie neuro-symbolische KI-Middleware · Barrierefreiheit nach BFSG/WCAG 2.1 AA · FFG-Projekt (130.800 €)
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#products" className="bg-brand-primary text-black font-black uppercase px-8 py-3 rounded-full text-xs tracking-widest hover:scale-105 transition-transform">
              Live Demos ansehen
            </a>
            <a href="#team" className="border border-white/20 text-white font-black uppercase px-8 py-3 rounded-full text-xs tracking-widest hover:bg-white/5 transition-colors">
              Das Team
            </a>
            <a href="mailto:koerperfluss@gmail.com?subject=Google for Startups – Körperfluss Review" className="border border-brand-primary/40 text-brand-primary font-black uppercase px-8 py-3 rounded-full text-xs tracking-widest hover:bg-brand-primary/10 transition-colors">
              Kontakt für Review
            </a>
          </div>
        </div>
      </Section>

      {/* Business Description */}
      <Section containerClassName="py-24 bg-zinc-950/30 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                Business & <span className="text-gradient-gold italic font-light">Mission</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed font-light mb-6 text-lg">
                Körperfluss schließt die <strong className="text-white">Zuverlässigkeitslücke</strong> in der medizinischen Ausbildung. Herkömmliche generative KI neigt zu Halluzinationen — für klinische Lehre inakzeptabel. Unsere <strong className="text-white">neuro-symbolische Middleware</strong> filtert in Echtzeit jeden KI-Output gegen validierte medizinische Wissensgraphen (AWMF, ICF).
              </p>
              <p className="text-zinc-400 leading-relaxed font-light text-lg">
                Über <strong className="text-white">LTI 1.3 Advantage</strong> dockt die Plattform direkt an bestehende LMS (Moodle, Ilias) an. Vollständige BFSG/WCAG 2.1 AA Konformität für barrierefreie Hochschullehre.
              </p>
            </div>
            <div className="space-y-4">
              <div className="glass-dark p-6 rounded-2xl border border-white/5">
                <span className="text-brand-primary font-black text-xs uppercase tracking-wider block mb-2">Zielgruppe</span>
                <p className="text-zinc-300 font-light text-sm">Österreichische & europäische Fachhochschulen, medizinische Akademien, physiotherapeutische Ausbildungszentren und klinische Lehrende.</p>
              </div>
              <div className="glass-dark p-6 rounded-2xl border border-white/5">
                <span className="text-brand-primary font-black text-xs uppercase tracking-wider block mb-2">Didaktische Mission</span>
                <p className="text-zinc-300 font-light text-sm">Sokratisches Lernprinzip: KI stellt Fragen statt Antworten zu geben. Studierende entwickeln eigenständiges Clinical Reasoning — kein passives Konsumieren von KI-Antworten.</p>
              </div>
              <div className="glass-dark p-6 rounded-2xl border border-brand-primary/20">
                <span className="text-brand-primary font-black text-xs uppercase tracking-wider block mb-2">Entwicklungsstufe (FFG)</span>
                <p className="text-zinc-300 font-light text-sm"><strong className="text-white">TRL 3 ➔ Ziel TRL 7</strong> – Einstieg als Konzept-Prototyp (TRL 3), Entwicklung über 36 Monate zum validierten Demonstrator im klinischen/akademischen Einsatz (TRL 7, Budget 130.800 €).</p>
              </div>
              <div className="glass-dark p-6 rounded-2xl border border-white/5">
                <span className="text-brand-primary font-black text-xs uppercase tracking-wider block mb-2">Businessmodell</span>
                <p className="text-zinc-300 font-light text-sm">B2B SaaS: Lizenzmodell pro FH/Akademie (ab €490/Monat). Zusatzmodul für Barrierefreiheits-Compliance (BFSG 2025 Pflicht für öffentl. Einrichtungen).</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Pilot Partners */}
      <Section containerClassName="py-16 relative z-10">
        <div className="container mx-auto px-8 max-w-6xl text-center">
          <h2 className="text-2xl font-bold font-serif text-white mb-2">Pilot-Kooperationen</h2>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-10">Österreichische Fachhochschulen · Geplant Q3–Q4 2026</p>
          <div className="grid md:grid-cols-3 gap-6">
            {pilots.map((p) => (
              <div key={p.name} className="glass-dark p-6 rounded-2xl border border-white/5">
                <p className="text-white font-bold mb-1">{p.name}</p>
                <p className="text-zinc-500 text-sm mb-2">{p.program}</p>
                <span className="text-brand-primary text-[10px] font-black uppercase tracking-wider">{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Products & Live Demos */}
      <Section id="products" containerClassName="py-24 bg-zinc-950/30 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
              Module & <span className="text-gradient-gold italic font-light">Live Demos</span>
            </h2>
            <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-black">Alle Module sind produktiv – Klick auf Demo startet die echte Anwendung</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((prod) => (
              <div key={prod.codename} className="premium-card rounded-3xl p-8 border border-white/5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-500">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">TRL {prod.trl}</span>
                    <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-full text-[10px] font-black tracking-wider uppercase">
                      {prod.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-serif text-white mb-4">{prod.name}</h3>
                  <p className="text-zinc-400 font-light leading-relaxed mb-6 text-sm">{prod.description}</p>
                  <div className="border-t border-white/5 pt-6 mb-6">
                    <span className="text-[10px] font-black uppercase text-brand-primary tracking-wider block mb-3">Key Features:</span>
                    <ul className="space-y-2">
                      {prod.features.map((feat, idx) => (
                        <li key={idx} className="text-xs text-zinc-500 font-light flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-brand-primary rounded-full flex-shrink-0"></span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Link
                  to={prod.demoPath}
                  className="w-full text-center bg-white/5 hover:bg-brand-primary/10 border border-white/10 hover:border-brand-primary/30 text-white hover:text-brand-primary font-black uppercase text-xs tracking-widest py-3 rounded-xl transition-all duration-300"
                >
                  → Live Demo starten
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Tech Stack */}
      <Section containerClassName="py-20 relative z-10">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
              Technology <span className="text-gradient-gold italic font-light">Stack</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((col) => (
              <div key={col.label} className="glass-dark p-6 rounded-2xl border border-white/5">
                <span className="text-brand-primary font-black text-[10px] uppercase tracking-wider block mb-4">{col.label}</span>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="text-zinc-400 text-xs font-light flex items-center gap-2">
                      <span className="w-1 h-1 bg-brand-primary/60 rounded-full flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Funding */}
      <Section containerClassName="py-16 relative z-10">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-serif text-white mb-2">Finanzierung & <span className="text-gradient-gold italic font-light">Förderungen</span></h2>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Aktive Förderungen und Finanzierungspartner</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {funding.map((f) => (
              <div key={f.name} className="glass-dark p-5 rounded-2xl border border-white/5 text-center">
                <p className="text-white font-bold text-sm mb-1">{f.name}</p>
                <span className={`text-[10px] font-black uppercase tracking-wider block mb-2 ${f.status === 'AKTIV' ? 'text-green-400' : 'text-brand-primary'}`}>{f.status}</span>
                <p className="text-zinc-500 text-xs font-light">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Team */}
      <Section id="team" containerClassName="py-24 bg-zinc-950/30 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
              Das <span className="text-gradient-gold italic font-light">Gründerteam</span>
            </h2>
            <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-black">Gründerteam & Fachexperten</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {team.map((member) => (
              <div key={member.name} className="glass-dark p-10 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-brand-primary/20 transition-all">
                <div>
                  <h3 className="text-2xl font-bold font-serif text-white mb-2">{member.name}</h3>
                  <span className="text-brand-primary text-[10px] font-black tracking-widest uppercase block mb-6">{member.role}</span>
                  <p className="text-zinc-400 font-light text-sm leading-relaxed mb-6">{member.focus}</p>
                </div>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-500 hover:text-brand-primary font-black uppercase tracking-wider flex items-center gap-2 transition-colors self-start mt-6"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn Profil
                </a>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact for Google Review */}
      <Section containerClassName="py-20 relative z-10 text-center">
        <div className="container mx-auto px-8 max-w-3xl">
          <h2 className="text-3xl font-bold font-serif text-white mb-4">Kontakt für Review</h2>
          <p className="text-zinc-400 mb-8 font-light">Für Rückfragen zum Google for Startups Cloud Program Application:</p>
          <a
            href="mailto:koerperfluss@gmail.com?subject=Google for Startups – Körperfluss Technologies Review"
            className="inline-flex items-center gap-3 bg-brand-primary text-black font-black uppercase px-10 py-4 rounded-full text-xs tracking-widest hover:scale-105 transition-transform"
          >
            koerperfluss@gmail.com
          </a>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="glass-dark p-4 rounded-xl border border-white/5">
              <p className="text-brand-primary font-black text-2xl mb-1">TRL 3 ➔ 7</p>
              <p className="text-zinc-500 text-xs uppercase tracking-wider">FFG Entwicklungsstand</p>
            </div>
            <div className="glass-dark p-4 rounded-xl border border-white/5">
              <p className="text-brand-primary font-black text-2xl mb-1">130.800 €</p>
              <p className="text-zinc-500 text-xs uppercase tracking-wider">FFG F&E Budget</p>
            </div>
            <div className="glass-dark p-4 rounded-xl border border-white/5">
              <p className="text-brand-primary font-black text-2xl mb-1">AT</p>
              <p className="text-zinc-500 text-xs uppercase tracking-wider">Österreich F&E</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <Section containerClassName="py-12 relative z-10 text-center text-zinc-600 text-xs border-t border-white/5">
        <div className="container mx-auto px-8">
          <p>© 2026 Körperfluss Technologies FlexCo · Dokumentation für das Google for Startups Cloud Program · <a href="https://koerperfluss.at" className="text-brand-primary hover:text-white">koerperfluss.at</a> (GCP: <span className="text-zinc-400">gen-lang-client-0285074833</span>)</p>
        </div>
      </Section>
    </div>
  );
};

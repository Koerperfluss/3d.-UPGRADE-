
import { FundingNode, FundingLink } from './types';

export const nodesData: FundingNode[] = [
  // --- CORE PROJECT ---
  {
    id: 'projekt-koerperfluss',
    label: 'Körperfluss Edu-Suite',
    type: 'project',
    status: 'active',
    group: 'Project',
    details: {
      description: 'KI-gestützte Ausbildungsplattform für evidenzbasierte Physiotherapie & Gesundheitsberufe. "Inferenz-Maschine" mit Compliance-Layer (MDR-frei) via LTI 1.3 Moodle-Integration. Zielmarkt: DACH & EU.',
      purpose: 'Schließung der "Reliability Gap" in der medizinischen KI-Lehre durch Neuro-Symbolik.',
      documents: [
        { name: 'Strategisches Master-Dossier Q1 2026.pdf', url: '#' },
        { name: 'FFG Antrag (Körperfluss Edu).pdf', url: '#' },
        { name: 'Antragsbestätigung WAW.pdf', url: '#' },
        { name: 'Finanzplan & Cap Table Entwurf.xlsx', url: '#' },
      ],
    },
  },
  {
    id: 'team-struktur',
    label: 'Team & Cap Table',
    type: 'info',
    status: 'completed',
    group: 'Project',
    details: {
      description: 'Sascha Lagler (51%, Clinical Lead/CEO), Peter Fischer (48%, Tech Lead/CTO), Lisa Mauerhart (1%, UX/Inklusion).',
      purpose: 'Interdisziplinäre Abdeckung: Physiotherapie, AI/Medical Engineering, Design/WCAG 2.2.',
    },
  },
  {
    id: 'task-gruendung',
    label: 'FlexCo Gründung',
    type: 'task',
    status: 'action_required',
    group: 'Strategy',
    details: {
      description: 'Gründung der Körperfluss Technologies FlexCo in 1130 Wien. KRITISCH für AWS Gender Bonus (Lisa muss >25% haben, aktuell 1%).',
      purpose: 'Rechtliche Basis für AWS PreSeed und Markteintritt.',
      timeline: 'ÜBERFÄLLIG (Ursprünglich Jänner 2026)',
      amount: 'Stammkapital: 10k',
      amountValue: 10000,
      requirements: ['Gesellschaftervertrag anpassen', 'Notartermin', 'Syndikatsvertrag'],
    },
  },

  {
    id: 'ffg-marktstart',
    label: 'FFG Marktstart',
    type: 'opportunity',
    status: 'future',
    group: 'FFG',
    details: {
      description: 'Förderung für den Markteintritt von innovativen KMU. Ideal nach Abschluss des FFG Kleinprojekts.',
      purpose: 'Finanzierung von Marketing, Vertriebsaufbau und Internationalisierung.',
      amount: 'Bis zu 250.000 € (Darlehen)',
      amountValue: 250000,
      timeline: 'Geplant: Q1 2027',
      requirements: ['Abgeschlossenes F&E Projekt', 'Verwertungsplan', 'KMU-Status'],
      link: 'https://www.ffg.at/marktstart',
      isOpen: true,
      isApplicable: false,
      probability: 60,
      probabilityReason: 'Gute Chancen als Folgeprojekt zum FFG Kleinprojekt.',
    },
  },
  {
    id: 'eurostars',
    label: 'Eurostars (EU)',
    type: 'opportunity',
    status: 'future',
    group: 'EU',
    details: {
      description: 'Förderprogramm für forschende KMU, die in internationalen Verbundprojekten innovative Produkte entwickeln.',
      purpose: 'Entwicklung der nächsten Generation der Edu-Suite mit europäischen Partnern.',
      amount: 'Bis zu 500.000 € (nationaler Anteil)',
      amountValue: 500000,
      timeline: 'Nächster Cut-off: Herbst 2026',
      requirements: ['Internationaler Partner', 'F&E-treibendes KMU', 'Markteinführung innerhalb 2 Jahren'],
      link: 'https://www.ffg.at/eurostars',
      isOpen: true,
      isApplicable: false,
      probability: 40,
      probabilityReason: 'Erfordert die Akquise eines starken internationalen Partners.',
    },
  },
  // --- MODULES (BUSINESS PLAN) ---
  {
    id: 'modul-gehirn',
    label: 'Modul 1: Smarte Aufnahme',
    type: 'technology',
    status: 'active',
    group: 'Technology',
    details: {
      description: 'Diagnostik- & Lehr-Bot (MAS-Core) mit Sokratischer Methode und LUMI Assistant (Campus-Begleiter).',
      purpose: 'Triage und intelligente Tutor-Funktion.',
    }
  },
  {
    id: 'modul-bibliothek',
    label: 'Modul 2: Wissens-Schatz',
    type: 'technology',
    status: 'active',
    group: 'Technology',
    details: {
      description: 'Vektor-RAG Multimedia Datenbank, Graph-Interface (Mindmap Engine) und Audio Transcriber.',
      purpose: 'Verhinderung von Halluzinationen durch echten Quellenbezug.',
    }
  },
  {
    id: 'modul-labor',
    label: 'Modul 3: Training & Praxis',
    type: 'technology',
    status: 'active',
    group: 'Technology',
    details: {
      description: 'Edge-Vision Media Analyzer, Vision Agent, Fall-Generator (Infinite Learning) und Spaced Repetition Quiz.',
      purpose: 'Praxisnahes Training ohne Patientengefährdung.',
    }
  },
  {
    id: 'modul-pruefung',
    label: 'Modul 4: Prüfung & Vernetzung',
    type: 'technology',
    status: 'active',
    group: 'Technology',
    details: {
      description: 'Exam Assistant (Auto-Korrektur), Modul-Linker (Interdisziplinär) und Dashboards.',
      purpose: 'Self-Correcting Classroom und Lernfortschritts-Tracking.',
    }
  },
  {
    id: 'modul-werkstatt',
    label: 'Modul 5: Unterlagen & Sicherheit',
    type: 'technology',
    status: 'active',
    group: 'Technology',
    details: {
      description: 'Handout Builder, Creative Lab, Safety Guard (MDR-Filter) und Barrierefreiheit (BFSG/WCAG 2.2).',
      purpose: 'Rechtliche Compliance und Inklusion.',
    }
  },

  // --- FUNDING: FFG ---
  {
    id: 'ffg-projekt-start',
    label: 'FFG Projekt.Start',
    type: 'program',
    status: 'completed',
    group: 'FFG',
    details: {
      description: 'Vorstudie und Antragsvorbereitung abgeschlossen. Endbericht am 23.12.2025 eingereicht.',
      amount: '6.000 €',
      amountValue: 6000,
      timeline: 'Auszahlung erwartet: März 2026',
      documents: [{ name: 'Endbericht Bestätigung.pdf', url: '#' }, { name: 'Auszahlungsanalyse.pdf', url: '#' }]
    },
  },
  {
    id: 'ffg-kleinprojekt',
    label: 'FFG Kleinprojekt',
    type: 'program',
    status: 'pending',
    group: 'FFG',
    details: {
      description: 'Eingereicht am 17.12.2025 (ID 68209806). Fokus: Experimentelle Entwicklung (TRL 7) der Neuro-Symbolic Engine.',
      purpose: 'Finanzierung der technischen Entwicklung (RAG, Compliance-Filter).',
      amount: '58.860 € (45% von 130.800 €)',
      amountValue: 58860,
      timeline: 'Entscheidung erwartet: März/April 2026',
      documents: [{ name: 'Bestätigung eCall Einreichung.pdf', url: '#' }, { name: 'Ergebnis Formalprüfung.pdf', url: '#' }],
      isOpen: false,
      isApplicable: false,
      probability: 75,
      probabilityReason: 'Formalprüfung bestanden, in inhaltlicher Prüfung. Hohe Relevanz durch MDR-Fokus.',
    },
  },
  {
    id: 'ffg-impact-innovation',
    label: 'FFG Impact Innovation',
    type: 'opportunity',
    status: 'action_required',
    group: 'FFG',
    details: {
      description: 'Perfekter Fit für die Pilotierung mit der FH Linz. Fördert Innovationsprozesse mit Stakeholder-Einbindung.',
      purpose: 'Anpassung der Inferenz-Maschine an die Bedürfnisse von Lehrenden/Studierenden.',
      amount: 'bis 150.000 € (75%)',
      amountValue: 150000,
      timeline: 'Call 2026 offen',
      requirements: ['LOI der FH Linz', 'Innovationsmethodik'],
    },
  },

  // --- FUNDING: REGIONAL (WAW / NÖ) ---
  {
    id: 'waw-innovation',
    label: 'WAW Innovation',
    type: 'program',
    status: 'pending',
    group: 'Regional',
    details: {
      description: 'Eingereicht am 27.12.2025 (ID 6444898). Hearing fand am 11./12. März 2026 statt.',
      purpose: 'Projektfinanzierung für Standort Wien (Digitaler Humanismus).',
      amount: '35.626 € (Akonto: 17.813 €) bei 79.173 € Kosten',
      amountValue: 35626,
      timeline: 'Entscheidung erwartet: Ende März / Anfang April 2026',
      documents: [{ name: 'Antragsbestätigung.pdf', url: '#' }, { name: 'Finanzplan_Real.pdf', url: '#' }],
      isOpen: false,
      isApplicable: false,
      probability: 90,
      probabilityReason: 'Hearing erfolgreich absolviert. Jury-Feedback war sehr positiv bezüglich LTI 1.3 Integration.',
    },
  },
  {
    id: 'land-noe-92k',
    label: 'Wirtschaftsförderung Land NÖ',
    type: 'opportunity',
    status: 'action_required',
    group: 'Regional',
    details: {
      description: 'Regionale Projekt- und Investitionsförderung des Landes NÖ.',
      amount: 'ca. 92.000 €',
      amountValue: 92000,
      timeline: 'Offen',
    },
  },
  {
    id: 'wwtf-digitaler-humanismus',
    label: 'WWTF-NÖ: Digitaler Humanismus',
    type: 'opportunity',
    status: 'future',
    group: 'Regional',
    details: {
      description: 'Kooperationsprojekt IKT 2026. Fokus auf Digitalen Humanismus. Erfordert zwingend einen Forschungspartner aus NÖ (z.B. Donau-Uni Krems).',
      purpose: 'Forschung an MDR-freier, ethischer KI in der Bildung.',
      amount: '350.000 € – 700.000 €',
      amountValue: 350000,
      timeline: 'Call 2026 (derzeit offen)',
      requirements: ['Forschungspartner aus NÖ zwingend erforderlich (Uni/FH)'],
    },
  },

  // --- FUNDING: AWS & PARTNERS ---
  {
    id: 'aws-ai-adoption',
    label: 'AWS AI Adoption Call',
    type: 'opportunity',
    status: 'action_required',
    group: 'AWS',
    details: {
      description: 'Förderung für die Implementierung von vertrauenswürdiger KI in KMUs. Ideal für die MDR-freie Neuro-Symbolic Engine.',
      purpose: 'Perfekt für die Validierung und Implementierung der Neuro-Symbolic Engine in der Praxis.',
      amount: 'max. 100.000 €',
      amountValue: 100000,
      timeline: 'Laufend (2026)',
      requirements: ['KMU in Österreich', 'Fokus auf Trustworthy AI', 'Konkreter Use Case'],
      isOpen: true,
      isApplicable: true,
      probability: 85,
      probabilityReason: 'Perfekter Match für die Neuro-Symbolic Engine. Antrag kann sofort gestartet werden.',
    }
  },
  {
    id: 'ffg-basisprogramm',
    label: 'FFG Basisprogramm',
    type: 'opportunity',
    status: 'future',
    group: 'FFG',
    details: {
      description: 'Themenoffene Förderung für wirtschaftlich verwertbare Forschungs- und Entwicklungsprojekte. Ideal für die Skalierungsphase.',
      purpose: 'Langfristige Finanzierung für die Weiterentwicklung der Plattform nach erfolgreichem PreSeed.',
      amount: 'Offen (bis zu 3 Mio. €)',
      amountValue: 3000000,
      timeline: 'Laufend',
      requirements: ['Hoher Innovationsgehalt', 'Technisches Risiko', 'Wirtschaftliche Verwertbarkeit'],
    }
  },
  {
    id: 'aws-seedfinancing',
    label: 'AWS Seedfinancing Deep Tech',
    type: 'opportunity',
    status: 'future',
    group: 'AWS',
    details: {
      description: 'Anschlussfinanzierung nach PreSeed. Für hoch-innovative, technologieintensive Startups in der Gründungs- und Aufbauphase.',
      purpose: 'Skalierung der Edu-Suite im DACH/EU Raum, Marktdurchdringung.',
      amount: 'bis 800.000 €',
      amountValue: 800000,
      timeline: 'Geplant: Ende 2026 / 2027',
      requirements: ['Erfolgreicher PreSeed Abschluss', 'Erste Markttraktion'],
    },
  },
  {
    id: 'aws-preseed',
    label: 'AWS PreSeed Deep Tech',
    type: 'program',
    status: 'action_required',
    group: 'AWS',
    details: {
      description: 'Fokus DACH/EU Bildungsraum. Hängt an der FlexCo-Gründung, dem Cap-Table-Fix (Gender Bonus) und dem LOI der FH Linz.',
      purpose: 'Finanzierung des Deep-Tech Kerns und Markteintritt.',
      amount: '~300.000 € (mit Bonus)',
      amountValue: 300000,
      timeline: 'AKUT (Geplant: Q2 2026)',
      requirements: ['FlexCo Gründung', 'Gender-Bonus Struktur (Lisa >25%)', 'LOI FH Linz'],
      link: 'https://www.aws.at/preseed/',
      isOpen: true,
      isApplicable: false,
      probability: 45,
      probabilityReason: 'Blockiert durch fehlende FlexCo-Gründung und Cap-Table-Anpassung (Lisa < 25%).',
    },
  },
  {
    id: 'google-for-startups-cloud',
    label: 'Google for Startups Cloud',
    type: 'opportunity',
    status: 'action_required',
    group: 'Partners',
    details: {
      description: 'Bis zu 350.000 USD an Cloud-Guthaben für KI-Startups über 2 Jahre.',
      purpose: 'Finanzierung der Cloud-Infrastruktur für KI-Modelle und RAG-Pipeline.',
      amount: 'bis 350.000 $',
      amountValue: 350000,
      timeline: 'Laufend',
      requirements: ['KI als Kerntechnologie', 'Geschäftskonto'],
    },
  },
  {
    id: 'kmu-digital',
    label: 'KMU.DIGITAL',
    type: 'opportunity',
    status: 'action_required',
    group: 'Regional',
    details: {
      description: 'Förderung für Digitalisierungsberatung und -umsetzung.',
      purpose: 'Beratung für IT-Security und Geschäftsprozessoptimierung.',
      amount: 'bis 14.800 €',
      amountValue: 14800,
      timeline: 'Offen (Umsetzung ab Q2 2026)',
    },
  },
  {
    id: 'horizon-europe-eic',
    label: 'Horizon Europe EIC Accelerator',
    type: 'opportunity',
    status: 'future',
    group: 'EU',
    details: {
      description: 'Förderung von bahnbrechenden Innovationen mit hohem Risiko und hohem Potenzial. Ideal für europäische Skalierung.',
      purpose: 'EU-weite Skalierung der KI-HealthTech Plattform.',
      amount: 'bis 2.5M € (Grant) + Equity',
      amountValue: 2500000,
      timeline: 'Langfristig (2027+)',
    },
  },
  {
    id: 'wko-tip-noe',
    label: 'TIP Plattform KI (WKO NÖ)',
    type: 'opportunity',
    status: 'action_required',
    group: 'Regional',
    details: {
      description: 'Förderung von KI-Projekten in NÖ. Antrag muss vor Projektbeginn gestellt werden.',
      purpose: 'Zusätzliche Förderung für KI-Implementierung.',
      amount: 'bis 9.900 €',
      amountValue: 9900,
      timeline: 'Vor Projektbeginn',
    },
  },

  // --- PARTNERS & STRATEGY ---
  {
    id: 'partner-physio-kette',
    label: 'Physiotherapie-Kette (15 Standorte)',
    type: 'partner',
    status: 'action_required',
    group: 'Partners',
    details: {
      description: 'Potenzieller Kunde/Partner. Fokus auf postoperative Reha & Sportverletzungen. Veraltete Software, wenig digitale Patienteninteraktion.',
      purpose: 'Digitalisierung der Patient Journey, Integration von Körperfluss via API in neues PVS, asynchrone Betreuung.',
      timeline: 'Erstgespräch Q2 2026',
    }
  },
  {
    id: 'partner-fh-linz',
    label: 'FH Linz (Pilotpartner)',
    type: 'partner',
    status: 'action_required',
    group: 'Partners',
    details: {
      description: 'Neuer strategischer Hauptpartner für Pilotierung (MedTech / Soziales). Ersetzt Kneipp Schulen.',
      purpose: 'Validierung im akademischen Umfeld für den DACH/EU Raum.',
      timeline: 'In Verhandlung (Prio 1)',
    }
  },
  {
    id: 'qubitec',
    label: 'Qubitec Funding',
    type: 'partner',
    status: 'active',
    group: 'Partners',
    details: {
      description: 'Strategische Förderbegleitung.',
      documents: [{ name: 'Rechnung RE-20251048.pdf', url: '#' }]
    },
  },
  {
    id: 'liquiditaet-check',
    label: 'Liquidität (Gesichert)',
    type: 'info',
    status: 'completed',
    group: 'Project',
    details: {
      description: '38.000 € Eigenmittel (Bar) + 25.000 € Eigenleistung (unbar) sind vorhanden.',
      amount: 'Verfügbar: 63.000 €',
      amountValue: 63000,
      purpose: 'Deckung der Projektkosten gemeinsam mit Förder-Akontos.',
    }
  }
];

export const linksData: FundingLink[] = [
  // Core connections
  { source: 'team-struktur', target: 'projekt-koerperfluss', type: 'info' },
  { source: 'task-gruendung', target: 'projekt-koerperfluss', type: 'prerequisite' },
  { source: 'liquiditaet-check', target: 'projekt-koerperfluss', type: 'financial' },
  
  // Modules to Project
  { source: 'modul-gehirn', target: 'projekt-koerperfluss', type: 'info' },
  { source: 'modul-bibliothek', target: 'projekt-koerperfluss', type: 'info' },
  { source: 'modul-labor', target: 'projekt-koerperfluss', type: 'info' },
  { source: 'modul-pruefung', target: 'projekt-koerperfluss', type: 'info' },
  { source: 'modul-werkstatt', target: 'projekt-koerperfluss', type: 'info' },

  // Funding connections
  { source: 'ffg-projekt-start', target: 'ffg-kleinprojekt', type: 'primary' },
  { source: 'projekt-koerperfluss', target: 'ffg-kleinprojekt', type: 'primary' },
  { source: 'projekt-koerperfluss', target: 'waw-innovation', type: 'primary' },
  { source: 'projekt-koerperfluss', target: 'aws-preseed', type: 'primary' },
  { source: 'projekt-koerperfluss', target: 'ffg-impact-innovation', type: 'primary' },
  { source: 'projekt-koerperfluss', target: 'land-noe-92k', type: 'primary' },
  { source: 'projekt-koerperfluss', target: 'wwtf-digitaler-humanismus', type: 'primary' },
  { source: 'projekt-koerperfluss', target: 'google-for-startups-cloud', type: 'primary' },
  { source: 'projekt-koerperfluss', target: 'aws-seedfinancing', type: 'primary' },
  { source: 'projekt-koerperfluss', target: 'kmu-digital', type: 'primary' },
  { source: 'projekt-koerperfluss', target: 'horizon-europe-eic', type: 'primary' },
  { source: 'projekt-koerperfluss', target: 'wko-tip-noe', type: 'primary' },
  { source: 'projekt-koerperfluss', target: 'aws-ai-adoption', type: 'primary' },

  // Dependencies
  { source: 'partner-physio-kette', target: 'projekt-koerperfluss', type: 'synergy' },
  { source: 'aws-preseed', target: 'aws-seedfinancing', type: 'prerequisite' },
  { source: 'task-gruendung', target: 'aws-preseed', type: 'prerequisite' },
  { source: 'partner-fh-linz', target: 'aws-preseed', type: 'relational' },
  { source: 'partner-fh-linz', target: 'ffg-impact-innovation', type: 'synergy' },
  { source: 'qubitec', target: 'ffg-kleinprojekt', type: 'synergy' },
  { source: 'qubitec', target: 'waw-innovation', type: 'synergy' },
  { source: 'ffg-kleinprojekt', target: 'ffg-marktstart', type: 'prerequisite' },
  { source: 'projekt-koerperfluss', target: 'eurostars', type: 'primary' },
];

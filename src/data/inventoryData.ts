export interface ToolAsset {
  id: string;
  name: string;
  path: string;
  techStack: string;
  maturity: string;
  functionality: string;
  type: string;
}

export const inventoryAssets: ToolAsset[] = [
  { id: '1', name: 'Körperfluss PILOT.AI', path: 'AI Studio', techStack: 'React 19, Express, D3', maturity: 'Funktioniert', type: 'Web-App', functionality: 'Förder-Cockpit: Funding-Graph + Gmail + KI-Advisor' },
  { id: '2', name: 'aktuell 3d upgrade (VOLLFUNKTION)', path: 'AI Studio', techStack: 'React-Three-Fiber, Firebase', maturity: 'Funktioniert', type: 'Web-App', functionality: 'Vollständige Plattform: Auth, E-Commerce, 3D' },
  { id: '3', name: 'Körperfluss OS', path: 'AI Studio', techStack: 'Angular, Firebase', maturity: 'Prototyp', type: 'Web-App', functionality: 'Internes Dashboard' },
  { id: '4', name: 'AI 3D-Druck Analyse Suite', path: 'AI Studio', techStack: 'Vite, React', maturity: 'Prototyp', type: 'Tool', functionality: 'Bambu/3D-Nische Tool' },
  { id: '5', name: 'Narben Reha-App', path: 'AI Studio', techStack: 'Angular 21, SSR', maturity: 'Funktioniert', type: 'Web-App', functionality: 'Klinik-Tool / Myofaszial' },
  { id: '6', name: 'Auto DTC Interpreter', path: 'AI Studio', techStack: 'Vite, React', maturity: 'Prototyp', type: 'Tool', functionality: 'KFZ-Codes Interpretation' },
  { id: '7', name: 'Bleicher Logistik Dispo-Tafel', path: 'AI Studio', techStack: 'Angular 21, SSR', maturity: 'Prototyp', type: 'B2B Software', functionality: 'Spedition Dispo-Tafel' },
  { id: '8', name: 'KI-Förder-Navigator Österreich', path: 'AI Studio', techStack: 'Vite, React', maturity: 'Funktioniert', type: 'Digitalprodukt', functionality: 'AT-Förder Navigator' },
  { id: '9', name: 'CannaMarkt Agent', path: 'AI Studio', techStack: 'Vite, React', maturity: 'Funktioniert', type: 'B2B Agent', functionality: 'Cannabis-Marketing / Compliance' },
  { id: '10', name: 'Prompt Alchemist 2026', path: 'AI Studio', techStack: 'React', maturity: 'Funktioniert', type: 'Tool', functionality: 'Prompt-Paket / Builder' },
  { id: '11', name: 'VintageScan AI', path: 'AI Studio', techStack: 'React', maturity: 'Funktioniert', type: 'Consumer App', functionality: 'Flohmarkt-Wert Analyse' },
  { id: '12', name: 'Vinyl-Katalogisierer', path: 'AI Studio', techStack: 'Android/React', maturity: 'Funktioniert', type: 'Consumer App', functionality: 'Plattensammlung Verwaltung' },
  { id: '13', name: 'M4 Finanzassistent (PWA OCR)', path: 'AI Studio', techStack: 'PWA, OCR', maturity: 'Funktioniert', type: 'Consumer App', functionality: 'ADHS-Finanz Hilfe' },
  { id: '14', name: 'VibeCode Assistant', path: 'AI Studio', techStack: 'Swift', maturity: 'Prototyp', type: 'Dev-Tool', functionality: 'iOS/macOS Coding Assistant' },
  { id: '15', name: 'Physiotherapie Optionsanalyse', path: 'AI Studio', techStack: 'React', maturity: 'Funktioniert', type: 'Tool', functionality: 'Karriere-Tool für Physios' },
  { id: '16', name: 'Bauplan Überlagerung Pro', path: 'AI Studio', techStack: 'AR/React', maturity: 'Funktioniert', type: 'AR Tool', functionality: 'AR-Bau Nische' },
  { id: '17', name: 'FFG Hearing Simulator', path: 'AI Studio', techStack: 'Angular', maturity: 'Funktioniert', type: 'Training Tool', functionality: 'AT-Förder-Prep' },
  { id: '18', name: 'Austrian Tax Advisor Assistant', path: 'AI Studio', techStack: 'Angular', maturity: 'Funktioniert', type: 'Tool', functionality: 'AT-Steuer-Tool' },
  { id: '19', name: 'andi - medical cannabis', path: 'AI Studio', techStack: 'React', maturity: 'Funktioniert', type: 'Lizenz', functionality: 'Befundungs-Tool' },
  { id: '20', name: 'Barbulls Manager & AI', path: 'AI Studio', techStack: 'React', maturity: 'Funktioniert', type: 'Vereins-SaaS', functionality: 'Vereins-Dashboard' },
  { id: '21', name: 'Atlas Cali Commercial V2', path: 'local', techStack: 'Vite, TS, Tailwind', maturity: 'Production', type: 'Web-App', functionality: 'B2B SaaS für Calisthenics' },
  { id: '22', name: 'Legal Ops Advisor', path: 'local', techStack: 'Python, FastAPI, PyWebView', maturity: 'MVP', type: 'Desktop App', functionality: 'Legal-Ops RAG System' },
  { id: '23', name: 'LOKI.OS Suite', path: 'local', techStack: 'Python, MLX, Angular', maturity: 'MVP', type: 'Agent OS', functionality: 'Komplexes Agenten-Betriebssystem' },
  { id: '24', name: 'Antigravity Cloud', path: 'local', techStack: 'Docker, Firebase, FastAPI', maturity: 'MVP', type: 'Cloud Service', functionality: 'Backend-Infrastruktur' },
];

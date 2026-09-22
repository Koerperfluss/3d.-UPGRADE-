export interface StudentCase {
  id: string;
  name: string;
  topic: string;
  status: 'vollständig' | 'red-flag' | 'in-bearbeitung';
  score: string;
  badge?: string;
  reasoningSteps: { step: string; content: string }[];
}

export const mockCases: StudentCase[] = [
  {
    id: '1',
    name: 'Anna Berger',
    topic: 'Schulter-Impingement',
    status: 'vollständig',
    score: '87%',
    reasoningSteps: [
      { step: 'Assessment-Check', content: 'Neer-Test und Hawkins-Kennedy korrekt appliziert.' },
      { step: 'Hypothesenbildung', content: 'Differentialdiagnostik Rotatorenmanschettenruptur ausgeschlossen.' },
      { step: 'Feedback', content: 'Sauberes Clinical Reasoning. Keine Lücken erkennbar.' }
    ]
  },
  {
    id: '2',
    name: 'Tom Fischer',
    topic: 'LWS-Syndrom',
    status: 'red-flag',
    score: '62%',
    badge: '⚠️ Red Flag: Neurologische Symptome nicht dokumentiert',
    reasoningSteps: [
      { step: 'NLU-Extraktion', content: 'Patient beschreibt Ausstrahlung bis ins Bein.' },
      { step: 'Wissens-Abgleich', content: 'Laut S3-Leitlinie zwingend Indikation für neurologisches Screening.' },
      { step: 'Kritik-Evaluierung', content: 'Prüfung von Sensibilität, Motorik und Reflexen fehlt komplett!' }
    ]
  },
  {
    id: '3',
    name: 'Sarah Klein',
    topic: 'Knie-Gonarthrose',
    status: 'in-bearbeitung',
    score: '–',
    reasoningSteps: [
      { step: 'Status', content: 'Patient befindet sich aktuell in der Anamnese-Phase.' },
      { step: 'Bisherige Daten', content: 'Gelenksteifigkeit am Morgen dokumentiert.' }
    ]
  }
];

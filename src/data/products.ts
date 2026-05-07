import { MembershipTier, PriceItem, PackageDeal } from '../types';

export const coreProduct: PriceItem = {
    id: 'handout-pdf',
    name: 'Personalisiertes Handout (PDF)',
    price: '99€',
    priceSuffix: 'einmalig',
    description: 'Eine umfassende, auf Ihren Angaben basierende Analyse mit konkreten Handlungsempfehlungen, Übungen und exklusiven Videolinks als PDF.',
    features: ['Detaillierte Analyse Ihrer Angaben', 'Individuelle Selbsttests & Übungen', 'Konkrete Handlungsempfehlungen', 'Red-Flag-Check für Ihre Sicherheit', 'Exklusive Videolinks zu den Übungen']
};

export const packageDeals: PackageDeal[] = [
    {
        id: 'perfect-start-package',
        name: 'Das „Perfekter Start“-Paket',
        price: '129€',
        originalPrice: '148€',
        priceSuffix: 'einmalig',
        description: 'Das personalisierte Handout (PDF) für den sofortigen Einblick plus 1 Monat des „Bewusstsein schaffen“-Abos, um direkt in die Umsetzung zu kommen.',
        features: ['Alle Inhalte des Personalisierten Handouts', '1 Monat voller Zugriff auf die Video-Bibliothek', '1 Monat Chat-Follow-up mit einem Experten']
    }
];

export const membershipTiers: MembershipTier[] = [
  {
    id: 'basis',
    name: 'Basis',
    price: '19€',
    priceDetails: '/ Monat',
    description: 'Der Einstieg, um kontinuierlich an Ihrer Gesundheit dranzubleiben und Fortschritte zu sichern.',
    features: [
        'Monatlicher Fortschritts-Report', 
        'Regelmäßige Übungs-Updates & Refreshs',
        'Grundlegender Community-Zugang'
    ],
    ctaText: 'Basis wählen',
    ctaVariant: 'secondary',
    discountInfo: { annualPrice: '190€', savings: '2 Monate geschenkt' }
  },
  {
    id: 'bewusstsein',
    name: 'Bewusstsein schaffen',
    price: '49€',
    priceDetails: '/ Monat',
    description: 'Für alle, die tiefer eintauchen und die Zusammenhänge in ihrem Körper verstehen wollen.',
    features: [
      'Alle Vorteile von Basis',
      'Voller Zugriff auf die Video-Bibliothek',
      '1x pro Monat Chat-Follow-up mit einem Experten',
      'Exklusive Lerninhalte & Workshops'
    ],
    isPopular: true,
    ctaText: 'Jetzt durchstarten',
    ctaVariant: 'primary',
    discountInfo: { annualPrice: '490€', savings: '2 Monate geschenkt' }
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '99€',
    priceDetails: '/ Monat',
    description: 'Das ultimative Paket für maximale Autonomie und professionelle Werkzeuge zur Selbst-Analyse.',
    features: [
      'Alle Vorteile von "Bewusstsein schaffen"',
      'Permanenter Zugang zum KI-Assistenten',
      'Zugriff auf professionelle Analyse-Tools',
      'Inkl. 1x 30 Min. Coaching-Call pro Monat'
    ],
    ctaText: 'Premium werden',
    ctaVariant: 'secondary',
    discountInfo: { annualPrice: '990€', savings: '2 Monate geschenkt' }
  },
];
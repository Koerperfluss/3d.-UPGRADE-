/**
 * Perfekte klinische Datensätze für die Live-Präsentation.
 * Ermöglicht eine fehlerfreie Demo ohne manuelle Eingabe.
 */
export const SHOWCASE_CASES = {
  LWS_ANAMNESE: {
    title: "Beispielfall: LWS-Stabilität",
    slots: {
      chief_complaint: "Stechender Schmerz untere LWS, ausstrahlend in den rechten Oberschenkel.",
      onset: "Vor 3 Wochen beim Heben einer Wasserkiste.",
      character: "Intermittierend, belastungsabhängig.",
      severity_vas: "7/10",
      aggravating_factors: "Längeres Stehen, Vorbeugen.",
      relieving_factors: "Stufenlagerung, Wärme.",
      prior_treatment: "Bisher nur Schmerzmittel (Ibuprofen)."
    },
    red_flags: false,
    reasoning_hint: "Muster deutet auf eine diskogene Beteiligung hin (L4/L5), keine neurologischen Ausfälle sichtbar."
  },
  GANGANALYSE_VALGUS: {
    image: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=1000", // Klinisches Beispiel
    findings: ["Genu Valgus bds.", "Eingeschränkte Dorsalextension links", "Beckenhochstand rechts"],
    steps: [
      { id: 1, title: "Mustererkennung", status: "done", confidence: 98 },
      { id: 2, title: "Achsen-Vektoren", status: "done", confidence: 92 },
      { id: 3, title: "S3-Abgleich", status: "done", confidence: 100, evidence: ["AWMF Leitlinie Knie-Instabilität"] }
    ]
  }
};

/**
 * Simuliert die Anbindung an Schul-Systeme (Moodle/Ilias).
 */
/**
 * Optimiertes Öffnen von Links für Safari Technology Preview (WebKit 22625+)
 * Nutzt die neuen Navigation-Standards für PWA/Standalone Modus.
 */
export const openOptimizedLink = (url: string) => {
  const isSafariTP = navigator.userAgent.includes('Safari') && navigator.userAgent.includes('Preview');
  
  if (isSafariTP && (window.navigator as any).standalone) {
    // Im Standalone-Modus von Safari TP versuchen wir die Hardware-Beschleunigung für den Übergang zu nutzen
    window.location.assign(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

export const simulateLmsExport = (moduleName: string): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`Exportiere Daten von ${moduleName} nach Moodle...`);
    // Simulierter Netzwerk-Delay
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
};

export const downloadAsPdf = () => {
  // Nutzt den Browser-Print Dialog, optimiert für Arbeitsblätter
  window.print();
};

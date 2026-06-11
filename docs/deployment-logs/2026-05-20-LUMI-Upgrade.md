# Körperfluss EDU 3D - Development Logbuch

Dieses Dokument protokolliert alle zentralen Architekturentscheidungen, UI-Anpassungen und Deployment-Schritte.

## [20.05.2026] - LUMI Intelligence & Visual Architectural Update

### 🧠 Architektur & Logik (aiService.ts / Assistant.tsx)
- **LUMI Identität:** Der alte Calisthenics-Chatbot wurde in der gesamten App (`App.tsx`) vollständig durch den akademischen "LUMI Assistant" (`Assistant.tsx`) ersetzt.
- **Sokratischer Mentor:** LUMI ist nun strikt darauf programmiert, keine direkten Antworten zu geben, sondern Clinical Reasoning (Ursache → Pathomechanismus → Symptom) zu erzwingen.
- **Location-Awareness (Kontext-Sensitivität):**
    - Pfad `/moodle-simulation`: LUMI fungiert als technischer LTI-Experte.
    - Pfad `/anamnese-trainer`: LUMI agiert im strengen sokratischen Modus.
    - Pfad `/labor` / `/vision`: LUMI unterstützt bei biomechanischen Kennzahlen.
    - Pfad `/dashboard`: Allgemeine akademische Assistenz.

### 🎨 UI & UX & 3D-Visuals
- **3D-Hintergrund Upgrade:**
    - **Dual-Model Setup:** Es werden nun zwei anatomische Figuren gerendert, die symmetrisch hinter den Bereichen "CAMPUS" und "FAKULTÄT" platziert sind.
    - **Orientierungs-Fix:** Die Figuren wurden um 180 Grad gedreht und zeigen nun ihre Vorderseite zum Betrachter.
- **Logo Überlagerungs-Fix:** 
    - Umstellung der Ladepriorität auf `logo2.svg`. Dies verhindert das doppelte Rendern von Text-Logos über den HTML-Überschriften und sorgt für ein sauberes, ikonisches Branding.
- **Fenster-Management:** Das Assistant-Fenster hat nun einen Schließen-Button (X) und ist "ablegbar" (minimierbar).
- **Responsive Design:** Optimierung für Mobilgeräte (iPhone/iPad); Fenster nimmt nicht mehr den gesamten Viewport ein und bleibt bedienbar.
- **Kontrast-Fix (Final):** Explizite Zuweisung von `text-slate-900` für Bot-Bubbles, um absolute Lesbarkeit auf weißem Grund zu garantieren (unabhängig von CSS-Variablen).

### 🚀 Deployment & Infrastruktur
- **Live-Status:** Die Webseite ist vollständig live geschaltet und synchronisiert.
- **URL:** [https://koerperfluss-edu-3d-709873485696.europe-west3.run.app](https://koerperfluss-edu-3d-709873485696.europe-west3.run.app)
- **GCP Billing & Auth:** Stabilisiert via Quota-Project Setzung und CLI-Key Generierung.
- **Firebase Auth:** Alle produktiven Cloud Run Domains sind autorisiert.

---
*Abschluss-Dokumentation von Gemini CLI am 20.05.2026.*

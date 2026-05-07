# 1. WO IST MEINE WEBSITE? (Lokalisierung & Entry Points)

**Exakter lokaler Pfad zum Hauptordner:**
`/Users/saschalagler/Desktop/(0) Körperfluss- Website Local`

**Entry Points (Dateipfade):**
- `/index.html` (HTML-Einstiegspunkt)
- `/index.tsx` (React-Einstiegspunkt, lädt App.tsx)
- `/src/App.tsx` (Haupt-Routing und State-Management)

**Startbefehl der App:**
`npm run dev` (Führt `vite` aus, definiert in `package.json` unter `scripts.dev`).

---

# 2. DIE KOMPROMISSLOSE INVENTUR (Was existiert WIRKLICH?)

| Tool / Feature | Dateipfad | UI/Frontend existiert? | Backend/KI-Logik verknüpft? | Wurde es getestet? |
| :--- | :--- | :--- | :--- | :--- |
| **Chatbot** | `/src/components/Chatbot.tsx` | Ja | Nein (Kein API-Call in der Datei) | Nein |
| **Media Analyzer** | `/src/components/MediaAnalyzer.tsx` | Ja | Ja (GoogleGenAI) | Nein |
| **WirkungskettenAnalyser** | `/src/components/WirkungskettenAnalyser.tsx` | Ja | Ja (GoogleGenAI) | Nein |
| **LUMI Assistant** | `/src/components/Assistant.tsx` | Ja | Ja (GoogleGenAI) | Nein |
| **Audio Transcriber** | `/src/components/AudioTranscriber.tsx` | Ja | Ja (GoogleGenAI) | Nein |
| **Creative Lab** | `/src/components/CreativeLab.tsx` | Ja | Ja (GoogleGenAI) | Nein |
| **Health Analysis** | `/src/components/HealthAnalysis.tsx` | Ja | Ja (GoogleGenAI) | Nein |
| **Vision Agent** | `/src/pages/VisionAgentPage.tsx` | Ja | Ja (GoogleGenAI) | Nein |
| **Case Training** | `/src/pages/CaseTrainingPage.tsx` | Ja | Ja (GoogleGenAI) | Nein |
| **Exam Simulation** | `/src/pages/ExamSimulationPage.tsx` | Ja | Ja (GoogleGenAI) | Nein |
| **Quiz** | `/src/pages/QuizPage.tsx` | Ja | Ja (GoogleGenAI) | Nein |

---

# 3. PIPELINE & FUNKTIONS-CHECK (Ist es umgesetzt?)

**Datenfluss Chatbot:**
Daten fließen in den lokalen Browser-Speicher (SessionStorage), aber **nicht** in ein echtes Backend/Datenbank.
Beweis in `/src/App.tsx` (Zeile 116-117):
```typescript
sessionStorage.setItem('chatbotCompleted', 'true');
sessionStorage.setItem('chatbotData', JSON.stringify(variables));
```

**RAG & GenAI (Google Gemini API Calls):**
Folgende Dateien funken tatsächlich an die Gemini API (Import & Nutzung von `@google/genai`):
- `/src/components/MediaAnalyzer.tsx`
- `/src/components/WirkungskettenAnalyser.tsx`
- `/src/components/Assistant.tsx` (LUMI)
- `/src/components/AudioTranscriber.tsx`
- `/src/components/CreativeLab.tsx`
- `/src/components/HealthAnalysis.tsx`
- `/src/components/AIToolsModal.tsx`
- `/src/pages/VisionAgentPage.tsx`
- `/src/pages/CaseTrainingPage.tsx`
- `/src/pages/ExamSimulationPage.tsx`
- `/src/pages/QuizPage.tsx`

**A4-Druck-Layout:**
**Nein.** Es gibt im gesamten Codebase keinen CSS/Tailwind-Code für Druckansichten (kein `@media print` und keine `print:` Utility-Klassen).

---

# 4. TEST-STATUS (Was ist geprüft?)

**Unit-Tests / E2E-Tests:**
**Nein.** Es existieren keine Test-Dateien (`.test.tsx`, `.spec.tsx`), keine Test-Frameworks (Vitest, Jest, Puppeteer, Cypress) in der `package.json` und keine Test-Skripte.

**MDR-Kill-Switch (Brustschmerzen = Abbruch):**
**Nein.** Der Begriff "Brustschmerzen", "Notfall" oder "Red Flag" existiert im Code des Chatbots (`/src/components/Chatbot.tsx`) nicht. Es gibt keine programmierte Logik für einen sofortigen Abbruch bei kritischen Symptomen. Wurde demnach auch nicht getestet.

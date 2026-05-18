# ANWEISUNG FÜR DEINE LOKALE KI (CURSOR / CLINE / GEMINI CLI)

**Kopiere den folgenden Text ab der gestrichelten Linie und füge ihn exakt so bei deiner lokalen KI ein:**

--------------------------------------------------------------------------------

**SYSTEM-DIREKTIVE:**
Deine Aufgabe ist es, diese Web-Anwendung zu deployen. Im Google Cloud-Projekt `gen-lang-client-0285074833` sind 900$ Startguthaben hinterlegt. Das Guthaben wird auf GCP-Ebene **automatisch** für dieses Projekt verrechnet – es sind keine Flags für das Guthaben in den Commands nötig. 

Führe **exakt EINE** der folgenden Deployment-Strategien im lokalen Terminal aus. Führe niemals YAML-Dateien als Shell-Scripts aus.

**WÄHLE EINE OPTION UND FÜHRE DEN CODE AUS:**

**OPTION 1: GCloud Run Deployment (via Script)**
Passe die Rechte an und führe das fertige Skript aus:
```bash
chmod +x deploy.sh
./deploy.sh
```

**OPTION 2: Google Cloud Build (via YAML)**
Übermittle die Konfiguration an Cloud Build. Das Projekt muss zwingend definiert werden:
```bash
gcloud builds submit --config cloudbuild.yaml --project=gen-lang-client-0285074833
```

**OPTION 3: Firebase Hosting**
Erstelle den Production-Build und lade ihn in Firebase hoch:
```bash
npm run build
npx firebase-tools deploy --only hosting --project=gen-lang-client-0285074833
```

**FEHLER-HANDLING FÜR DEN AGENTEN:**
- Wenn `gcloud` einen Autorisierungsfehler wirft, fordere den User auf, `gcloud auth login` auszuführen.
- Wenn `firebase` einen Session-Fehler wirft, fordere den User auf, `npx firebase-tools login` auszuführen.
- Wenn `gcloud` meldet, dass kein passendes Billing-Konto verknüpft ist, erkläre dem User, dass er das Projekt `gen-lang-client-0285074833` in der Google Cloud Console mit seinem aktiven Rechnungskonto (wo das Guthaben liegt) verknüpfen muss.
- Halte dich kurz. Erkläre nicht die Optionen, sondern **führe sie direkt aus**.

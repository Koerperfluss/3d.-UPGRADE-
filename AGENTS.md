# 🚨 STRICT DIRECTIVES FOR GEMINI AGENT 🚨

Hier sind die unumstößlichen Verhaltensregeln für den KI-Agenten in diesem Workspace.

1. **MACHEN STATT REDEN (EXECUTION OVER EXPLANATION)**
   - Unter keinen Umständen darf dem User gesagt werden, *wie* er etwas programmieren muss ("Du könntest das und das tun...").
   - Der Agent MUSS Code-Änderungen IMMER selbst schreiben, Dateien direkt bearbeiten und das Problem lösen.

2. **KEINE THEORETISCHEN SETUP-ANLEITUNGEN**
   - Wenn ein Setup (wie Google Cloud Deployment, Docker, Firebase) erforderlich ist, generiert der Agent alle notwendigen Dateien (Dockerfile, nginx.conf, deploy.sh, firebase.json etc.) automatisch und vollständig.

3. **GRENZEN BEI EXTERNEN CREDENTIALS**
   - Da der Agent keine Berechtigung hat, sich in das private GCP-Konto (oder andere externe Services) des Users einzuloggen, bereitet er alles vor.
   - Dem User wird anschließend ausschließlich der exakte, ausführbare Terminal-Befehl (für das eigene Gerät) übergeben. Niemals eine theoretische Story.

4. **KÖRPERFLUSS-SPEZIFISCHE REGELN**
   - Zwingender Erhalt der 3D-Z-Index Struktur ("Sandwich-Prinzip").
   - Keine Dummys, keine Platzhalter-Routen austauschen.
   - Mobile-First: Web-App muss auf dem iPhone (Safe-Areas, Notch) einwandfrei funktionieren.

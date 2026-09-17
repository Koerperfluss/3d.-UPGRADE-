# 🗺️ WAYFINDER MAP: Körperfluss 3D Edu Upgrade & Tool-Matrix

## Destination
Vollständig deployte und verifizierte Web-App auf `koerperfluss.at` mit integrierten 12 Inhouse-Aufgaben, abgeschlossenem Security-Audit (Strix) und dokumentierter LTI 1.3/MDR-Compliance.

## Notes
* **Verzeichnisse:** `/Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade`
* **Skills:** `/strix-pentesting`, `/context7-mcp`, `/jules-meta-agent`, `/lokiomnidevteam-plan`
* **Priorität:** Zuerst Track 1 (Infrastruktur) abschließen, parallel Track 2 (Inhouse-Refactoring) verifizieren.

---

## 📊 EFFEKTIVITÄTS- & AUFWANDSMATRIX (ALL TOOLS)

| Tool / Skill | Relevanz für Projekt | Aufwand (Schätzung) | Zweck / Nutzen |
|---|---|---|---|
| **`/wayfinder`** | 🔴 **Kritisch** (Steuert die Roadmap) | Gering (0.5h Setup) | Strukturierte Verfolgung offener Entscheidungen |
| **`/grill-me`** | 🟡 **Hoch** (Konzeptschärfung) | Gering (0.2h/Session) | Klärung von Business- und MDR-Grenzen im Dialog |
| **`/strix-pentesting`** | 🟡 **Hoch** (Sicherheits-Audit) | Mittel (1.5h Scripting) | Pentesting der Firebase-Endpoints & Auth |
| **`/context7-mcp`** | 🔴 **Kritisch** (Dokumentation) | Gering (Integriert) | Schneller Abruf aktueller React/Vite/Three.js-APIs |
| **`/jules-meta-agent`**| 🟡 **Hoch** (Automatische Edits) | Gering (Hintergrund) | Große, dateiübergreifende Refactorings auf dem Mac |
| **`/lokiomnidevteam`** | 🔴 **Kritisch** (Orchestrierung) | Gering (Integriert) | Koordination von Coder, Tester & Sysprog |
| **`/graphify`** | 🟢 **Mittel** (Visualisierung) | Mittel (1.0h Graphing) | Abbildung der Wissensdatenbank-Verbindungen |
| **`/caveman`** | 🟢 **Mittel** (Output-Stil) | Keine (Konfiguration) | Ultra-kurze, technische Antworten bei schnellen Fixes |

---

## 🎫 DECISION-TICKETS (DIE ROADMAP)

### [T-1] DNS & Domain-Integration [HITL]
* **Typ:** `wayfinder:research`
* **Frage:** Wie lauten die exakten Nameserver- und DNS-TXT-Einträge für `koerperfluss.at` zur Firebase-Verbindung?
* **Aufwand:** 0.5h
* **Blocker:** Wartet auf deine Angabe des Domain-Registrars.

### [T-2] DigiArk Showcase Page Integration [AFK]
* **Typ:** `wayfinder:task`
* **Frage:** Sind alle 5 Module (LUMI, VisionAgent, Anamnese, Handout-Builder, Exam-Grader) funktional in `/showcase` verlinkt?
* **Aufwand:** 1.0h
* **Blocker:** Keine.

### [T-3] Strix Security Audit & Pentesting [AFK]
* **Typ:** `wayfinder:research`
* **Frage:** Weisen die Firebase Auth-Rules oder die API-Endpoints Sicherheitslücken auf?
* **Aufwand:** 1.5h
* **Blocker:** [T-1] (Muss auf der finalen Domain laufen).

### [T-4] MDR Boundary Assessment [HITL]
* **Typ:** `wayfinder:grilling`
* **Frage:** Reicht der aktuelle "Education-Only" Disclaimer in den Impressums- und DSGVO-Seiten aus, um die MDR-Zertifizierungspflicht sicher auszuschließen?
* **Aufwand:** 0.5h
* **Blocker:** Keine.

---

## 🔮 NOT YET SPECIFIED (FOG OF WAR)
* **LTI 1.3 Anbindung:** Spezifikation der OAuth2-Schnittstelle zur Anbindung an Universitäts-LMS (Moodle/Canvas).
* **xLSTM-Modell-Hosting:** Hosting-Strategie auf Google Cloud Run oder lokalem M4 MLX-Inferenz-Server.

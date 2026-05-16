# Körperfluss Intelligence Suite - Edu-Konzept

## 18-Tool Mapping im Physio-Ausbildungsalltag (Phase 1)

Basierend auf der System-Definition wurden 18 KI-gestützte Tools identifiziert und in pädagogische Workflows strukturiert.

### 1. Adaptive Intake (Anamnese)
*   **1. Diagnostik-Bot:** Führt sokratische Dialoge mit Studenten zur Erhebung der Patienten-Anamnese.
*   **2. Red-Flag-System:** Analysiert Anamnese-Eingaben im Hintergrund auf absolute Kontraindikationen und warnt den Studenten.

### 2. Reasoning Hub (Pathomechanik)
*   **3. Wirkungsketten-Analyser (Deep Reasoning):** Verknüpft isolierte Symptome mit zugrundeliegender Anatomie und Biomechanik (Ursache-Wirkung).
*   **4. Mindmap-Generator:** Visualisiert das Clinical Reasoning als interaktiven Graphen.

### 3. Evidence Layer (Validierung)
*   **5. Literatur-RAG (Semantische Suche):** Gleicht die studentischen Therapieansätze mit integrierten S3-Leitlinien ab.
*   **6. Compliance-Filter (MDR-Modus):** Blockiert Heilversprechen und bindet die Ausgabe an studentische Befugnisse.

### 4. Skills Lab (Praxis & Biomechanik)
*   **7. Vision Agent (Haltung):** Analysiert statische Bilder auf posturale Abweichungen.
*   **8. Vision Agent (Gait Mode):** Analysiert dynamische Video-Ganganalysen (Initial Contact, Swing Phase).
*   **9. Media Analyzer (Skill-Check):** Bewertet die manuellen Grifftechniken (Handplatzierung, Vektor) des Studenten per Video.

### 5. Simulation & Training (Prüfungsvorbereitung)
*   **10. Case Training (Fallgenerator):** Erstellt in Sekunden komplexe, BPS-konforme Patientenfälle nach Schwierigkeitsgrad.
*   **11. Patient-Video-Generator (Veo):** Erzeugt aus dem generierten Fall ein passendes "Patienten-Video" zur Inspektion.
*   **12. Sokratischer Tutor (Chat):** Diskutiert den Fall mit dem Studenten, anstatt Lösungen vorzugeben.

### 6. Assessment Center (Prüfung & Evaluation)
*   **13. Exam Simulator (Freitext):** KI-Korrektur von komplexen Fallberichten und Reflexionen anhand von Rubrics.
*   **14. Quiz Engine:** Formative Tests zur Wissensüberprüfung.
*   **15. Learning Path Recommender (CoT):** Analysiert Fehler aus Quiz/Exam und empfiehlt vertiefende Module.

### 7. Operational & Administration (Dozenten-Ebene)
*   **16. Query Analytics Dashboard:** Aggregiert häufige Fehlkonzepte der Klasse zur Anpassung des Unterrichts.
*   **17. Chatbot-Config (LUMI):** Dozenten-Interface zur Steuerung der "Reasoning-Tiefe" und des KI-Charakters ("Supportiv" vs "Prüfer").
*   **18. LMS-Export (Moodle/PDF):** Überführung der digitalen KI-Auswertungen in offizielle Schul-Protokolle.

---

## Tool Interdependencies (Datenfluss)

1.  **Skills Lab -> Diagnostik-Bot:** Das Video-Feedback aus dem *Media Analyzer* (z.B. Schulter-Asymmetrie) dient als "visueller Befund" für den *Diagnostik-Bot*, der daraufhin gezielte Anamnese-Fragen (z.B. "Wie ist der Schmerz bei Elevation?") antizipiert.
2.  **Diagnostik-Bot -> Wirkungsketten-Analyser:** Die extrahierten Anamnese-Ergebnisse (ICF-Report) fließen direkt in den *Reasoning Hub*, der daraus die biomechanische Kausalität berechnet.
3.  **Assessment Center -> Educator Dashboard:** Die aggregierten Fehler-Analysen (CoT) der Studenten im *Exam Simulator* erzeugen Alerts für den Dozenten im *Query Analytics Dashboard*.

*Status: Konzept finalisiert. Bereit für die technische Härtung in reale Demo-Pfade.*

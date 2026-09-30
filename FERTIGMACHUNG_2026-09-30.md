# FERTIGMACHUNG — Körperfluss Edu Website (30.09.2026)

**Ergebnis:** Build grün (Exit 0), Slicing-Käfig-3D-Fix committed, UI/UX-Userflow chirurgisch überarbeitet (Navbar, HomePage-CTAs, LMS-Sidebar, WCAG-Fokus/Motion), GLB nicht im Initial-Bundle, Preview HTTP 200. **Nicht deployed** — Deploy wartet auf GO von Sascha.

---

## 1. IST-Stand vor den Änderungen

| Punkt | Befund (verifiziert) |
|---|---|
| Build | `npm run build` (tsc + vite build) bereits grün, Exit 0, 2839 Module, 21,83 s |
| Slicing-Käfig-Fix (Vorgänger-Agent) | In **beiden** Background3D-Dateien (`src/Background3D.tsx`, `src/components/Background3D.tsx`) ist der GLB-Load deaktiviert: `useGLTF` aus dem Import entfernt, `<AnatomicalModel>` nicht mehr in der Szene gerendert, `useGLTF.preload('/koerperfluss_model.glb')` auskommentiert |
| Uncommittete Änderungen | 7 Dateien: App.tsx (Error-Boundary mit „App-Daten zurücksetzen"-Selbstheilung), Background3D.tsx, CartContext.tsx + spacedRepetitionService.ts (localStorage try/catch gegen korrupte Daten), theme-gold-torus.tsx (Geometry-Dispose), tsconfig.json (Finder-Duplikate aus Compile excluded) |
| Routen | 41 Routen in `src/App.tsx` (inkl. 8 Redirects `/pricing→/angebote`, `/anamnese→/anamnese-trainer` usw.) |
| Impressum/Datenschutz | Existieren BEIDE mit Inhalt: Impressum = „Körperfluss Technologies FlexCo (i.G.), Sebastianistraße 15, 3382 Loosdorf", vertreten durch Sascha Lagler + Peter Fischer; Datenschutz = Standard-Datenschutzerklärung. → **Keine Platzhalter nötig**, aber Inhalt von Sascha gegenprüfen (siehe offen) |
| Userflow-Lücken | CAMPUS-Hero führte zu `/login` statt in den Trainer; Hero-Flächen + Bento-Karten waren nur per Maus bedienbar (kein `role`/`tabIndex`); LMS-Sidebar hatte keinen „Zur Startseite"-Rückweg; `/moodle-simulation` in LMS-Sidebar nicht verlinkt; Navbar-Icon-Buttons ohne `aria-label` |

## 2. Änderungen (Datei → was/warum)

| Datei:Zeile | Änderung | Warum |
|---|---|---|
| `src/index.css:143-147` | `:focus-visible`-Regel (goldener 2px-Outline, offset 3px) ergänzt | WCAG 2.4.7 — sichtbarer Tastatur-Fokus war nicht definiert |
| `src/components/Navbar.tsx:75-78` | Öffentlicher Desktop-Menü-Punkt **„Campus" → `/anamnese-trainer`** nach „Showcase" | KERN-Route Studierende direkt aus der Navbar erreichbar (Struktur otherwise unverändert) |
| `src/components/Navbar.tsx:210` | Mobile-Menü: gleicher „Campus"-Punkt | Konsistenz Desktop/Mobile; Menü schloss nach Klick bereits korrekt |
| `src/components/Navbar.tsx:139,145` | `aria-label="Seite teilen"` + `aria-label="Warenkorb öffnen, n Artikel"` | Icon-Buttons ohne Text waren für Screenreader unbenannt |
| `src/components/Navbar.tsx:180-181` | Mobile Cart `aria-label` + Burger `aria-label`/`aria-expanded` | dito + Menü-Zustand für Assistive Tech |
| `src/pages/HomePage.tsx:15-22` | Helper `activateWithKeyboard(target)` (Enter/Leertaste → navigate) | WCAG 2.1.1 — klickbare div-Flächen tastaturbedienbar machen |
| `src/pages/HomePage.tsx:79-84` | **CAMPUS-Hero: Ziel `/login` → `/anamnese-trainer`** + `role="link"` + `tabIndex={0}` + `aria-label` + `onKeyDown` | Auftrags-Userflow „Campus → /anamnese-trainer"; Dozenten-Login bleibt über Login-Seite (Tab „Bildungspartner & Dozenten") + FAKULTÄT-Fläche erreichbar |
| `src/pages/HomePage.tsx:104-109` | FAKULTÄT-Hero: `role="link"` + `tabIndex={0}` + `aria-label` + `onKeyDown` (Ziel bleibt `/dozenten-login`) | Tastatur-Bedienbarkeit |
| `src/pages/HomePage.tsx:137-183` | Alle 3 Bento-Karten (Showcase / Anamnese-Trainer / Moodle-Simulation): `role="link"` + `tabIndex={0}` + `aria-label` + `onKeyDown` | KERN-CTAs waren Maus-only |
| `src/components/SidebarLayout.tsx:13-14` | Icons `Home`, `School` importiert (lucide-react) | Für neue Sidebar-Einträge |
| `src/components/SidebarLayout.tsx:43` | Sidebar-Eintrag **„Moodle-Simulation" → `/moodle-simulation`** | KERN-Route in LMS-Navigation sichtbar |
| `src/components/SidebarLayout.tsx:64-73` | **„Zur Startseite"-Link** am Kopf der LMS-Sidebar | Rückweg aus dem LMS zur öffentlichen Seite fehlte komplett |
| `src/components/SidebarLayout.tsx:80` | `aria-current="page"` auf aktive Sidebar-Links | Aktiver Zustand auch für Screenreader |
| `src/components/Background3D.tsx:225-253` | `prefers-reduced-motion`-Check: bei „Bewegung reduzieren" statisches Grid statt animierter Canvas (Partikel/Ring-Rotation pausiert), inkl. Live-`change`-Listener | WCAG 2.3.3 — 3D-Bewegung auf Nutzer-Wunsch abschalten |

**Bereits im Fix-Stand des Vorgängers enthalten (nicht von mir, mit committed):** App.tsx Error-Boundary-Selbstheilung, CartContext/spacedRepetitionService localStorage-Härtung, theme-gold-torus Geometry-Dispose, tsconfig Duplikat-Exclude.

**Nicht geändert (bewusst):** Framework, Routen-Struktur, Footer, Rechtstexte, alle „ 2"-Duplikate, `src/Background3D.tsx` (totes Duplikat, bleibt wie es ist).

## 3. Verifikations-Beweise

| Prüfung | Befehl | Ergebnis |
|---|---|---|
| Build NACH Änderungen | `npm run build` | **Exit 0**, `✓ built in 3.35s`, 2839 Module transformed |
| Preview | `npx vite preview --port 4173` + `curl -s -o /dev/null -w "%{http_code}"` | `HTTP-Status: 200` auf `/` und `/anamnese-trainer`; Titel `Körperfluss | Adaptive Intelligence für Physiotherapie & Gesundheitsausbildung` |
| GLB nicht im Initial-Bundle | `grep -c "koerperfluss_model" dist/assets/*.js` | **0 Treffer** in `index-*.js`, `Background3D-*.js`, `vendor-three-*.js` (grep Exit 1 = keine Treffer). Die 2,4-MB-Datei liegt nur als ungenutzte public-Kopie: `dist/koerperfluss_model.glb` (2.477.408 Bytes) |
| 3D lazy loading | Build-Output | `dist/assets/Background3D-WTh1XKwx.js 5.00 kB` eigener Async-Chunk; three.js in separatem `vendor-three`-Chunk (825,91 kB), erst nach Bedarf geladen |
| Loading-State 3D-Szene | Code-Befund (vorhanden, nicht neu gebaut) | 3 Ebenen: `React.lazy` + Suspense (Chunk-Load, Splash läuft davor), Suspense-Fallback in der Szene (goldene Wireframe-Sphere beim HDR-CDN-Load), `CanvasGuard` (3D-Crash wirft nicht die App ab) |
| Screenshots | Headless-Chrome (`--headless --screenshot`), Chrome war systemweit vorhanden, nichts installiert | `/tmp/kf_home_desktop.png`, `/tmp/kf_home_mobile.png`, `/tmp/kf_hero_desktop.png` — zeigen korrekt gerenderten **IntroSplashScreen** (Logo + „Überspringen"). Hero hinter dem Splash ist im Headless-Modus nicht sichtbar, weil `--virtual-time-budget` die Framer-Motion-Timer des Splash einfriert — Headless-Artefakt, im echten Browser läuft der Splash (skip-Flag `kf_splash_seen` in sessionStorage). **Einschränkung ehrlich dokumentiert.** |
| AnatomicalModel-Check | `grep -n "AnatomicalModel\|useGLTF" src/components/Background3D.tsx` | Zeile 13 Definition (Stub), Zeile 17 auskommentierter Load, Zeile 273 auskommentiertes preload → Loader in beiden Dateien deaktiviert |

## 4. Duplikat-/Doppelstruktur-Befund (NUR dokumentiert — nichts gelöscht/verschoben)

| Befund | Zahl | Details |
|---|---|---|
| „ 2"-Finder-Duplikate in `src/` | 23 | z. B. `src/pages/ImpressumPage 2.tsx`, `src/components/Background3D 2.tsx`, `src/index 2.css` |
| „ 2"-Finder-Duplikate in `public/` | 3 | `logo 2.jpeg`, `logo-1 2.jpeg`, `logo-main 2.png` |
| „ 2"-Duplikate gesamt im Repo | deutlich mehr als die im Auftrag genannten ~123 | `find . -name "* 2.*"` (ohne node_modules/.git) = 8543 Treffer, weil auch Unterordner (`.agents/`, `functions/lib/`, Unterprojekte) betroffen sind |
| Background3D-Varianten | 3 | 1. `src/components/Background3D.tsx` = **aktiv** (importiert in App.tsx, ge-fixed). 2. `src/Background3D.tsx` = **totes Duplikat** — wird nirgends importiert (grep Exit 1), untracked, identischer Fix-Stand. 3. `src/components/Background3D 2.tsx` = Finder-Duplikat |
| Antrags-Kernzahlen (laut FFG-SSOT, unverändert gültig) | — | 130.800 € Gesamtkosten · 58.860 € Förderung (45 %) · 2.180 h (Lagler 900 / Fischer 1.120 / Karnen 160) · TRL 3→7 · Laufzeit 01.10.2026–30.09.2027 · FH St. Pölten, Moodle LTI 1.3 |

## 5. Offene Punkte

1. **Deploy-GO fehlt:** Bewusst NICHT deployed (HARD-REGEL). Live-Stand koerperfluss.web.app ist älter als dieser Commit. Anleitung unten.
2. **Rechtstexte gegenprüfen (Sascha):** Impressum nennt FlexCo (i.G.), Loosdorf, Lagler/Fischer; Datenschutz ist ein generischer Standardtext. Inhalt ist da, aber Sachverhalt (Firmenstatus, UID, Hosting-Auftragsverarbeitung Firebase/Google) sollte Sascha bestätigen — ich habe NICHTS erfunden.
3. **Duplikat-Aufräumen:** 23+3+ Duplikate und `src/Background3D.tsx` (tot) warten auf GO — Löschen/Schieben war HARD-VERBOTEN.
4. **Chunk-Größen:** `index` 964 kB + `vendor-three` 826 kB → Vite-Warnung bleibt. Kein Refactor im Rahmen dieses Tickets (Framework-Wechsel/Code-Splitting-Umbau = eigene Entscheidung).
5. **Screenshot-Grenze:** Hero-Ansicht nur via echtem Browser verifizierbar (Headless-Virtual-Time-Freeze des Splash).

## 6. Deploy-Anleitung (wenn Sascha GO gibt)

```bash
cd "/Users/saschalagler/Desktop/Coworkspace_Ich/Körperfluss EDU/Koerperfluss-3D-Upgrade"
npm run build
firebase deploy --only hosting
# Projekt: gen-lang-client-0285074833 · Live: https://koerperfluss.web.app
```

## 7. Review-Fixes (30.09.2026, nach Code-Review „PASS MIT HINWEISEN")

| Finding | Fix | Beweis |
|---|---|---|
| P1: `src/components/HealthAnalysis.tsx` — `dangerouslySetInnerHTML` mit LLM-Output (`analysis`) ohne Sanitizing → Prompt-Injection konnte Script-HTML einschleusen | Vorhandene Dependency `dompurify` (^3.4.14, bereits an 6 anderen Stellen im Muster `DOMPurify.sanitize(...)` im Einsatz) wiederverwendet: Replace-Kette in `DOMPurify.sanitize(...)` gewrappt, KEINE neue Dependency | Build Exit 0 |
| P2: `src/components/Background3D.tsx` — `removeEventListener` auf neuem `matchMedia()`-Objekt → Cleanup wirkungslos | `MediaQueryList` einmal als `mql` gecacht, add/remove auf derselben Referenz | Build Exit 0 |
| P2: `src/components/SidebarLayout.tsx` — `SidebarContent` im Render-Body definiert → Remount + Fokusverlust je Render | An Modul-Scope gezogen mit expliziten Props (`user/lecturer/onLogout/isCotMode/setCotMode/onCloseMobileMenu/onOpenShare`), eigenes `useLocation()` | Build Exit 0; Preview HTTP 200 auf `/` und `/dashboard` |

Commit: siehe `git log` — „REVIEW-FIXES: P1 XSS-Sanitizing (HealthAnalysis) + P2 matchMedia-Cleanup + P2 SidebarContent-Remount (30.09.2026)".

---

*Erstellt 30.09.2026 durch Builder-Subagent (ZCode/GLM). Alle Befehle und Exit-Codes in Abschnitt 3 sind echte Ausführungen, keine Behauptungen.*


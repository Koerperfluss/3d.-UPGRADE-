# WIKI — Körperfluss 3D Web-App
> Stand: 2026-09-06 · Auto-generiert aus Discovery · Git: main @ f720160 (sync mit origin)

## Ziel
Physio-Web-App mit 3D-Human (Three.js), KI-Chatbot, Health-Analyse, Clinical-Context — Firmenprojekt Körperfluss.

## Pfad (KORRIGIERT — nicht ~/Desktop/Koerperfluss-3D-Upgrade!)
**`~/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade`**
Remote: `github.com/Koerperfluss/3d.-UPGRADE-.git`

## Stack
React · TypeScript · Vite · **Three.js / React Three Fiber / Drei** (3D-Human) · Tailwind v4 · **Firebase** (Hosting + Cloud Functions v2 + Firestore) · `@google/genai` · framer-motion

## Architektur & Module
- `src/components/` (~30): **Background3D**, Chatbot, CreativeLab, HealthAnalysis, ErrorBoundary, ProtectedRoute …
- `src/pages/` — 36 Seiten
- `src/context/` — App, Auth, Cart, **Clinical**
- `src/services/` — aiService, **safetyGuard**, spacedRepetitionService
- Backend: `functions/src/index.ts` (**Gemini-Proxy**, onCall + admin), `firestore.rules`
- Deploy-Skripte: `deploy.sh` (Cloud Run `koerperfluss-edu-3d`, europe-west3), Dockerfile, cloudbuild.yaml, nginx.conf

## Einstiegspunkte
`index.tsx` → `src/App.tsx` (215 Zeilen, ~30 Routen)

## Befehle & Deploy
`npm run dev|build|lint` — **kein Test-Script!** (E2E als F14/F15 geplant, nicht umgesetzt)
Deploy-Regel: **IMMER `--project gen-lang-client-0285074833`** (`.firebaserc` default stimmt) · Hosting-Site `koerperfluss` · Logs: `docs/deployment-logs/`

## Bekannte Lücken
- 🔴 Keine Tests im Root (nur die alte Kopie „(0) Körperfluss- Website Local" hat vitest)
- Kein vercel.json — Firebase ist der Deploy-Weg

## Quellen-Index
Discovery 06.09. (ZCode Explore): package.json, .firebaserc, deploy.sh, PROJECT.md (15 Features / 5 Milestones)

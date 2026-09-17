# Project: Körperfluss 3D Edu Web Application Overhaul

## Architecture
The application is a high-performance React 19 + TypeScript + Vite web platform integrating Three.js WebGL rendering, Tailwind CSS (v4), Firebase Cloud Functions backend proxy, and Firebase Firestore authentication/storage.

```
Client (React / Vite) 
  ├── PublicLayout / DashboardLayout
  ├── 3D Canvas Layer (Three.js / React Three Fiber / Drei)
  ├── Route Components (App.tsx: 30+ interactive routes)
  ├── UI / Theme Engine (index.css: Dark/Gold Tokens)
  └── AI Service Layer (Calling Firebase Cloud Functions Proxy)
           │
           ▼
Backend (Firebase Cloud Functions in europe-west3)
  ├── generateClinicalContentProxy (Authenticated Gemini Proxy)
  ├── Firestore Security Rules (Strict RBAC & Admin Protection)
  └── Secret Management (Google Cloud Secret Manager / IAM)
```

## Feature Inventory
Every feature identified during the Survey phase is mapped below:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F01 | Routing & Page Registration | Register 9 missing pages in `App.tsx` (`/impressum`, `/datenschutz`, `/blog/:slug`, `/pricing`, `/register`, `/checkout`, `/forgot-password`, `/onboarding`, `/services`, `/chatbot`) | M1 | Survey (UI/UX) |
| F02 | Internal Link Normalization | Fix broken/legacy link strings across `StartupPage`, `DashboardPage`, `CurriculumPage`, `DozentenDashboardPage` | M1 | Survey (UI/UX) |
| F03 | Design Tokens & Gold Theme | Standardize gold theme tokens in `index.css` (`--color-brand-primary`, `.text-gradient-gold`, glassmorphism) | M1 | Survey (UI/UX) |
| F04 | Hero Responsiveness & CTAs | Fix `HomePage.tsx` mobile/tablet layout, visible CTA buttons, and smooth scrolling | M1 | Survey (UI/UX) |
| F05 | 3D Canvas Layering & Blackout Fix | Fix Tailwind v4 opacity conflict in `PublicLayout` and set Canvas z-index to render 3D human model seamlessly behind hero cards | M2 | Survey (3D WebGL) |
| F06 | 3D Frustum & Viewport Adaptation | Dynamic viewport responsive satellite model positioning (`useThree().viewport.width`) preventing clipping | M2 | Survey (3D WebGL) |
| F07 | 3D Scene Resilience & ErrorBoundary | Add Canvas ErrorBoundary, fallback lighting if remote HDR is unavailable, and smooth mouse pointer tracking | M2 | Survey (3D WebGL) |
| F08 | Cloud Functions Gemini Proxy | Secure `generateClinicalContentProxy` with `request.auth` check and expand support for multimodal/image generation | M3 | Survey (Security) |
| F09 | Firestore Security Rules & Config | Block privilege escalation (`role: 'lecturer'`), configure `firebase.json` with `firestore.rules` | M3 | Survey (Security) |
| F10 | Client-Side Secret Elimination | Remove client `VITE_GEMINI_API_KEY` from `CreativeLab`, `HealthAnalysis`, `CaseTrainingPage`; route via proxy; `.gitignore` `.env` | M3 | Survey (Security) |
| F11 | XSS DOMPurify Sanitization | Add `DOMPurify.sanitize()` to `HealthAnalysis.tsx` and verify all dynamic HTML areas | M3 | Survey (Security) |
| F12 | Dependency Vulnerability Remediation | Fix vulnerable dependencies (`websocket-driver`, `react-router-dom`, etc.) to achieve 0 Critical / 0 High findings | M3 | Survey (Security) |
| F13 | Education & Showcase Modules | Verify interactive demo states for `/showcase`, `/startup`, `/anamnese-trainer`, `/vision`, `/moodle-simulation` | M4 | Survey (UI/UX) |
| F14 | Comprehensive E2E Test Suite | 4-tier requirement-driven opaque-box test harness publishing `TEST_READY.md` | E2E Track | Requirements |
| F15 | E2E 100% Pass & Adversarial Hardening | Pass 100% E2E test suite (Tiers 1-4) + Tier 5 adversarial stress testing + Forensic Audit | M5 | Requirements |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Requirement-driven test harness, runner, and test cases (Tiers 1-4) -> `TEST_READY.md` | none | PLANNED |
| M1 | UI/UX Consistency & Layout Fixes | F01, F02, F03, F04 (Routing, links, gold tokens, hero mobile layout) | none | PLANNED |
| M2 | 3D WebGL Scene & Asset Pipeline | F05, F06, F07 (Canvas layering, blackout fix, responsive viewport, ErrorBoundary) | M1 | PLANNED |
| M3 | Security, Proxy & Strix Monitoring | F08, F09, F10, F11, F12 (Cloud Function auth proxy, Firestore rules, secret scrubbing, DOMPurify, dependency audit) | none | PLANNED |
| M4 | Education & Showcase Modules Verification | F13 (Interactive demo states for all 5 core modules) | M1, M3 | PLANNED |
| M5 | Final Milestone: 100% E2E Pass & Hardening | F14, F15 (Pass 100% E2E tests, Tier 5 adversarial hardening, Forensic Audit) | E2E, M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### Client ↔ Cloud Functions Proxy (`generateClinicalContentProxy`)
- **Protocol**: Firebase Callable Function (`httpsCallable(functions, 'generateClinicalContentProxy')`)
- **Request**: `{ model?: string, prompt?: string, contents?: any[], generationConfig?: any, systemInstruction?: string, action?: 'generateContent' | 'generateImages' | 'generateVideos' }`
- **Auth**: Requires valid Firebase Auth token (`request.auth != null`). Unauthenticated calls return `HttpsError('unauthenticated')`.
- **Response**: `{ text?: string, candidates?: any[], images?: any[], success: boolean }`

### Client ↔ 3D Scene Layer (`Background3D.tsx`)
- **Container**: `<div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>`
- **Canvas**: Alpha true, antialias true, camera `[0, 0, 7]`, FOV 45.
- **Pointer Tracking**: Global mouse move listener updating mutable ref, normalized `[-1, 1]`, lerped in `useFrame`.
- **Overlay Layer**: `PublicLayout` uses `bg-[#020202]/20 backdrop-blur-[2px] pointer-events-none`.

## Code Layout
- `src/App.tsx`: Master router and layouts (`PublicLayout`, `DashboardLayout`)
- `src/index.css`: Global design tokens, dark/gold CSS variables, utility classes
- `src/components/Background3D.tsx`: Three.js Canvas, GLTF human model, satellite figurines, particle systems
- `src/components/`: Reusable UI components (`Navbar.tsx`, `Footer.tsx`, `HealthAnalysis.tsx`, `CreativeLab.tsx`, etc.)
- `src/pages/`: Route page components (`HomePage.tsx`, `ShowcasePage.tsx`, `StartupPage.tsx`, `AnamneseTrainerPage.tsx`, `VisionAgentPage.tsx`, `MoodleSimulationPage.tsx`, etc.)
- `src/services/aiService.ts`: AI service layer abstracting Gemini calls through Firebase Cloud Functions
- `functions/src/index.ts`: Firebase Cloud Functions backend proxy
- `firestore.rules`: Firestore security rules
- `tests/e2e/`: E2E test suites (Tiers 1-4)

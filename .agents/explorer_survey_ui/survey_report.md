# Comprehensive UI/UX & Education Modules Survey Report

**Project**: Körperfluss 3D Edu Web Application  
**Author**: Explorer 1 (UI/UX & Education Modules Surveyor)  
**Date**: 2026-08-26  
**Status**: Completed  

---

## Executive Summary

A comprehensive investigation of the entire Körperfluss 3D codebase was conducted, covering:
1. **Routing Architecture & Page Inventory** (all 36 pages in `src/pages/`, `App.tsx`, `Navbar.tsx`, `SidebarLayout.tsx`, `Footer.tsx`).
2. **UI/UX, CSS & Design Tokens** (Tailwind CSS v4 `@theme`, dark/gold palette tokens, contrast, layout responsiveness across mobile, tablet, and desktop).
3. **Education & Showcase Modules State Management** (`/showcase`, `/startup`, `/anamnese-trainer`, `/vision`, `/moodle-simulation`, `/virtual-classroom`, `/pitch-deck`, `/case-training`, `/exam-simulation`, `/quiz`, `/educator`).
4. **Asset Integrity, Broken Links & Layout Glitches** (SVGs, 3D glTF model, logo fallback chain, DOMPurify HTML sanitization).

The application compiles cleanly (`tsc && vite build` passed with exit code 0). However, critical routing gaps, dead link references, and token inconsistencies were discovered that require systematic remediation.

---

## 1. Routing Architecture & Page Inventory

### 1.1 Registered vs. Unregistered Pages

The application has **36 page components** in `src/pages/`. Currently, **27 routes** are registered in `App.tsx`, leaving **9 existing pages unrouted** or unreachable:

| Status | Page Component | File Path | Route in `App.tsx` | Notes & Impact |
|---|---|---|---|---|
| 🔴 **Missing Route** | `BlogPostPage` | `src/pages/BlogPostPage.tsx` | *None* | `BlogPage.tsx` links to `/blog/:slug`, but without this route in `App.tsx`, clicking any article redirects to `/` via the wildcard route. |
| 🔴 **Missing Route** | `ImpressumPage` | `src/pages/ImpressumPage.tsx` | *None* | `Footer.tsx` has `<Link to="/impressum">`; currently redirects to `/` (Legal compliance violation). |
| 🔴 **Missing Route** | `DatenschutzPage` | `src/pages/DatenschutzPage.tsx` | *None* | `Footer.tsx` has `<Link to="/datenschutz">`; currently redirects to `/` (GDPR compliance violation). |
| 🔴 **Missing Route** | `PricingPage` | `src/pages/PricingPage.tsx` | *None* | Pricing page exists with tiered plans, but has no route. |
| 🔴 **Missing Route** | `RegisterPage` | `src/pages/RegisterPage.tsx` | *None* | `PricingPage.tsx` links to `/register`; currently unrouted. |
| 🔴 **Missing Route** | `CheckoutPage` | `src/pages/CheckoutPage.tsx` | *None* | Checkout flow exists with payment simulation, but has no route. |
| 🔴 **Missing Route** | `ForgotPasswordPage` | `src/pages/ForgotPasswordPage.tsx` | *None* | Forgot password flow exists, but has no route. |
| 🔴 **Missing Route** | `OnboardingPage` | `src/pages/OnboardingPage.tsx` | *None* | Post-signup onboarding guide exists, but has no route. |
| 🔴 **Missing Route** | `ServicesPage` | `src/pages/ServicesPage.tsx` | *None* | Service catalog page exists, unrouted. |
| 🔴 **Missing Route** | `ChatbotStartPage` | `src/pages/ChatbotStartPage.tsx` | *None* | Standalone chatbot starter exists, unrouted. |
| 🟢 **Active Route** | `HomePage` | `src/pages/HomePage.tsx` | `/` | Split-screen Hero (Campus vs. Fakultät). |
| 🟢 **Active Route** | `AboutPage` | `src/pages/AboutPage.tsx` | `/ueber-uns` | Mission, Team & System Architecture. |
| 🟢 **Active Route** | `StartupPage` | `src/pages/StartupPage.tsx` | `/startup` | Google for Startups Pitch, TRL 7, Demos. |
| 🟢 **Active Route** | `ShowcasePage` | `src/pages/ShowcasePage.tsx` | `/showcase` | DigiArk F&E Hub: 18 Tools in 4 Categories. |
| 🟢 **Active Route** | `AngebotePage` | `src/pages/AngebotePage.tsx` | `/angebote` | Positioning & Go-To-Market strategy. |
| 🟢 **Active Route** | `BlogPage` | `src/pages/BlogPage.tsx` | `/blog` | Wissen & Ratgeber list. |
| 🟢 **Active Route** | `ContactPage` | `src/pages/ContactPage.tsx` | `/kontakt` | Contact form & office locations. |
| 🟢 **Active Route** | `LoginPage` | `src/pages/LoginPage.tsx` | `/login` | Dual Login (Student & Dozent). |
| 🟢 **Active Route** | `DozentenLoginPage` | `src/pages/DozentenLoginPage.tsx` | `/dozenten-login` | Dedicated Dozenten authentication. |
| 🟢 **Active Route** | `DashboardPage` | `src/pages/DashboardPage.tsx` | `/dashboard` | Patient & Student Cockpit. |
| 🟢 **Active Route** | `DozentenDashboardPage` | `src/pages/DozentenDashboardPage.tsx` | `/labor`, `/dozenten-dashboard` | Dozenten Management & Tools. |
| 🟢 **Active Route** | `AnalysisPage` | `src/pages/AnalysisPage.tsx` | `/analyse` | Body Scanner & Audio Transcriber. |
| 🟢 **Active Route** | `LaborPage` | `src/pages/LaborPage.tsx` | `/creative-lab` | Creative Lab (Imagen / Veo generation). |
| 🟢 **Active Route** | `EducationPage` | `src/pages/EducationPage.tsx` | `/education` | Wirkungsketten Analyser & Theory. |
| 🟢 **Active Route** | `CurriculumPage` | `src/pages/CurriculumPage.tsx` | `/curriculum` | System Matrix & Tool Catalog. |
| 🟢 **Active Route** | `LiteraturPage` | `src/pages/LiteraturPage.tsx` | `/literatur` | 234 Curated Evidence Studies RAG. |
| 🟢 **Active Route** | `AssessmentCenterPage` | `src/pages/AssessmentCenterPage.tsx` | `/assessment` | Assessment Hub & Adaptive Path. |
| 🟢 **Active Route** | `AnamneseTrainerPage` | `src/pages/AnamneseTrainerPage.tsx` | `/anamnese-trainer` | Socratic LUMI Mentor & 3-Step Flow. |
| 🟢 **Active Route** | `VisionAgentPage` | `src/pages/VisionAgentPage.tsx` | `/vision` | Gait 2.0 Kinematic & Skeleton Scan. |
| 🟢 **Active Route** | `CaseTrainingPage` | `src/pages/CaseTrainingPage.tsx` | `/case-training` | Interactive Case Studies & Feedback. |
| 🟢 **Active Route** | `ExamSimulationPage` | `src/pages/ExamSimulationPage.tsx` | `/exam-simulation` | Timed Mock Exam with AI Auto-Grading. |
| 🟢 **Active Route** | `QuizPage` | `src/pages/QuizPage.tsx` | `/quiz` | Spaced Repetition Quiz Engine. |
| 🟢 **Active Route** | `EducatorWorkspacePage` | `src/pages/EducatorWorkspacePage.tsx` | `/educator` | Dozenten Red-Flag Analytics & LUMI Config. |
| 🟢 **Active Route** | `PitchDashboardPage` | `src/pages/PitchDashboardPage.tsx` | `/pitch-deck` | Executive Pitch Center & ROI Simulator. |
| 🟢 **Active Route** | `MoodleSimulationPage` | `src/pages/MoodleSimulationPage.tsx` | `/moodle-simulation` | LTI 1.3 Moodle eCampus Mock & AGS 2.0. |
| 🟢 **Active Route** | `VirtualClassroomPage` | `src/pages/VirtualClassroomPage.tsx` | `/virtual-classroom` | Live 3D Classroom & Student Pulse. |

---

### 1.2 Dead / Broken Internal Links Across Modules

Multiple components contain internal links with outdated or misaligned route names, leading directly to wildcard redirects to `/`:

| Source File | Line | Linked Route | Expected Valid Route | Impact |
|---|---|---|---|---|
| `StartupPage.tsx` | 28, 42 | `/anamnese` | `/anamnese-trainer` | Clicking LUMI/Anamnese demo redirects to `/`. |
| `StartupPage.tsx` | 56 | `/visionagent` | `/vision` | Clicking Vision Agent demo redirects to `/`. |
| `StartupPage.tsx` | 70 | `/handout-builder` | `/educator` | Clicking Handout Builder demo redirects to `/`. |
| `DashboardPage.tsx` | 155 | `/vision-agent` | `/vision` | "Vision Agent" button redirects to `/`. |
| `DashboardPage.tsx` | 174 | `/assessment-center` | `/assessment` | "Hub öffnen" button redirects to `/`. |
| `DashboardPage.tsx` | 262, 275, 276, 288 | `/educator-workspace` | `/educator` | Dozenten tools redirect to `/`. |
| `CurriculumPage.tsx` | 19, 22, 30 | `/vision-agent` | `/vision` | Demo buttons redirect to `/`. |
| `CurriculumPage.tsx` | 24 | `/assessment-center` | `/assessment` | Assessment matrix button redirects to `/`. |
| `CurriculumPage.tsx` | 25 | `/educator-workspace` | `/educator` | Educator matrix button redirects to `/`. |
| `CurriculumPage.tsx` | 29, 37, 151 | `/clinical-hub` | `/education` | Clinical Hub workflow steps redirect to `/`. |
| `DozentenDashboardPage.tsx` | 100 | `/labor` | `/creative-lab` | "Creative Lab" card self-links to dashboard instead of Creative Lab. |
| `Footer.tsx` | 53 | `/impressum` | `/impressum` (needs route) | Legal link dead. |
| `Footer.tsx` | 54 | `/datenschutz` | `/datenschutz` (needs route) | Legal link dead. |

---

## 2. UI/UX Structure, CSS / Tailwind & Theme Tokens

### 2.1 CSS & Tailwind v4 Theme Tokens

In `src/index.css`:
```css
@theme {
  --color-brand-primary: #FFFFFF;
  --color-brand-primary-light: #F5F5F5;
  --color-brand-primary-dark: #A3A3A3;
  --color-brand-secondary: #0A0A0A;
  --color-brand-background: #000000;
  --color-brand-surface: #121212;
  --color-brand-border: rgba(255, 255, 255, 0.15);
  --color-brand-text-on-light: #000000;
  --color-brand-text-on-light-secondary: #525252;
}
```

#### Token Inconsistencies & Issues Found:
1. **Primary Color Mismatch**:
   - `--color-brand-primary` is defined as `#FFFFFF` (pure white).
   - Throughout components, the visual identity relies on gold accents (`#D4AF37`, `#C9A84C`, `rgba(212,175,55,...)`).
   - Because `--color-brand-primary` is white, utilities like `text-brand-primary` or `bg-brand-primary` render as white instead of the expected gold in some components, forcing individual developers to hardcode `#C9A84C` or `#D4AF37`.
2. **Pseudo Gold Gradient**:
   - `.text-gradient-gold` in `src/index.css` is defined as:
     `background-image: linear-gradient(to right, #FFFFFF, #D4D4D4, #737373);`
     This is a monochrome silver/gray gradient rather than gold (`#F5D77F`, `#D4AF37`, `#A67C1E`).
3. **Glassmorphism Consistency**:
   - `.glass` and `.glass-dark` are heavily used and render high-quality backdrop blurs with subtle borders (`border: 1px solid rgba(255, 255, 255, 0.1)`).

---

### 2.2 Hero Elements & Responsive Breakpoints

#### Issues in `HomePage.tsx`:
1. **Mobile Center CTA Disappearance**:
   - The central logo stand and the two core action buttons ("Plattform Entdecken" and "Live Demo Starten") are wrapped in:
     `className="absolute top-1/2 left-1/2 ... hidden md:flex flex-col items-center"`
   - **Result on Mobile (< 768px)**: On smartphones, the center logo and CTAs are completely hidden. The user only sees "CAMPUS" (top) and "FAKULTÄT" (bottom) split blocks without any guide to start the demo tour or discover the platform.
2. **Orphaned Scroll Handler**:
   - `handleScrollToFeatures` calls `window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })`.
   - However, `HomePage.tsx` only contains the 100vh hero section; there are no feature sections below it, causing the scroll button to scroll into empty black space.

#### HTML Accessibility Violations:
- In `PitchDashboardPage.tsx` (lines 148-156):
  `<Link to="/moodle-simulation"><Button variant="primary">...</Button></Link>`
  Because `Button.tsx` accepts a `to` prop and renders an internal `<Link>` when `to` is provided, nesting `<Button>` inside `<Link>` generates invalid nested `<a><button>...</button></a>` elements in the DOM.

---

## 3. Interactive State Management in Education & Showcase Modules

### 3.1 Showcase Module (`/showcase` — `ShowcasePage.tsx`)
- **Structure**: 18 tools grouped into 4 distinct categories (Anamnese, Diagnostik, Lehre, Simulation).
- **State & Metadata**:
  - Reifegrad (TRL / Maturity) badge: `Live` (green), `Beta` (gold/primary), `Konzept` (zinc).
  - Cards launch live demo tools via `<Link to={tool.route} target="_blank">`.
  - Comprehensive compliance section detailing BFSG / WCAG 2.1 AA and MDR-Freedom (Education-Only).

### 3.2 Startup Module (`/startup` — `StartupPage.tsx`)
- **Structure**: Structured application dossier for Google for Startups Cloud Program.
- **State & Data**:
  - TRL 7 stage demonstrator metrics, team credentials with LinkedIn links, and pilot university targets.
  - Interactive demo launch buttons for 5 core modules (requires route destination fixes).

### 3.3 Anamnese Trainer (`/anamnese-trainer` — `AnamneseTrainerPage.tsx`)
- **State Machine**:
  1. **Phase 1 (Exploration)**: Socratic chat with LUMI bot. One-click "Demo" button pre-populates `SHOWCASE_CASES.LWS_ANAMNESE`.
  2. **Phase 2 (Hypothese)**: Formulate cause-pathomechanism-symptom chain (`Ursache -> Pathomechanismus -> Symptom`).
  3. **Phase 3 (Evaluation & Bug-Sprint)**: Neuro-symbolic validation against S3-Leitlinien. If a critical red-flag is missed (e.g. Cauda equina / fracture), triggers mandatory "Bug-Sprint" micro-learning video.
- **Context Integration**:
  - Fully integrated with `useClinicalContext()` (`visionData`, `addCotStep`, `updateCotStep`, `setCotMode`).
- **Simulations**:
  - Interactive audio recording toggle and simulated LTI 1.3 Moodle Grade Sync toast notification.

### 3.4 Vision Agent (`/vision` — `VisionAgentPage.tsx`)
- **State & Visualization**:
  - **Ganganalyse 2.0**: Media file upload / demo video toggle.
  - **Skeleton Overlay**: SVG vector rendering of hip, knee, and ankle joint axes, dynamically highlighting valgus deviation errors in red (`#f43f5e`) vs. normal axes in green (`#10b981`).
  - **Dozenten-Vergleich**: Side-by-side comparison of Student vs. Gold-Standard Dozent metrics (Student Score 65% vs. Expert Score 98%).
  - **Kinematics Table**: Angular deviation tracking against clinical tolerances.

### 3.5 Moodle Simulation (`/moodle-simulation` — `MoodleSimulationPage.tsx`)
- **State & Visuals**:
  - Simulated eCampus (FH St. Pölten) Moodle LMS interface with weekly course items.
  - Interactive LTI 1.3 launch handshake animation overlay (OIDC Auth -> NRPS Roster Sync -> Safety Guard Connect -> Redirect).
  - Interactive AGS 2.0 Grade Sync animation overlay (transfers 87% test score directly to Moodle gradebook).

### 3.6 Virtual Classroom (`/virtual-classroom` — `VirtualClassroomPage.tsx`)
- **State & Visuals**:
  - Live session simulation with 28 connected students.
  - 3D view mockup with myofascial chain ("Deep Front Line") callout and CMD simulation disclaimer.
  - Interactive group chat and Student Pulse comprehension heatmap.

### 3.7 Pitch Dashboard (`/pitch-deck` — `PitchDashboardPage.tsx`)
- **Features**:
  - MDR-Distance Verification badge.
  - ROI Calculator (4.5 hours/week saved, €157/student/year, >90% ROI).
  - Safety Guard live status monitor.

---

## 4. Asset Integrity, Icons & Sanitization

1. **3D Scene Asset**:
   - `public/koerperfluss_model.glb` (2.48 MB) loads smoothly in `Background3D.tsx` via `@react-three/drei`'s `useGLTF`.
   - Mesh transmission shader renders central human figure with gold emissive highlights; satellite figures represent Campus and Fakultät.
2. **Logo Robustness**:
   - `Logo.tsx` implements a robust multi-path fallback chain (`/logo2.svg` -> `/logo-main.png` -> `/logo.svg` -> `/logo.jpeg` -> `/logo.png`) preventing broken image badges.
3. **SVG Icons**:
   - `src/components/IconComponents.tsx` contains 377 lines of clean, self-contained SVG icon components.
   - Lucide-react is also used for utility icons (`Share2`, `LogOut`, `Sparkles`, etc.).
4. **Security & Sanitization**:
   - `DOMPurify.sanitize()` is consistently applied on dynamic HTML renders in `BlogPostPage.tsx`, `AnamneseTrainerPage.tsx`, and `VisionAgentPage.tsx`.

---

## 5. Prioritized Action Recommendations

### Priority 1: Critical Routing Fixes (Breaking User Navigation)
1. In `src/App.tsx`:
   - Register `/blog/:slug` -> `BlogPostPage` (enables article reading from blog list).
   - Register `/impressum` -> `ImpressumPage` (legal requirement).
   - Register `/datenschutz` -> `DatenschutzPage` (GDPR compliance).
   - Register `/pricing`, `/register`, `/checkout`, `/forgot-password`, `/onboarding` for full auth & membership flow.
2. In `src/pages/StartupPage.tsx`:
   - Change `demoPath: "/anamnese"` to `/anamnese-trainer`.
   - Change `demoPath: "/visionagent"` to `/vision`.
   - Change `demoPath: "/handout-builder"` to `/educator`.
3. In `src/pages/DashboardPage.tsx`:
   - Change `/vision-agent` to `/vision`.
   - Change `/assessment-center` to `/assessment`.
   - Change `/educator-workspace` to `/educator`.
4. In `src/pages/CurriculumPage.tsx`:
   - Change `/vision-agent` to `/vision`.
   - Change `/assessment-center` to `/assessment`.
   - Change `/educator-workspace` to `/educator`.
   - Change `/clinical-hub` to `/education`.
5. In `src/pages/DozentenDashboardPage.tsx`:
   - Change "Creative Lab" link from `/labor` to `/creative-lab`.

### Priority 2: UI/UX & Responsive Layout Enhancements
1. In `src/index.css`:
   - Update `--color-brand-primary` to `#D4AF37` (or define `--color-brand-gold: #D4AF37`) and adjust `.text-gradient-gold` to use rich gold gradient stops (`#FFFFFF`, `#F5D77F`, `#D4AF37`).
2. In `src/pages/HomePage.tsx`:
   - Make the central logo and CTA buttons visible or appropriately positioned on mobile screens so mobile visitors can launch the demo tour.
3. In `src/pages/PitchDashboardPage.tsx`:
   - Replace `<Link to="..."><Button>...</Button></Link>` with `<Button to="...">...</Button>` to eliminate nested interactive tag warnings.

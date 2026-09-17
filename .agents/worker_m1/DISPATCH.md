## 2026-08-26T10:28:25Z
You are Worker M1 (UI/UX Consistency, Missing Routes & Layout Fixes).
Your working directory is: /Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade/.agents/worker_m1

Read ORIGINAL_REQUEST.md at:
/Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade/.agents/ORIGINAL_REQUEST.md

Read PROJECT.md at:
/Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade/PROJECT.md

Read Explorer 1 Survey Report at:
/Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade/.agents/explorer_survey_ui/survey_report.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Exclusively Owned Files:
- src/App.tsx
- src/index.css
- src/components/Footer.tsx
- src/components/Navbar.tsx
- src/pages/HomePage.tsx
- src/pages/StartupPage.tsx
- src/pages/DashboardPage.tsx
- src/pages/CurriculumPage.tsx
- src/pages/DozentenDashboardPage.tsx
- src/pages/BlogPage.tsx

Your Tasks:
1. Register all 9 missing pages in `src/App.tsx` (`/impressum` -> `ImpressumPage`, `/datenschutz` -> `DatenschutzPage`, `/blog/:slug` -> `BlogPostPage`, `/pricing` -> `PricingPage`, `/register` -> `RegisterPage`, `/checkout` -> `CheckoutPage`, `/forgot-password` -> `ForgotPasswordPage`, `/onboarding` -> `OnboardingPage`, `/services` -> `ServicesPage`, `/chatbot` -> `ChatbotStartPage`).
2. Fix broken/legacy link paths across `StartupPage.tsx` (`/anamnese` -> `/anamnese-trainer`, `/visionagent` -> `/vision`, `/handout-builder` -> `/educator`), `DashboardPage.tsx` (`/vision-agent` -> `/vision`, `/assessment-center` -> `/assessment`, `/educator-workspace` -> `/educator`), `CurriculumPage.tsx` (`/vision-agent` -> `/vision`, `/assessment-center` -> `/assessment`, `/educator-workspace` -> `/educator`, `/clinical-hub` -> `/education`), and `DozentenDashboardPage.tsx` (`/labor` -> `/creative-lab`).
3. Standardize gold theme tokens in `src/index.css` (`--color-brand-primary: #D4AF37;`, rich gold `.text-gradient-gold` linear-gradient, glassmorphic styling, high-contrast text).
4. Fix `src/pages/HomePage.tsx` hero section for mobile/tablet breakpoints: remove `hidden md:flex` blocker, ensure hero CTAs ("Plattform Entdecken", "Live Demo Starten") are accessible and clearly visible on mobile and desktop without layout overlap.
5. Run `npm run build` and `npx tsc --noEmit` to verify 0 errors.

Write your report and handoff.md in your working directory and notify parent via send_message.

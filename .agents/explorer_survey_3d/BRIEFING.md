# BRIEFING — 2026-08-26T10:26:00Z

## Mission
Survey the entire codebase focusing on 3D WebGL / Three.js setup, 3D asset pipeline, mouse tracking/raycasting/camera, and console errors/memory leaks/bottlenecks.

## 🔒 My Identity
- Archetype: explorer
- Roles: 3D WebGL & Three.js Asset Pipeline Survey Specialist
- Working directory: /Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade/.agents/explorer_survey_3d
- Original parent: 267a67d1-ca3f-4d1b-bed5-c86b9d80fcef
- Milestone: 3D WebGL Survey Complete

## 🔒 Key Constraints
- Read-only investigation — do NOT implement changes in codebase source files
- Keep investigation thorough, precise with file paths and line numbers
- Write comprehensive survey report to `survey_report.md`
- Write 5-component handoff report to `handoff.md`

## Current Parent
- Conversation ID: 267a67d1-ca3f-4d1b-bed5-c86b9d80fcef
- Updated: 2026-08-26T10:26:00Z

## Investigation State
- **Explored paths**:
  - `src/components/Background3D.tsx` (Canvas, R3F Scene, Shaders, Animations)
  - `src/App.tsx` (Router, Layouts, CSS Stacking, GlobalErrorBoundary)
  - `src/index.css` (Tailwind v4 theme, Body backgrounds, Layer styles)
  - `src/themes/theme-gold-torus.tsx` (Procedural tool scenes)
  - `src/components/IntroSplashScreen.tsx` (4.5s splash animation)
  - `public/koerperfluss_model.glb` (Meshopt GLTF asset, 209k triangles)
  - `Körperfluss Edu Local 3d MErch /` (Historical 3D models & designs)
- **Key findings**:
  - CSS Stacking bug: Tailwind v4 opacity syntax in `App.tsx:180` (`bg-[#020202] bg-opacity-20`) created a solid opaque blackout layer over `z-index: -1` canvas container.
  - 3D asset geometry verified: 139,718 vertices, 209,018 triangles in `koerperfluss_model.glb`.
  - Satellite clipping: fixed $x = -2.8$ and $x = +3.6$ coordinates clip outside camera frustum on $< 1.25$ aspect ratio screens.
  - Draw call / triangle load: 54 draw calls and 5,118,860 triangles per frame due to multi-pass transmission and continuous shadow maps.
  - External network dependency: Drei `<Environment preset="city" />` fetches remote HDR from GitHub CDN at runtime.
- **Unexplored areas**: None. All 4 focus areas surveyed in full depth.

## Key Decisions Made
- Executed dynamic WebGL draw call interception, memory analysis, and route traversal in real browser environment.
- Documented full architectural remediation plan in `survey_report.md` and `handoff.md`.

## Artifact Index
- `/Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade/.agents/explorer_survey_3d/survey_report.md` — Comprehensive findings report
- `/Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade/.agents/explorer_survey_3d/handoff.md` — Standard 5-component handoff report
- `/Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade/.agents/explorer_survey_3d/DISPATCH.md` — Task dispatch log
- `/Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade/.agents/explorer_survey_3d/progress.md` — Progress tracker

# Handoff Report — 3D WebGL & Three.js Asset Pipeline Survey

**Agent**: Explorer 2 (3D WebGL & Three.js Asset Pipeline Survey - Replacement)  
**Working Directory**: `/Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade/.agents/explorer_survey_3d`  
**Handoff Type**: Hard (Task Complete)  
**Report Artifact**: `/Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade/.agents/explorer_survey_3d/survey_report.md`

---

## 1. Observation

1. **Three.js & Canvas Setup**:
   - Three.js dependencies in `package.json`: `@react-three/fiber` (`^8.18.0`), `@react-three/drei` (`^9.122.0`), `three` (`^0.184.0`), `three-stdlib` (`^2.36.1`).
   - `Global3DBackground` in `src/components/Background3D.tsx` mounts `<Canvas camera={{ position: [0, 0, 7], fov: 45 }} gl={{ antialias: true, alpha: true }}>` within `<div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>`.
   - In `src/App.tsx` (line 180), `PublicLayout` renders `<div className="fixed inset-0 pointer-events-none z-0 bg-[#020202] bg-opacity-20" />`. Tailwind v4 ignores `bg-opacity-20`, rendering solid opaque `rgb(2, 2, 2)` at `z-index: 0` directly on top of the `z-index: -1` canvas container.
   - In `src/index.css` (lines 107–108), `body` has `background-color: #000000; background-image: radial-gradient(...)`.

2. **3D Asset Pipeline**:
   - `public/koerperfluss_model.glb` (2,477,408 bytes) contains 1 single mesh primitive (`node_0`) with 139,718 vertices and 627,054 indices (209,018 triangles) using `EXT_meshopt_compression`.
   - `Background3D.tsx` loads the model via `useGLTF('/koerperfluss_model.glb')` and renders 3 instances using `modelGeometry`:
     - Main Model: Scale 1.2, position `[1.8, -0.6, 0]`, `MeshTransmissionMaterial` (refractive glass with gold emissive).
     - Left Satellite: Scale 0.65, position `[-2.8, -1.2, -1.5]`, `meshStandardMaterial` (gold metallic).
     - Right Satellite: Scale 0.65, position `[3.6, -1.2, -1.5]`, `meshStandardMaterial` (gold metallic).
   - Drei `<Environment preset="city" />` makes a remote network request to `https://raw.githack.com/pmndrs/drei-assets/.../potsdamer_platz_1k.hdr` (1,172 ms runtime duration).

3. **Mouse Tracking & Camera Interactions**:
   - Mouse movement is captured via `window.addEventListener('mousemove')` in normalized device coordinates `[-1, 1]` stored in a mutable ref (`pointerPos`), eliminating React component re-renders.
   - `useFrame` smoothly lerps rotations with inertia: `ref.current.rotation.y += (targetX - ref.current.rotation.y + scrollParallax * 0.5) * 0.05`.
   - Canvas wrapper has `pointer-events-none`, so all DOM buttons and hero cards remain clickable and accessible.
   - At camera `z=7, fov=45`, horizontal visible frustum is only $\approx \pm 2.46$ on 1:1 viewports, causing satellite models at $x=-2.8$ and $x=+3.6$ to be clipped on narrow screens.

4. **Runtime Diagnostics & Performance**:
   - Intercepted WebGL draw calls: 54 draw calls and 5,118,860 triangles rendered per frame.
   - Average FPS: 111.2 FPS on Apple M4 Metal backend.
   - Deprecation warning: `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` emitted by Three.js r184.
   - Asset 404: `GET /favicon.ico` returns HTTP 404.
   - Monolithic production JS bundle: `dist/assets/index-BOrfjfgo.js` is 2,604 kB (675 kB gzip).

---

## 2. Logic Chain

1. **Root Cause of Black 3D Background**:
   - *Observation*: `<Canvas>` is wrapped in `style={{ zIndex: -1 }}` (`Background3D.tsx:259`).
   - *Observation*: `body` has solid `#000000` background (`index.css:107`), placing negative z-index items behind it.
   - *Observation*: `PublicLayout` in `App.tsx:180` renders `bg-[#020202] bg-opacity-20`. Under Tailwind v4, legacy `bg-opacity-20` is not applied, resulting in a solid `rgb(2, 2, 2)` blackout layer with `z-index: 0`.
   - *Inference*: The 3D scene is actively rendering in WebGL (54 draw calls/frame), but is visually masked behind two opaque CSS layers. Modifying the overlay class to `bg-[#020202]/20` and moving canvas to `z-index: 0` immediately reveals the 3D scene.

2. **Satellite Clipping on Non-Ultrawide Displays**:
   - *Observation*: Satellites are positioned at $x = -2.8$ and $x = +3.6$. Camera is fixed at $z = 7$ with $fov = 45^\circ$.
   - *Inference*: On viewports with aspect ratio $< 1.25$, visible horizontal span is $< 7.2$ ($[-3.6, +3.6]$), which places the right satellite completely offscreen. Dynamic positioning using `useThree().viewport.width` is required.

3. **Resilience & Offline Failure**:
   - *Observation*: `<Environment preset="city" />` loads `potsdamer_platz_1k.hdr` from an external URL. No local ErrorBoundary surrounds `<Canvas>`.
   - *Inference*: In offline deployment or strict CORS/firewall environments, failing HDR fetch causes Suspense rejection, cascading into `GlobalErrorBoundary` and crashing the entire website.

---

## 3. Caveats

1. **Local vs Cloud Assets**: The original 30 MB GLB model is present in `Körperfluss Edu Local 3d MErch /`, while `/public/koerperfluss_model.glb` is a 2.47 MB meshopt-compressed version. Future 3D updates must preserve meshopt compression to avoid 30 MB client bundle downloads.
2. **Three.js r184 Deprecations**: The `THREE.Clock` warning originates within `@react-three/fiber` / `@react-three/drei` internals and does not break functionality, but will require updating when R3F releases official r184 patches.
3. **No Codebase Edits in Explorer Role**: Per investigator archetype constraints, no modifications were made to project source files during this survey; all findings and remediation patches are documented in `survey_report.md`.

---

## 4. Conclusion

The 3D WebGL pipeline is fundamentally operational with authentic 209k-triangle anatomical geometry and high-end transmission shaders, but is currently obscured by a Tailwind v4 CSS opacity/z-index layering conflict and vulnerable to remote HDR network dependency and frustum clipping. Implementing the 5 remediation steps outlined in `survey_report.md` will fully restore and harden the 3D visual experience across all devices.

---

## 5. Verification Method

To independently verify these findings:
1. **TypeScript & Build Verification**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
2. **Start Local Dev Server**:
   ```bash
   npx vite --port 5179
   ```
3. **Inspect DOM Overlay Fix in Browser Console**:
   ```js
   document.querySelector('div.fixed.inset-0.pointer-events-none.z-0.bg-\\[\\#020202\\]').style.display = 'none';
   document.querySelector('div[style*="z-index: -1"]').style.zIndex = '0';
   ```
   *Result*: The 3D anatomical model, rotating gold rings, and particle orbits appear immediately behind the hero section.
4. **Inspect GLB Metadata**:
   ```bash
   node -e '
   const fs = require("fs");
   const f = fs.readFileSync("public/koerperfluss_model.glb");
   const len = f.readUInt32LE(12);
   console.log(JSON.parse(f.toString("utf8", 20, 20 + len)).accessors);
   '
   ```

# Comprehensive 3D WebGL & Three.js Asset Pipeline Survey Report
**Project**: Körperfluss 3D Edu Web Application (`Koerperfluss-3D-Upgrade`)  
**Investigator**: Explorer 2 (3D WebGL & Three.js Asset Pipeline Survey Specialist)  
**Date**: 2026-08-26  
**Status**: Survey Complete

---

## Executive Summary

A comprehensive investigation into the 3D WebGL scene, Three.js / React Three Fiber setup, 3D asset pipeline, interaction/camera layers, and performance characteristics was conducted across the entire codebase.

### Core Survey Findings:
1. **WebGL Canvas Setup & Stacking Glitch**: The 3D scene is implemented in `src/components/Background3D.tsx` via `@react-three/fiber` (`v8.18.0`) and `@react-three/drei` (`v9.122.0`). The canvas is mounted globally in `src/App.tsx`. However, a critical CSS layering conflict in `App.tsx` (`PublicLayout` line 180) renders a solid black overlay (`bg-[#020202] bg-opacity-20` where Tailwind v4 ignores `bg-opacity-20` and applies 100% solid opacity) combined with `z-index: -1` on the canvas container and `body` background colors in `src/index.css`, obscuring the 3D canvas behind opaque DOM layers.
2. **3D Asset Pipeline & Geometry Verification**: The primary full-body anatomical model is located at `/public/koerperfluss_model.glb` (2.47 MB), consisting of 139,718 vertices and 209,018 triangles (`EXT_meshopt_compression`). The geometry is shared across 3 figures (1 main figure and 2 satellite figurines).
3. **Frustum & Satellite Positioning**: The camera is positioned at `[0, 0, 7]` with `fov: 45`. The satellite figurines are placed at `x = -2.8` (Campus) and `x = +3.6` (Fakultät). On viewports with aspect ratios below ~1.3 (laptops, tablets, split-screens), the satellites are outside the camera frustum and get clipped.
4. **Rendering Overhead & Bottlenecks**: Due to multi-pass FBO rendering in `MeshTransmissionMaterial`, continuous `ContactShadows` depth passes, and 3 full-resolution mesh instances, the scene executes **54 draw calls and renders 5,118,860 triangles per frame** (~614 million triangles/sec at 120 FPS on Apple Silicon).
5. **External Asset Dependency**: `<Environment preset="city" />` attempts to load `potsdamer_platz_1k.hdr` at runtime from `raw.githack.com` / `raw.githubusercontent.com`. In offline or firewall-restricted environments, this network request fails.
6. **Error Handling & Resilience**: The Canvas lacks a local ErrorBoundary and WebGL context loss recovery handlers (`webglcontextlost`/`webglcontextrestored`), meaning a WebGL context failure crashes the entire React application up to `GlobalErrorBoundary`.

---

## 1. 3D WebGL / Three.js / React Three Fiber Setup

### 1.1 Architecture & Component Hierarchy

| Component | File Path | Line Range | Purpose |
|---|---|---|---|
| `Global3DBackground` | `src/components/Background3D.tsx` | Lines 233–281 | Root wrapper, handles desktop breakpoint check (`>= 1024px`), toggle event, and Canvas mount |
| `AbstractPremiumScene` | `src/components/Background3D.tsx` | Lines 191–231 | Scene graph: lights, environment, shadows, and Suspense wrapper |
| `AnatomicalModel` | `src/components/Background3D.tsx` | Lines 10–116 | Main human model (refractive glass) + 2 satellite figurines (gold standard) |
| `AnimatedLogoRings` | `src/components/Background3D.tsx` | Lines 118–148 | Dual golden torus rings with smooth pointer follow and float animation |
| `Particles` | `src/components/Background3D.tsx` | Lines 150–189 | 50 golden particle instances orbiting in instanced mesh |
| `GoldTorusScene` (Theme) | `src/themes/theme-gold-torus.tsx` | Lines 343–359 | 9 specialized procedural canvas scenes for LMS tools (standalone/unused) |

### 1.2 Canvas Configuration & Mounting

In `src/components/Background3D.tsx` (lines 258–280):
```tsx
<div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
  {show3D && isDesktop ? (
    <Canvas 
      camera={{ position: [0, 0, 7], fov: 45 }} 
      gl={{ antialias: true, alpha: true }}
    >
      <AbstractPremiumScene />
    </Canvas>
  ) : (
    /* 🏫 HELE DISTRACTION-FREE FH KREMS / ST. PÖLTEN UNIVERSITY CHARTING GRID */
    <div className="absolute inset-0 bg-[#040404] transition-colors duration-1000">
      ...
    </div>
  )}
</div>
```

### 1.3 Canvas Visibility & DOM Stacking Defects

| Issue | Location | Root Cause | Impact | Recommended Fix |
|---|---|---|---|---|
| **Negative Z-Index Canvas** | `Background3D.tsx:259` | `style={{ zIndex: -1 }}` places canvas behind `body` background in root stacking context | Canvas hidden behind `body` background | Change container to `z-index: 0` or integrate with Layout |
| **Tailwind v4 Opacity Syntax** | `App.tsx:180` (`PublicLayout`) | `<div className="... bg-[#020202] bg-opacity-20" />`. Tailwind 4 ignores `bg-opacity-20` and renders solid `rgb(2, 2, 2)` | Solid black overlay completely covers 3D canvas | Replace with `bg-[#020202]/20` or `bg-black/20` |
| **Opaque Body Background** | `index.css:107–108` | `body { background-color: #000000; background-image: radial-gradient(...) }` | Prevents negative z-index elements from showing | Keep canvas at `z-index: 0` and content at `z-index: 10+` |

### 1.4 Resize & Responsiveness

- **Breakpoint**: `isDesktop` is evaluated via `window.innerWidth >= 1024` on initial render and on `window.onresize`.
- **Behavior**:
  - `< 1024px`: `<Canvas>` unmounts cleanly, and the CSS grid (`.bg-[#040404]`) is rendered.
  - `>= 1024px`: `<Canvas>` mounts and initializes WebGL context.
- **Flaw**: Resizing across the 1024px boundary destroys and re-creates the entire WebGL context, triggering shader recompilations and asset re-binding.

### 1.5 WebGL Context Loss & Recovery

- **Observation**: Neither `Background3D.tsx` nor `App.tsx` attaches `webglcontextlost` or `webglcontextrestored` listeners.
- **Log Observation**: When unmounting during toggles/resizing, Three.js outputs `THREE.WebGLRenderer: Context Lost.`.
- **Vulnerability**: If the GPU resets, memory is exceeded, or mobile Safari sleeps, an uncaught context loss causes a permanent black canvas or an unhandled exception that triggers the full-screen `GlobalErrorBoundary` ("System-Fehler").

---

## 2. 3D Asset Pipeline Survey

### 2.1 Asset Inventory

| Asset Name | Location | Size | Type / Format | Vertex / Triangle Count | Status |
|---|---|---|---|---|---|
| `koerperfluss_model.glb` | `/public/koerperfluss_model.glb` | 2.47 MB | GLTF 2.0 Binary (Meshopt compressed) | 139,718 Vertices / 209,018 Triangles | **Active** (Loaded in `Background3D.tsx`) |
| `KÖRPERFLUSS3dModell.usd` | `/public/KÖRPERFLUSS3dModell.usd` | 3.70 MB | Universal Scene Description (USD) | — | Legacy / Reference |
| `KÖRPERFLUSS3dModell.glb` | `/Körperfluss Edu Local 3d MErch /` | 30.0 MB | GLTF 2.0 Binary (Uncompressed) | ~209k Triangles | Source original model |
| `KORPERFLUSS3dModell-v1..3.glb` | `/Körperfluss Edu Local 3d MErch /KÖRPERFLUSS3dModell/` | 2.40 MB ea | GLTF 2.0 Binary | ~209k Triangles | Iteration variants |

### 2.2 GLTF Mesh & Hierarchy Analysis (`koerperfluss_model.glb`)

Inspection of `public/koerperfluss_model.glb` via Node GLTF parser:
- **Root Node**: `node_0`, translation `[-0.021, 0.274, -0.014]`, rotation `[0.7071, 0, 0, 0.7071]` (+90° on X), scale `[0.567, 0.567, 0.567]`.
- **Primitives**: 1 primitive with attributes: `POSITION` (VEC3, 139,718 entries), `NORMAL` (VEC3, 139,718 entries), `TEXCOORD_0` (VEC2, 139,718 entries), `indices` (SCALAR, 627,054 entries = 209,018 triangles).
- **Compression**: Buffer 1 compressed using `EXT_meshopt_compression`.
- **Material**: `Material.001` (PBR Metallic/Roughness with `KHR_materials_specular`).

### 2.3 Loader Implementation & Geometry Memoization

In `src/components/Background3D.tsx`:
```tsx
const { nodes, materials } = useGLTF('/koerperfluss_model.glb') as any;
...
const modelGeometry = React.useMemo(() => {
  if (nodes?.node_0?.geometry) return nodes.node_0.geometry;
  const foundKey = Object.keys(nodes || {}).find(key => nodes[key]?.geometry);
  return foundKey ? nodes[foundKey].geometry : null;
}, [nodes]);

useGLTF.preload('/koerperfluss_model.glb');
```

- **Preloading**: `useGLTF.preload` initiates the asset fetch when the JS module is loaded.
- **Robustness**: Geometry lookup uses fallback key matching if `node_0` is renamed.

### 2.4 Material Definitions

1. **Main Full-Body Human Figure**:
   ```tsx
   <MeshTransmissionMaterial 
     backside
     backsideThickness={4}
     thickness={1.5}
     roughness={0.08}
     transmission={0.95}
     ior={1.4}
     chromaticAberration={0.05}
     anisotropy={0.1}
     color="#ffffff"
     emissive="#B38F2D"
     emissiveIntensity={0.15}
   />
   ```
   - High-fidelity glass transmission with golden emissive subsurface glow.
   - Requires FBO render targets for optical refraction.
2. **Left Satellite (Campus)**:
   ```tsx
   <meshStandardMaterial 
     color="#E5BF48" 
     emissive="#B38F2D" 
     emissiveIntensity={0.3} 
     roughness={0.2} 
     metalness={0.9} 
     transparent 
     opacity={0.7} 
   />
   ```
3. **Right Satellite (Fakultät)**:
   ```tsx
   <meshStandardMaterial 
     color="#D4AF37" 
     emissive="#B38F2D" 
     emissiveIntensity={0.3} 
     roughness={0.2} 
     metalness={0.9} 
     transparent 
     opacity={0.7} 
   />
   ```

### 2.5 External Asset Dependency: Environment Lighting

In `Background3D.tsx` line 227:
`<Environment preset="city" />`
- **Mechanism**: Drei's `useEnvironment` maps `preset="city"` to `https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/potsdamer_platz_1k.hdr`.
- **Runtime Trace**: Network inspection recorded `GET https://raw.githack.com/.../potsdamer_platz_1k.hdr` (301 redirect to `raw.githubusercontent.com`, 200 OK, 1,172 ms).
- **Risk**: Fails when offline or behind restrictive enterprise firewalls.
- **Recommendation**: Bundle an optimized lightweight HDR or procedural environment cubemap locally in `/public/environment/`.

---

## 3. Mouse Pointer Tracking, Raycasting, Camera & Hero Layout

### 3.1 Pointer Tracking Implementation

```tsx
const pointerPos = useRef({ x: 0, y: 0 });

useEffect(() => {
  const handlePointerMove = (e: MouseEvent) => {
    pointerPos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerPos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  window.addEventListener('mousemove', handlePointerMove, { passive: true });
  return () => window.removeEventListener('mousemove', handlePointerMove);
}, []);
```
- **Performance**: Normalized NDC coordinates `[-1, 1]` stored in a mutable ref (`useRef`), zero React state updates or component re-renders during mouse move.
- **Smoothing (Lerp)**: In `useFrame`, target rotations are smoothly interpolated:
  ```tsx
  ref.current.rotation.y += (targetX - ref.current.rotation.y + scrollParallax * 0.5) * 0.05;
  ref.current.rotation.x += (-targetY - ref.current.rotation.x) * 0.05;
  ```

### 3.2 Camera Positioning & Spatial Frustum Analysis

- **Camera**: `position: [0, 0, 7], fov: 45`
- **Visible Frustum Calculations**:
  - Vertical span at $z=0$: $2 \times \tan(22.5^\circ) \times 7 \approx 5.80$ units.
  - Horizontal span at 16:9 aspect ratio ($1.77$): $5.80 \times 1.77 \approx 10.27$ units ($x \in [-5.13, +5.13]$).
  - Horizontal span at 1:1 aspect ratio ($1.0$): $5.80$ units ($x \in [-2.90, +2.90]$).
  - Horizontal span at 9:16 portrait ($0.56$): $3.25$ units ($x \in [-1.62, +1.62]$).
- **Object Coordinates**:
  - Main Model: $x = +1.8$ (visible on 16:9, partially cut off in portrait).
  - Left Satellite: $x = -2.8$ (visible only on aspect ratios $> 1.0$).
  - Right Satellite: $x = +3.6$ (visible only on aspect ratios $> 1.25$).
  - Logo Rings: $x = +1.8$ (centered with main figure).
- **Layout Observation**:
  - On `HomePage.tsx`, the 2D Center Logo and CTA buttons are positioned at $x = 0$.
  - The 3D main figure is shifted to $x = 1.8$ (behind the "Fakultät" card), preventing 3D geometry from obstructing the central CTA button stack.
  - On narrower viewports, satellite coordinates should scale dynamically based on `viewport.width` via `@react-three/fiber`'s `useThree((state) => state.viewport)`.

### 3.3 DOM Interaction & Event Pass-Through

- The canvas wrapper has `pointer-events-none`.
- All DOM buttons ("Plattform Entdecken", "Live Demo Starten", Campus & Fakultät split-cards, navigation links, FAB chat icon) receive clicks, taps, and keyboard focus without obstruction.

---

## 4. Console Errors, Memory Leaks & Animation Bottlenecks

### 4.1 Console Messages & Build Warnings

| Category | Warning / Error | Source | Remediation |
|---|---|---|---|
| **Deprecation** | `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` | Three.js r184 in R3F/Drei animation loop | Upgrade/patch clock reference or ignore until R3F updates |
| **HTTP 404** | `GET http://localhost:5179/favicon.ico [404]` | Missing `public/favicon.ico` | Place `favicon.ico` in `/public` |
| **Bundle Size** | Monolithic bundle `dist/assets/index-BOrfjfgo.js` (2,604 kB) | Vite builds all 27 pages & Three.js synchronously | Add dynamic `React.lazy()` chunking for sub-pages |

### 4.2 WebGL Render Pipeline & Draw Call Audit

Live WebGL interception under Chromium Metal backend:
- **Draw calls per frame**: 54 calls
- **Triangles per frame**: 5,118,860 triangles
- **Memory footprint**: JS Heap 67 MB / 86 MB allocated
- **Average FPS**: 111.2 FPS on Apple M4 Metal renderer

#### Bottleneck Analysis:
1. **Multi-Pass Transmission**: `MeshTransmissionMaterial` renders multiple render passes per frame to sample the background scene for refraction.
2. **ContactShadows Continuous Rendering**: `<ContactShadows>` without `frames={1}` or `renderOrder` continuously renders depth maps for all 3 models every frame.
3. **Geometry Multiplier**: 3 copies of a 209,018-triangle mesh (627,054 base triangles) rendered across multiple render targets.

---

## 5. Architectural Recommendations & Action Plan

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                 3D UPGRADE ROADMAP                                │
├───────────────────────────────────────────────────────────────────────────────────┤
│ 1. FIX CSS Z-INDEX & OPACITY (Immediate Priority)                                 │
│    - Change PublicLayout in App.tsx line 180: bg-[#020202]/20                     │
│    - Set Background3D container to z-index: 0, content at z-index: 10             │
│                                                                                   │
│ 2. DYNAMIC RESPONSIVE VIEWPORT POSITIONING                                        │
│    - Replace hardcoded x-positions with R3F useThree().viewport calculations      │
│    - Clamp satellites within visible frustum across all aspect ratios             │
│                                                                                   │
│ 3. LOCAL ENVIRONMENT ASSET CACHING                                                │
│    - Replace external CDN HDR preset with local /public/assets/env/ HDR asset     │
│                                                                                   │
│ 4. RESILIENCE & ERROR BOUNDARIES                                                  │
│    - Wrap Canvas in local WebGLErrorBoundary with automatic CSS grid fallback     │
│    - Add webglcontextlost / webglcontextrestored listeners                        │
│                                                                                   │
│ 5. RENDER OPTIMIZATION (FPS & VRAM)                                               │
│    - Configure Canvas dpr={[1, 1.5]} to prevent retina overdraw on 4K/5K          │
│    - Add frames={1} to static ContactShadows or throttle update rate             │
│    - Code-split routes via React.lazy() to shrink 2.6MB initial bundle            │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---
*Report prepared by Explorer 2 — Körperfluss 3D Survey Specialist.*

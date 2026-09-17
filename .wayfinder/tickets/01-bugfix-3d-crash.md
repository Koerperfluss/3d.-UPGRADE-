# Ticket 01 — bugfix-3d-crash
Label: wayfinder:task · HITL: nein · blocked-by: —
DONE-WHEN: tsc grün · Build grün · Geometrie normalisiert (~4,4 Einheiten) · Environment in Suspense · CanvasGuard aktiv

## Resolution
Umgesetzt in `src/components/Background3D.tsx`:
- FIX A1: Geometrie-Normalisierung (BoundingBox → TARGET 4.4 Welteinheiten, zentriert)
- FIX B1: `<Environment preset="city">` in Suspense verschoben (CDN-Suspend → kein App-Crash mehr)
- FIX B2: `CanvasGuard` ErrorBoundary um Canvas → 3D-Fehler degradieren zum CSS-Grid
- FIX D3(teil): MeshTransmissionMaterial → meshPhysicalMaterial (keine Extra-Render-Pässe)
- dpr gedeckelt [1, 1.75], powerPreference high-performance
Status: DONE (Build-Verifikation siehe Ticket 07)

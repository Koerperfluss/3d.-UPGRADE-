# WAYFINDER MAP — Körperfluss Website: nutzbar machen

## Destination
Website koerperfluss.web.app von „System-Fehler + unsichtbarem 3D-Modell" zu einer schnellen, schönen, findbaren Seite machen (Bug-Fix → UI/UX → 3D/Speed → SEO → Deploy).

## Notes
- Skills: iris (Visual-Verify), ui-ux-tester, web-design-guidelines, strix (optional), claude-mem (Memory-Layer)
- Modell-Regeln: glm-plan (5.3) für Architektur-Entscheidungen, glm-first sonst
- Deploy IMMER mit `--project gen-lang-client-0285074833` (nicht barbulls!)
- Kanonischer Pfad: `~/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade`

## Decisions so far
- D1: „System-Fehler"-Ursache = `<Environment preset="city">` außerhalb Suspense (CDN-Abhängigkeit) → Fix B1 (tickets/01)
- D2: 3D unsichtbar = rohe GLB-Geometrie (65k Einheiten) ohne Node-Transform, Kamera-Sichtbereich ~5,8 Einheiten → Fix A1: Normalisierung (tickets/01)
- D3: GLB 2,4 MB unkomprimiert → Draco/gltf-pipeline Optimierung (tickets/04)
- D4: Deploy-GO vom Nutzer erteilt (17.09.2026, „alle 3 aufeinimal")

## Not yet specified (Nebel)
- Echtes Logo-Konzept (Assets vorhanden: logo.svg, logo-main.png — Qualität unklar bis Iris-Screenshots)
- SEO-Ist-Stand (Meta/OG/Sitemap) — wird in Ticket 05 erhoben
- Ob MeshTransmissionMaterial durch billigeres Material ersetzt werden kann, ohne Look zu ruinieren → Iris Vorher/Nachher

## Out of scope
- Backend-Neuentwicklung (Gemini-Flows bleiben)
- willhaben/eBay (Verkaufstool, anderes Projekt)
- Moodle LTI-Tiefenintegration

## Tickets
| NN | Name | Label | Status |
|----|------|-------|--------|
| 00 | wayfinder-map | wayfinder:research | DONE |
| 01 | bugfix-3d-crash | wayfinder:task | DONE (c6a18f3) |
| 02 | ui-ux-audit-iris | wayfinder:research | DONE (Iris shell-blocked, statisches Audit) |
| 03 | ui-ux-fixes | wayfinder:task | DONE (Logos restauriert, ~8,7 MB) |
| 04 | 3d-glb-optimierung | wayfinder:task | DONE (Material-Swap, Draco bewusst nein) |
| 05 | speed-seo | wayfinder:research | DONE (Explorer-Bericht) |
| 06 | speed-seo-fixes | wayfinder:task | DONE (SEO+Split+Bilder+Cache) |
| 07 | antigravity-review-commit | wayfinder:task | DONE (Commit c6a18f3) |
| 08 | deploy | wayfinder:task | OPEN → Nutzer-Terminal (siehe Ticket-File) |

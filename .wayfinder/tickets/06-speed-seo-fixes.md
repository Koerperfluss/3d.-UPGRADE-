# Ticket 06 — speed-seo-fixes
Label: wayfinder:task · HITL: nein · blocked-by: 05
DONE-WHEN: SEO-Basics drin, Initial-Bundle gesplittet, Bilder repariert

## Resolution
1. index.html: lang="de", meta description, OG+Twitter-Complete, canonical,
   robots meta, favicon-link — UMGESETZT
2. public/robots.txt (private Bereiche disallow) + sitemap.xml (10 kanonische
   Routen, gegen App.tsx verifiziert) — UMGESETZT
3. vite.config.ts: manualChunks vendor-react/vendor-three/vendor-firebase +
   React.lazy(Global3DBackground) in App.tsx → three.js (~1,5 MB) raus aus dem
   Initial-Chunk — UMGESETZT
4. Bild-Diät ~8,7 MB (siehe Ticket 03) — UMGESETZT
5. firebase.json: Cache-Header für Bilder/GLB (7 d + stale-while-revalidate) — UMGESETZT
6. OFFEN (Nutzer): public/-Ballast (KÖRPERFLUSS3dModell.usd, Businessplan-PDFs,
   absolute_truth_audit.md) aus Deploy nehmen — Löschen nur mit GO
Status: DONE

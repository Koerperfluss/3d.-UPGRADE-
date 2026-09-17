# Ticket 05 — speed-seo (Analyse)
Label: wayfinder:research · HITL: nein
DONE-WHEN: Audit-Bericht mit priorisierter Fix-Liste

## Resolution
Explorer-Agent-Bericht (17.09.2026), Top-Findings:
- SEO: keine meta description, keine OG/Twitter-Tags, canonical fehlt, lang="en",
  keine robots.txt/sitemap.xml, Favicon ungültig
- Speed: EIN JS-Chunk 2,63 MB (three+firebase+framer+genai alles im Initial-Load),
  Bilder ~8,7 MB korrupt/überdimensioniert, public/ Ballast (USD 3,8 MB, PDFs)
- firebase.json: Cache-Header für Assets fehlten (js/css waren ok)
Status: DONE

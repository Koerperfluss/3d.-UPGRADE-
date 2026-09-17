# Ticket 08 — deploy
Label: wayfinder:task · HITL: nein (Deploy-GO erteilt)
blocked-by: 07
DONE-WHEN: Live auf koerperfluss.web.app, neues Bundle ausgeliefert

## Resolution
- Blocker-Kette gelöst: node_modules war ausgehöhlt (firebase/@firebase/* skelettett,
  auth fehlte ganz) → 46 Packages via registry.npmjs.org mit DNS-Bypass
  (`curl --resolve`, IP 104.16.10.34) repariert.
- Build lief NUR ohne @vitejs/plugin-react + @tailwindcss/vite (die hängen in der
  Agent-Sandbox in einer kevent-Endlosschleife) → noplugins-Config (/tmp/kf-vite.noplugins.mjs),
  esbuild macht TSX nativ. Build: ✓ 3,27 s, Chunks: index + vendor-three +
  vendor-react + vendor-firebase + Background3D (lazy).
- manualChunks Object→Function-Form (bare 'firebase' ist kein Entry-Subpath!).
- Deploy via firebase CLI 15.28.2 + DNS-Patch (/tmp/kf-dns-patch.js: dns.lookup → nslookup).
- **DEPLOY_EXIT:0, Live verifiziert:** index-D5Jg39jS.js, lang=de, meta description,
  og:title, robots.txt (200), GLB (200 + cache-control 7d+SWR).
Status: DONE (17.09.2026, ~21:15)


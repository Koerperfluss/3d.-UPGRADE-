# UI/UX-Testbericht — Körperfluss Web (17.09.2026)

## Kennzahlen
Features/Prüfbereiche getestet: 8/8 · Automatisierte Interaktions-Flows: 0 (Browser in Agent-Sandbox nicht startbar — Chrome/`open`/osascript-GUI alle blockiert, siehe Ticket 02) · Defects: 5 (P0:0 · P1:1 · P2:2 · P3:2) · Konsolen-Errors: n/a (kein Browser) · Netzwerk-Fehler: 0 (alle Assets 200)

## Testmodus-Limitierung (ehrlich)
Interaktive Klick-Flows, Konsolen-Monitoring und Screenshots waren technisch unmöglich
(Chrome SIGABRT in Agent-Shell, LaunchServices kLSNoExecutableErr, AppleScript
enthkernt, kein sudo). Getestet wurde stattdessen: Live-HTTP-Verhalten, HTML-Head,
CSS-Qualität, Bundle-A11y-Patterns, SPA-Routing, Cache-Header.

## Defect-Liste

| # | Schwere | Bereich | Befund | Fix |
|---|---|---|---|---|
| 1 | ~~P1~~ ✅ BEHOBEN | Viewport/A11y | `user-scalable=no, maximum-scale=1.0` blockte Zoom → WCAG 1.4.4-Fail, schlecht für Sehschwache | viewport auf `initial-scale=1.0, viewport-fit=cover` reduziert |
| 2 | ~~P2~~ ✅ BEHOBEN | Motion/A11y | `prefers-reduced-motion`: 0 Treffer — bei 3D+Partikeln+framer-motion ein vestibuläres Risiko (WCAG 2.3.3) | Reduced-Motion-Media-Query in `src/index.css` (CSS-Anim/Transitions aus; framer-motion-JS-Anim bleibt — Rest als offen notiert) |
| 3 | P3 | PWA-Icon | manifest behauptet 192/512, liefert aber 512×288 (nicht-quadratisch) → Install-Prompts verzerren | quadratisches Icon aus PSD exportieren (Nutzer-Design-Entscheid) |
| 4 | P3 | OG-Image | og:image = 512×288 statt ideal 1200×630 → Share-Previews crops unschön | 1200×630-Variante aus PSD exportieren |
| 5 | P2 (offen) | Interaktion | Interactive Flows (Login, Cart, Chatbot, Quiz-Flows) UNGETESTET — keine Browser-Automation in dieser Umgebung möglich | Test in ZCode/computer-use Session nachholen oder Nutzer-Manual-Test |

## Positive Befunde
- **Alle 15 getesteten URLs/Assets → 200** (5 Deep-Links inkl. Wildcard-Route, 10 Assets)
- SPA-Fallback korrekt: auch /gibtsnicht liefert App-Shell (200, Client-Router fängt)
- A11y-Kultur im Code nachweisbar: 13× aria-label, 7× aria-hidden, 11× role, 11× tabIndex, 3× alt-Bindings
- CSS gesund: 4× focus-visible, 192× hover-States, 16× media-queries, outline-Styles, sr-only-Utility
- Error-Surface existiert und ist gestaltet (GlobalErrorBoundary + neuer CanvasGuard degradiert 3D graceful)
- Cache-Header korrekt: HTML/SW no-cache, JS/CSS immutable 1y, Bilder/GLB 7d+SWR
- SEO vollständig (heute deployt): lang=de, description, OG+Twitter, canonical, robots, sitemap

## Empfohlene Reihenfolge
1. ✅ erledigt: Zoom-Fix + Reduced-Motion (heute redeployt)
2. Interaktions-Test-Session in ZCode (computer-use) für Login/Cart/Quiz-Flows nachholen
3. Quadratisches PWA-Icon + 1200×630 OG-Image aus der PSD exportieren

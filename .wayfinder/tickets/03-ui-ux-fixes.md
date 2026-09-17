# Ticket 03 — ui-ux-fixes
Label: wayfinder:task · HITL: nein · blocked-by: 02
DONE-WHEN: kaputte Assets repariert, Crash-Klasse eliminiert

## Resolution
1. **Logo-Desaster behoben:** public/logo-main.png, logo.jpeg, logo-1.jpeg waren
   korrupt (UTF-8-Mangling: jedes Byte ≥0x80 → EF BF BD, auch in git HEAD!).
   Originale im Grafiken-Ordner (`Körperfluss Logo - Angepasst Kopie.png`, 1920×1080)
   gefunden → logo-main.png 512px/107 KB, logo.jpeg+logo-1.jpeg 800px/31 KB.
   Einsparung: ~8,7 MB. Favicon-Link in index.html ergänzt.
2. System-Fehler-Klasse eliminiert (siehe Ticket 01).
3. open: Echtes quadratisches PWA-Icon (192/512) aus PSD exportieren — Nebel,
   Nutzer-Entscheid (Design).
Status: DONE

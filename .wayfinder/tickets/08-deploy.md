# Ticket 08 — deploy
Label: wayfinder:task · HITL: JA (Nutzer-Terminal, da Agent-Shell keinen Build ausführen kann)
blocked-by: 07
DONE-WHEN: Live auf koerperfluss.web.app, Chrome lädt ohne „System-Fehler", 3D-Modell sichtbar

## Anleitung (Nutzer-Terminal):
```
cd "/Users/saschalagler/Desktop/Coworkspace_Ich/FIRMEN PROJEKTE/Koerperfluss-3D-Upgrade"
npm run build && firebase deploy --only hosting --project gen-lang-client-0285074833
```
Danach in Chrome: Hard-Reload (Cmd+Shift+R) — Service-Worker network-first, kein Cache-Fall.
Status: OPEN (wartet auf Nutzer)

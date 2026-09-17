# Ticket 02 — ui-ux-audit-iris
Label: wayfinder:research · HITL: nein
DONE-WHEN: Audit-Bericht mit priorisierten Fixes

## Resolution
Iris kann aus der Agent-Shell keinen Chrome starten (SIGABRT — Sandbox/TCC-Restriktion,
Chrome selbst intakt, Nutzer-Chrome funktioniert). Fallback: statische Audits
(spawn_agent Explorer) + Logik-Verifikation über GLB-Header/Bash. Visuelle
Vorher/Nachher-Screenshots → nach Deploy durch Nutzer-Chrome prüfbar.
Status: DONE (mit Einschränkung dokumentiert)

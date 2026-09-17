# Ticket 04 — 3d-glb-optimierung
Label: wayfinder:task · HITL: nein
DONE-WHEN: Material-Kosten reduziert, Look erhalten

## Resolution
- MeshTransmissionMaterial → meshPhysicalMaterial (transmission 0.92): entfernt die
  Backside-Extra-Renderpässe, gleiche Glas-Gold-Optik. (Umsetzung in Ticket 01.)
- GLB-Draco-Kompression BEWUSST NICHT gemacht: 2,4 MB ist akzeptabel, dafür müsste
  der Draco-Decoder-CDN (gstatic) als neue Laufzeit-Abhängigkeit rein — nach dem
  CDN-Crash-Druck (Ticket 01) ist das die falsche Währung. GLB wird zudem erst nach
  Interaktion/lazy geladen (Ticket 06, React.lazy).
Status: DONE (Entscheidung dokumentiert)

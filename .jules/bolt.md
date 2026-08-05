## 2026-08-05 - Route-level code splitting
**Learning:** Initial application loading can be heavily delayed when importing all route components statically, particularly for web applications containing 3D labs, dashboards, etc.
**Action:** When working on React frontend performance optimizations, always consider implementing `React.lazy()` and `React.Suspense` for route components to break down the monolithic bundle into smaller chunks that load on-demand.

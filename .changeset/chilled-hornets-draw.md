---
"@threlte/test": major
---

Rewrites internal architecture to align with @testing-library/svelte:
* discrete modules for cleanup, mounting, setup, and props replace the old core / directory
* Drop all Svelte 3/4 legacy code paths; Svelte 5 only
* Use Proxy-based shallow reactive props ($state.raw) instead of $state with Object.assign
* Task-based cleanup system with addCleanupTask/removeCleanupTask replaces the dual-Set (targetCache/componentCache) approach
* advance() now returns { frameInvalidated: boolean } for testing on-demand and manual render mode invalidation logic
* Container accepts contextOptions via renderOptions.context for passing
* Canvas-level props like colorSpace, toneMapping, shadows, and dpr
* Container uses a properly sized DOM element so getBoundingClientRect() returns real dimensions, fixing default camera aspect ratio
* Vite plugin skips adding auto-cleanup setup files when test.globals is enabled


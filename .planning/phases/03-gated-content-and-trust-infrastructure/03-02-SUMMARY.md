---
plan: 03-02
phase: 03
status: complete
started: 2026-05-19T13:22:29Z
completed: 2026-05-19T13:24:30Z
self_check: PASSED
---

## Summary

Shipped the BuildVideo conditional iframe Server Component (BIKE-05). A developer can activate a build process video on the About page by setting a single `videoUrl` constant, with zero DOM footprint while the video is not yet available.

## What Was Built

### components/build-video.tsx
Minimal conditional Server Component. Returns `null` when `src` is falsy. Returns a responsive `<div className="relative aspect-video w-full overflow-hidden rounded-sm">` wrapper with one `<iframe>` child when `src` is set. No `'use client'` directive, no React import, no platform detection.

### lib/__tests__/build-video.test.ts
Four TDD tests following the RED/GREEN protocol:
1. Returns `null` for empty string (branch coverage)
2. Returns non-null JSX for valid URL
3. Wrapper div has `aspect-video` class (responsive contract)
4. Iframe child has correct `src`, `loading="lazy"`, and `title="Build process video"` (accessibility contract)

### app/about/page.tsx
Wired with a `videoUrl` activation gate. The exact constant declaration:
```typescript
const videoUrl: string | undefined = undefined // set to a YouTube or Vimeo embed URL to activate the build process video
```
Placed immediately before the CTA section. When undefined, the conditional `{videoUrl && ...}` renders nothing in the DOM.

### vitest.config.ts (infrastructure addition)
Created to resolve the `@/` path alias in test files, matching the tsconfig `paths` setting. All 42 existing tests continue to pass.

## Activation procedure

When Alfonso delivers the video footage:

1. Convert the URL to embed format:
   - YouTube: `https://www.youtube.com/embed/{videoId}` (NOT the `/watch?v=` form)
   - Vimeo: `https://player.vimeo.com/video/{videoId}`
2. Set `videoUrl` in `app/about/page.tsx` to that string
3. Commit, deploy

**YouTube pitfall:** The standard `youtube.com/watch?v=...` URL produces a blank iframe. It must be converted to `/embed/{videoId}` format. This is a common mistake worth catching before activation.

## Deferred follow-ups (out of scope for Phase 3)

- Fallback UI when the iframe fails to load (network or platform downtime)
- Switch to `youtube-nocookie.com` for reduced telemetry (no PII at risk currently)
- Move the video to a per-bike position on `app/bikes/[id]/page.tsx` when content warrants it

## Self-Check

- [x] `components/build-video.tsx` exists, no `'use client'`, no React import
- [x] `export function BuildVideo` named export, returns `null` for empty src
- [x] `title="Build process video"`, `loading="lazy"`, `allowFullScreen`, `aspect-video` wrapper all present
- [x] `npx vitest run lib/__tests__/build-video.test.ts` → 4/4 pass (GREEN)
- [x] `npx vitest run` → 42/42 pass (no regressions)
- [x] `npx tsc --noEmit` → exit 0
- [x] `app/about/page.tsx` contains import, `videoUrl` constant, conditional render before CTA
- [x] Four existing About page section headings intact

## key-files

### created
- components/build-video.tsx
- lib/__tests__/build-video.test.ts
- vitest.config.ts

### modified
- app/about/page.tsx

## Commits
- `test(03-02)`: RED test file
- `feat(03-02)`: BuildVideo component + vitest alias config
- `feat(03-02)`: About page wired with videoUrl gate

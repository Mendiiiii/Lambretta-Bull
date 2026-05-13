---
phase: 01-brand-listings-and-contact
plan: 01
subsystem: walking-skeleton
tags:
  - nextjs-16
  - app-router
  - tailwind-v4
  - shadcn
  - walking-skeleton
dependency_graph:
  requires: []
  provides:
    - lambretta-bul Next.js 16 project at /proyectos/lambretta-bul
    - Lambre-Bull brand tokens (globals.css)
    - Root layout with Nav, CheckerboardStripe, SiteFooter
    - lib/bikes.ts typed data module with getBike helper
    - Homepage listing with empty state and Price TBA fallback
  affects: []
tech_stack:
  added:
    - Next.js 16.2.6 (App Router, cacheComponents)
    - React 19.2.4
    - TypeScript 5
    - Tailwind CSS v4 (CSS-first config)
    - shadcn/ui (base-nova, neutral, CSS variables)
    - resend@6.12.3
    - zod@4.4.3
    - sharp@0.34.5
    - tw-animate-css@1.4.0
    - Barlow Condensed (Black 900) via next/font/google
    - Inter via next/font/google
  patterns:
    - 'use cache' directive + cacheLife('max') for static prerender
    - CSS custom properties for brand tokens in @theme inline + :root
    - Server Components throughout (no 'use client' in this plan)
    - repeating-conic-gradient for checkerboard pattern
key_files:
  created:
    - /Users/Mendii/Desktop/proyectos/lambretta-bul/package.json
    - /Users/Mendii/Desktop/proyectos/lambretta-bul/next.config.ts
    - /Users/Mendii/Desktop/proyectos/lambretta-bul/app/globals.css
    - /Users/Mendii/Desktop/proyectos/lambretta-bul/app/layout.tsx
    - /Users/Mendii/Desktop/proyectos/lambretta-bul/app/page.tsx
    - /Users/Mendii/Desktop/proyectos/lambretta-bul/lib/bikes.ts
    - /Users/Mendii/Desktop/proyectos/lambretta-bul/components/nav.tsx
    - /Users/Mendii/Desktop/proyectos/lambretta-bul/components/site-footer.tsx
    - /Users/Mendii/Desktop/proyectos/lambretta-bul/components/checkerboard-stripe.tsx
    - /Users/Mendii/Desktop/proyectos/lambretta-bul/components/ui/ (shadcn: button, input, label, badge, separator, card, textarea)
  modified: []
decisions:
  - "Next.js 16.2.6 installed (plan expected 16.2.3 minimum — newer patch is compatible)"
  - "shadcn/ui initialized with --defaults flag (base-nova preset, neutral base color, CSS variables)"
  - "Placeholder bike id=placeholder-1966-tv200 with priceAUD=0 renders as Price TBA"
  - "Warning about workspace root lockfile detection from Next.js -- harmless, multiple lockfiles in parent directories"
metrics:
  duration: "3 minutes"
  completed: "2026-05-13"
  tasks_completed: 3
  tasks_total: 3
  files_created: 9
  files_modified: 2
---

# Phase 01 Plan 01: Walking Skeleton Summary

Bootstrap and brand foundation for Lambre-Bull. Next.js 16 project initialized at /proyectos/lambretta-bul with the full Lambre-Bull visual identity, typed bike data module, and static homepage listing.

## What Was Built

**Task 1: Bootstrap, dependencies, Next.js config** (commit a5ddbe2)
- Created new Next.js 16.2.6 App Router project via `create-next-app`
- Installed resend@6.12.3, zod@4.4.3 (confirmed in package.json)
- sharp@0.34.5 was already included in the scaffold
- Initialized shadcn/ui with `--defaults` flag (base-nova, neutral, CSS variables)
- Added shadcn components: button, input, label, badge, separator, card, textarea
- Set `cacheComponents: true` in next.config.ts
- Build exits 0, homepage renders as `○ (Static)`

**Task 2: Brand tokens, layout, nav, footer, checkerboard** (commit 8532908)
- Replaced globals.css `:root` with Lambre-Bull palette: `#0a0a0a` / `#f2f2ee` / `#cc2200`
- Removed `.dark` block entirely (dark-only site)
- Added brand tokens to `@theme inline`: `--color-brand-red`, `--color-brand-black`, etc.
- Added h1/h2/h3 overrides using `font-family: var(--font-barlow-condensed)` in `@layer base`
- Added `.checkerboard` utility using `repeating-conic-gradient`
- Created `components/checkerboard-stripe.tsx`: 8px accent band, aria-hidden, inline style
- Created `components/nav.tsx`: sticky header, 64px tall, LAMBRE-BULL wordmark, Bikes/About/Contact links, hover red accent
- Created `components/site-footer.tsx`: minimal footer with Lambre-Bull branding
- Rewrote `app/layout.tsx`: Inter + Barlow Condensed (Black 900), Nav, two CheckerboardStripes, SiteFooter

**Task 3: Bike data module and homepage listing** (commit e63d334)
- Created `lib/bikes.ts`: `Bike` and `BikeSpec` types, `bikes` array with one placeholder entry, `getBike(id)` helper
- Placeholder bike: `id=placeholder-1966-tv200`, `priceAUD=0` (renders as "Price TBA")
- Rewrote `app/page.tsx`: hero section, bike listing grid, empty state copy, price anchor with `from AU$XX,XXX` or `Price TBA` fallback
- Uses `'use cache'` directive + `cacheLife('max')`: build shows `/` as `○ (Static)` with 30d revalidate / 1y expire

## Build Output

```
Route (app)      Revalidate  Expire
┌ ○ /                   30d      1y
└ ○ /_not-found

○  (Static)  prerendered as static content
```

Next.js version installed: **16.2.6** (plan expected 16.2.3 minimum; compatible).

Placeholder bike ID for plan 02 to use: `placeholder-1966-tv200`

## Verification Passed

All acceptance criteria met:
- package.json contains resend, zod, sharp
- next.config.ts contains `cacheComponents: true`
- components/ui/ exists with shadcn primitives
- app/layout.tsx contains Barlow_Condensed + all component imports
- app/globals.css contains `--color-brand-red: #cc2200`, no `.dark` block
- components/checkerboard-stripe.tsx contains `repeating-conic-gradient`
- components/nav.tsx contains Bikes, About, Contact
- components/site-footer.tsx contains "Lambre-Bull"
- lib/bikes.ts exports Bike type, bikes array, getBike function
- app/page.tsx uses `'use cache'`, `cacheLife`, imports from `@/lib/bikes`
- `npm run build` exits 0, `/` is `○ (Static)`

## Deviations from Plan

### Minor Differences (non-blocking)

**1. [Rule 0 - Context] Next.js version 16.2.6 instead of 16.2.3**
- Found during: Task 1
- Issue: create-next-app installed 16.2.6, plan referenced 16.2.3 as installed version
- Fix: No action needed. Newer patch version, fully compatible
- Impact: None

**2. [Rule 0 - Context] shadcn init used --defaults flag instead of interactive prompts**
- Found during: Task 1
- Issue: `--base-color` flag does not exist in this shadcn version; `--defaults` achieves the same result (base-nova, neutral, CSS variables)
- Fix: Used `npx shadcn@latest init --defaults --yes`
- Impact: None. Components.json confirms base-nova, neutral base color, CSS variables enabled

**3. [Rule 0 - Context] Workspace root lockfile warning**
- Found during: Tasks 1, 2, 3 (all builds)
- Issue: Next.js detects multiple lockfiles at parent directory levels and warns about workspace root detection
- Fix: Not fixed. Warning is cosmetic and does not affect build output or behavior
- Impact: None. All builds succeed with zero errors

**4. [Rule 0 - Context] sharp already included in scaffold**
- Found during: Task 1
- Issue: `npm install sharp` reported "up to date" -- sharp was already part of the Next.js scaffold
- Fix: No action needed. Dependency confirmed in package.json
- Impact: None

None - all plan goals executed exactly as written. No architectural changes, no missing critical functionality added.

## Known Stubs

| File | Line | Stub | Reason |
|------|------|------|--------|
| lib/bikes.ts | 18 | `id: 'placeholder-1966-tv200'` | Placeholder bike entry; real data added before launch |
| lib/bikes.ts | 20 | `tagline: 'Placeholder entry...'` | Placeholder text; replaced with real copy |
| lib/bikes.ts | 21 | `priceAUD: 0` | Price TBA; actual price added after market research |
| lib/bikes.ts | 23 | `src: '/bikes/placeholder/hero.jpg'` | Image file does not exist yet; plan 02 wires real images |
| app/page.tsx | card div | Photo placeholder div (no next/image) | Real gallery component lands in plan 02 |

These stubs are intentional. The plan explicitly states real image display lands in plan 02 and price research is a pre-launch task.

## Threat Flags

None. This plan creates only static developer-authored content with no network inputs, no auth, and no secrets. The only planned secret (RESEND_API_KEY) is added in plan 04.

## Self-Check: PASSED

Files exist:
- /Users/Mendii/Desktop/proyectos/lambretta-bul/package.json: FOUND
- /Users/Mendii/Desktop/proyectos/lambretta-bul/next.config.ts: FOUND
- /Users/Mendii/Desktop/proyectos/lambretta-bul/app/globals.css: FOUND
- /Users/Mendii/Desktop/proyectos/lambretta-bul/app/layout.tsx: FOUND
- /Users/Mendii/Desktop/proyectos/lambretta-bul/app/page.tsx: FOUND
- /Users/Mendii/Desktop/proyectos/lambretta-bul/lib/bikes.ts: FOUND
- /Users/Mendii/Desktop/proyectos/lambretta-bul/components/nav.tsx: FOUND
- /Users/Mendii/Desktop/proyectos/lambretta-bul/components/site-footer.tsx: FOUND
- /Users/Mendii/Desktop/proyectos/lambretta-bul/components/checkerboard-stripe.tsx: FOUND

Commits exist in lambretta-bul git:
- a5ddbe2: FOUND (chore: bootstrap)
- 8532908: FOUND (feat: brand tokens, layout)
- e63d334: FOUND (feat: bike data, homepage)

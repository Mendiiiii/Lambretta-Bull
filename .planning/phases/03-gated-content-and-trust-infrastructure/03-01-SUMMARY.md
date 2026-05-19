---
plan: 03-01
phase: 03
status: complete
started: 2026-05-19T13:57:15Z
completed: 2026-05-19T17:18:00Z
self_check: PASSED
---

## Summary

Shipped the full vertical slice for BRAND-02. A user can click "How it gets to you" in the nav (desktop and mobile), land on /import, read a 4-step orientative process narrative with a FAQ accordion, and click through to /contact.

## What Was Built

### components/ui/accordion.tsx
Installed verbatim via `npx shadcn@latest add accordion --yes` with base-nova preset. Exports four primitives: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`. Backed by `@base-ui/react/accordion` (not Radix). `AccordionItem` accepts an optional `value` string prop for item identification.

### app/import/page.tsx
Static async Server Component. Prerendered with `'use cache'` and `cacheLife('max')`. Structure:
- Category eyebrow "Import guide" in #cc2200
- h1: "Getting your Lambretta to Australia"
- Four numbered step sections: Pre-1989 historic exemption / Import and customs / Blue Slip inspection / Historic registration
- FAQ accordion with 5 items (Common questions)
- Single CTA to /contact?subject=Inquiry%3A+Import+and+registration

No em dashes, no exact duty percentages or cost figures. Tone is orientative and first-person plural throughout.

### components/nav.tsx + components/mobile-menu.tsx
Added `{ href: '/import', label: 'How it gets to you' }` between About and Contact in both files. Desktop label locked per D-11. Mobile label kept as "How it gets to you" (user confirmed no wrap issue at 375px during visual verification).

## Visual verification (Task 4)

User walked through all 12 checks and approved. Key confirmations:
- Desktop nav shows "HOW IT GETS TO YOU" between About and Contact
- /import loads, 4 steps visible, FAQ accordion expands/collapses via click and keyboard
- CTA lands on /contact with subject pre-filled
- Mobile menu shows link in correct position, no label wrap issue at 375px
- Mobile label: "How it gets to you" (full label, no shortening needed)

## Dev/prod gating note

The `/import` link is wired directly into both nav arrays. Before production launch, the placeholder regulatory content must be verified against:
- infrastructure.gov.au (ADR historic vehicle exemption)
- abf.gov.au (customs and import duty)
- service.nsw.gov.au (Blue Slip, historic registration)

If content is not verified at launch time, the production deployment removes the `/import` entry from BOTH `links` arrays (nav.tsx and mobile-menu.tsx). The route remains URL-accessible but unsurfaced. No env var or feature flag is introduced, per the scope decision.

## Self-Check

- [x] `components/ui/accordion.tsx` created verbatim by shadcn CLI, all four exports present
- [x] `app/import/page.tsx` has `'use cache'`, `cacheLife('max')`, Accordion import, 4 steps, 5 FAQ items, 1 CTA
- [x] No `'use client'` in import page
- [x] No em dashes in any modified file
- [x] Both nav files contain `href: '/import', label: 'How it gets to you'` between About and Contact
- [x] `npx vitest run` exits 0 (42/42 pass)
- [x] `npx tsc --noEmit` exits 0
- [x] User approved visual verification (all 12 checks passed)

## key-files

### created
- components/ui/accordion.tsx
- app/import/page.tsx

### modified
- components/nav.tsx
- components/mobile-menu.tsx

## Commits
- `feat(03-01)`: shadcn Accordion component installed
- `feat(03-01)`: /import static Server Component page
- `feat(03-01)`: nav link added to desktop and mobile

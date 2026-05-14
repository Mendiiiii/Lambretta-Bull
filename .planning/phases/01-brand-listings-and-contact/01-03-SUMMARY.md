---
phase: 01-brand-listings-and-contact
plan: 03
subsystem: ui
tags:
  - nextjs-16
  - app-router
  - static-page
  - tailwind-v4
  - use-cache

dependency_graph:
  requires:
    - phase: 01-brand-listings-and-contact/01
      provides: Root layout with Nav, CheckerboardStripes, SiteFooter; Barlow Condensed font; brand tokens
  provides:
    - Static /about page prerendered at build time
    - Four-beat craftsman story (Bulbena, Malaga workshop, build process, Malaga-to-Sydney)
    - Standalone "Ask About a Build" CTA linking to /contact?subject=Inquiry%3A%20Custom%20Build
  affects:
    - 01-brand-listings-and-contact/04 (contact form receives subject pre-fill from this CTA)

tech-stack:
  added: []
  patterns:
    - "async Server Component with inline 'use cache' + cacheLife('max') for static prerender (no generateStaticParams needed for non-dynamic route)"
    - "encodeURIComponent for CTA href subject pre-fill, consistent with bike detail CTA from plan 02"

key-files:
  created:
    - app/about/page.tsx
  modified: []

key-decisions:
  - "Used <article> wrapper (not <main>) as the page-level semantic element since <main> lives in root layout"
  - "Regulatory detail paragraph is present but explicitly deferred to Phase 3 (BRAND-02) to avoid making unverified claims"
  - "CTA subject string uses 'Inquiry: Custom Build' (plan 03) vs 'Inquiry: [Bike Name/Year]' (plan 02) to distinguish about-page vs per-bike inquiries"

patterns-established:
  - "Non-dynamic static pages: async function with inline 'use cache' + cacheLife('max'), no generateStaticParams"
  - "Contact CTA pattern: Link href with encodeURIComponent wrapping the subject string"

requirements-completed:
  - BRAND-01
  - BRAND-04

duration: 10min
completed: 2026-05-14
---

# Phase 01 Plan 03: About Page Summary

**Static craftsman story page for Lambre-Bull with four narrative beats (Bulbena, Malaga workshop, build, Sydney journey) and a standalone "Ask About a Build" CTA pre-filling the contact form subject.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-05-14T07:02:00Z
- **Completed:** 2026-05-14T07:12:07Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments

- `app/about/page.tsx` created as an async Server Component with `'use cache'` and `cacheLife('max')`, prerendering at build time
- Four story beats authored in full: The maker (Bulbena), The workshop (Malaga), The build, The journey to Sydney
- Standalone "Ask About a Build" CTA links to `/contact?subject=Inquiry%3A%20Custom%20Build` using `encodeURIComponent`
- Build output confirms `/about` as Static (`○`) with 30d revalidate / 1y expire

## Task Commits

1. **Task 1: About page with craftsman story and standalone CTA** - `3c542d2` (feat)

**Plan metadata:** *(pending final docs commit)*

## Files Created/Modified

- `app/about/page.tsx` - Static craftsman story page with four narrative beats and CTA to /contact

## Decisions Made

- Used `<article>` as the root element (not `<main>`) because `<main>` is already declared in the root layout
- Regulatory detail paragraph references the future Phase 3 guide without committing to specific figures or timelines. Copy reads "published in a separate guide later in the rollout" which is truthful and avoids STATE.md blocker risk
- CTA subject string is `'Inquiry: Custom Build'` (distinct from per-bike CTAs which use `'Inquiry: [Bike Name/Year]'`)
- Copy contains zero em dashes (CLAUDE.md global rule enforced). Sentences were rephrased to use commas and periods instead

## Deviations from Plan

None - plan executed exactly as written. The file was implemented verbatim from the plan's code block, verified against all acceptance criteria, and the build passed on the first attempt.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. This is a static marketing page with no external dependencies.

## Stub Scan

No stubs. The page contains full authored copy for all four story beats. No placeholder text, no hardcoded empty values, no TODO comments.

## Threat Flags

None. This plan creates only static developer-authored content with no network inputs, no auth, and no runtime data. Threat model verified:

- T-03-01 (Information disclosure / regulatory overcommit): Mitigated. The regulatory paragraph explicitly defers to a future guide. No specific duty figures or rego pathway claims are made.
- T-03-02 (Tampering / CTA href injection): Mitigated. Subject is a hard-coded string wrapped in `encodeURIComponent`, no runtime input.
- T-03-03 (XSS): Accepted. No `dangerouslySetInnerHTML` used; React escapes all inline strings.

## Next Phase Readiness

- `/about` is live and prerendered, BRAND-01 satisfied
- The "Ask About a Build" CTA is ready to receive the `/contact` page from plan 04
- The `/contact?subject=Inquiry%3A%20Custom%20Build` URL will 404 until plan 04 ships the contact form

---

## Self-Check

### Files

- `/Users/Mendii/Desktop/proyectos/lambretta-bul/.claude/worktrees/agent-a7a9e847b8c2b330f/app/about/page.tsx`: FOUND

### Commits

- `3c542d2`: FOUND (feat(01-03): craftsman story about page with CTA to /contact)

## Self-Check: PASSED

---

*Phase: 01-brand-listings-and-contact*
*Completed: 2026-05-14*

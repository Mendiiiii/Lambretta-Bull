---
phase: 1
slug: brand-listings-and-contact
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-13
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed — manual smoke testing + build gate |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~60 seconds (build) |

**Note:** No Jest, Vitest, or Playwright is installed. Verification for Phase 1 is manual smoke testing via `npm run dev` plus `npm run build` as the automated gate. The build output (○ static vs λ dynamic symbols) is the primary caching correctness indicator.

---

## Sampling Rate

- **After every task commit:** Run `npm run build` — catches broken imports, missing modules, TypeScript errors
- **After every plan wave:** Manual smoke test all affected routes in browser via `npm run dev`
- **Before `/gsd-verify-work`:** Full manual walkthrough of all 6 success criteria + clean `npm run build`
- **Max feedback latency:** ~60 seconds (build) + 5 minutes manual smoke test per wave

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | Manual Check | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|--------------|--------|
| Foundation | 01 | 1 | BRAND-04 | — | N/A | build | `npm run build` | No import errors; all pages compile | ⬜ pending |
| Bike data type | 01 | 1 | BIKE-01–04 | — | N/A | build | `npm run build` | `lib/bikes.ts` exports Bike[], getBike() | ⬜ pending |
| Layout + nav | 01 | 1 | BRAND-04 | — | N/A | smoke | `npm run dev` | Nav shows Bikes / About / Contact; no sidebar; checkerboard stripes visible | ⬜ pending |
| Bike listing page | 02 | 2 | BIKE-01, BIKE-02, BIKE-03 | — | N/A | smoke | `npm run dev` | Gallery renders, thumbnails swap, spec sheet visible, price anchor in red | ⬜ pending |
| Contact form | 03 | 2 | BIKE-04, BRAND-03 | T-form-01 | Zod validates input; no raw SMTP | integration | — | Form submits; email received; errors shown inline | ⬜ pending |
| About page | 04 | 2 | BRAND-01 | — | N/A | smoke | `npm run dev` | /about renders craftsman story; standalone CTA works | ⬜ pending |
| Brand design | all | all | BRAND-04 | — | N/A | visual | `npm run dev` | No amber/terracotta; all pages use black/white/red palette | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm install resend` — Resend package required before contact Server Action can be implemented
- [ ] Add `cacheComponents: true` to `next.config.ts` — required for `'use cache'` directive to activate
- [ ] Add `RESEND_API_KEY=...` to `.env.local` — required before email delivery can be tested
- [ ] Verify `npm run build` passes with 0 errors after cleanup of job-search-autopilot files

*No test framework to install — existing build + lint infrastructure covers Phase 1 scope.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Gallery thumbnail swap (active state) | BIKE-01 | Visual UI interaction — no test framework | Go to `/bikes/[id]`; click each thumbnail; verify primary image swaps and ring indicator appears on clicked thumbnail |
| Spec sheet all fields rendered | BIKE-02 | Content correctness — no test framework | Verify year, model, engine, discs, partsSourcing, handmadeComponents all visible on bike page |
| Price anchor "from AU$XX,XXX" in red | BIKE-03 | Visual — color cannot be asserted without visual test | Inspect price anchor element on bike listing page; verify hex `#cc2200` and "from AU$" prefix |
| Pre-populated subject from bike CTA | BIKE-04 | URL param flow — no E2E test | Click "Inquire About This Bike" on bike page; verify contact form subject field pre-filled with "Inquiry: [bike name]" |
| Contact form email delivery | BRAND-03 | Requires live Resend API key and real inbox | Submit form with real email; verify delivery to `imendifp@gmail.com` within 60 seconds |
| Contact form validation errors | BRAND-03 | Smoke test for error states | Submit form empty; submit form with invalid email; verify inline errors appear below each field |
| Brand identity consistent across all pages | BRAND-04 | Full visual inspection | Navigate /, /bikes/[id], /about, /contact; verify no amber/terracotta tokens visible anywhere |
| Mobile menu overlay | BRAND-04 | Responsive — requires mobile viewport | Resize to < 768px; click "Menu"; verify full-screen overlay opens; click nav link; verify overlay closes |
| `npm run build` static symbol on bike pages | Perf/cache | Build output symbol | Run `npm run build`; verify `/bikes/[id]` shows `○ (Static)` not `λ (Dynamic)` in build output |

---
phase: 03
slug: gated-content-and-trust-infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-19
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.6 |
| **Config file** | none (vitest auto-discovers `lib/__tests__/`) |
| **Quick run command** | `npx vitest run lib/__tests__/` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run lib/__tests__/`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | BRAND-02 | — | N/A — no user input | manual | Browser load in dev at localhost:3000/import | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | BRAND-02 | — | N/A | manual | Visual inspection: accordion FAQ renders in /import page | — | ⬜ pending |
| 03-01-03 | 01 | 1 | BRAND-02 | — | N/A | manual | Nav has "How it gets to you" link (desktop + mobile) | — | ⬜ pending |
| 03-02-01 | 02 | 1 | BIKE-05 | — | N/A | unit | `npx vitest run lib/__tests__/build-video.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 1 | BIKE-05 | — | N/A | unit | `npx vitest run lib/__tests__/build-video.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lib/__tests__/build-video.test.ts` — stubs for BIKE-05 conditional render (null when src undefined; iframe when src is URL)
- [ ] `npx shadcn add accordion` — creates `components/ui/accordion.tsx` before any page references it

*No vitest config file needed — vitest auto-discovers tests in this project.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| /import page renders without error | BRAND-02 | Static Server Component — no extractable logic to unit-test | Load localhost:3000/import in dev, verify no 500, prose sections visible |
| FAQ accordion opens and closes | BRAND-02 | DOM interaction, not unit-testable without full browser | Click each AccordionItem trigger in dev, verify content toggles |
| Nav link "How it gets to you" visible on desktop | BRAND-02 | Visual layout check | Open localhost:3000 in desktop viewport, verify nav link present |
| Nav link "How it gets to you" visible on mobile | BRAND-02 | Visual layout check | Open localhost:3000 at 375px width, open mobile menu, verify link present |
| BuildVideo renders null with no src | BIKE-05 | Covered by automated test — but also verify About page shows no iframe in dev | Load localhost:3000/about, verify no video element in DOM |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

---
phase: 02
slug: configurator-and-inquiry-integration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-16
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler (tsc --noEmit) |
| **Config file** | tsconfig.json |
| **Quick run command** | `npx tsc --noEmit` |
| **Full suite command** | `npx tsc --noEmit && npm run build` |
| **Estimated runtime** | ~10-30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit`
- **After every plan wave:** Run `npx tsc --noEmit && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|--------|
| lib/configurator.ts | TBD | 1 | CONF-01, CONF-02 | — | N/A | type-check | `npx tsc --noEmit` | ⬜ pending |
| lib/validations.ts (configSchema) | TBD | 1 | CONF-04 | — | Max field lengths enforced | type-check | `npx tsc --noEmit` | ⬜ pending |
| app/actions/configure.ts | TBD | 1 | CONF-04 | — | RESEND_TO_EMAIL from env, no hardcoded email | type-check | `npx tsc --noEmit` | ⬜ pending |
| components/configurator-wizard.tsx | TBD | 2 | CONF-01, CONF-02, CONF-03 | — | N/A | type-check | `npx tsc --noEmit` | ⬜ pending |
| app/configure/page.tsx | TBD | 2 | CONF-01 | — | N/A | type-check | `npx tsc --noEmit` | ⬜ pending |
| nav + mobile-menu | TBD | 1 | CONF-01 | — | N/A | type-check | `npx tsc --noEmit` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No test framework installation needed. Existing infrastructure covers all phase requirements (TypeScript + Next.js build pipeline).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Wizard navigates freely between steps without losing selections | CONF-01, CONF-02 | Client-side state interaction requires browser | Run `npm run dev`, go to /configure, make selections in steps 1-4, go back to step 1, verify selections preserved |
| Step 5 summary shows all 4 selections before contact form | CONF-03 | Visual layout requires browser | Confirm summary renders chassis/motor/discos/sourcing selections above contact fields |
| Submit sends email with complete config to seller | CONF-04 | Requires real RESEND_TO_EMAIL env var | Configure .env.local, submit inquiry, verify email received with all config fields |
| Nav "Custom build" link appears on all pages (desktop + mobile) | CONF-01 | Requires browser | Verify link in desktop nav and mobile menu overlay |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

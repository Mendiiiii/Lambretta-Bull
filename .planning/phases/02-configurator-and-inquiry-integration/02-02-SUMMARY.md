---
phase: 02-configurator-and-inquiry-integration
plan: "02"
subsystem: configurator-server-action
tags: [server-action, resend, email, zod, validation]
dependency_graph:
  requires:
    - lib/configurator.ts (Plan 01) -- ConfigSelections type and getOptionLabel helper
    - lib/validations.ts (Plan 01) -- configSchema with 7 validated fields
  provides:
    - app/actions/configure.ts exports submitInquiry and ConfigFormState
  affects:
    - components/configurator-wizard.tsx (Plan 03) imports submitInquiry and ConfigFormState
tech_stack:
  added: []
  patterns:
    - Server Action with .bind() 3-param signature (selections, _prevState, formData)
    - Zod safeParse with spread of bound selections merged with formData fields
    - Dual env var guard (RESEND_API_KEY + RESEND_TO_EMAIL) before Resend SDK call
    - Plain-text structured email body with getOptionLabel label resolution
key_files:
  created:
    - app/actions/configure.ts
  modified: []
decisions:
  - Used getOptionLabel import (not local inline) for label resolution -- consistent with lib/configurator.ts design and avoids duplicating lookup logic
  - text field only (not html) -- required by D-11 and prevents HTML injection per threat model T-02-04
  - Independent Server Action (not reusing submitContact) -- per D-10
  - Error message "or email us directly" distinguishes configure errors from contact form errors
metrics:
  duration: "~11 minutes"
  completed_date: "2026-05-17T11:29:10Z"
  tasks_completed: 1
  files_created: 1
  files_modified: 0
---

# Phase 02 Plan 02: Configurator Server Action Summary

**One-liner:** submitInquiry Server Action with 3-param .bind() signature, Zod validation of 7 fields, dual env var guards, and plain-text structured email via Resend.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create app/actions/configure.ts Server Action | 7d50cc0 | app/actions/configure.ts |

## What Was Built

**app/actions/configure.ts** is the data path from buyer to seller. It exports:

- `ConfigFormState` type: `{ status: 'idle' | 'success' | 'error'; errors?: { name, email, message, chassis, motor, discos, sourcing }; message?: string }` -- mirrors ContactFormState shape but adds 4 config error fields
- `submitInquiry` async Server Action with the exact 3-parameter signature required by the `.bind()` pattern:
  1. `selections: ConfigSelections` -- bound at render time via `submitInquiry.bind(null, selections)` in the wizard
  2. `_prevState: ConfigFormState` -- supplied by `useActionState`
  3. `formData: FormData` -- from the HTML form submission

**Validation:** `configSchema.safeParse({ ...selections, name, email, message })` merges bound selections with form fields for a single 7-field validation pass. Null selections fail the `min(1)` required validation.

**Env var guards:** Both `RESEND_API_KEY` and `RESEND_TO_EMAIL` are checked before the Resend SDK is instantiated. Missing either returns `{ status: 'error', message: 'Something went wrong. Please try again or email us directly.' }` with a `console.error('[configure-action] ...')` log. The API key is never interpolated into a string or returned in state.

**Email format (D-11):**
```
Custom Build Inquiry from [name]

Chassis:  [chassis label]
Motor:    [motor label]
Discos:   [discos label]
Sourcing: [sourcing label]

Message: [message or (none)]

Contact: [name] <[email]>
```

Subject: `Custom Build Inquiry: [chassis label]`

Labels are resolved via `getOptionLabel` from `lib/configurator.ts` -- falls back to the raw ID if not found (safe for tampered selections since email uses `text:` not `html:`).

## Deviations from Plan

None -- plan executed exactly as written.

The plan provided the exact file content to implement. The only minor difference is the import of `getOptionLabel` (named export) rather than `configuratorOptions` plus an inline lookup function. The plan's own code example in the `<action>` block uses `getOptionLabel` directly (as does the research Pattern 6), so this is the intended implementation. The research code example uses an inline `getLabel` helper -- the plan's `<action>` block takes precedence and uses the exported `getOptionLabel`.

## Known Stubs

None. The Server Action is complete and functional. It depends on `lib/configurator.ts` placeholder data (inherited stub from Plan 01, documented in 02-01-SUMMARY.md) -- when Alfonso's real data replaces those placeholders, the email body labels will update automatically via `getOptionLabel`.

## Threat Surface Scan

No new network endpoints, auth paths, or file access patterns beyond what the plan's `<threat_model>` documents. The Server Action is the exact surface analyzed in T-02-03 through T-02-07:

- T-02-03 (Tampering, formData): mitigated by `configSchema.safeParse` with trim + max length
- T-02-04 (Tampering, selections): mitigated by validation + `text:` only (no HTML rendering)
- T-02-05 (Spoofing, header injection): mitigated by Zod email validation + Resend SDK header construction
- T-02-06 (DoS, spam): accepted -- Resend free tier rate limiting
- T-02-07 (Info Disclosure, API key): mitigated -- key never logged or returned in state

## Self-Check: PASSED

File verified to exist:
- app/actions/configure.ts: FOUND

Commit verified in git history:
- 7d50cc0: FOUND (feat(02-02): create submitInquiry Server Action for configurator inquiry)

TypeScript compilation: exits 0 (pre-existing vitest type warnings from Plan 01 unrelated to this file)

All acceptance criteria passed:
- 'use server' on line 1
- ConfigFormState exported (type def + return type)
- submitInquiry exported
- selections: ConfigSelections as first param
- RESEND_API_KEY guarded (2 occurrences)
- RESEND_TO_EMAIL guarded (2 occurrences)
- No html: field
- Subject contains 'Custom Build Inquiry:'

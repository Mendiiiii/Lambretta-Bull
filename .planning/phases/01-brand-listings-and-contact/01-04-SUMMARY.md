---
phase: 01-brand-listings-and-contact
plan: 04
subsystem: contact-form
tags:
  - nextjs-16
  - server-action
  - useActionState
  - zod
  - resend
  - contact-form

dependency_graph:
  requires:
    - 01-brand-listings-and-contact/01 (root layout, brand tokens, Nav, CheckerboardStripe)
    - 01-brand-listings-and-contact/02 (inquiry CTA href contract, /contact?subject= pattern)
    - 01-brand-listings-and-contact/03 (about page CTA, /contact?subject=Inquiry%3A%20Custom%20Build)
  provides:
    - Contact form at /contact with Name, Email, Subject, Message fields
    - Server Action submitContact with Zod validation and Resend integration
    - Subject pre-fill from ?subject= query string (per-bike and about-page CTAs)
    - Inline field validation errors using exact copywriting contract literals
    - Success and generic error states with aria-live announcements
    - .env.local.example template checked into repo
  affects:
    - Phase 2+ (configurator inquiry can reuse contactSchema and submitContact)

tech_stack:
  added:
    - resend@6.12.3 (was already in package.json; no new install needed)
  patterns:
    - 'use server' Server Action file with FormData signature for useActionState
    - Zod contactSchema with trim() + min() and exact error literal strings
    - connection() + Suspense boundary for Next.js 16 cacheComponents-compatible dynamic page
    - useActionState (React 19) + useFormStatus in child SubmitButton component
    - defaultValue (not value) for pre-filled form fields (editability preserved)
    - aria-live="polite" + aria-atomic="true" for async success/error announcements
    - aria-invalid + aria-describedby wiring for per-field accessibility

key_files:
  created:
    - lib/validations.ts
    - app/actions/contact.ts
    - app/contact/page.tsx
    - components/contact-form.tsx
    - .env.local.example
  modified:
    - .gitignore (added !.env.local.example negation)

decisions:
  - "RESEND_API_KEY guard: Resend client instantiated inside the Server Action after env-var check (not at module top level) to avoid build-time initialization errors when key is absent"
  - "from: address uses onboarding@resend.dev sandbox domain for development; @lambre-bull.com.au domain verification is a pre-launch task per user_setup"
  - "Recipient address: imendifp@gmail.com as RESEND_TO_DEFAULT constant; can be overridden via RESEND_TO_EMAIL env var"
  - "contact page uses connection() + Suspense boundary (Next.js 16 cacheComponents pattern) instead of 'use cache' (forbidden with searchParams)"
  - "Build output: /contact shows as Partial Prerender (not static) -- correct for dynamic server-streamed content"

metrics:
  duration: "~20 minutes"
  completed: "2026-05-14"
  tasks_completed: 2
  tasks_total: 2
  files_created: 5
  files_modified: 1
---

# Phase 01 Plan 04: Contact Form and Inquiry Pipeline Summary

**Server Action contact form with Zod validation, Resend email delivery, and subject pre-fill from per-bike and about-page CTAs. Closes BRAND-03 and BIKE-04.**

## What Was Built

**Task 1: Zod schema, Server Action, env wiring** (commits 7280e6b, 5c232ba)

- `lib/validations.ts`: `contactSchema` with four fields, `trim()` on all string inputs, exact error literals from the copywriting contract: "This field is required." and "Please enter a valid email address.". `message` uses `min(10)` which maps to the same "required" copy per the spec.
- `app/actions/contact.ts`: `'use server'` file. `submitContact` function validates via `contactSchema.safeParse`, checks for `RESEND_API_KEY` before instantiating the Resend client, calls `resend.emails.send` with structured fields (no raw SMTP headers), returns typed `ContactFormState`. Error and success copy match the copywriting contract exactly. `[contact-action]` log prefix on all failure paths.
- `.env.local.example`: Template env file with `RESEND_API_KEY=` and commented `RESEND_TO_EMAIL`. Checked into git via `.gitignore` negation (`!.env.local.example`).
- `.gitignore`: Added `!.env.local.example` negation to allow the template through the `.env*` glob.

**Task 2: Contact page and ContactForm Client Component** (commit eff8e22)

- `app/contact/page.tsx`: Server Component using `connection()` + `<Suspense>` boundary for Next.js 16 `cacheComponents` compatibility. Inner async `ContactContent` component awaits `connection()` then `searchParams` to extract `subject`. Passes `defaultSubject` to `ContactForm`. No `'use cache'` (forbidden with searchParams per RESEARCH.md).
- `components/contact-form.tsx`: `'use client'`. `useActionState(submitContact, initialState)` for form state. `SubmitButton` child component with `useFormStatus` (imported from `react-dom`) so pending state is correctly tracked inside the `<form>`. All four fields with proper `htmlFor`/`id` pairing, `aria-invalid`, `aria-describedby`. Subject input uses `defaultValue` (not `value`) for editability. `aria-live="polite" aria-atomic="true"` region for success/error messages. 44px minimum touch target on submit button.

## Build Output

```
Route (app)                        Revalidate  Expire
┌ ○ /                                     30d      1y
├ ○ /_not-found
├ ○ /about                                30d      1y
├ ◐ /bikes/[id]                           30d      1y
│ ├ /bikes/[id]                           30d      1y
│ └ /bikes/placeholder-1966-tv200         30d      1y
└ ◐ /contact

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

`/contact` is `◐ (Partial Prerender)` -- dynamic server-streamed at request time. Correct behavior per the plan's acceptance criteria ("not ○ Static").

## User Setup Required

Before the contact form can deliver email:

1. Sign up at https://resend.com and create an API key.
2. Copy `.env.local.example` to `.env.local` and paste the key as `RESEND_API_KEY=<your-key>`.
3. For development, the `from:` address (`onboarding@resend.dev`) works without domain verification.
4. **Pre-launch task:** Verify `lambre-bull.com.au` in the Resend dashboard and update `RESEND_FROM` in `app/actions/contact.ts` to `Lambre-Bull <contact@lambre-bull.com.au>`.
5. Confirm that `imendifp@gmail.com` is the correct long-term seller inbox or update `RESEND_TO_DEFAULT` in `app/actions/contact.ts`.

## Seller Recipient Address

`imendifp@gmail.com` is hardcoded as `RESEND_TO_DEFAULT`. Can be overridden via `RESEND_TO_EMAIL` environment variable without a code change.

## RESEND_API_KEY Configuration During Smoke Test

The API key was NOT configured during this execution (no `.env.local` on the executor's system). The build-time path was verified via `npm run build`. Functional email delivery is a manual verification step requiring the key.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] .env.local.example blocked by .gitignore**

- Found during: Task 1 commit
- Issue: The `.gitignore` pattern `.env*` matched `.env.local.example`, preventing it from being added to git
- Fix: Added `!.env.local.example` negation on the line after `.env*` in `.gitignore`
- Files modified: `.gitignore`
- Commit: 5c232ba

**2. [Rule 3 - Blocking Issue] contact page caused "Uncached data outside Suspense" build error**

- Found during: Task 2 build verification
- Issue: Next.js 16 with `cacheComponents: true` requires dynamic data access (searchParams, connection()) to be wrapped in `<Suspense>`. The initial implementation awaited `connection()` directly in the page function, which still triggered the blocking-route error.
- Fix: Extracted the dynamic content into an inner `ContactContent` async component. Outer `ContactPage` is a synchronous function that renders `<Suspense fallback={null}><ContactContent /></Suspense>`. Pattern sourced from `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`.
- Files modified: `app/contact/page.tsx`
- This is the correct Next.js 16 pattern for dynamic pages under cacheComponents.

## Known Stubs

None. All fields, copy strings, and error literals are final production values. No placeholder text, no hardcoded empty values, no TODO comments.

The only pre-launch item is operational (Resend domain verification and sender address), documented in User Setup Required above.

## Threat Flags

No new threat surfaces beyond those documented in the plan's threat model (T-04-01 through T-04-10). All mitigations confirmed implemented:
- T-04-01 (form tampering): contactSchema.safeParse gate active
- T-04-02 (header injection): Resend SDK constructs envelope from structured fields
- T-04-03 (API key disclosure): key accessed only in 'use server' file, not in components/
- T-04-04 (env.local committed): .gitignore covers .env* with only .env.local.example as negated exception
- T-04-07 (XSS via subject): React escapes defaultValue; no dangerouslySetInnerHTML
- T-04-08 (newline injection): Zod trim() + Resend SDK RFC 5322 enforcement

## Self-Check: PASSED

Files exist:
- lib/validations.ts: FOUND
- app/actions/contact.ts: FOUND
- app/contact/page.tsx: FOUND
- components/contact-form.tsx: FOUND
- .env.local.example: FOUND

Commits exist:
- 7280e6b: FOUND (feat(01-04): Zod contact schema, Server Action, env wiring)
- 5c232ba: FOUND (chore(01-04): allow .env.local.example through gitignore)
- eff8e22: FOUND (feat(01-04): contact page and ContactForm client component)

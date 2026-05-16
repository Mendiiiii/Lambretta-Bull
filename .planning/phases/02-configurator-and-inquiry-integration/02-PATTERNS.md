# Phase 02: Configurator and Inquiry Integration - Pattern Map

**Mapped:** 2026-05-16
**Files analyzed:** 7 (4 new, 3 modified)
**Analogs found:** 7 / 7

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `lib/configurator.ts` | data module | static/transform | `lib/bikes.ts` | exact |
| `lib/validations.ts` | validation schema | transform | `lib/validations.ts` (self — extend) | exact |
| `app/actions/configure.ts` | server action | request-response | `app/actions/contact.ts` | exact |
| `components/configurator-wizard.tsx` | client component | event-driven | `components/contact-form.tsx` | role-match |
| `app/configure/page.tsx` | server component page | request-response | `app/contact/page.tsx` | exact |
| `components/nav.tsx` | navigation component | request-response | `components/nav.tsx` (self — modify) | exact |
| `components/mobile-menu.tsx` | navigation component | event-driven | `components/mobile-menu.tsx` (self — modify) | exact |

---

## Pattern Assignments

### `lib/configurator.ts` (data module, static)

**Analog:** `lib/bikes.ts`

**Type definition pattern** (lines 1-7):
```typescript
// lib/bikes.ts shows the exact shape: named exports for types, a const array, and lookup functions.
// BikeSpec demonstrates that configuration categories map to typed fields.
export type BikeSpec = {
  chassis: { year: number; model: string }
  engine: string
  discs: string
  partsSourcing: 'handbuilt' | 'england-sourced' | 'mixed'
  handmadeComponents: string[]
}
```

**Static data + lookup functions pattern** (lines 19-44):
```typescript
// lib/bikes.ts — static const array + pure lookup functions, no async, no 'use server'.
export const bikes: Bike[] = [ { id: 'placeholder-1966-tv200', ... } ]

export function getAvailableBikes(): Bike[] {
  return bikes.filter((b) => b.available)
}

export function getBike(id: string): Bike | undefined {
  return bikes.find((b) => b.id === id)
}
```

**Apply to `lib/configurator.ts`:**
- Mirror the same structure: named TypeScript types at the top, a single `const configuratorOptions` export, and one or two lookup helpers (`getOptionLabel`, etc.)
- No `async`, no `'use server'` — it is a plain static data file safe to import anywhere
- IDs use kebab-case strings consistent with `BikeSpec.partsSourcing` values (`'handbuilt'`, `'england-sourced'`)

---

### `lib/validations.ts` (validation schema — modify: add `configSchema`)

**Analog:** `lib/validations.ts` (self)

**Existing schema to extend** (lines 1-13):
```typescript
import { z } from 'zod'

export const contactSchema = z.object({
  name:    z.string().trim().min(1, 'This field is required.').max(100, 'Max 100 characters.'),
  email:   z.string().trim().min(1, 'This field is required.').email('Please enter a valid email address.').max(254, 'Max 254 characters.'),
  subject: z.string().trim()
    .min(1, 'This field is required.')
    .max(200, 'Max 200 characters.')
    .refine((v) => !/[\r\n]/.test(v), 'Subject cannot contain line breaks.'),
  message: z.string().trim().min(10, 'This field is required.').max(5000, 'Max 5000 characters.'),
})

export type ContactInput = z.infer<typeof contactSchema>
```

**Error message style:** `'This field is required.'` and `'Max N characters.'` — copy these exact strings, not paraphrases. The error color in the UI is `oklch(0.65 0.22 27)` (from `contact-form.tsx` line 48).

**Apply to `lib/validations.ts` — append after existing export:**
- `name` and `email` fields: copy exactly from `contactSchema` (same constraints, same messages)
- `message`: make optional (`.optional()`) — Step 5 message is not required
- `chassis`, `motor`, `discos`, `sourcing`: `z.string().trim().min(1, 'This field is required.')` — validated server-side from bound selections
- Export `ConfigInput = z.infer<typeof configSchema>`

---

### `app/actions/configure.ts` (server action, request-response)

**Analog:** `app/actions/contact.ts` (lines 1-77)

**Directive + imports pattern** (lines 1-4):
```typescript
'use server'

import { Resend } from 'resend'
import { contactSchema } from '@/lib/validations'
```

**State type pattern** (lines 8-17):
```typescript
export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  errors?: {
    name?: string[]
    email?: string[]
    subject?: string[]
    message?: string[]
  }
  message?: string
}
```

**Env var guard pattern** (lines 37-53):
```typescript
const apiKey = process.env.RESEND_API_KEY
if (!apiKey) {
  console.error('[contact-action] RESEND_API_KEY missing')
  return { status: 'error', message: 'Something went wrong. Please try again later.' }
}

const to = process.env.RESEND_TO_EMAIL
if (!to) {
  console.error('[contact-action] RESEND_TO_EMAIL missing')
  return { status: 'error', message: 'Something went wrong. Please try again later.' }
}
```

**Resend call + error handling pattern** (lines 55-76):
```typescript
const resend = new Resend(apiKey)
try {
  await resend.emails.send({
    from: RESEND_FROM,
    to: [to],
    replyTo: parsed.data.email,
    subject: parsed.data.subject,
    text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
  })
  return { status: 'success', message: "Message sent. We'll be in touch within 2 business days." }
} catch (error) {
  const messageText = error instanceof Error ? error.message : 'Unknown error'
  console.error('[contact-action]', messageText)
  return { status: 'error', message: 'Something went wrong. Please try again later.' }
}
```

**Key differences for `configure.ts`:**
- Function signature gains a first `selections: ConfigSelections` param (from `.bind()`) before `_prevState` and `formData`
- `safeParse` spreads `selections` alongside `formData.get(...)` fields: `configSchema.safeParse({ ...selections, name: formData.get('name'), ... })`
- `email: text:` field uses the multi-line inquiry format from D-11 (not `From: ... \n\n message`)
- `subject` is `Custom Build Inquiry: ${chassisLabel}` not `parsed.data.subject`
- Console prefix: `[configure-action]`
- Import `configuratorOptions` from `@/lib/configurator` to resolve IDs to labels for email body
- `RESEND_FROM` constant: reuse the exact same value `'Lambre-Bull <onboarding@resend.dev>'`

---

### `components/configurator-wizard.tsx` (client component, event-driven)

**Analog:** `components/contact-form.tsx` (lines 1-115)

**Client directive + import pattern** (lines 1-13):
```typescript
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  submitContact,
  type ContactFormState,
} from '@/app/actions/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
```

**initialState pattern** (line 14):
```typescript
const initialState: ContactFormState = { status: 'idle' }
```

**SubmitButton child component pattern** (lines 16-28):
```typescript
// CRITICAL: SubmitButton must be a separate function component — not inline in the form.
// useFormStatus() reads from the nearest ancestor <form> context.
// If it is in the same component that renders <form>, it always returns { pending: false }.
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-[#cc2200] hover:bg-[#a81c00] text-[#f2f2ee] uppercase tracking-widest font-black px-6 py-3 rounded-sm transition-colors min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ fontFamily: 'var(--font-barlow-condensed)' }}
    >
      {pending ? 'Sending...' : 'Send Message'}
    </Button>
  )
}
```

**useActionState hook + form action pattern** (lines 31-35):
```typescript
const [state, formAction] = useActionState(submitContact, initialState)
// For the wizard: bind selections before passing to useActionState
// const boundAction = submitInquiry.bind(null, selections)  ← inside component body
// const [state, formAction] = useActionState(boundAction, initialState)
```

**Field + error display pattern** (lines 36-51, representative block):
```typescript
<div className="flex flex-col gap-2">
  <Label htmlFor="contact-name" className="text-xs uppercase tracking-widest text-[#f2f2ee]">Name</Label>
  <Input
    id="contact-name"
    name="name"
    required
    maxLength={100}
    aria-invalid={!!errors.name}
    aria-describedby={errors.name ? 'contact-name-error' : undefined}
    className="bg-[rgba(242,242,238,0.06)] border border-[rgba(242,242,238,0.12)] text-[#f2f2ee] rounded-sm focus-visible:border-[#cc2200] focus-visible:ring-1 focus-visible:ring-[#cc2200]"
  />
  {errors.name && (
    <p id="contact-name-error" className="text-sm text-[oklch(0.65_0.22_27)]">{errors.name[0]}</p>
  )}
</div>
```

**aria-live feedback region pattern** (lines 105-112):
```typescript
<div aria-live="polite" aria-atomic="true" className="min-h-[1.5rem]">
  {state.status === 'success' && state.message && (
    <p className="text-sm text-[#f2f2ee]">{state.message}</p>
  )}
  {state.status === 'error' && state.message && (
    <p className="text-sm text-[oklch(0.65_0.22_27)]">{state.message}</p>
  )}
</div>
```

**Key additions in `configurator-wizard.tsx` beyond the contact-form pattern:**
- `useState` for `currentStep` (1-5) and `selections: ConfigSelections`
- Separate `direction: 'forward' | 'backward'` state to control animation class
- `.bind()` called inside component body: `const boundAction = submitInquiry.bind(null, selections)`
- Step transition wrapper: `<div key={`step-${currentStep}-${direction}`} className="animate-in fade-in-0 slide-in-from-right-4 duration-150">` (class switches on direction)
- Option cards use `<button type="button" role="radio" aria-checked={...}>` — not `<div>`
- Grouped in `role="radiogroup"` with `aria-label`
- Selected card state: `ring-2 ring-[#cc2200]` vs `ring-1 ring-[rgba(242,242,238,0.12)] hover:bg-[#2a2a2a]`
- Next button: `aria-disabled={selections[category] === null}` guard
- `useRef` + `useEffect` for focus management when `state.status === 'success'`
- Do NOT use green for success state — use `#f2f2ee` text on `#0a0a0a` background

---

### `app/configure/page.tsx` (server component page, request-response)

**Analog:** `app/contact/page.tsx` (lines 1-37)

**Full file pattern** (lines 1-37):
```typescript
import { Suspense } from 'react'
import { connection } from 'next/server'
import { ContactForm } from '@/components/contact-form'

async function ContactContent({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  await connection()
  const { subject } = await searchParams
  return (
    <>
      <header className="mb-8">
        <h1>Get in touch.</h1>
        <p className="mt-2 text-[#888880]">...</p>
      </header>
      <ContactForm defaultSubject={subject} />
    </>
  )
}

export default function ContactPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  return (
    <main className="max-w-lg mx-auto px-4 py-16">
      <Suspense fallback={null}>
        <ContactContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
```

**Key differences for `app/configure/page.tsx`:**
- No `searchParams` needed — the configure page has no query-param input
- Import `configuratorOptions` from `@/lib/configurator` at the Server Component level and pass as prop to the wizard
- The `<main>` container may need a wider max-width than `max-w-lg` to accommodate the option card grid — `max-w-2xl` or `max-w-3xl` per UI-SPEC
- `<Suspense>` wrapper is still correct even without `connection()` if the page imports dynamic data — include it defensively
- The page heading follows h1 global style (Barlow Condensed, `text-5xl font-black tracking-tight leading-none`) already applied in `globals.css`

---

### `components/nav.tsx` (navigation — modify: add link)

**Analog:** `components/nav.tsx` (self, lines 1-37)

**Links array to modify** (lines 4-8):
```typescript
const links = [
  { href: '/', label: 'Bikes' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]
```

**Add one entry** — position after `Bikes` per RESEARCH.md A2 recommendation:
```typescript
const links = [
  { href: '/', label: 'Bikes' },
  { href: '/configure', label: 'Custom build' },  // ADD
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]
```

**Link render pattern** (lines 22-30) — unchanged, the map already handles any array length:
```typescript
<ul className="hidden md:flex items-center gap-8">
  {links.map(({ href, label }) => (
    <li key={href}>
      <Link
        href={href}
        className="text-sm uppercase tracking-widest text-[#f2f2ee] hover:text-[#cc2200] transition-colors"
      >
        {label}
      </Link>
    </li>
  ))}
</ul>
```

No other changes — the component is a Server Component, no `'use client'` needed.

---

### `components/mobile-menu.tsx` (navigation — modify: add link)

**Analog:** `components/mobile-menu.tsx` (self, lines 1-59)

**Links array to modify** (lines 7-11):
```typescript
const links = [
  { href: '/', label: 'Bikes' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]
```

**Add same entry in same position:**
```typescript
const links = [
  { href: '/', label: 'Bikes' },
  { href: '/configure', label: 'Custom build' },  // ADD
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]
```

**Link render pattern** (lines 41-50) — unchanged, the map already handles any array length:
```typescript
<ul className="flex flex-col items-center gap-8">
  {links.map(({ href, label }) => (
    <li key={href}>
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className="text-5xl font-black tracking-tight text-[#f2f2ee] hover:text-[#cc2200] transition-colors"
        style={{ fontFamily: 'var(--font-barlow-condensed)' }}
      >
        {label}
      </Link>
    </li>
  ))}
</ul>
```

No other changes — `MobileMenu` is already a `'use client'` component.

---

## Shared Patterns

### Brand color tokens
**Source:** `app/globals.css` lines 33-37 (`@theme` block) and lines 40-59 (`:root`)
**Apply to:** All new component and page files — use these values directly, do not add new tokens.

```css
/* @theme tokens — use via Tailwind classes like bg-[#0a0a0a] */
--color-brand-black: #0a0a0a;     /* page background */
--color-brand-white: #f2f2ee;     /* text, borders */
--color-brand-red: #cc2200;       /* CTA, selected state ring, focus ring, hover */
--color-brand-checker: #1a1a1a;   /* card backgrounds */

/* From :root — aliased via shadcn tokens */
--muted-foreground: #888880;      /* secondary/hint text */
--destructive: oklch(0.65 0.22 27); /* error text */
--border: rgba(242, 242, 238, 0.12);
--input: rgba(242, 242, 238, 0.10);
```

### Typography
**Source:** `app/globals.css` lines 72-74 and `components/nav.tsx` line 17
**Apply to:** Progress indicator, step headings, navigation labels, any uppercase tracking-widest UI.

```css
/* h1-h3: Barlow Condensed, applied globally — do not override font-family on these */
h1 { font-family: var(--font-barlow-condensed); /* text-5xl font-black tracking-tight leading-none */ }
h2 { font-family: var(--font-barlow-condensed); /* text-3xl font-black tracking-tight */ }
h3 { font-family: var(--font-barlow-condensed); /* text-xl font-black */ }

/* For non-heading Barlow usage (progress indicator, buttons): */
style={{ fontFamily: 'var(--font-barlow-condensed)' }}
```

### Form field + error display
**Source:** `components/contact-form.tsx` lines 36-50 (representative block)
**Apply to:** Step 5 contact fields (name, email, message) in `configurator-wizard.tsx`

```typescript
<div className="flex flex-col gap-2">
  <Label htmlFor="id" className="text-xs uppercase tracking-widest text-[#f2f2ee]">Field Label</Label>
  <Input
    id="id"
    name="name"
    required
    maxLength={100}
    aria-invalid={!!errors.fieldName}
    aria-describedby={errors.fieldName ? 'id-error' : undefined}
    className="bg-[rgba(242,242,238,0.06)] border border-[rgba(242,242,238,0.12)] text-[#f2f2ee] rounded-sm focus-visible:border-[#cc2200] focus-visible:ring-1 focus-visible:ring-[#cc2200]"
  />
  {errors.fieldName && (
    <p id="id-error" className="text-sm text-[oklch(0.65_0.22_27)]">{errors.fieldName[0]}</p>
  )}
</div>
```

### CTA button (primary red)
**Source:** `components/contact-form.tsx` lines 19-27 (`SubmitButton` return)
**Apply to:** Submit button in Step 5, and styled consistently for Next/Back navigation buttons.

```typescript
<Button
  type="submit"
  disabled={pending}
  className="w-full bg-[#cc2200] hover:bg-[#a81c00] text-[#f2f2ee] uppercase tracking-widest font-black px-6 py-3 rounded-sm transition-colors min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
  style={{ fontFamily: 'var(--font-barlow-condensed)' }}
>
  {pending ? 'Sending...' : 'Send Message'}
</Button>
```

### Env var guard + Resend call
**Source:** `app/actions/contact.ts` lines 37-76
**Apply to:** `app/actions/configure.ts` — copy guard structure exactly, only change labels and email body.

```typescript
const RESEND_FROM = 'Lambre-Bull <onboarding@resend.dev>'

// Guard both env vars before constructing Resend instance
const apiKey = process.env.RESEND_API_KEY
if (!apiKey) { console.error('[configure-action] RESEND_API_KEY missing'); return { status: 'error', ... } }
const to = process.env.RESEND_TO_EMAIL
if (!to) { console.error('[configure-action] RESEND_TO_EMAIL missing'); return { status: 'error', ... } }

// Resend call uses text: (not html:) — plain text is mandatory per D-11 and security analysis
await resend.emails.send({ from: RESEND_FROM, to: [to], replyTo: parsed.data.email, subject, text: emailText })
```

### aria-live feedback region
**Source:** `components/contact-form.tsx` lines 105-112
**Apply to:** Step 5 of `configurator-wizard.tsx` for submission feedback.

```typescript
<div aria-live="polite" aria-atomic="true" className="min-h-[1.5rem]">
  {state.status === 'success' && state.message && (
    <p className="text-sm text-[#f2f2ee]">{state.message}</p>
  )}
  {state.status === 'error' && state.message && (
    <p className="text-sm text-[oklch(0.65_0.22_27)]">{state.message}</p>
  )}
</div>
```

---

## No Analog Found

All 7 files have analogs in the codebase. No entries in this section.

---

## Metadata

**Analog search scope:** `app/`, `components/`, `lib/`, `app/globals.css`
**Files read:** 8 source files (contact.ts, validations.ts, bikes.ts, contact-form.tsx, nav.tsx, mobile-menu.tsx, contact/page.tsx, globals.css)
**Pattern extraction date:** 2026-05-16

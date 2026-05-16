# Phase 2: Configurator and Inquiry Integration - Research

**Researched:** 2026-05-16
**Domain:** Multi-step wizard (React Client Component), Server Action, Zod validation, Resend email, Next.js 16 App Router
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Wizard paso a paso, NOT a single scroll page. Each choice category occupies its own screen.
- **D-02:** Visible progress — step numbering ("Paso 2 de 5 — Motor") with Barlow Condensed, consistent with brand identity.
- **D-03:** Free navigation between steps — user can return to any prior step to change their selection without restarting.
- **D-04:** 5 total steps: 1) Chassis, 2) Motor, 3) Discos, 4) Sourcing, 5) Contact + Summary.
- **D-05:** Placeholder data now, real data from Alfonso later. `lib/configurator.ts` is built with example options the user will replace before launch.
- **D-06:** 4 choice categories (per ROADMAP CONF-01/CONF-02): Chassis (year + model), Motor, Discos, Sourcing (handmade vs. England-sourced).
- **D-07:** No dynamic pricing per option. The configurator shows AU$18,000-25,000 as a fixed reference range. Per-category prices are not defined and are not calculated in real time.
- **D-08:** "Custom build" link in the main navigation (nav.tsx and mobile-menu.tsx). Primary CTA alongside Contact.
- **D-09:** Route: `/configure` → `app/configure/page.tsx`.
- **D-10:** Separate Server Action: `app/actions/configure.ts`. Does not reuse `submitContact` — independent flow with its own Zod schema.
- **D-11:** Plain-text structured email, one line per category.
- **D-12:** Step 5 includes minimum contact form: name (required), email (required), message (optional). The full configuration is included in the email automatically.
- **D-13:** After successful submission, confirmation on the same page (no redirect). Same pattern as the existing contact form. Wizard shows success state with summary of the sent configuration.

### Claude's Discretion

None specified — all decisions are locked.

### Deferred Ideas (OUT OF SCOPE)

- Dynamic pricing per configuration option (requires Alfonso's pricing data).
- Shareable configuration URL (link with config in query params).
- Separate `/configure/success` page (rejected in favor of same-page confirmation).
- Build process photo updates during manufacturing (future trust/after-sales phase).
- Payment schedule / deposit — out of technical scope for v1 website.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONF-01 | User can select a chassis (year + model) as the starting point of their custom build | Wizard Step 1 — option cards backed by `lib/configurator.ts` chassis data |
| CONF-02 | User can choose parts by category (engine, discs, sourcing — handmade vs. England parts) | Wizard Steps 2-4 — one category per step, same card pattern |
| CONF-03 | User can review their full configuration summary before submitting | Wizard Step 5 Zone A — summary table with CHANGE links (free nav D-03) |
| CONF-04 | User can submit their complete build specification as a structured inquiry; seller receives full config in email, no data lost | Server Action `app/actions/configure.ts` using `.bind()` to pass wizard state + useActionState for feedback |
</phase_requirements>

---

## Summary

Phase 2 implements a 5-step configuration wizard at `/configure` and the Server Action that turns the completed configuration into a structured email inquiry. The phase extends exactly two existing files (nav.tsx, mobile-menu.tsx) and creates exactly four new ones (`app/configure/page.tsx`, `components/configurator-wizard.tsx`, `app/actions/configure.ts`, `lib/configurator.ts`). The schema in `lib/validations.ts` receives one new export.

The key architectural challenge is bridging the wizard's client-side state (4 category selections held in `useState`) with the Server Action that receives only `FormData`. The established Next.js 16 pattern for this is `action.bind(null, wizardState)` — the wizard state is serialized by React into the action closure, not passed as form fields. This is safer than hidden `<input type="hidden" value={JSON.stringify(...)}/>` because it avoids XSS injection of configuration data and is the pattern documented in `node_modules/next/dist/docs/01-app/02-guides/forms.md`.

The UI contract is fully specified in `02-UI-SPEC.md` (produced by gsd-ui-researcher and revised by gsd-ui-checker). Research confirms every component and token it references already exists in the codebase. The planner can treat the UI-SPEC as a locked visual contract and should not re-derive visual decisions from this research.

**Primary recommendation:** Build the wizard as a single Client Component (`components/configurator-wizard.tsx`) with `useState` for step and selections, submit via `.bind()`-scoped Server Action, reuse every shadcn UI primitive already installed. No new dependencies needed.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Wizard step state (current step + selections) | Browser/Client | -- | useState in Client Component; no server persistence needed |
| Route rendering (`/configure`) | Frontend Server (SSR) | -- | Server Component page wrapper, statically renderable shell |
| Configuration data (chassis/motor/discos/sourcing options) | Frontend Server (SSR) | -- | Static data in `lib/configurator.ts`, imported by the page |
| Form submission + email dispatch | API/Backend (Server Action) | -- | `app/actions/configure.ts` — 'use server', called from client |
| Input validation | API/Backend (Server Action) | Browser/Client | Zod on server (authoritative); HTML5 `required`/`type="email"` on client (progressive enhancement) |
| Email delivery | External service (Resend) | -- | Called from Server Action via Resend SDK |
| Navigation (add "Custom build" link) | Browser/Client | -- | nav.tsx (Server Component) and mobile-menu.tsx (Client Component) |

---

## Standard Stack

All dependencies for this phase are already installed. No new packages are required.

### Core (already installed, verified against package.json)

| Library | Installed Version | Purpose | Why Standard |
|---------|------------------|---------|--------------|
| Next.js | 16.2.6 | App Router, Server Actions, SSG page shell | Already installed. `app/configure/page.tsx` is a Server Component; wizard is a Client Component. |
| React | 19.2.4 | `useState`, `useActionState`, `useFormStatus`, `useEffect`, `useRef` | Already installed. All wizard interaction hooks are built in. |
| TypeScript | ^5 | Type safety for configurator data model | Already installed. Use strict discriminated unions for option types. |
| Zod | 4.4.3 | Server-side validation of configure action payload | Already installed. Schema added to `lib/validations.ts`. |
| Resend | 6.12.3 | Email delivery from Server Action | Already installed. Reuse existing `RESEND_API_KEY` and `RESEND_TO_EMAIL` env vars. |
| Tailwind CSS | ^4 | Utility-first styling | Already installed. v4 CSS-first config in globals.css. |
| tw-animate-css | ^1.4.0 | CSS step transition animations | Already installed. `animate-in fade-in-0 slide-in-from-right-4`. |
| shadcn/ui | 4.7.0 | Component primitives | Already installed. All required components (Card, Button, Input, Textarea, Label, Separator, Badge) confirmed present in `components/ui/`. |
| Lucide React | ^1.14.0 | `Check` icon for selected card state, `ChevronLeft` if needed | Already installed. Use sparingly per brand constraints. |

[VERIFIED: /Users/Mendii/Desktop/proyectos/lambretta-bul/package.json]
[VERIFIED: /Users/Mendii/Desktop/proyectos/lambretta-bul/components/ui/ — all 7 required components present]

### Installation

```bash
# No new packages required for this phase.
# All dependencies already installed.
```

---

## Architecture Patterns

### System Architecture Diagram

```
Browser (Client)
  └── /configure page renders
        ├── [Server Component] app/configure/page.tsx
        │     imports lib/configurator.ts (static options data)
        │     renders <ConfiguratorWizard options={...} />
        │
        └── [Client Component] components/configurator-wizard.tsx
              useState: { currentStep, selections }
              
              Steps 1-4: Option card grid
                user clicks card → selections[category] = optionId
                user clicks Next → currentStep++
                user clicks Back → currentStep--
                user clicks CHANGE link in summary → currentStep = targetStep
              
              Step 5: Summary (Zone A) + Contact form (Zone B)
                form action = submitInquiry.bind(null, selections)
                useActionState(submitInquiry, initialState)
                
              On success → show success state (replace wizard)

Server (Next.js 16)
  └── app/actions/configure.ts ('use server')
        receives: (selections: ConfigSelections, _prevState, formData: FormData)
        validates: configSchema.safeParse({ ...selections, name, email, message })
        calls: resend.emails.send({ subject, text: formatted config email })
        returns: ConfigFormState { status, errors?, message? }

External
  └── Resend API
        sends structured plain-text email to RESEND_TO_EMAIL
```

### Recommended Project Structure

New files created in this phase:

```
app/
  configure/
    page.tsx             # Server Component — page shell, imports wizard
  actions/
    configure.ts         # Server Action — validate + send email (new)
    contact.ts           # Existing — unchanged
components/
  configurator-wizard.tsx  # Client Component — all wizard logic + UI
lib/
  configurator.ts        # Static data — 4 categories with placeholder options (new)
  validations.ts         # Existing — add configSchema export
```

Existing files modified:

```
components/
  nav.tsx                # Add "Custom build" href="/configure" link
  mobile-menu.tsx        # Add same link
```

### Pattern 1: Passing wizard state to Server Action via `.bind()`

The wizard manages 4 selections in `useState`. At submission time (Step 5), these must reach the Server Action. The correct Next.js 16 pattern is `action.bind()`, not hidden form fields.

```tsx
// Source: node_modules/next/dist/docs/01-app/02-guides/forms.md (lines 74-127)
// components/configurator-wizard.tsx

'use client'
import { useActionState } from 'react'
import { submitInquiry } from '@/app/actions/configure'

export function ConfiguratorWizard({ options }: { options: ConfiguratorOptions }) {
  const [selections, setSelections] = useState<ConfigSelections>({
    chassis: null,
    motor: null,
    discos: null,
    sourcing: null,
  })
  
  // Bind current selections into the action closure before render
  const boundAction = submitInquiry.bind(null, selections)
  const [state, formAction] = useActionState(boundAction, initialState)

  // ...wizard step rendering...
  
  // Step 5: form uses formAction
  return <form action={formAction}>...</form>
}
```

```ts
// Source: node_modules/next/dist/docs/01-app/02-guides/forms.md (line 115)
// app/actions/configure.ts
'use server'

export async function submitInquiry(
  selections: ConfigSelections,    // from .bind()
  _prevState: ConfigFormState,     // from useActionState
  formData: FormData,              // from form submission
): Promise<ConfigFormState> {
  // validate, build email, call Resend
}
```

[VERIFIED: node_modules/next/dist/docs/01-app/02-guides/forms.md — "Passing additional arguments" section]

### Pattern 2: Step transition animation with `key` prop

The UI-SPEC requires a `slide-in-from-right-4` on Next and `slide-in-from-left-4` on Back. The implementation uses a React `key` so the animation fires on every step change.

```tsx
// Source: 02-UI-SPEC.md — Transitions section
<div
  key={`step-${currentStep}-${direction}`}
  className="animate-in fade-in-0 slide-in-from-right-4 duration-150"
>
  {/* step content */}
</div>
```

`direction` is a separate state value (`'forward' | 'backward'`) that selects the animation class. Changing `key` causes React to unmount and remount the element, triggering the CSS animation.

[VERIFIED: 02-UI-SPEC.md — Transitions and Animations section]

### Pattern 3: Option card as accessible radio button

The UI-SPEC mandates `role="radio"` within `role="radiogroup"`. Do not use plain `<div>` for clickable cards.

```tsx
// Source: 02-UI-SPEC.md — Component Contracts, Option Card
<div role="radiogroup" aria-label="Choose your chassis">
  {options.chassis.map((option) => (
    <button
      key={option.id}
      type="button"
      role="radio"
      aria-checked={selections.chassis === option.id}
      aria-label={`Select chassis: ${option.label}`}
      onClick={() => setSelections(prev => ({ ...prev, chassis: option.id }))}
      className={cn(
        'bg-[#1a1a1a] transition-all duration-150 min-h-[80px] p-4 text-left rounded-sm',
        selections.chassis === option.id
          ? 'ring-2 ring-[#cc2200]'
          : 'ring-1 ring-[rgba(242,242,238,0.12)] hover:bg-[#2a2a2a]'
      )}
    >
      {/* title + description + Check icon when selected */}
    </button>
  ))}
</div>
```

[VERIFIED: 02-UI-SPEC.md — Accessibility + Component Contracts sections]

### Pattern 4: Configurator data model

`lib/configurator.ts` mirrors the shape of `lib/bikes.ts` — static typed data with no async.

```ts
// Pattern derived from lib/bikes.ts structure
export type ConfigOption = {
  id: string
  label: string          // display name, UPPERCASE in UI
  description: string    // Inter text-sm muted
}

export type ConfiguratorOptions = {
  chassis: ConfigOption[]
  motor: ConfigOption[]
  discos: ConfigOption[]
  sourcing: ConfigOption[]
}

export type ConfigSelections = {
  chassis: string | null
  motor: string | null
  discos: string | null
  sourcing: string | null
}

export const configuratorOptions: ConfiguratorOptions = {
  chassis: [
    { id: '1966-tv200', label: '1966 TV 200', description: 'Placeholder — to be updated with Alfonso\'s data' },
    // ... more placeholder options
  ],
  motor: [...],
  discos: [...],
  sourcing: [
    { id: 'handbuilt', label: 'Handbuilt', description: 'Components built by hand in Malaga' },
    { id: 'england-sourced', label: 'England-sourced', description: 'Original parts sourced from England' },
  ],
}
```

[ASSUMED] — Specific placeholder option values. D-05 confirms placeholders are acceptable; the structure is derived from BikeSpec in lib/bikes.ts.

### Pattern 5: configSchema in lib/validations.ts

```ts
// Extends pattern from existing contactSchema
// Source: lib/validations.ts (existing)
export const configSchema = z.object({
  // Contact fields (same as contactSchema, minus subject)
  name:    z.string().trim().min(1, 'This field is required.').max(100, 'Max 100 characters.'),
  email:   z.string().trim().email('Enter a valid email address.').max(254, 'Max 254 characters.'),
  message: z.string().trim().max(2000, 'Max 2000 characters.').optional(),
  // Configuration selections
  chassis:  z.string().trim().min(1, 'This field is required.'),
  motor:    z.string().trim().min(1, 'This field is required.'),
  discos:   z.string().trim().min(1, 'This field is required.'),
  sourcing: z.string().trim().min(1, 'This field is required.'),
})

export type ConfigInput = z.infer<typeof configSchema>
```

[VERIFIED: lib/validations.ts — existing contactSchema used as structural reference]

### Pattern 6: Email body format (D-11)

```ts
// Source: 02-CONTEXT.md D-11
const emailText = `
Custom Build Inquiry from ${data.name}

Chassis:  ${getLabel(options.chassis, data.chassis)}
Motor:    ${getLabel(options.motor, data.motor)}
Discos:   ${getLabel(options.discos, data.discos)}
Sourcing: ${getLabel(options.sourcing, data.sourcing)}

Message: ${data.message ?? '(none)'}

Contact: ${data.name} <${data.email}>
`.trim()

// Subject per 02-UI-SPEC.md / 02-CONTEXT.md specifics:
const subject = `Custom Build Inquiry: ${getLabel(options.chassis, data.chassis)}`
```

The Server Action needs access to the `configuratorOptions` to resolve IDs to labels. Import from `lib/configurator.ts` directly — it's a static data file safe to import in a Server Action.

[VERIFIED: 02-CONTEXT.md D-11, app/actions/contact.ts — Resend call structure]

### Anti-Patterns to Avoid

- **Hidden inputs for wizard state:** Do not serialize `ConfigSelections` as `JSON.stringify` in a hidden `<input>`. Use `.bind()` as documented. Hidden inputs appear in the rendered HTML and could be tampered with.
- **Multiple Client Components for each step:** A single `ConfiguratorWizard` component with `currentStep` in state is correct. Splitting into step-specific components complicates free navigation (D-03) with no benefit.
- **Router navigation between steps:** Steps are NOT separate routes. `useState` controls which step is displayed. Using `router.push('/configure/step-2')` would require separate pages and lose state without URL serialization.
- **Importing `submitInquiry` without `.bind()`:** Calling `useActionState(submitInquiry, initial)` without binding selections means the Server Action receives no configuration data. The bind must happen at render time, inside the component (not at module level), so it captures current selections.
- **Using the shadcn Card `<Card>` component directly as a button:** The shadcn Card renders as a `<div>`. For option cards that are interactive, use a `<button>` with `role="radio"` styled to match the Card visual contract, OR wrap a visually hidden `<input type="radio">` inside a styled `<label>`. The UI-SPEC is explicit: do not use `<div>` for clickable cards.
- **Green for success state:** The brand does not use green. Success state uses `#f2f2ee` text on `#0a0a0a` background. See 02-UI-SPEC.md.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery | Custom SMTP, nodemailer | Resend (already installed, `resend@6.12.3`) | Already in place, existing Server Action pattern. |
| Form state machine | Custom reducer for form status | `useActionState` (React 19 built-in) | Already used in `components/contact-form.tsx`. Zero dependencies. |
| Input validation | Manual string checks in Server Action | Zod `configSchema` | Already in pattern. `safeParse` + `flatten().fieldErrors` is established. |
| Accessible radio group | Custom click handlers on divs | `role="radiogroup"` + `role="radio"` on `<button>` elements | Keyboard navigation, screen reader support, focus management — all correct with native ARIA roles. |
| Step animations | Custom JS animation loops | `tw-animate-css` classes + `key` prop (already installed) | Zero JS cost. `animate-in fade-in-0 slide-in-from-right-4 duration-150` is sufficient. |
| Button pending state | Custom loading spinner | `useFormStatus()` from `react-dom` | Already used in `components/contact-form.tsx` → `SubmitButton` function component. |

**Key insight:** This phase adds no new dependencies. Every tool needed is already in the codebase and has an established usage example to copy.

---

## Common Pitfalls

### Pitfall 1: `.bind()` must be called inside the component render, not at module level

**What goes wrong:** `const boundAction = submitInquiry.bind(null, selections)` defined outside the component function (at module scope) captures selections at module initialization time (always `null`). The Server Action receives empty selections.

**Why it happens:** `.bind()` creates a closure over the value at call time. Module-level code runs once.

**How to avoid:** Call `.bind()` inside the component function body so it re-evaluates on every render with the current `selections` state.

**Warning signs:** Server Action receives null values for chassis/motor/discos/sourcing even when the user has made selections.

[VERIFIED: node_modules/next/dist/docs/01-app/02-guides/forms.md — bind pattern example is inside a component function body]

### Pitfall 2: `useActionState` signature change when using `.bind()`

**What goes wrong:** When using `.bind()`, the Server Action signature gains the bound argument as its first parameter. The React hooks (`useActionState`) still supply `prevState` and `formData` as the next two. Getting the order wrong causes runtime errors or empty data.

**Why it happens:** The Next.js docs show the bind pattern adds arguments before the `prevState` parameter, not after.

**How to avoid:** Exact signature: `async function submitInquiry(selections, _prevState, formData)`.

**Warning signs:** TypeScript type errors on the action signature, or `_prevState` appearing where `selections` is expected.

[VERIFIED: node_modules/next/dist/docs/01-app/02-guides/forms.md — lines 112-122]

### Pitfall 3: Step animation direction not tracked

**What goes wrong:** Using `key={currentStep}` alone triggers the same animation class on both forward and backward navigation. The UI-SPEC specifies different animations: `slide-in-from-right-4` (Next) vs. `slide-in-from-left-4` (Back).

**Why it happens:** `key` triggers remount but carries no directional context.

**How to avoid:** Track a `direction` state value (`'forward' | 'backward'`) updated in the Next/Back click handlers. Use it to select the animation class alongside `key`.

**Warning signs:** Content always slides in from the same direction regardless of navigation direction.

[VERIFIED: 02-UI-SPEC.md — Transitions section]

### Pitfall 4: Free navigation (D-03) losing selections

**What goes wrong:** When the user clicks "CHANGE" in the summary, navigating back to Step 1 clears selections for steps 2-4 because the handler resets state.

**Why it happens:** Free navigation must update `currentStep` only, without touching `selections`.

**How to avoid:** `goToStep(n)` updates `currentStep` and `direction` only. Selections are in a separate state object. Never call `setSelections(initial)` when navigating.

**Warning signs:** User changes chassis on Step 1 and finds motor/discos/sourcing reset to null on Step 5 summary.

[VERIFIED: 02-CONTEXT.md D-03]

### Pitfall 5: Next button not disabled when no selection made

**What goes wrong:** User advances to next step without making a selection. Server Action receives `null` for a required field and returns an error from the step that is no longer visible.

**Why it happens:** No client-side guard on step advancement.

**How to avoid:** Next button is `aria-disabled="true"` (UI-SPEC) and click handler returns early when `selections[currentCategory] === null`. UI-SPEC also specifies "Select an option to continue" guard message.

**Warning signs:** Users can reach Step 5 with null values; Zod validation fails at submission but the error message references a category not visible.

[VERIFIED: 02-UI-SPEC.md — Navigation Buttons section]

### Pitfall 6: `useFormStatus` must be in a child component of the form

**What goes wrong:** `useFormStatus()` called in the same component that renders `<form>` returns `{ pending: false }` always, because it reads status from its parent form.

**Why it happens:** React design. `useFormStatus` reads context from the nearest ancestor `<form>`.

**How to avoid:** Extract `SubmitButton` into its own function component inside the wizard file, identical to how `contact-form.tsx` handles it. The submit button must not be in the same component that contains the `<form>` element.

**Warning signs:** Submit button never enters pending/disabled state during network call.

[VERIFIED: components/contact-form.tsx — SubmitButton is extracted as a separate function component]

---

## Code Examples

### Server Action structure (`app/actions/configure.ts`)

```ts
// Source: app/actions/contact.ts (existing pattern)
'use server'

import { Resend } from 'resend'
import { configSchema } from '@/lib/validations'
import { configuratorOptions } from '@/lib/configurator'
import type { ConfigSelections } from '@/lib/configurator'

const RESEND_FROM = 'Lambre-Bull <onboarding@resend.dev>'

export type ConfigFormState = {
  status: 'idle' | 'success' | 'error'
  errors?: {
    name?: string[]
    email?: string[]
    message?: string[]
    chassis?: string[]
    motor?: string[]
    discos?: string[]
    sourcing?: string[]
  }
  message?: string
}

export async function submitInquiry(
  selections: ConfigSelections,
  _prevState: ConfigFormState,
  formData: FormData,
): Promise<ConfigFormState> {
  const parsed = configSchema.safeParse({
    ...selections,
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return { status: 'error', errors: parsed.error.flatten().fieldErrors }
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.RESEND_TO_EMAIL
  if (!apiKey || !to) {
    return { status: 'error', message: 'Something went wrong. Please try again or email us directly.' }
  }

  // Resolve IDs to labels for email readability
  const getLabel = (category: 'chassis' | 'motor' | 'discos' | 'sourcing', id: string) =>
    configuratorOptions[category].find(o => o.id === id)?.label ?? id

  const emailText = [
    `Custom Build Inquiry from ${parsed.data.name}`,
    '',
    `Chassis:  ${getLabel('chassis', parsed.data.chassis)}`,
    `Motor:    ${getLabel('motor', parsed.data.motor)}`,
    `Discos:   ${getLabel('discos', parsed.data.discos)}`,
    `Sourcing: ${getLabel('sourcing', parsed.data.sourcing)}`,
    '',
    `Message: ${parsed.data.message ?? '(none)'}`,
    '',
    `Contact: ${parsed.data.name} <${parsed.data.email}>`,
  ].join('\n')

  const resend = new Resend(apiKey)
  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: [to],
      replyTo: parsed.data.email,
      subject: `Custom Build Inquiry: ${getLabel('chassis', parsed.data.chassis)}`,
      text: emailText,
    })
    return { status: 'success', message: 'Inquiry sent. We\'ll be in touch shortly.' }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[configure-action]', msg)
    return { status: 'error', message: 'Something went wrong. Please try again or email us directly.' }
  }
}
```

### Adding "Custom build" to nav.tsx

```tsx
// Source: components/nav.tsx (existing)
const links = [
  { href: '/', label: 'Bikes' },
  { href: '/configure', label: 'Custom build' },  // ADD
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]
// No other changes needed — link renders via existing map()
```

### Adding "Custom build" to mobile-menu.tsx

```tsx
// Source: components/mobile-menu.tsx (existing)
const links = [
  { href: '/', label: 'Bikes' },
  { href: '/configure', label: 'Custom build' },  // ADD
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]
// No other changes needed — link renders via existing map()
```

### Success state focus management (accessibility)

```tsx
// Source: 02-UI-SPEC.md — Accessibility section
// "Success state: focus moved to success heading on appearance"
const successRef = useRef<HTMLHeadingElement>(null)

useEffect(() => {
  if (state.status === 'success') {
    successRef.current?.focus()
  }
}, [state.status])

// In JSX:
<h2 ref={successRef} tabIndex={-1} className="...">INQUIRY SENT</h2>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useState` for form state + manual pending tracking | `useActionState` + `useFormStatus` (React 19) | React 19 stable | No external state library needed for multi-step form feedback |
| `react-hook-form` for multi-step wizards | `useState` for step/selections + Server Action | Next.js 13+ / React 19 | Zero bundle cost for simple configurators; `react-hook-form` explicitly excluded in REQUIREMENTS.md |
| Separate API route (`/api/send`) for email | Server Action (`'use server'`) called directly from form | Next.js 13+ | No separate API file needed; Server Action handles the call |
| Framer Motion for step transitions | CSS animations via `tw-animate-css` + `key` prop | — | Framer Motion explicitly excluded in REQUIREMENTS.md; CSS is sufficient for fade/slide |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Placeholder option values for chassis/motor/discos/sourcing (specific IDs and labels) | Standard Stack — Pattern 4 | Low: D-05 explicitly states placeholders are expected. The structure is what matters; values are replaced before launch. |
| A2 | Order of nav links after adding "Custom build" (Bikes, Custom build, About, Contact) | Code Examples | Low: nav order is a UX decision, easy to adjust. The link must be added — its exact position can shift. |

**All other claims in this research are VERIFIED against codebase files or CITED from Next.js 16 in-repo documentation.**

---

## Open Questions

1. **Configurator options: how many placeholder options per category?**
   - What we know: D-05 says placeholders are acceptable; data will be replaced by Alfonso before launch.
   - What's unclear: Whether 2 or 3 placeholder options per category is more useful for UI testing.
   - Recommendation: Use 2-3 placeholders per category. Enough to show the grid layout without cluttering. The exact count has no technical consequence.

2. **Environment variables: RESEND_TO_EMAIL recipient for configure inquiries**
   - What we know: `RESEND_TO_EMAIL` already set for the contact form. The configure action can reuse it.
   - What's unclear: Whether the seller wants configurator inquiries sent to a different address.
   - Recommendation: Reuse `RESEND_TO_EMAIL` for now. The planner should note this as a config decision, not a code change.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js dev server | Yes | v25.9.0 | -- |
| npm | Package management | Yes | 11.12.1 | -- |
| RESEND_API_KEY | Server Action email | Unknown | -- | Inquiry silently fails with 'error' state; existing contact form has same dependency |
| RESEND_TO_EMAIL | Server Action email | Unknown | -- | Same fallback as above |

**Note on env vars:** The project already uses both env vars for the contact form Server Action. If they work for the contact form, they will work for the configure action. The planner does not need to add an install step for these.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, or test directories exist |
| Config file | None — Wave 0 must create |
| Quick run command | `npm run lint` (only automated check available pre-framework install) |
| Full suite command | `npm run build` (smoke test via Next.js build) |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONF-01 | Chassis options rendered and selectable | manual | -- | -- |
| CONF-02 | Motor/discos/sourcing options rendered and selectable | manual | -- | -- |
| CONF-03 | Summary in Step 5 shows all 4 selections correctly | manual | -- | -- |
| CONF-04 | Submit sends email with full config; success state shown | manual (requires live RESEND_API_KEY) | -- | -- |
| CONF-04 (unit) | `configSchema.safeParse()` validates complete and incomplete payloads | unit | n/a until framework installed | Wave 0 gap |

### Sampling Rate

- Per task commit: `npm run lint` (catches TypeScript and ESLint errors)
- Per wave merge: `npm run build` (catches rendering errors and type errors)
- Phase gate: `npm run build` passes before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] No test framework installed — for CONF-04 unit testing of `configSchema`, the planner may scope it as a manual verification step rather than requiring framework installation, given project scale.
- [ ] `npm run lint` is the only automated per-commit check. This is sufficient for this phase scope.

*(The project is a small brand site with no existing test infrastructure. For this phase, build-passing and manual browser verification are the practical quality gates.)*

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in this phase; configurator is public |
| V3 Session Management | No | No session; wizard state is ephemeral client state |
| V4 Access Control | No | Server Action is public; no gated resources |
| V5 Input Validation | Yes | Zod `configSchema` in Server Action validates all fields server-side; HTML5 `required`/`type="email"` on client |
| V6 Cryptography | No | No secrets generated or stored |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Server Action receives tampered configuration values (e.g., injected HTML in selections) | Tampering | Zod validates all selection IDs against string constraints; email uses `text:` not `html:` so HTML is not rendered |
| Email header injection via name/email fields | Spoofing | Zod trims and validates length; Resend SDK handles header construction safely |
| Spam abuse of public Server Action | Denial of Service | Resend free tier (3,000 emails/month) provides natural rate limiting for this scale; no additional rate limiting needed for v1 |

**Note:** The `text:` field (not `html:`) in the Resend call is the correct choice per D-11 and is safer by default — no HTML injection risk.

[VERIFIED: app/actions/contact.ts — existing action uses `text:` field, not `html:`]

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on This Phase |
|-----------|---------------------|
| No `react-hook-form` | Use `useActionState` + `useFormStatus` only |
| No `framer-motion` | Use `tw-animate-css` CSS classes + `key` prop for step transitions |
| No `Zustand` / Redux / Jotai | All wizard state in `useState` inside a single Client Component |
| No database | No persistence of configurations anywhere |
| No CMS | `lib/configurator.ts` is the data source, managed in code |
| Tailwind v4 CSS-first | No tailwind.config.js; all tokens via `@theme` in globals.css |
| No new brand tokens | Do not add tokens to globals.css; use existing `--color-brand-*` variables |
| shadcn/ui only (no Chakra/MUI/Ant) | All UI from existing `components/ui/` directory |
| `'use cache'` on static data | `lib/configurator.ts` is a static data file; the page shell can apply `'use cache'` if needed |
| Read `node_modules/next/dist/docs/` before writing Next.js code | Done — forms.md read for Server Action + useActionState patterns |
| No git commits without explicit permission | Except within GSD workflow execution |

---

## Sources

### Primary (HIGH confidence)

- `node_modules/next/dist/docs/01-app/02-guides/forms.md` — useActionState + Server Action + `.bind()` pattern (Next.js 16)
- `app/actions/contact.ts` — Resend call structure, error handling pattern, state shape
- `lib/validations.ts` — Zod schema pattern
- `lib/bikes.ts` — data module shape for configurator data model
- `components/contact-form.tsx` — useActionState, useFormStatus, SubmitButton child component pattern, input/label styling
- `components/nav.tsx` — link array pattern, exact class names
- `components/mobile-menu.tsx` — link array pattern, font/style classes
- `components/bike-gallery.tsx` — `ring-2 ring-[#cc2200]` selected state pattern
- `components/ui/` — confirmed presence of: badge.tsx, button.tsx, card.tsx, input.tsx, label.tsx, separator.tsx, textarea.tsx
- `app/globals.css` — all color tokens, font variables, radius values
- `app/layout.tsx` — font variable names, layout structure (Nav + CheckerboardStripe + main + CheckerboardStripe + SiteFooter)
- `.planning/phases/02-configurator-and-inquiry-integration/02-CONTEXT.md` — all 13 locked decisions
- `.planning/phases/02-configurator-and-inquiry-integration/02-UI-SPEC.md` — visual and interaction contract
- `package.json` — verified installed versions of all dependencies

### Secondary (MEDIUM confidence)

- `.planning/research/market-research.md` Section 6 — buyer expectations for configurator/contact flow (qualitative, not technical)

### Tertiary (LOW confidence)

None. All claims are verified against codebase files.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all dependencies verified in package.json and components/ui/ directory
- Architecture: HIGH — pattern verified in existing contact.ts and Next.js 16 forms.md
- Pitfalls: HIGH — derived from verified code patterns and official Next.js documentation
- UI contract: HIGH — 02-UI-SPEC.md is a locked upstream artifact

**Research date:** 2026-05-16
**Valid until:** 2026-06-16 (stable stack; Next.js 16 + React 19 — no fast-moving changes expected)

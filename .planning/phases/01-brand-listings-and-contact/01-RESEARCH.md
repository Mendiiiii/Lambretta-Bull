# Phase 1: Brand, Listings, and Contact - Research

**Researched:** 2026-05-13
**Domain:** Next.js 16 App Router, static bike data, Resend email, Tailwind v4, shadcn/ui 4.2.0
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BIKE-01 | User can view a gallery of 8-12 photos per bike (multiple angles, close-up details) | BikeGallery client component with useState for active index; next/image with priority on first |
| BIKE-02 | User can view a full spec sheet per bike (chassis year/model, engine type, parts sourcing, disc type, handmade components) | SpecSheet server component reading from TypeScript data file; typed discriminated union |
| BIKE-03 | User can see a price anchor ("from AU$XX,XXX") on each listing | PriceAnchor component; red accent text; never "POA" — fixed in data type |
| BIKE-04 | User can click a per-bike inquiry CTA and reach a contact form pre-loaded with that bike as subject | Link from /bikes/[id] to /contact?subject=Inquiry%3A+[name]; form reads searchParam on mount |
| BRAND-01 | User can read the craftsman story (About page) | Static server component at /about; no data fetching needed |
| BRAND-03 | User can submit a standalone contact form | Server Action in app/actions/contact.ts; useActionState + Zod + Resend |
| BRAND-04 | Site presents consistent Mod/2 Tone brand design throughout | New layout.tsx with nav; replace globals.css tokens; remove sidebar/top-header |
</phase_requirements>

---

## Summary

Phase 1 is a complete replacement of the existing job-search-autopilot UI with the Lambre-Bull brand. The technical work splits into three streams: (1) delete and replace all existing UI scaffolding (sidebar, dashboard, old pages), (2) build the Lambre-Bull page structure (homepage, bike listings, about, contact), and (3) wire the contact form through a Server Action to Resend.

The stack is already installed and does not require decisions. Next.js 16.2.3 with `cacheComponents` is the caching model. Bike data lives in TypeScript files — no database. Resend is the only missing dependency. The contact form uses `useActionState` + Zod + a Server Action in `app/actions/contact.ts`. Fonts are Inter (installed) + Barlow Condensed (added via `next/font/google`). The gallery uses `useState` in a client component — no JS library.

**Primary recommendation:** Write bike data as a typed TypeScript array in `lib/bikes.ts`, build pages as async Server Components that import from it directly, mark data access with `'use cache'` and enable `cacheComponents: true` in `next.config.ts`. Pre-populate contact subject via URL search params.

**Key prerequisite before first line of code:** Install `resend` and enable `cacheComponents` in `next.config.ts`. All other dependencies are already in `node_modules`.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Bike data storage | Static TS file (build-time) | — | No database; 1-5 bikes managed in code |
| Bike listing page | Server Component (SSR/static) | — | All data is static; prerendered at build |
| Gallery interaction (thumbnail swap) | Browser / Client Component | — | useState for active image index |
| Contact form UI | Browser / Client Component | — | useActionState requires 'use client' |
| Contact form submission | API / Server Action | — | 'use server' function; calls Resend |
| Email delivery | External service (Resend) | — | Transactional email; no SMTP |
| Navigation (desktop) | Server Component | — | No client state needed |
| Navigation (mobile overlay) | Browser / Client Component | — | useState for open/closed |
| Brand tokens / CSS | CSS custom properties in globals.css | — | Tailwind v4 CSS-first config |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.3 (installed) | App Router, Server Actions, static prerender | Already installed; `'use cache'` is the Next.js 16 caching primitive |
| React | 19.2.4 (installed) | UI runtime, `useActionState`, `useFormStatus` | Installed; React 19 stable ships `useActionState` |
| TypeScript | ^5 (installed) | Type safety for bike data discriminated unions | Installed; strict mode recommended |
| Tailwind CSS | ^4 (installed) | Utility-first CSS, v4 CSS-first config | Installed; `@theme` block already in globals.css |
| shadcn/ui | 4.2.0 (installed) | Component primitives (button, input, label, badge, separator) | Already configured with base-nova / neutral |
| Zod | 4.3.6 (installed) | Server-side form validation in Server Action | Installed |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Resend | 6.12.3 (latest; not installed) | Transactional email from Server Action | Required for contact form submission |
| sharp | 0.34.5 (installed) | Image optimization dependency for next/image | Already installed; no action needed |
| tw-animate-css | 1.4.0 (installed) | CSS animation utilities | Entrance transitions on page load |
| Lucide React | ^1.8.0 (installed) | Functional icons (close, chevron, check) | Sparingly; brand is typographic |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Resend | Nodemailer + SMTP | More setup; requires credential management — no benefit at this scale |
| useActionState + Zod | react-hook-form | Explicitly forbidden in CLAUDE.md |
| CSS animations | framer-motion | Explicitly forbidden in CLAUDE.md; 40kB bundle cost |
| TypeScript data file | Any CMS | Explicitly forbidden in CLAUDE.md |

**Installation (only missing package):**
```bash
npm install resend
```

**Version verification:** [VERIFIED: npm registry] — resend@6.12.3, sharp@0.34.5, zod@4.3.6 confirmed installed or latest.

---

## Architecture Patterns

### System Architecture Diagram

```
Visitor browser
     |
     | HTTP request
     v
Next.js 16 App Router (Vercel)
     |
     |-- GET /                     -> app/page.tsx (Server Component, static prerender)
     |-- GET /bikes/[id]           -> app/bikes/[id]/page.tsx (Server Component + 'use cache')
     |                                  |-> BikeGallery (Client Component, useState)
     |                                  |-> SpecSheet (Server Component)
     |                                  |-> PriceAnchor (Server Component)
     |-- GET /about                -> app/about/page.tsx (Server Component, static)
     |-- GET /contact              -> app/contact/page.tsx (Client Component wrapper)
     |                                  |-> ContactForm (Client Component, useActionState)
     |                                       |
     |                                  POST (Server Action)
     |                                       |-> app/actions/contact.ts ('use server')
     |                                              |-> Zod validation
     |                                              |-> Resend API
     |                                              |-> return { success | errors }
     |
     |-- Static data               -> lib/bikes.ts (TypeScript array, build-time)
     |-- Brand tokens              -> app/globals.css (@theme, :root block)
     |-- Nav (desktop)             -> components/nav.tsx (Server Component)
     |-- Nav (mobile overlay)      -> components/mobile-menu.tsx (Client Component, useState)
```

### Recommended Project Structure

```
app/
├── layout.tsx              # Root layout — NEW (replaces existing; adds Barlow Condensed font, nav, footer)
├── globals.css             # REPLACED tokens (Lambre-Bull palette replaces Ember palette)
├── page.tsx                # Homepage — REPLACED (hero + bike listing grid)
├── about/
│   └── page.tsx            # About/craftsman story — NEW
├── bikes/
│   └── [id]/
│       └── page.tsx        # Bike detail page — NEW (gallery + spec + CTA)
├── contact/
│   └── page.tsx            # Contact form page — NEW
└── actions/
    └── contact.ts          # Server Action for form submission — NEW ('use server')

components/
├── nav.tsx                 # Top navigation — NEW (replaces sidebar.tsx + top-header.tsx)
├── mobile-menu.tsx         # Mobile full-screen overlay — NEW ('use client')
├── bike-gallery.tsx        # Gallery with thumbnail swap — NEW ('use client')
├── spec-sheet.tsx          # Bike spec renderer — NEW (Server Component)
├── price-anchor.tsx        # "from AU$XX,XXX" display — NEW (Server Component)
├── checkerboard-stripe.tsx # 8px brand accent band — NEW (Server Component)
├── contact-form.tsx        # Form with useActionState — NEW ('use client')
├── sidebar.tsx             # DELETED
├── top-header.tsx          # DELETED
└── theme-provider.tsx      # DELETED (no theme switching; dark-only)

lib/
├── bikes.ts                # Bike data TypeScript array — NEW
├── validations.ts          # Zod schemas — NEW (contact form schema)
└── utils.ts                # KEEP (cn() function)

public/
└── bikes/
    └── [bike-id]/
        ├── hero.jpg        # Placeholder — actual photos added by developer
        └── ...             # 8-12 images per bike

```

**Files to delete:**

| File | Reason |
|------|--------|
| `components/sidebar.tsx` | Job-search-autopilot dashboard nav; not used in Lambre-Bull |
| `components/top-header.tsx` | Dashboard header with search + theme toggle; replaced by nav.tsx |
| `components/theme-provider.tsx` | Dark-only site; no theme switching needed |
| `app/page.tsx` | Dashboard homepage; fully replaced |
| `app/applications/` | Entire directory — job-search route |
| `app/coffees/` | Entire directory — job-search route |
| `app/cv/` | Entire directory — job-search route |
| `app/interview/` | Entire directory — job-search route |
| `app/jobs/` | Entire directory — job-search route |
| `app/settings/` | Entire directory — job-search route |
| `app/api/analyze/` | Job-search API route |
| `app/api/analyze-style/` | Job-search API route |
| `app/api/cv/` | Job-search API route |
| `app/api/import-contacts/` | Job-search API route |
| `app/api/interview/` | Job-search API route |
| `app/api/refinar-mensaje/` | Job-search API route |
| `lib/groq.ts` | Job-search AI client |
| `lib/gemini.ts` | Job-search AI client |
| `lib/supabase.ts` | Job-search database client |
| `lib/import-contacts.ts` | Job-search utility |
| `lib/zai.ts` | Job-search utility |

**Files to keep:**

| File | What Changes |
|------|-------------|
| `app/globals.css` | Replace `:root` and `.dark` token blocks; update heading overrides; remove sidebar tokens |
| `app/layout.tsx` | Full rewrite — add Barlow Condensed font, remove Sidebar/TopHeader/ThemeProvider, add nav.tsx + checkerboard stripes |
| `next.config.ts` | Add `cacheComponents: true`; keep existing `serverExternalPackages` |
| `components.json` | No change needed |
| `lib/utils.ts` | No change needed (cn() stays) |
| `package.json` | Add `resend`; optionally remove unused AI/Supabase deps |

---

### Pattern 1: Bike Data — TypeScript Array

**What:** Static typed array exported from `lib/bikes.ts`. No database, no fetch. Imported directly into Server Components.

**When to use:** All bike listing and detail pages. Data changes only when a developer edits the file.

```typescript
// Source: CLAUDE.md — "No database. Everything is static content."
// lib/bikes.ts

export type BikeSpec = {
  chassis: {
    year: number
    model: string
  }
  engine: string
  discs: string
  partsSourcing: 'handbuilt' | 'england-sourced' | 'mixed'
  handmadeComponents: string[]
}

export type Bike = {
  id: string                  // URL slug — e.g. "1966-lambretta-tv200"
  name: string                // Display name — e.g. "1966 TV 200"
  tagline: string             // One-liner for listing card
  priceAUD: number            // Numeric — PriceAnchor formats it
  spec: BikeSpec
  photos: {
    src: string               // Path relative to /public — e.g. "/bikes/1966-tv200/hero.jpg"
    alt: string               // "[Year] [Model] — [angle]"
  }[]
  available: boolean
}

export const bikes: Bike[] = [
  // Developer adds entries here
]

export function getBike(id: string): Bike | undefined {
  return bikes.find(b => b.id === id)
}
```

---

### Pattern 2: Static Bike Page with `'use cache'`

**What:** Bike detail page is a Server Component that reads from the TypeScript data file. `'use cache'` + `cacheLife('max')` ensures build-time prerender.

**When to use:** `/bikes/[id]/page.tsx` — any page that reads static data.

**Critical requirement:** `cacheComponents: true` must be set in `next.config.ts` before `'use cache'` will work. [VERIFIED: node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md]

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md
// app/bikes/[id]/page.tsx

import { cacheLife } from 'next/cache'
import { getBike, bikes } from '@/lib/bikes'
import { notFound } from 'next/navigation'
import { BikeGallery } from '@/components/bike-gallery'
import { SpecSheet } from '@/components/spec-sheet'
import { PriceAnchor } from '@/components/price-anchor'

export async function generateStaticParams() {
  return bikes.map(b => ({ id: b.id }))
}

export default async function BikePage({ params }: { params: Promise<{ id: string }> }) {
  'use cache'
  cacheLife('max')

  const { id } = await params
  const bike = getBike(id)
  if (!bike) notFound()

  return (
    <div>
      <BikeGallery photos={bike.photos} />
      <SpecSheet spec={bike.spec} />
      <PriceAnchor priceAUD={bike.priceAUD} />
    </div>
  )
}
```

**Note on params:** In Next.js 16, `params` is a Promise — always `await params` before accessing fields. [VERIFIED: pattern from Next.js 16 App Router route conventions]

---

### Pattern 3: Contact Form — useActionState + Server Action

**What:** Client component form wired to a `'use server'` action. The action validates with Zod and calls Resend. Returns typed state for error/success rendering.

**When to use:** `components/contact-form.tsx` (Client Component) + `app/actions/contact.ts` (Server Action file).

```typescript
// Source: node_modules/next/dist/docs/01-app/02-guides/forms.md
// app/actions/contact.ts

'use server'

import { z } from 'zod'
import { Resend } from 'resend'

const schema = z.object({
  name: z.string().min(1, 'This field is required.'),
  email: z.string().email('Please enter a valid email address.'),
  subject: z.string().min(1, 'This field is required.'),
  message: z.string().min(10, 'This field is required.'),
})

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

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContact(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return {
      status: 'error',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    await resend.emails.send({
      from: 'Lambre-Bull <contact@lambre-bull.com.au>',
      to: ['imendifp@gmail.com'],        // seller email — update before launch
      subject: parsed.data.subject,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    })
    return {
      status: 'success',
      message: "Message sent. We'll be in touch within 2 business days.",
    }
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong. Try again or email us directly at [address].',
    }
  }
}
```

```typescript
// Source: node_modules/next/dist/docs/01-app/02-guides/forms.md
// components/contact-form.tsx (excerpt — key wiring)

'use client'

import { useActionState } from 'react'
import { submitContact, type ContactFormState } from '@/app/actions/contact'

const initialState: ContactFormState = { status: 'idle' }

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState)

  return (
    <form action={formAction}>
      {/* fields */}
      <input type="hidden" name="subject" defaultValue={defaultSubject} />
      <button disabled={pending} type="submit">Send Message</button>
      {state.status === 'success' && <p aria-live="polite">{state.message}</p>}
    </form>
  )
}
```

---

### Pattern 4: Pre-loading Contact Subject from Per-Bike CTA

**What:** Bike listing page links to `/contact?subject=Inquiry%3A+1966+TV+200`. Contact page reads `searchParams` server-side and passes the value as `defaultSubject` prop to the form.

**When to use:** `/bikes/[id]/page.tsx` inquiry CTA link + `app/contact/page.tsx`.

```typescript
// app/contact/page.tsx
import { ContactForm } from '@/components/contact-form'

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>
}) {
  const { subject } = await searchParams
  return (
    <main>
      <ContactForm defaultSubject={subject} />
    </main>
  )
}
```

**Note:** In Next.js 16, `searchParams` is also a Promise — must be awaited. [VERIFIED: consistent with params pattern from App Router conventions in Next.js 16]

---

### Pattern 5: Gallery — Client Component with useState

**What:** `BikeGallery` is a Client Component that manages the active photo index with `useState`. No JS library. Thumbnail click swaps the primary image. Ring indicator on active thumbnail.

**When to use:** `components/bike-gallery.tsx`

```typescript
'use client'

import { useState } from 'react'
import Image from 'next/image'

type Photo = { src: string; alt: string }

export function BikeGallery({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState(0)

  return (
    <div>
      {/* Primary image */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={photos[active].src}
          alt={photos[active].alt}
          fill
          className="object-cover"
          priority={active === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-4 gap-2 mt-2">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setActive(i)}
            aria-label={photo.alt}
            className={`relative aspect-square overflow-hidden transition-opacity ${
              i === active
                ? 'opacity-100 ring-2 ring-[#cc2200]'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="25vw"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
```

---

### Pattern 6: Font Loading — Barlow Condensed + Inter

**What:** Both fonts loaded in `app/layout.tsx` via `next/font/google`. CSS variables exposed and applied via `@theme` in `globals.css`.

**When to use:** Root layout only. Applied globally via CSS variables.

**Barlow Condensed availability:** [VERIFIED: node_modules/next/dist/server/capsize-font-metrics.json] — key `barlowCondensed` confirmed present.

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md
// app/layout.tsx (font section)

import { Inter } from 'next/font/google'
import { Barlow_Condensed } from 'next/font/google'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['900'],   // Black only — the UI spec calls for 900 weight exclusively
})

// Apply both variables to <html>:
// <html className={`${inter.variable} ${barlowCondensed.variable}`}>
```

---

### Pattern 7: Mobile Menu — Full-Screen Overlay

**What:** At mobile breakpoint, nav collapses to logo + "Menu" button. Click opens a full-screen `position: fixed` overlay with nav links. No hamburger accordion.

**When to use:** `components/mobile-menu.tsx` ('use client')

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden text-sm font-semibold uppercase tracking-widest"
        aria-label="Open navigation menu"
      >
        Menu
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center gap-8"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6"
            aria-label="Close navigation menu"
          >
            {/* Lucide X icon */}
          </button>
          {['Bikes', 'About', 'Contact'].map(label => (
            <Link
              key={label}
              href={`/${label.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="text-5xl font-black tracking-tight text-[#f2f2ee]"
              style={{ fontFamily: 'var(--font-barlow-condensed)' }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
```

---

### Pattern 8: Globals.css Token Replacement

**What:** The existing `:root` block contains the Ember palette from job-search-autopilot. It must be fully replaced with the Lambre-Bull palette. The `.dark` class block is removed entirely (dark-only site). Sidebar tokens are removed. Heading overrides are updated to use Barlow Condensed.

**Checkerboard CSS (verified pattern):**
```css
/* Source: 01-UI-SPEC.md — repeating-conic-gradient pattern */
.checkerboard {
  background-image: repeating-conic-gradient(
    #1a1a1a 0% 25%,
    #f2f2ee 0% 50%
  ) 0 0 / 16px 16px;
}
```

**@theme additions needed:**
```css
@theme inline {
  /* Add alongside existing color tokens: */
  --color-brand-black: #0a0a0a;
  --color-brand-white: #f2f2ee;
  --color-brand-red: #cc2200;
  --color-brand-checker: #1a1a1a;
  /* Update font heading: */
  --font-heading: var(--font-barlow-condensed);
  /* Remove all sidebar tokens */
}
```

---

### Anti-Patterns to Avoid

- **Calling `params` or `searchParams` without await:** In Next.js 16, both are Promises. Sync access throws at runtime. Always `const { id } = await params`.
- **Using `'use cache'` without `cacheComponents: true` in next.config.ts:** The directive has no effect without the config flag. [VERIFIED: use-cache.md]
- **Using `next-themes` / ThemeProvider in Lambre-Bull:** The site is dark-only. ThemeProvider adds bundle weight and hydration complexity for zero benefit. Remove it.
- **Importing from `@supabase/supabase-js` in any Lambre-Bull component:** Supabase is a job-search dependency; no persistence in v1.
- **Putting `'use cache'` on a page that reads `searchParams`:** `searchParams` is runtime data and cannot be passed into a cached scope. Contact page must NOT use `'use cache'`.
- **Using placeholder `"Contact for pricing"` anywhere:** The UI spec and REQUIREMENTS.md both forbid this. Price anchor must show `"from AU$XX,XXX"`.
- **Adding `'use client'` to `SpecSheet` or `PriceAnchor`:** These are pure render components with no interactivity. They should remain Server Components so they prerender.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form submission state | Custom fetch + useState | `useActionState` (React 19 built-in) | Handles pending, errors, success in one hook; progressive enhancement included |
| Server-side form validation | Manual string checks | Zod `safeParse` with `flatten().fieldErrors` | Type-safe, composable, returns structured per-field errors |
| Email delivery | Node.js nodemailer + SMTP | Resend SDK | No SMTP credentials to manage; REST API; free tier 3k/month |
| Image optimization | Manual srcset | `next/image` | WebP/AVIF conversion, responsive sizes, blur placeholder, lazy loading |
| Font loading | `<link>` tag in head | `next/font/google` | Self-hosted at build time; zero external request; no layout shift |
| CSS conic gradient checker | SVG image | `repeating-conic-gradient` CSS | Scales to any size; 0 bytes; exact pattern from UI spec |

**Key insight:** The contact form is the only stateful UI in Phase 1. Everything else is static data rendered at build time. Keep client boundaries minimal and intentional.

---

## Common Pitfalls

### Pitfall 1: Old Imports Breaking After File Deletions

**What goes wrong:** After deleting job-search files, build fails because `app/layout.tsx` still imports `Sidebar`, `TopHeader`, and `ThemeProvider`. TypeScript compilation fails immediately.
**Why it happens:** The current layout.tsx must be rewritten as part of the same task that deletes the old components.
**How to avoid:** Rewrite `app/layout.tsx` in the same plan step that deletes `components/sidebar.tsx`, `components/top-header.tsx`, and `components/theme-provider.tsx`.
**Warning signs:** `Module not found` errors on `next dev` start.

### Pitfall 2: `params` / `searchParams` Sync Access

**What goes wrong:** `params.id` or `searchParams.subject` used without `await` — TypeScript may not catch this if types are loosened.
**Why it happens:** Next.js 16 made these Promises; accessing them synchronously returns `undefined` silently in some contexts, or throws in others.
**How to avoid:** Always write `const { id } = await params` and `const { subject } = await searchParams` at the top of async page functions.
**Warning signs:** `undefined` slug causing `notFound()` to trigger even for valid routes.

### Pitfall 3: `'use cache'` Without Config Flag

**What goes wrong:** Developer adds `'use cache'` to a page function; the page appears to work but is not actually cached — it re-renders on every request.
**Why it happens:** `cacheComponents: true` must be set in `next.config.ts` or the directive is ignored.
**How to avoid:** Add `cacheComponents: true` to `next.config.ts` in Wave 0, before any page uses the directive.
**Warning signs:** Build output shows page as `λ (dynamic)` instead of `○ (static)`.

### Pitfall 4: Contact Form `defaultValue` vs `value`

**What goes wrong:** Pre-populating the subject field with `value={defaultSubject}` makes it a controlled input that can't be edited.
**Why it happens:** React controlled vs uncontrolled input distinction; `value` + no `onChange` = read-only.
**How to avoid:** Use `defaultValue={defaultSubject}` for the subject input. The user can then edit it freely.

### Pitfall 5: Server Component Importing from `lib/supabase.ts`

**What goes wrong:** Any retained lib file that imports `@supabase/supabase-js` will cause the build to attempt to include Supabase client code, potentially breaking Server Components if the env vars are missing.
**Why it happens:** Supabase initializes on import using `process.env.NEXT_PUBLIC_SUPABASE_URL`.
**How to avoid:** Delete all Supabase-dependent lib files in the cleanup plan. No Lambre-Bull page should import from `lib/supabase.ts`.

### Pitfall 6: `next/image` Without `sizes` Prop

**What goes wrong:** Images render correctly but trigger a console warning in Next.js 16; also, browser downloads a full-resolution image even on mobile.
**Why it happens:** Without `sizes`, Next.js cannot generate appropriate srcsets for responsive display.
**How to avoid:** Always add `sizes` prop. Gallery primary: `"(max-width: 768px) 100vw, 50vw"`. Thumbnails: `"25vw"`.

---

## Code Examples

### Checkerboard Stripe Component

```typescript
// components/checkerboard-stripe.tsx
// Source: 01-UI-SPEC.md

export function CheckerboardStripe({ height = 8 }: { height?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        height: `${height}px`,
        backgroundImage:
          'repeating-conic-gradient(#1a1a1a 0% 25%, #f2f2ee 0% 50%) 0 0 / 16px 16px',
      }}
    />
  )
}
```

### PriceAnchor Component

```typescript
// components/price-anchor.tsx
// Source: 01-UI-SPEC.md copywriting contract

export function PriceAnchor({ priceAUD }: { priceAUD: number }) {
  const formatted = priceAUD.toLocaleString('en-AU')
  return (
    <p className="text-[#cc2200] uppercase tracking-widest text-xl font-black">
      from AU${formatted}
    </p>
  )
}
```

### Homepage Empty State (no bikes)

```typescript
// Per 01-UI-SPEC.md copywriting contract
<p className="text-[#888880]">
  No bikes available right now. New builds are underway — get in touch to be first to know.
</p>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `export const dynamic = 'force-static'` | `'use cache'` + `cacheComponents: true` | Next.js 15/16 | Route-level config deprecated; use directive instead |
| `getStaticProps` | Async Server Component with `'use cache'` | Next.js 13+ | Pages Router pattern; fully replaced by App Router |
| `react-hook-form` | `useActionState` + Server Action | React 19 stable | Built-in form state management; no external library |
| `useFormStatus` in same component | `useFormStatus` in child `SubmitButton` component | React 19 | Must be in a separate child component nested inside `<form>` |
| `params.id` (sync) | `(await params).id` (async) | Next.js 15/16 | Breaking change — sync access returns undefined |

**Deprecated/outdated:**
- `next-themes` ThemeProvider: Not deprecated, but actively removed here — Lambre-Bull is dark-only; the component adds unnecessary hydration complexity.
- `ThemeProvider` pattern from job-search-autopilot: Remove entirely. No `<html suppressHydrationWarning>` needed when there's no theme switching.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/runtime | ✓ | (detected on system) | — |
| sharp | next/image optimization | ✓ | 0.34.5 | — |
| Vercel CLI / project | Deployment | ✓ | .vercel/project.json present | — |
| resend | Contact form email | ✗ | — | None — install required |
| RESEND_API_KEY | Resend SDK | ✗ | — | Form fails silently without it |

**Missing dependencies with no fallback:**
- `resend` npm package: must be installed before contact form Server Action can be implemented. Install: `npm install resend`
- `RESEND_API_KEY` environment variable: must be added to `.env.local` before testing email delivery. Obtain from resend.com dashboard.

**Missing dependencies with fallback:**
- None beyond the above.

---

## Validation Architecture

**Framework:** No dedicated test framework currently installed. `nyquist_validation: true` in config.json.

Per the project's stack, there is no Jest, Vitest, or Playwright in `package.json` or `node_modules`. The validation approach for Phase 1 is manual smoke testing with build-time verification as the primary gate.

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Verification Method | Automated? |
|--------|----------|-----------|---------------------|-----------|
| BIKE-01 | Gallery shows 8-12 photos; thumbnail click swaps primary | Smoke | `npm run dev` — navigate to `/bikes/[id]`, click thumbnails | Manual |
| BIKE-02 | Spec sheet renders all fields: year, model, engine, discs, sourcing, handmade | Smoke | `npm run dev` — inspect `/bikes/[id]` spec section | Manual |
| BIKE-03 | Price anchor shows "from AU$XX,XXX" in red; no "POA" or "Contact for pricing" | Smoke | Visual check on `/bikes/[id]` and `/` listing cards | Manual |
| BIKE-04 | "Inquire About This Bike" CTA links to `/contact?subject=Inquiry%3A+[name]`; subject pre-fills | Smoke | Click CTA from bike page; verify subject field pre-populated | Manual |
| BRAND-01 | About page renders craftsman story content | Smoke | `npm run dev` — navigate to `/about` | Manual |
| BRAND-03 | Contact form submits successfully; Resend delivers email | Integration | Submit form with valid data; check inbox | Manual (requires RESEND_API_KEY) |
| BRAND-03 | Contact form shows validation errors for invalid input | Smoke | Submit empty form; submit invalid email | Manual |
| BRAND-04 | All pages use Lambre-Bull palette; no Ember amber/terracotta anywhere | Visual | `npm run build` + visual inspection of all routes | Manual |

### Build Verification (automated gate)

```bash
# Wave 0 gate — must pass before implementation:
npm run build

# Expected output: all Lambre-Bull pages show as ○ (Static) or λ (dynamic for /contact)
# Red flag: any import errors, any reference to deleted job-search files
```

### Wave 0 Gaps

- [ ] No test files exist in the repo. Validation is manual smoke testing.
- [ ] `npm run build` is the only automated gate — catches broken imports, TypeScript errors, and missing modules.
- [ ] Consider adding a basic `npm run lint` check as a pre-commit gate.

**Test framework install (if automated tests are desired in future phases):**
```bash
npm install -D vitest @vitejs/plugin-react
```
For Phase 1, manual smoke testing is the appropriate approach given the static, visual nature of the requirements.

---

## Security Domain

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in v1 — public showcase |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | No protected routes |
| V5 Input Validation | Yes | Zod schema in Server Action (`lib/validations.ts`) |
| V6 Cryptography | No | No secrets stored or encrypted; RESEND_API_KEY is env-only |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Contact form spam / abuse | Denial of service | Resend rate limits; no CAPTCHA in v1 (low traffic, private URL pre-launch) |
| RESEND_API_KEY exposure | Information disclosure | Store in `.env.local` only; never commit; `.gitignore` already excludes `.env*` |
| XSS via form input | Tampering | React escapes output by default; no dangerouslySetInnerHTML used |
| Email header injection | Tampering | Resend SDK handles email construction; no raw SMTP headers |

---

## Open Questions

1. **Seller email address for Resend `to:` field**
   - What we know: The developer's personal email is `imendifp@gmail.com` (from MEMORY.md)
   - What's unclear: Is this the permanent seller contact, or will a dedicated `@lambre-bull.com.au` address be used?
   - Recommendation: Use `imendifp@gmail.com` as placeholder in the Server Action; flag for update before public launch.

2. **Resend `from:` domain verification**
   - What we know: Resend requires domain verification for custom `from:` addresses.
   - What's unclear: Does `lambre-bull.com.au` exist and is it DNS-verified in Resend?
   - Recommendation: For development/testing, Resend allows sending from their shared domain (`onboarding@resend.dev`). Use that initially. Domain verification is a pre-launch task.

3. **Actual bike photos**
   - What we know: Phase 1 requires 8-12 photos per bike in `public/bikes/[id]/`.
   - What's unclear: Do photos exist yet, or will placeholder images be used during development?
   - Recommendation: Developer creates `public/bikes/placeholder/` with stock images for development. Real photos are a content task, not a code task. The gallery component works identically with either.

4. **Price anchor value**
   - What we know: STATE.md flags that AU Lambretta competitor pricing requires a live search to set accurately.
   - What's unclear: What price to use in `lib/bikes.ts` for the first bike entry.
   - Recommendation: Use a clearly marked placeholder value (e.g., `0`) with a TODO comment. The `PriceAnchor` component should degrade gracefully if `priceAUD` is 0.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Resend free tier allows 3,000 emails/month | Standard Stack | If pricing changed, may need paid plan; verify at resend.com before launch |
| A2 | `app/api/refinar-mensaje/` and other API routes do not contain any logic needed for Lambre-Bull | Files to Delete | If any route was shared, deleting it would break functionality |
| A3 | The `.vercel/project.json` Vercel project can be redeployed with a completely different Next.js app structure | Environment | Vercel project was created for job-search-autopilot; renaming is cosmetic, redeployment should work |

---

## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/02-guides/forms.md` — Server Action form pattern, `useActionState` signature
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md` — `'use cache'` usage, requirement for `cacheComponents: true`
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md` — Config flag requirement
- `node_modules/next/dist/docs/01-app/02-guides/public-static-pages.md` — Cache component pattern for static data pages
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` — `next/image` props and sizes
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` — `next/font/google` API
- `node_modules/next/dist/server/capsize-font-metrics.json` — Barlow Condensed (`barlowCondensed`) confirmed present
- `.planning/phases/01-brand-listings-and-contact/01-UI-SPEC.md` — Design system, component inventory, color tokens, copywriting contract
- `package.json` + `node_modules/*/package.json` — Installed versions (Next.js 16.2.3, React 19.2.4, Zod 4.3.6, sharp 0.34.5)
- `npm view resend version` — Resend 6.12.3 (latest)

### Secondary (MEDIUM confidence)
- Resend Next.js Server Action integration pattern — widely documented in community; not independently verified against resend.com docs in this session [ASSUMED: A1]

### Tertiary (LOW confidence)
- None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified against installed packages and npm registry
- Architecture: HIGH — patterns verified against Next.js 16 bundled docs
- Delete/keep file list: HIGH — verified against actual codebase file listing
- Pitfalls: HIGH — derived directly from Next.js 16 breaking changes documented in bundled docs
- Resend integration: MEDIUM — SDK API surface verified (npm view), integration pattern ASSUMED

**Research date:** 2026-05-13
**Valid until:** 2026-06-13 (stable stack; 30 days)

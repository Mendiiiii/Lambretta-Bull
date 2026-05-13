# Phase 1: Brand, Listings, and Contact - Pattern Map

**Mapped:** 2026-05-13
**Files analyzed:** 13 new/modified files
**Analogs found:** 10 / 13

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `lib/bikes.ts` | data module | static / transform | `lib/utils.ts` (export pattern) | partial-match |
| `lib/validations.ts` | utility | transform | `app/api/refinar-mensaje/route.ts` (Zod-adjacent validation) | partial-match |
| `app/layout.tsx` | root layout | request-response | `app/layout.tsx` (current — same file, full rewrite) | exact |
| `app/globals.css` | config | static | `app/globals.css` (current — same file, token replace) | exact |
| `next.config.ts` | config | static | `next.config.ts` (current — same file, add flag) | exact |
| `app/page.tsx` | Server Component | request-response | `app/page.tsx` (current — same file, full rewrite) | role-match |
| `app/about/page.tsx` | Server Component | static | `app/page.tsx` (async Server Component structure) | role-match |
| `app/bikes/[id]/page.tsx` | Server Component | CRUD / static | `app/jobs/[id]/page.tsx` (dynamic route detail page) | role-match |
| `app/contact/page.tsx` | Server Component (wrapper) | request-response | `app/coffees/page.tsx` (searchParams reading pattern) | partial-match |
| `app/actions/contact.ts` | Server Action | request-response | `app/api/refinar-mensaje/route.ts` (validation + external API call) | role-match |
| `components/nav.tsx` | Server Component | static | `components/top-header.tsx` (header + nav structure) | role-match |
| `components/mobile-menu.tsx` | Client Component | event-driven | `components/sidebar.tsx` (useState open/close toggle) | role-match |
| `components/bike-gallery.tsx` | Client Component | event-driven | `components/sidebar.tsx` (useState active index pattern) | role-match |
| `components/contact-form.tsx` | Client Component | request-response | `app/jobs/new/page.tsx` (form with loading state) | role-match |
| `components/spec-sheet.tsx` | Server Component | static | `app/page.tsx` (pure render, no client state) | role-match |
| `components/price-anchor.tsx` | Server Component | static | `app/page.tsx` (pure render, no client state) | role-match |
| `components/checkerboard-stripe.tsx` | Server Component | static | — | no analog |

---

## Pattern Assignments

### `lib/bikes.ts` (data module, static)

**Analog:** `lib/utils.ts`

**Imports / export pattern** (`lib/utils.ts` lines 1-6):
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Key observation:** The project exports named functions and typed constants from `lib/`. No default export. Use the same named export convention for `bikes` array and `getBike` helper.

**Pattern to copy for `lib/bikes.ts`:** Named export for the data array + a lookup helper. The RESEARCH.md pattern is authoritative here (see Pattern 1 in 01-RESEARCH.md). The only codebase convention to replicate is named exports, no default export, strict TypeScript types.

---

### `lib/validations.ts` (utility, transform)

**Analog:** `app/api/refinar-mensaje/route.ts` (Zod usage inline)

**Validation pattern** (`app/api/refinar-mensaje/route.ts` lines 13-17):
```typescript
if (!borrador || typeof borrador !== 'string' || borrador.trim().length < 10) {
  return NextResponse.json({ error: 'El borrador es demasiado corto.' }, { status: 400 })
}
```

**Key observation:** The existing codebase does manual validation in-route. `lib/validations.ts` will be the first Zod schema file in the project. Use the pattern from RESEARCH.md (Pattern 3 in 01-RESEARCH.md) which is sourced directly from Next.js 16 bundled docs. Export the Zod schema and the inferred TypeScript type as named exports:
```typescript
import { z } from 'zod'

export const contactSchema = z.object({ ... })
export type ContactInput = z.infer<typeof contactSchema>
```

---

### `app/layout.tsx` (root layout, request-response)

**Analog:** `app/layout.tsx` (current file — full rewrite)

**Current imports pattern** (lines 1-7):
```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";
import { ThemeProvider } from "@/components/theme-provider";
```

**Current font loading pattern** (lines 8-12):
```typescript
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
```

**Current html element pattern** (lines 25-26):
```typescript
<html lang="es" className={`${inter.variable} h-full`} suppressHydrationWarning>
  <body className="min-h-full flex bg-background text-foreground antialiased">
```

**What changes:**
- Add `Barlow_Condensed` import alongside `Inter` (same `next/font/google` call shape)
- Set `lang="en"` (Australian market)
- Remove `suppressHydrationWarning` — only needed for theme switching
- Remove `ThemeProvider`, `Sidebar`, `TopHeader` imports and JSX
- Add `Nav` component and `CheckerboardStripe` in their place
- Keep the `skip-link` accessibility anchor and `#main-content` target
- Apply both font variables: `className={`${inter.variable} ${barlowCondensed.variable}`}`

**Keep pattern** (lines 29-36 structure):
```typescript
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
{/* Nav replaces Sidebar + TopHeader */}
<main id="main-content" className="flex-1 overflow-auto" tabIndex={-1}>
  {children}
</main>
```

---

### `app/globals.css` (config, static)

**Analog:** `app/globals.css` (current file — token replacement)

**Keep: imports block** (lines 1-5):
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));
```

**Keep: @theme inline block structure** (lines 7-44) — remove sidebar tokens, add brand tokens:
- Remove all `--color-sidebar-*` lines (8 lines, sidebar gone)
- Add `--color-brand-black`, `--color-brand-white`, `--color-brand-red`, `--color-brand-checker`
- Change `--font-heading: var(--font-inter)` to `--font-heading: var(--font-barlow-condensed)`
- Add `--font-sans: var(--font-inter)` (keep)

**Replace: entire :root block** (lines 51-79) with Lambre-Bull tokens from 01-UI-SPEC.md:
```css
:root {
  --background: #0a0a0a;
  --foreground: #f2f2ee;
  --card: #1a1a1a;
  --card-foreground: #f2f2ee;
  --primary: #cc2200;
  --primary-foreground: #f2f2ee;
  --muted-foreground: #888880;
  --destructive: oklch(0.65 0.22 27);
  --border: rgba(242, 242, 238, 0.12);
  --input: rgba(242, 242, 238, 0.10);
  --ring: #cc2200;
  --radius: 0.125rem;
  /* full token list in 01-UI-SPEC.md § Color */
}
```

**Delete: entire .dark block** (lines 84-111) — dark-only site, no class switching needed.

**Keep: @layer base block** (lines 113-153) with these changes:
- Keep `.skip-link`, `*:focus-visible`, `textarea/input:focus-visible` rules unchanged
- Replace heading scale (lines 150-152):
```css
/* OLD */
h1 { @apply text-4xl font-extrabold tracking-tight; }
h2 { @apply text-2xl font-bold tracking-tight; }
h3 { @apply text-base font-semibold; }

/* NEW */
h1 { @apply text-5xl font-black tracking-tight leading-none; font-family: var(--font-barlow-condensed); }
h2 { @apply text-3xl font-black tracking-tight; font-family: var(--font-barlow-condensed); }
h3 { @apply text-xl font-black; font-family: var(--font-barlow-condensed); }
```

**Add after @layer base:** checkerboard utility class:
```css
.checkerboard {
  background-image: repeating-conic-gradient(
    #1a1a1a 0% 25%,
    #f2f2ee 0% 50%
  ) 0 0 / 16px 16px;
}
```

---

### `next.config.ts` (config, static)

**Analog:** `next.config.ts` (current file — additive change)

**Current file** (lines 1-7):
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', 'mammoth', 'pdfjs-dist'],
};

export default nextConfig;
```

**What changes:** Add `cacheComponents: true`. Clean up `serverExternalPackages` — remove PDF/mammoth packages (those files are deleted). The array can be emptied or the key removed entirely if no other packages need it.

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

---

### `app/page.tsx` (Server Component, request-response — FULL REWRITE)

**Analog:** Current `app/page.tsx` (async Server Component pattern, lines 40-101)

**Server Component import pattern** (lines 1-11):
```typescript
import { Card, CardContent } from '@/components/ui/card'
import { Coffee, Users, AlertCircle, ... } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
```

**Async Server Component signature** (line 40):
```typescript
export default async function DashboardPage() {
```

**Page wrapper pattern** (line 101):
```typescript
return (
  <div className="p-8 max-w-5xl mx-auto">
```

**What to reuse:** The async Server Component function signature, named default export, `max-w-*xl mx-auto` centering, and `Link` for CTAs. Replace all Supabase data fetching with direct import from `lib/bikes.ts`. Replace the dashboard card layout with the bike listing grid.

**New import pattern for Lambre-Bull pages:**
```typescript
import { bikes } from '@/lib/bikes'
import { BikeCard } from '@/components/bike-card'
import Link from 'next/link'
```

---

### `app/about/page.tsx` (Server Component, static — NEW)

**Analog:** `app/page.tsx` async Server Component structure

**Pattern to copy:** Same async Server Component shape but without any data fetching. Pure static render.

```typescript
// No imports from lib/ needed — all content is inline
export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-16">
      {/* content */}
    </main>
  )
}
```

**Note:** No `async` keyword needed since there is no `await` call. Server Component by default — no `'use client'` directive.

---

### `app/bikes/[id]/page.tsx` (Server Component, CRUD/static — NEW)

**Analog:** `app/jobs/[id]/page.tsx`

**Current dynamic route pattern** (lines 38-39) — this is the OLD Next.js pattern. Do NOT copy it:
```typescript
// OLD — client-side pattern using useParams (do not copy)
export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
```

**New pattern required** (Next.js 16 async params — from RESEARCH.md Pattern 2):
```typescript
// NEW — Server Component with async params (copy this)
export async function generateStaticParams() {
  return bikes.map(b => ({ id: b.id }))
}

export default async function BikePage({ params }: { params: Promise<{ id: string }> }) {
  'use cache'
  cacheLife('max')
  const { id } = await params   // Always await params in Next.js 16
  const bike = getBike(id)
  if (!bike) notFound()
  ...
}
```

**notFound pattern:** `app/jobs/[id]/page.tsx` has an equivalent null check (lines 92-98):
```typescript
if (!job) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <p className="text-sm text-muted-foreground">Oferta no encontrada.</p>
    </div>
  )
}
```
Replace with Next.js `notFound()` import from `next/navigation` for the Lambre-Bull version — cleaner and triggers the not-found boundary.

**Layout pattern from jobs/[id]** (lines 101-108):
```typescript
return (
  <div className="p-8 max-w-4xl mx-auto">
    <button onClick={() => router.back()} ...>Volver</button>
    <Card className="mb-6">
      <CardContent className="p-6">
        ...two-column header with title left, action right...
      </CardContent>
    </Card>
```

For Lambre-Bull: use `max-w-6xl` (wider — gallery needs space), two-column split (gallery left, spec+CTA right), and `Link` back instead of `router.back()` since the page is prerendered.

---

### `app/contact/page.tsx` (Server Component wrapper, request-response — NEW)

**Analog:** `app/coffees/page.tsx` (searchParams reading), `app/page.tsx` (Server Component shell)

**searchParams async pattern from coffees** (lines 1-4 of coffees — uses `useSearchParams` hook because it's a Client Component):
```typescript
// coffees/page.tsx uses client-side useSearchParams — do NOT copy this
import { useSearchParams } from 'next/navigation'
const searchParams = useSearchParams()
```

**New server-side pattern required** (from RESEARCH.md Pattern 4):
```typescript
// contact/page.tsx — Server Component reads searchParams as Promise
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>
}) {
  const { subject } = await searchParams   // Always await searchParams in Next.js 16
  return (
    <main className="max-w-lg mx-auto px-4 py-16">
      <ContactForm defaultSubject={subject} />
    </main>
  )
}
```

**Key divergence from existing codebase:** All existing pages that read URL params use `useSearchParams` (client-side). Lambre-Bull's contact page uses server-side `searchParams` prop — a different pattern. This is the correct Next.js 16 approach for a page that does not need client interactivity itself.

---

### `app/actions/contact.ts` (Server Action, request-response — NEW)

**Analog:** `app/api/refinar-mensaje/route.ts`

**External API call pattern** (`app/api/refinar-mensaje/route.ts` lines 1-6):
```typescript
import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
```

**Validation + try/catch + error return pattern** (lines 12-45):
```typescript
if (!borrador || typeof borrador !== 'string' || borrador.trim().length < 10) {
  return NextResponse.json({ error: '...' }, { status: 400 })
}
try {
  const response = await client.chat.completions.create({ ... })
  return NextResponse.json({ version_refinada })
} catch (error) {
  const message = error instanceof Error ? error.message : 'Error desconocido'
  console.error('[refinar-mensaje]', message)
  return NextResponse.json({ error: '...' }, { status: 500 })
}
```

**What to replicate:** The try/catch structure, the `console.error` with a `[module-name]` prefix, and the pattern of catching `Error` instances before falling back to a generic message.

**What diverges:** Server Action is NOT a Route Handler — no `NextRequest`/`NextResponse`. The action signature is:
```typescript
'use server'

export async function submitContact(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Zod validation, then Resend call
  // Returns plain object, not NextResponse
}
```

**SDK initialization pattern** (from refinar-mensaje line 4):
```typescript
// Pattern: initialize SDK at module level with env var
const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Copy shape for Resend:
const resend = new Resend(process.env.RESEND_API_KEY)
```

---

### `components/nav.tsx` (Server Component, static — NEW)

**Analog:** `components/top-header.tsx`

**Header element and sticky positioning pattern** (`components/top-header.tsx` line 31):
```typescript
<header className="border-b border-border bg-background flex items-center px-8 gap-6 sticky top-0 z-10" style={{height: '3.75rem'}}>
```

**What to reuse:** The `<header>` element, `sticky top-0 z-10`, the `px-8` horizontal padding, and the `flex items-center` pattern.

**What diverges:**
- Nav is a Server Component — no `'use client'` directive, no `useState`, no `useTheme`
- Layout is `justify-between` (logo left, links right) rather than search-dominated center
- Height is 64px (`h-16`) per UI spec, not 3.75rem
- Add `MobileMenu` Client Component for the hamburger (see below)
- No theme toggle, no search input

**Nav links pattern from sidebar** (`components/sidebar.tsx` lines 99-101):
```typescript
const active = pathname === matchPath || pathname.startsWith(matchPath + '/')
// active styles:
active ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
```

For Lambre-Bull nav, the active indicator is a bottom border on the link (`border-b-2 border-[#cc2200]`) and `text-[#cc2200]`. The `usePathname` hook requires `'use client'` — put active-state logic in a small `NavLink` Client Component or accept that the server-rendered nav won't highlight the active link (acceptable for v1 given the small nav).

---

### `components/mobile-menu.tsx` (Client Component, event-driven — NEW)

**Analog:** `components/sidebar.tsx`

**useState open/close toggle pattern** (`components/sidebar.tsx` lines 48-49):
```typescript
const [openItem, setOpenItem] = useState<'cv' | 'jobs' | null>(null)
```

**'use client' + useState imports** (lines 1-5):
```typescript
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
```

**What to reuse:** The `'use client'` directive at top, `useState` for open boolean, and the `Link` with `onClick={() => setOpen(false)}` to close on navigation.

**What diverges:** No Supabase, no router. Simple `boolean` state (not union). Full-screen `position: fixed` overlay pattern does not exist in the codebase yet — follow RESEARCH.md Pattern 7.

---

### `components/bike-gallery.tsx` (Client Component, event-driven — NEW)

**Analog:** `components/sidebar.tsx` (useState active index), `app/jobs/[id]/page.tsx` (tab switching pattern)

**Tab switching with active index** (`app/jobs/[id]/page.tsx` lines 43, 171-184):
```typescript
const [activeTab, setActiveTab] = useState<'cv' | 'cover' | 'jd'>('cv')

// Active indicator on button:
className={`text-sm pb-3 border-b-2 transition-colors font-medium ${
  activeTab === 'cv'
    ? 'border-primary text-foreground'
    : 'border-transparent text-muted-foreground hover:text-foreground'
}`}
onClick={() => setActiveTab('cv')}
```

**What to reuse:** The pattern of `useState(0)` for active index, conditional className on the active item (ring vs opacity), and `onClick` handler shape.

**What diverges:** Index is `number` not a union type. Uses `next/image` with `fill` prop — no existing analog for this in the codebase. Follow RESEARCH.md Pattern 5.

---

### `components/contact-form.tsx` (Client Component, request-response — NEW)

**Analog:** `app/jobs/new/page.tsx` (form with loading state and error handling)

**'use client' + useState loading pattern** (`app/jobs/new/page.tsx` lines 1-56):
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
```

**Submit handler shape** (lines 57-60):
```typescript
async function handleAnalyze() {
  if (!jobText.trim()) return
  setLoading(true)
  setError(null)
```

**What to reuse:** The `'use client'` directive, Button/Input/Label shadcn imports, Loader2 for pending state visual, and the error string state pattern.

**What diverges — critical:** Lambre-Bull contact form uses `useActionState` + Server Action, NOT `useState` + `fetch`. This is the primary pattern difference. The jobs/new pattern is client-fetch based. Contact form must use:

```typescript
'use client'

import { useActionState } from 'react'
import { submitContact, type ContactFormState } from '@/app/actions/contact'

const initialState: ContactFormState = { status: 'idle' }

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState)
  // ...
  <form action={formAction}>        // action prop gets the Server Action
  <button disabled={pending}>       // pending from useActionState, not local useState
```

**shadcn component imports from coffees.tsx** (lines 7-9):
```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
```
Copy this import block — these same three components are needed for the contact form. Add `Textarea` when installed via `npx shadcn add textarea`.

---

### `components/spec-sheet.tsx` (Server Component, static — NEW)

**Analog:** `app/page.tsx` stats rendering pattern (lines 93-133)

**Pure render pattern with typed prop** (`app/page.tsx` lines 93-108):
```typescript
const stats = [
  { label: 'Contactos activos', value: String(totalActivos ?? 0), icon: Users, color: 'text-primary' },
  ...
]
// Mapped to JSX:
{stats.map(({ label, value }) => (
  <div key={label} className="px-6 py-5">
    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">{label}</p>
    <p className="text-3xl font-extrabold text-foreground tracking-tight leading-none">{value}</p>
  </div>
))}
```

**What to reuse:** The `label + value` two-line pattern, `uppercase tracking-widest` for labels, and no `'use client'` needed.

**What diverges:** Props-driven (takes `spec: BikeSpec`) rather than reading from local state. No client interactivity. Use `Separator` from shadcn between spec sections.

---

### `components/price-anchor.tsx` (Server Component, static — NEW)

**Analog:** `app/page.tsx` stat value display — no direct match but same pure render shape.

**Pattern:** Smallest possible Server Component. Single `<p>` element. Props-driven. No analog exists in the codebase for `toLocaleString` currency formatting — follow RESEARCH.md Code Examples directly.

---

## Shared Patterns

### 'use client' directive placement
**Source:** `components/sidebar.tsx` line 1, `components/top-header.tsx` line 1, `app/jobs/new/page.tsx` line 1, `app/jobs/[id]/page.tsx` line 1
**Apply to:** `components/mobile-menu.tsx`, `components/bike-gallery.tsx`, `components/contact-form.tsx`

Always the first line of the file, before any imports:
```typescript
'use client'

import { useState } from 'react'
```

### Lucide icon imports
**Source:** `components/sidebar.tsx` lines 8-17, `components/top-header.tsx` lines 3-4
**Apply to:** `components/nav.tsx`, `components/mobile-menu.tsx`

Named imports from `lucide-react`, one import statement:
```typescript
import { ChevronRight, Loader2, X } from 'lucide-react'
```

### shadcn component imports
**Source:** `app/coffees/page.tsx` lines 7-9, `app/jobs/new/page.tsx` lines 3-5
**Apply to:** `components/contact-form.tsx`

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
```

### Link navigation (no router.push for simple links)
**Source:** `app/page.tsx` lines 109-116
**Apply to:** All nav links, bike listing cards, inquiry CTAs

```typescript
import Link from 'next/link'
// Use <Link href="/contact"> not router.push('/contact')
```

### console.error module prefix
**Source:** `app/api/refinar-mensaje/route.ts` line 43
**Apply to:** `app/actions/contact.ts`

```typescript
console.error('[contact-action]', message)
```

### Error catch pattern
**Source:** `app/api/refinar-mensaje/route.ts` lines 40-44
**Apply to:** `app/actions/contact.ts`

```typescript
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error('[contact-action]', message)
  return { status: 'error', message: 'Something went wrong. Try again or email us directly.' }
}
```

### Page max-width centering
**Source:** `app/page.tsx` line 101, `app/jobs/[id]/page.tsx` line 101
**Apply to:** All new page files

```typescript
// Listing pages and detail pages:
<div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
// Contact and narrow pages:
<main className="max-w-lg mx-auto px-4 py-16">
```

### aria-live for async feedback
**Source:** `app/jobs/[id]/page.tsx` line 201
**Apply to:** `components/contact-form.tsx` success/error messages

```typescript
<div aria-live="polite" aria-atomic="true">
  {state.status === 'success' && <p>{state.message}</p>}
</div>
```

---

## No Analog Found

Files with no close match in the codebase (planner should use RESEARCH.md patterns instead):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `components/checkerboard-stripe.tsx` | Server Component | static | No decorative stripe/divider component exists anywhere in the codebase |
| `app/actions/contact.ts` (Server Action shape) | Server Action | request-response | Codebase has only Route Handlers (`route.ts`), never a `'use server'` action file |
| `next/image` usage | — | static | No `next/image` usage exists anywhere in the codebase today; use RESEARCH.md Pattern 5 |

For these three, the RESEARCH.md code examples are the authoritative patterns.

---

## Deletion Checklist (for planner reference)

These files are deleted, not modified. Their patterns must NOT be copied into Lambre-Bull files:

| File | Why pattern must NOT be copied |
|------|-------------------------------|
| `components/sidebar.tsx` | Supabase dependency; persistent sidebar layout (no sidebar in Lambre-Bull) |
| `components/top-header.tsx` | `useTheme` / next-themes dependency; search input pattern (not needed) |
| `components/theme-provider.tsx` | ThemeProvider entire concept removed |
| `lib/supabase.ts` | Database client; Lambre-Bull has no persistence |
| `lib/groq.ts` | AI client; Lambre-Bull has no AI features |
| All `app/api/` routes | Route Handler pattern replaced by Server Actions for the only POST in Lambre-Bull |

---

## Metadata

**Analog search scope:** `app/`, `components/`, `lib/`, `app/api/`
**Files scanned:** 10 source files read in full
**Pattern extraction date:** 2026-05-13

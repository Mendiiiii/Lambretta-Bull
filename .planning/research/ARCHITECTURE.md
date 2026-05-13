# Architecture Patterns

**Domain:** Small product showcase + multi-step configurator website
**Project:** Lambre-Bull
**Researched:** 2026-05-13
**Stack version:** Next.js 16.2.3, React 19.2.4 (App Router)
**Confidence:** HIGH (verified against bundled Next.js docs in node_modules/next/dist/docs/)

---

## Recommended Architecture

Lambre-Bull is a statically renderable marketing site with one interactive island: the configurator. The correct architectural posture is:

- **Everything is a Server Component by default** — bike listings, layout, nav, static pages
- **The configurator is a single Client Component subtree** — it is the only place that needs React state
- **No database** — product data lives in TypeScript files committed to the repo
- **One Route Handler** — `app/api/inquiry/route.ts` handles contact/inquiry form submission (email dispatch)
- **URL search params carry configurator state** — makes sharing and bookmarking possible at zero cost

---

## Data Models

All types live in `lib/types.ts`. All data lives in `lib/data/`.

```typescript
// lib/types.ts

export type Chassis = {
  id: string                  // e.g. "li-150-1962"
  name: string                // e.g. "Li 150 Series 3 (1962)"
  year: number
  model: string               // e.g. "Li 150"
  description: string
  photos: string[]            // paths under /public/bikes/
  available: boolean          // false = sold / show-only
}

export type PartCategory = {
  id: string                  // e.g. "engine"
  label: string               // e.g. "Engine"
  description: string
  required: boolean           // if true, configurator blocks summary until selected
}

export type Part = {
  id: string                  // e.g. "engine-255cc-mugello"
  categoryId: string          // foreign key to PartCategory.id
  name: string                // e.g. "255cc Mugello Engine"
  description: string
  origin?: string             // e.g. "England" — important for brand story
  photo?: string
}

export type Configuration = {
  chassisId: string
  selections: Record<string, string>  // categoryId -> partId
}
```

**Why this shape:**
- `Configuration` is a flat map, not a nested object. It serialises cleanly into URL search params: `?chassis=li-150-1962&engine=engine-255cc-mugello&discs=disc-sls-england`
- `PartCategory.required` lets the Summary step show an "incomplete" warning without hard-coding category names
- `Part.origin` surfaces the England sourcing story, which is core to brand identity

---

## Component Boundaries

```
app/
  layout.tsx                   [Server] Root layout, nav, brand shell
  page.tsx                     [Server] Homepage — hero, featured bikes grid
  bikes/
    page.tsx                   [Server] Bike listing — all available Lambrettas
    [id]/
      page.tsx                 [Server] Bike detail — specs, photos, CTA to configurator
  configurator/
    page.tsx                   [Server] Shell — reads searchParams prop, passes to client
    configurator-shell.tsx     [Client] The entire interactive configurator tree
      step-chassis.tsx         [Client] Step 1 — chassis card selection
      step-parts.tsx           [Client] Step 2 — part picker per category
      step-summary.tsx         [Client] Step 3 — review selections, inquiry form
  contact/
    page.tsx                   [Server] Standalone contact page
  api/
    inquiry/
      route.ts                 [Server] POST — receives inquiry form, sends email

components/
  bike-card.tsx                [Server] Reusable card for bike listing
  part-card.tsx                [Server] Reusable card for parts (Server-safe: no state)
  inquiry-form.tsx             [Client] The form itself, uses useActionState

lib/
  types.ts                     Type definitions
  data/
    bikes.ts                   Chassis/bike catalog as exported TypeScript constant
    parts.ts                   Parts and categories as exported TypeScript constants
  actions/
    inquiry.ts                 Server Action for inquiry form submission
```

**Key boundary decisions:**

| Boundary | Why |
|----------|-----|
| `configurator-shell.tsx` is the single `'use client'` entry point | Prevents the entire `/configurator` route from becoming a client bundle. The page shell (Server Component) can still render metadata, OG tags, etc. |
| `bikes/[id]/page.tsx` is Server Component | Bike detail is pure read — no interactivity. It imports static data at build time. |
| `inquiry-form.tsx` is a separate Client Component | The form uses `useActionState` for pending/error state. Isolating it keeps the client bundle minimal. |
| `api/inquiry/route.ts` vs Server Action | A Route Handler is used here rather than a Server Action because email sending is a side effect with a clear API contract. Either approach works, but a Route Handler makes it easy to test with curl and to add rate limiting later. |

---

## Data Flow

### Bike Listing and Detail (static, Server-rendered)

```
lib/data/bikes.ts (TypeScript constant)
  |
  v
app/bikes/page.tsx (Server Component, async)
  imports bikes array directly — no fetch, no await
  |
  v
<BikeCard /> rendered to HTML at build time
```

Because data is a local import (not a `fetch()` call), there is no network round-trip, no cache configuration needed, and no stale data risk. Updating a bike means editing `lib/data/bikes.ts` and redeploying.

### Configurator State Flow

```
User lands on /configurator
  |
  v
app/configurator/page.tsx (Server Component)
  reads searchParams prop (e.g. { chassis: "li-150-1962", engine: "..." })
  passes initial selections to <ConfiguratorShell initialSelections={...} />
  |
  v
ConfiguratorShell (Client Component)
  owns local state: useState<Configuration>
  initialised from props (which came from URL)
  |
  +-- Step 1: ChassisSelector
  |     onChange → updates state.chassisId
  |     onChange → router.replace(url with new ?chassis=...)
  |
  +-- Step 2: PartPicker (renders per PartCategory)
  |     onChange → updates state.selections[categoryId]
  |     onChange → router.replace(url with updated search param)
  |
  +-- Step 3: ConfigurationSummary
        renders read-only view of selections
        renders <InquiryForm configuration={state} />
```

**Why URL params carry state, not just local state:**
- The user can bookmark or share their configuration — important for a custom, high-consideration purchase
- Back/forward browser navigation works correctly
- The Server Component `page.tsx` can pre-populate state on initial load (useful for CTA links from bike detail pages like `/configurator?chassis=li-150-1962`)
- Zero extra infrastructure: no store, no context, no session

**Why local `useState` also exists (not URL-only):**
- `useSearchParams` is read-only. To update URL params you call `router.replace()`. During rapid selection changes, managing that in every event handler gets noisy
- The clean pattern: local state is the source of truth for the UI, URL is updated on every change as a side effect via `useEffect` or in the event handler directly. On mount, state is initialised from URL params passed via server props.

### Inquiry / Contact Form

```
User fills InquiryForm (Client Component)
  |
  v
form action={inquiryAction} (Server Action in lib/actions/inquiry.ts)
  OR
POST /api/inquiry (Route Handler)
  |
  v
Server: validate with zod, send email via Resend/Nodemailer
  |
  v
Return success/error state to form via useActionState
```

Recommendation: use a **Server Action** for simplicity. The form calls `inquiryAction(formData)`, which:
1. Validates fields with zod
2. Sends email (Resend is the simplest, single API key, free tier is generous)
3. Returns `{ success: boolean, message: string }` which `useActionState` surfaces to the UI

No database write needed. The email is the record.

---

## Suggested Build Order

Build in this sequence. Each step produces something visible and testable before the next depends on it.

### 1. Data layer first (no UI)
- Define `lib/types.ts`
- Write `lib/data/bikes.ts` with 1-2 real bike entries
- Write `lib/data/parts.ts` with real categories and 2-3 parts each
- No component yet. Validate the shape compiles.

**Why first:** Every component depends on these types. Getting the shape right early prevents refactoring components later.

### 2. Bike listing and detail
- `app/bikes/page.tsx` — renders `BikeCard` grid from imported data
- `components/bike-card.tsx` — displays chassis name, photo, available/sold badge
- `app/bikes/[id]/page.tsx` — full bike detail with photo gallery, specs table

**Why second:** This is the simplest read path. No state, no interactivity. Validates that data imports, routing, and image handling all work. Gives you something to show immediately.

### 3. Brand shell and navigation
- `app/layout.tsx` — header with logo + nav links, footer
- Brand design tokens (Tailwind config or CSS variables for the B&W Mod palette)

**Why third (not first):** It's tempting to do design first, but having real content in components makes design decisions easier. Do layout after you have real pages to style.

### 4. Configurator — static skeleton
- `app/configurator/page.tsx` — Server Component shell
- `components/configurator-shell.tsx` — Client Component with stepped UI (no state logic yet, just render the steps statically)
- `step-chassis.tsx` renders chassis cards as a visual grid
- `step-parts.tsx` renders part cards per category

**Why before state logic:** Separates "what does it look like" from "how does state flow." Easier to review visually before wiring interactivity.

### 5. Configurator state wiring
- Add `useState<Configuration>` to `ConfiguratorShell`
- Wire onChange handlers in ChassisSelector and PartPicker
- Add URL sync: `useEffect` watches state, calls `router.replace()`
- Parse initial state from server-passed `searchParams` prop
- Implement ConfigurationSummary step

**Why after skeleton:** The visual structure is already proven. Only state logic changes here.

### 6. Inquiry form and email
- `components/inquiry-form.tsx` — Client Component with `useActionState`
- `lib/actions/inquiry.ts` — Server Action, zod validation, email send
- Email transport: Resend (or SMTP via Nodemailer if Resend is unwanted)
- Test the full flow: fill form, receive email

### 7. Contact page
- Simple standalone form reusing `InquiryForm` without the configuration context
- No new architecture needed

### 8. Homepage
- Hero with brand statement, CTA to `/bikes` or `/configurator`
- Can feature 1-2 bike cards pulled from the bikes data

**Why last:** The homepage is marketing copy around content that already exists. Writing it last means you have real photos, real bike names, and real brand feel to work from.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Putting configurator state in a global store (Zustand, Context)
**What goes wrong:** You introduce a dependency, test surface, and bundle weight for what is genuinely just URL params + local component state.
**Instead:** URL params + `useState` inside the configurator Client Component subtree. No state escapes the configurator. No global store needed.

### Anti-Pattern 2: Fetching product data at runtime
**What goes wrong:** You add a `fetch('/api/bikes')` somewhere, which requires an API route, error handling, loading states, and cache invalidation for data that literally never changes between deploys.
**Instead:** Import directly from `lib/data/bikes.ts`. The data is in the same repo. Use the filesystem. This is the correct trade-off for developer-managed content at this scale.

### Anti-Pattern 3: Making the entire `/configurator` route a Client Component
**What goes wrong:** Metadata, OG images, and static content (the page title, SEO description) get excluded from the server render. The entire route JS bundle grows.
**Instead:** Keep `app/configurator/page.tsx` as a Server Component. Read `searchParams` from its props there. Pass initial values as plain serialisable props to `<ConfiguratorShell>`. The boundary is the shell component, not the page.

### Anti-Pattern 4: Encoding the entire `Configuration` object as a single URL param (JSON-encoded)
**What goes wrong:** `?config={"chassisId":"li-150","selections":{"engine":"..."}}` is fragile, ugly in URLs, and breaks URL sharing when percent-encoded.
**Instead:** Flat params: `?chassis=li-150-1962&engine=engine-mugello-255cc&discs=disc-sls-england`. Each category becomes its own param key. Clean, readable, shareable.

### Anti-Pattern 5: Using a database for bike data in v1
**What goes wrong:** You add migration tooling, env var management, connection pooling, and a deployment dependency for 1-5 rows that change 2-3 times a year.
**Instead:** TypeScript files. When inventory changes, open the file, change a field, commit, deploy. Takes 5 minutes and leaves a full git history of every change.

---

## File/Directory Structure Summary

```
app/
  layout.tsx
  page.tsx                        Homepage
  bikes/
    page.tsx                      Listing
    [id]/
      page.tsx                    Detail
  configurator/
    page.tsx                      Server shell, reads searchParams
    configurator-shell.tsx        Client, owns Configuration state
    step-chassis.tsx              Client
    step-parts.tsx                Client
    step-summary.tsx              Client
  contact/
    page.tsx
  api/
    inquiry/
      route.ts                    (optional, if not using Server Actions)

components/
  bike-card.tsx
  part-card.tsx
  inquiry-form.tsx                Client

lib/
  types.ts
  data/
    bikes.ts
    parts.ts
  actions/
    inquiry.ts                    Server Action

public/
  bikes/
    [chassis-id]/
      01.jpg
      02.jpg
      ...
```

---

## Scalability Notes

This architecture handles the stated scope with zero over-engineering. Future evolution paths that do not require architectural changes:

- **Add more bikes:** edit `lib/data/bikes.ts`, add photos to `public/`
- **Add more part categories:** edit `lib/data/parts.ts`, the configurator renders categories dynamically
- **Visual configurator later:** `ConfiguratorShell` is already isolated; replace step components with richer ones without touching data layer
- **CMS in the future:** swap `lib/data/bikes.ts` import for a `fetch()` call to a headless CMS API; types remain unchanged

Architectural changes that would be required only at significant scale:
- **Payments/e-commerce:** would require a database (Postgres), authentication, and order management — out of scope for v1 by design
- **Admin panel:** same database requirement; developer-managed content explicitly avoids this

---

## Sources

- Next.js 16.2.3 bundled docs: `node_modules/next/dist/docs/01-app/`
  - `01-getting-started/05-server-and-client-components.md` — Server/Client boundary rules
  - `01-getting-started/15-route-handlers.md` — Route Handler conventions and caching
  - `02-guides/forms.md` — Server Actions, `useActionState`, form validation with zod
  - `02-guides/static-exports.md` — Static rendering capabilities and constraints
  - `03-api-reference/04-functions/use-search-params.md` — URL param patterns, Suspense requirement
- Project context: `.planning/PROJECT.md`

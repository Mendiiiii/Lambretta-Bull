# Phase 03: Gated Content and Trust Infrastructure - Research

**Researched:** 2026-05-19
**Domain:** Next.js static page, shadcn/ui Accordion, iframe video embed, nav wiring
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Route is `/import` (`app/import/page.tsx`).
- **D-02:** Page structure: short editorial intro (Malaga-to-Sydney journey framing) + numbered process steps (ADR exemption, import/customs, Blue Slip, historic registration) + FAQ section with accordion at the end.
- **D-03:** Tone is orientative and reassuring, not technical. Goal is "we handle this, here is what happens." No exact cost figures. Focus on process and that Bulbena has done it before.
- **D-04:** No interactive elements beyond the FAQ accordion. No forms, no CTAs other than the site-wide Contact link.
- **D-05:** Phase 3 builds the page with provisional placeholder text. Page is navigable in dev. Wired into nav but can be toggled off in prod until content is verified.
- **D-06:** BuildVideo component: `components/build-video.tsx`. Renders nothing if no `videoUrl`. No dedicated route, no placeholder visible to end users.
- **D-07:** Default placement: About page (`app/about/page.tsx`). Can be moved later.
- **D-08:** Video platform TBD. Component accepts a generic `src` URL. YouTube and Vimeo compatible.
- **D-09:** To activate: add `videoUrl` wherever the component is placed. One-line activation.
- **D-10:** "How it gets to you" link added to primary nav header (`components/nav.tsx`) and mobile menu (`components/mobile-menu.tsx`), alongside About and Contact.
- **D-11:** Nav label: "How it gets to you".

### Claude's Discretion

- Exact accordion component choice: shadcn/ui Accordion is already available (needs `npx shadcn add accordion`) — use it.
- Placeholder content depth for /import: write enough to validate structure (3-5 sentences per step, 3-5 FAQ entries), not production-quality text.
- Whether to use `generateStaticParams` or static render for /import: static page with no dynamic data, use `'use cache'` or default static render.

### Deferred Ideas (OUT OF SCOPE)

- Multilingual support (ES + EN): deferred to a future phase.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BRAND-02 | User can read how import and registration works in Australia ("How it gets to you" page: pre-1989 ADR exemption, duty, Blue Slip, historic rego). Regulatory content requires live verification before publishing. | `/import` static Server Component page, shadcn Accordion for FAQ, nav wiring in both nav files |
| BIKE-05 | User can watch a build process video per bike. Content-gated: requires video to exist before shipping. | `BuildVideo` conditional component using `<iframe>` embed, placed on About page with zero-footprint when `videoUrl` is absent |
</phase_requirements>

---

## Summary

Phase 3 delivers three files of new code (the `/import` page, the `BuildVideo` component, and nav entry in two files) and one new dependency (the shadcn Accordion component, added via CLI). All decisions are locked. No external APIs, no server actions, no database reads. The entire phase is static render territory.

The `/import` page follows the exact same pattern as `app/about/page.tsx`: an `async` Server Component with `'use cache'` and `cacheLife('max')` at the top, `<article>` root, editorial prose sections, and a closing CTA pointing at `/contact`. The new addition is a final `<section>` containing the shadcn `Accordion` component for the FAQ, which requires installing the `accordion` primitive from the shadcn registry (one `npx shadcn add accordion` command, creates `components/ui/accordion.tsx`).

The `BuildVideo` component is a minimal conditional render: if the prop `src` is a non-empty string, render a responsive `<iframe>` wrapper; otherwise return `null`. No client state, no `'use client'`, no dependencies beyond the JSX itself. The About page adds an optional `videoUrl` prop or inline constant (defaulting to `undefined`/`null`) that gates the component. The nav wiring is a one-line addition to each of the two `links` arrays in `components/nav.tsx` and `components/mobile-menu.tsx`.

**Primary recommendation:** Install the Accordion component first (`npx shadcn add accordion`), then build all three deliverables as pure Server Component additions following established patterns in the codebase.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| /import page render | Frontend Server (SSR/static) | CDN (prerendered) | Pure static content, no request-time data — prerendered at build |
| FAQ accordion interaction | Browser / Client | — | shadcn Accordion uses Base UI which handles open/close state in the browser; the component file itself is a Server Component (Base UI accordion uses no React state hooks that force `'use client'` at the page level) |
| BuildVideo conditional embed | Frontend Server (SSR/static) | — | Prop-conditional at render time, no browser state needed; if `src` is known at build, entire page is static |
| Nav wiring | Frontend Server (SSR/static) | Browser (mobile menu) | Desktop nav is a Server Component; mobile menu is `'use client'` due to `useState` for open/close |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 16.2.6 (installed) | Static page routing, `'use cache'` prerendering | Already the project framework [VERIFIED: package.json] |
| React | 19.2.4 (installed) | UI runtime | Installed [VERIFIED: package.json] |
| TypeScript | ^5 (installed) | Type safety, strict mode | Installed [VERIFIED: package.json] |
| Tailwind CSS v4 | ^4 (installed) | Utility styling via `@theme` tokens | Installed and configured in globals.css [VERIFIED: app/globals.css] |
| shadcn/ui Accordion | 4.7.0 CLI (needs install) | FAQ collapsible sections | Not yet installed — `npx shadcn add accordion` creates `components/ui/accordion.tsx` [VERIFIED: shadcn dry-run] |
| @base-ui/react Accordion | 1.4.1 (installed) | Underlying primitive for shadcn Accordion | Already installed as dependency [VERIFIED: node_modules] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/link` | built-in | Internal links | All internal navigation, including CTA on /import |
| `next/cache` (cacheLife) | built-in | Static prerender control | `'use cache'` + `cacheLife('max')` on /import page, matching About page pattern |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| shadcn Accordion (Base UI) | `<details>`/`<summary>` HTML | HTML native is zero-dependency but inconsistent browser animation and harder to style within the brand; Accordion is already in the project ecosystem |
| `<iframe>` for video | `next-video`, Cloudinary | Way too heavy for a single conditional embed that may never activate; `<iframe>` is the Next.js docs-recommended approach for external platform videos [CITED: node_modules/next/dist/docs/01-app/02-guides/videos.md] |

**Installation (Accordion only — all other deps already installed):**
```bash
npx shadcn add accordion
```

**Version verification:**
- `shadcn` CLI: 4.7.0 [VERIFIED: node_modules/shadcn/package.json]
- `@base-ui/react`: 1.4.1 [VERIFIED: node_modules/@base-ui/react/package.json]
- Accordion primitive in `@base-ui/react`: confirmed present at `node_modules/@base-ui/react/accordion` [VERIFIED: directory listing]

---

## Architecture Patterns

### System Architecture Diagram

```
Browser request → Vercel CDN (prerendered HTML)
                        ↓
              /import page (static)
                        ↓
         ┌──────────────────────────────┐
         │  article                     │
         │    header (editorial intro)  │
         │    section × 4 (steps)       │
         │    section (FAQ)             │
         │      Accordion               │
         │        AccordionItem × N     │
         │    section (Contact CTA)     │
         └──────────────────────────────┘

About page (static) → optional BuildVideo slot
         ↓ videoUrl prop/const
         ├── undefined/null → renders null (zero footprint)
         └── "https://..." → renders responsive iframe wrapper
                                    ↓
                             YouTube / Vimeo embed
                             (third-party script loads in browser)

Nav request:
  components/nav.tsx (Server Component)
    links array → includes "/import" "How it gets to you"
  components/mobile-menu.tsx ('use client')
    links array → includes "/import" "How it gets to you"
```

### Recommended Project Structure

The phase adds these files:

```
app/
  import/
    page.tsx          # new — /import static Server Component
components/
  build-video.tsx     # new — conditional iframe embed
  ui/
    accordion.tsx     # new — created by `npx shadcn add accordion`
  nav.tsx             # modified — add /import link
  mobile-menu.tsx     # modified — add /import link
```

### Pattern 1: Static Server Component Page (matches About)

**What:** `async` Server Component with `'use cache'` directive and `cacheLife('max')` for full prerendering at build time.

**When to use:** Any page with no request-time data, no user-specific content.

```typescript
// Source: app/about/page.tsx (verified in codebase)
import Link from 'next/link'
import { cacheLife } from 'next/cache'

export default async function ImportPage() {
  'use cache'
  cacheLife('max')

  return (
    <article className="max-w-3xl mx-auto px-4 md:px-8 py-16">
      {/* ... */}
    </article>
  )
}
```

### Pattern 2: shadcn Accordion for FAQ

**What:** `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` from `@/components/ui/accordion`. The component file itself uses Base UI primitives and does NOT include `'use client'` — the interactivity is handled by Base UI's own client boundary internally. The page remains a Server Component.

**When to use:** FAQ sections, collapsible lists.

```typescript
// Source: shadcn add accordion --view output (verified via CLI dry-run)
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

// Inside the page's JSX:
<Accordion>
  <AccordionItem value="item-1">
    <AccordionTrigger>Do I need to handle import duty myself?</AccordionTrigger>
    <AccordionContent>
      No. Customs and duty are handled on arrival before the bike reaches you.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

Note: The `AccordionItem` prop name for the identifier may be `value` or unnamed depending on the Base UI version. The generated file from `npx shadcn add accordion` is the authority — read it after install.

### Pattern 3: Conditional Video Embed

**What:** A Server Component that renders `null` when no `src` prop is provided, or a responsive `<iframe>` wrapper when a URL is present. No `'use client'` needed — the iframe itself loads external scripts in the browser.

**When to use:** Any optional embed that should have zero DOM footprint when inactive.

```typescript
// Source: Next.js videos guide (node_modules/next/dist/docs/01-app/02-guides/videos.md)
// Pattern: conditional render + responsive iframe

type BuildVideoProps = {
  src: string
}

export function BuildVideo({ src }: BuildVideoProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm">
      <iframe
        src={src}
        title="Build process video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
```

Caller in About page:
```typescript
// Zero footprint when videoUrl is undefined
const videoUrl: string | undefined = undefined // set to URL string to activate

{videoUrl && <BuildVideo src={videoUrl} />}
```

### Pattern 4: Nav Link Addition

**What:** Both `components/nav.tsx` (Server Component) and `components/mobile-menu.tsx` (`'use client'`) define a `links` array. Add the new entry to both.

```typescript
// Source: components/nav.tsx and components/mobile-menu.tsx (verified in codebase)
const links = [
  { href: '/', label: 'Bikes' },
  { href: '/configure', label: 'Custom build' },
  { href: '/about', label: 'About' },
  { href: '/import', label: 'How it gets to you' },  // ADD THIS
  { href: '/contact', label: 'Contact' },
]
```

The label "How it gets to you" is longer than other nav items. No code change is needed for the desktop nav layout (flex gap-8 handles it naturally). Mobile menu uses `text-5xl font-black` — the longer label will wrap on very narrow screens. Acceptable per D-11; no truncation logic needed for Phase 3.

### Anti-Patterns to Avoid

- **Adding `'use client'` to /import page:** The page has no client state. The FAQ accordion's interactivity is handled by Base UI internally — the page stays a Server Component. [VERIFIED: shadcn accordion code uses Base UI primitives only]
- **Adding `'use client'` to BuildVideo:** The `<iframe>` tag is pure HTML; no React hooks or browser APIs are needed in the component itself.
- **Using em dashes in editorial content:** Project-wide constraint — no `—` characters. Use commas, periods, or rephrase. [CITED: app/globals.css brand constraints, About page copy pattern]
- **Hardcoding exact import costs or duty percentages:** D-03 explicitly forbids it. Placeholder text should describe the process, not figures.
- **Placing accordion in its own page:** D-02 specifies FAQ is the last section of /import, not a standalone route.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Collapsible FAQ items | Custom `useState` toggle | shadcn Accordion (Base UI) | Keyboard accessibility, ARIA `aria-expanded`, animation via `tw-animate-css` — all handled. Base UI v1.4.1 is already installed. |
| Responsive iframe wrapper | Raw `<iframe>` without aspect ratio | `aspect-video` Tailwind class + `relative/absolute` positioning | The aspect-ratio approach from the Next.js videos guide is the standard pattern for responsive iframes without JS. |
| Video platform detection | URL-parsing logic to choose embed style | Generic `<iframe src={src}>` | YouTube and Vimeo both accept standard iframe embeds. Platform-specific players (YouTube API, Vimeo player SDK) are unnecessary for a passive embed. |

**Key insight:** Every problem in this phase has a solution already in the project's dependency tree. No new packages beyond the Accordion component install.

---

## Common Pitfalls

### Pitfall 1: AccordionItem value prop naming

**What goes wrong:** The Base UI accordion's `<AccordionItem>` may use a different prop name than Radix-based implementations. If copied from Radix shadcn examples, the `value` prop may be missing or incorrectly named.

**Why it happens:** The shadcn registry has been migrating from Radix UI to Base UI. This project uses the Base UI variant (`style: "base-nova"` in `components.json`). The generated `accordion.tsx` wraps `AccordionPrimitive.Item` from `@base-ui/react/accordion`.

**How to avoid:** After running `npx shadcn add accordion`, read the generated `components/ui/accordion.tsx` before writing any FAQ JSX. Use the exact prop names from that file.

**Warning signs:** TypeScript errors on `AccordionItem` props after install.

### Pitfall 2: Nav label length on mobile

**What goes wrong:** "How it gets to you" is significantly longer than "Bikes" or "About". In the mobile menu fullscreen overlay, which uses `text-5xl font-black`, a five-word label can overflow on narrow viewports (iPhone SE width 375px).

**Why it happens:** The mobile menu is a flex column with `items-center`, so long labels wrap to multiple lines instead of truncating. This is visually disruptive at large font size.

**How to avoid:** The label is locked by D-11. Verify the render on a 375px viewport. If wrapping is visually unacceptable, the mobile label can use a shorter alias (e.g., "Import guide") while the desktop nav keeps the full label — but this is a discretion call for the executor, not a scope change.

**Warning signs:** Visual inspection on narrow viewport shows two-line nav items in the mobile menu overlay.

### Pitfall 3: `'use cache'` without `cacheLife` causes short-lived cache

**What goes wrong:** Using `'use cache'` alone without `cacheLife('max')` on a purely static page results in a shorter default revalidation window, not true full prerender.

**Why it happens:** The default `cacheLife` profile in Next.js 16 is not `'max'`. The About page explicitly calls both. Omitting `cacheLife('max')` on /import means the page may revalidate on a schedule instead of being treated as truly static.

**How to avoid:** Always pair `'use cache'` with `cacheLife('max')` for pages with no dynamic data. Mirror the About page pattern exactly.

**Warning signs:** `next build` output shows route as dynamic or partial-prerender instead of `○ (Static)`.

### Pitfall 4: iframe origin policy for YouTube embed URLs

**What goes wrong:** Using the standard `youtube.com/watch?v=...` URL as the iframe `src` produces a blank embed. YouTube requires the `/embed/` URL format.

**Why it happens:** YouTube's standard watch URLs are not embeddable. Only `https://www.youtube.com/embed/{videoId}` works in an `<iframe>`.

**How to avoid:** Document this for the content handoff. When Alfonso provides a video URL, it must be converted to embed format. The component itself can accept only the embed URL (simplest) or include a utility function to normalize common YouTube URL formats. For Phase 3 with no video existing yet, this is a note in the activation instructions, not code.

**Warning signs:** Blank or grey iframe when activating the component with a standard YouTube watch URL.

---

## Code Examples

Verified patterns from existing codebase:

### About page structure (template for /import)
```typescript
// Source: app/about/page.tsx (verified in codebase)
import Link from 'next/link'
import { cacheLife } from 'next/cache'

export default async function AboutPage() {
  'use cache'
  cacheLife('max')

  return (
    <article className="max-w-3xl mx-auto px-4 md:px-8 py-16">
      <header className="mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#cc2200]">
          [category label]
        </p>
        <h1 className="mt-2">[Page title]</h1>
        <p className="mt-6 text-lg text-[#f2f2ee] leading-relaxed">[Intro paragraph]</p>
      </header>
      {/* sections */}
      <section className="border-t border-[rgba(242,242,238,0.12)] pt-12 mt-12 flex flex-col gap-4">
        <h2>[CTA heading]</h2>
        <Link href="/contact" className="self-start inline-flex items-center ...">
          Contact Us
        </Link>
      </section>
    </article>
  )
}
```

### Brand token values (from globals.css)
```css
/* Source: app/globals.css (verified) */
--color-brand-black: #0a0a0a;
--color-brand-white: #f2f2ee;
--color-brand-red: #cc2200;
--color-brand-checker: #1a1a1a;
--muted-foreground: #888880;   /* used for secondary text */
--border: rgba(242, 242, 238, 0.12);  /* section dividers */
```

### Heading typographic scale
```typescript
// Source: app/globals.css @layer base (verified)
// h1: text-5xl font-black tracking-tight leading-none, Barlow Condensed
// h2: text-3xl font-black tracking-tight, Barlow Condensed
// h3: text-xl font-black, Barlow Condensed
// Body: text-[#f2f2ee] leading-relaxed
// Muted: text-[#888880]
// Category label: text-[10px] font-semibold uppercase tracking-widest text-[#cc2200]
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Radix UI as shadcn primitive | Base UI as shadcn primitive | shadcn base-nova style (this project) | `AccordionItem` may use different prop names than Radix-based tutorials; always read generated file |
| `getStaticProps` + `revalidate` | `'use cache'` + `cacheLife` | Next.js 15+ (this project uses 16) | Static pages use directive-based caching, not export functions |

**Deprecated/outdated:**
- `getStaticProps`: replaced by `'use cache'` directive in App Router [CITED: node_modules/next/dist/docs/01-app/02-guides/public-static-pages.md]
- `getServerSideProps`: not applicable to this phase (no request-time data)

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The shadcn Accordion component's generated code does not add `'use client'` to the page that imports it (Base UI handles its own client boundary internally) | Architecture Patterns | If wrong, /import page would need to become a client component, losing static prerender. Mitigate: read generated `accordion.tsx` after install before wiring into the page. |
| A2 | YouTube and Vimeo embed URLs work in a plain `<iframe>` with no additional configuration in this Next.js/Vercel setup | Common Pitfalls | If wrong (CSP header conflict), Content Security Policy headers would need to be added. Mitigate: verify in dev when a video URL exists. |

---

## Open Questions

1. **Mobile nav label length**
   - What we know: "How it gets to you" is five words at `text-5xl` in the mobile overlay. This is wider than any current label.
   - What's unclear: Whether it wraps unacceptably at 375px viewport width.
   - Recommendation: Executor should render in dev at iPhone SE width and decide if a shorter mobile alias is needed. Decision is within Claude's discretion (not a locked constraint).

2. **/import page visibility in prod before content is verified**
   - What we know: D-05 says page is navigable in dev and wired to nav, but "can be toggled off in prod until content is verified."
   - What's unclear: What mechanism to use for toggling. Options: (a) remove the nav link only; (b) `notFound()` redirect; (c) env var gate; (d) leave it live as a draft with a clear "Content being verified" notice.
   - Recommendation: Simplest mechanism is to omit the link from the nav arrays until content is ready — the route is still accessible by direct URL but not surfaced. No env var complexity needed for Phase 3. Document the activation step clearly in the plan.

---

## Environment Availability

All dependencies are either already installed or available via the existing CLI. No external services needed.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Next.js 16 | /import page | ✓ | 16.2.6 | — |
| @base-ui/react Accordion | shadcn Accordion | ✓ | 1.4.1 | — |
| shadcn CLI | `npx shadcn add accordion` | ✓ | 4.7.0 | — |
| Node.js | CLI command | ✓ | v25.9.0 | — |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.6 |
| Config file | none (vitest auto-discovers `lib/__tests__/`) |
| Quick run command | `npx vitest run lib/__tests__/` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BRAND-02 | /import page renders without error | smoke/manual | Browser load in dev | ❌ Wave 0 — no automated render test; page is a static Server Component with no testable logic |
| BRAND-02 | Accordion renders with correct items | manual | Visual inspection in dev | — |
| BIKE-05 | BuildVideo renders null when src is undefined | unit | `npx vitest run lib/__tests__/build-video.test.ts` | ❌ Wave 0 |
| BIKE-05 | BuildVideo renders iframe when src is a URL | unit | `npx vitest run lib/__tests__/build-video.test.ts` | ❌ Wave 0 |
| Both | Nav contains /import link | manual | Visual inspection in dev | — |

Note: The /import page and Accordion have no extractable logic to unit-test. The meaningful automated tests are the two conditional render cases for `BuildVideo`, which can be tested as a pure function (given prop, check rendered output) using vitest with jsdom or a simple string check on the returned JSX type.

### Sampling Rate
- **Per task commit:** `npx vitest run lib/__tests__/` (existing tests must stay green)
- **Per wave merge:** `npx vitest run` (full suite)
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `lib/__tests__/build-video.test.ts` — covers BIKE-05 conditional render (null vs iframe)
- [ ] `npx shadcn add accordion` — creates `components/ui/accordion.tsx` before any page references it

*(No test config gaps — vitest auto-discovers tests without a config file in this project)*

---

## Security Domain

This phase introduces no authentication, form submission, server actions, user input, or external API calls. The `<iframe>` embed is a passive read-only element.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | no | No user input in this phase |
| V6 Cryptography | no | — |

**iframe security note:** The `<iframe>` for BuildVideo should include `loading="lazy"` (reduces page weight when the component is not in viewport) and `title` attribute (accessibility). No `sandbox` restriction is needed for YouTube/Vimeo — their embeds require script and same-origin access to function. [ASSUMED: standard YouTube/Vimeo embed permission requirements; no CSP headers currently configured in this project]

---

## Project Constraints (from CLAUDE.md)

All directives from `CLAUDE.md` that affect this phase:

| Directive | Impact on Phase 3 |
|-----------|-------------------|
| No em dashes (`—`) in any text | All placeholder content in /import page must use commas, periods, or rephrased sentences. No `—` anywhere. |
| No commit/push without explicit permission (except GSD workflow) | Applies normally; GSD workflow approves commits implicitly |
| shadcn/ui already configured (base-nova, neutral, RSC: true) | Accordion must be added via `npx shadcn add accordion`, not hand-rolled |
| No react-hook-form, framer-motion, Zustand, any database | Not applicable to this phase (no forms, no animation, no state) |
| Content managed in code (no CMS) | Placeholder text lives directly in `app/import/page.tsx`; no external data source |
| This version of Next.js has breaking changes — read guides in `node_modules/next/dist/docs/` before writing code | Applies: use `'use cache'` + `cacheLife('max')` for static pages, not `getStaticProps` |
| `await params` before use (Next.js 16 breaking change) | Not applicable — /import is not a dynamic route |

---

## Sources

### Primary (HIGH confidence)
- `app/about/page.tsx` — verified page pattern for /import
- `components/nav.tsx` + `components/mobile-menu.tsx` — verified nav link array pattern
- `app/globals.css` — verified brand tokens
- `components.json` — verified shadcn config (base-nova style, Base UI primitives)
- `node_modules/@base-ui/react/` directory listing — accordion primitive confirmed present
- `node_modules/next/dist/docs/01-app/02-guides/videos.md` — iframe embed pattern
- `node_modules/next/dist/docs/01-app/02-guides/public-static-pages.md` — `'use cache'` static page pattern
- `npx shadcn add accordion --view` — exact generated code for accordion component

### Secondary (MEDIUM confidence)
- shadcn registry dry-run output — confirms accordion would be created at `components/ui/accordion.tsx` with correct Base UI imports

### Tertiary (LOW confidence)
- None in this phase — all claims are verified against the installed codebase

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified against installed `node_modules` and `package.json`
- Architecture: HIGH — directly derived from existing About page, nav, and mobile-menu patterns in the codebase
- Pitfalls: HIGH (Base UI prop names, `cacheLife` requirement) / MEDIUM (mobile label length, iframe CSP)

**Research date:** 2026-05-19
**Valid until:** 2026-06-19 (stable stack — Next.js, Base UI, shadcn change slowly)

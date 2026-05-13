---
phase: 1
slug: brand-listings-and-contact
created: 2026-05-13
status: draft
---

# Walking Skeleton, Lambre-Bull

> The thinnest possible end-to-end working slice. Proves the infrastructure, brand foundation, and data → render pipeline before any feature work.

## What the Skeleton Proves

After plan 01 ships, the following statements are TRUE:

1. The site is dark-only, uses the Lambre-Bull palette (`#0a0a0a` / `#f2f2ee` / `#cc2200`), and the Barlow Condensed display font is loaded.
2. The root layout renders a nav (Bikes / About / Contact), checkerboard stripes (8px) above and below the page body, and a minimal footer. No sidebar. No top-header search. No theme toggle.
3. `lib/bikes.ts` exports a typed `Bike` array and a `getBike(id)` helper. At least one placeholder bike entry exists.
4. The homepage (`/`) lists every bike from `lib/bikes.ts` as a card with name, tagline, and price anchor. If the array is empty, the empty state copy renders verbatim.
5. `npm run build` exits 0, the homepage shows as `○ (Static)` in the build output, and `cacheComponents: true` is active.
6. All job-search-autopilot routes, components, and lib files are removed. No import points at deleted code.
7. `resend` and `zod` are explicit dependencies in `package.json`.

## Architectural Decisions Locked by the Skeleton

| Decision | Value | Locked because |
|----------|-------|----------------|
| Framework | Next.js 16.2.3 App Router | Already installed; cannot swap |
| Caching primitive | `'use cache'` + `cacheComponents: true` | Next.js 16 replaces `export const dynamic` |
| Data layer | Static TypeScript array in `lib/bikes.ts` | No CMS, no DB (CLAUDE.md) |
| Email transport | Resend SDK (added in plan 04) | RESEARCH.md standard stack |
| Form pattern | `useActionState` + Server Action + Zod | RESEARCH.md; react-hook-form forbidden |
| Display font | Barlow Condensed Black (900) via `next/font/google` | UI-SPEC.md |
| Body font | Inter | UI-SPEC.md (already loaded) |
| Theming | None (dark-only); no `next-themes`, no `ThemeProvider` | UI-SPEC.md "No dark mode: dark-only" |
| Brand tokens | CSS variables in `app/globals.css` `@theme` + `:root` blocks | Tailwind v4 CSS-first |
| Border radius | `0.125rem` (2px), angular Mod aesthetic | UI-SPEC.md |
| Nav pattern | Top nav, sticky, 64px tall, full-screen mobile overlay | UI-SPEC.md |
| Image component | `next/image` with `sizes` prop always set | RESEARCH.md Pitfall 6 |
| Deployment | Vercel (Hobby) | CLAUDE.md recommended stack |

## Directory Layout After Skeleton

```
app/
├── layout.tsx              # NEW (replaces existing)
├── globals.css             # token block replaced
├── page.tsx                # NEW (homepage with bike listing)

components/
├── nav.tsx                 # NEW
├── mobile-menu.tsx         # NEW (deferred to plan 02, skeleton uses desktop-only nav)
├── checkerboard-stripe.tsx # NEW
├── site-footer.tsx         # NEW

lib/
├── bikes.ts                # NEW
├── utils.ts                # KEPT (cn helper)

next.config.ts              # cacheComponents: true added
package.json                # resend + zod added; supabase/groq/etc removed in cleanup
```

## What the Skeleton Does NOT Prove (deferred to later plans)

| Out of skeleton | Lands in plan |
|-----------------|---------------|
| Bike detail page (`/bikes/[id]`), gallery, spec sheet | 02 |
| Mobile menu overlay (`'use client'`) | 02 |
| About page craftsman story | 03 |
| Contact form + Server Action + Resend email delivery | 04 |
| Per-bike inquiry CTA pre-fill round trip | 04 (and verifies plan 02's `href` contract) |

## Smoke Test for the Skeleton

After plan 01 completes, a developer can:

1. Run `npm run build` and get a zero-error build.
2. Run `npm run dev` and open `http://localhost:3000`.
3. See: black page, Barlow Condensed display "Lambre-Bull" or homepage hero text, nav with Bikes / About / Contact links, an 8px checkerboard stripe under the nav and above the footer, one bike card (or the empty state copy).
4. Open DevTools → Elements and confirm no `data-sidebar` attribute exists in the DOM and no `class="dark"` toggle exists on `<html>`.
5. Open `app/globals.css` and confirm no `--color-sidebar-*` tokens remain.

## What "Done" Looks Like

`npm run build` output (excerpt) shows:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    ...      ...
└ ○ /_not-found                          ...      ...
```

`○ (Static)` next to `/` is the decisive signal. `λ (Dynamic)` here would mean `'use cache'` isn't engaging, a skeleton failure.

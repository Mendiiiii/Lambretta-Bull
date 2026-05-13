# Project Research Summary

**Project:** Lambre-Bull
**Domain:** Niche high-ticket vintage scooter showcase + made-to-order configurator, Australian market
**Researched:** 2026-05-13
**Confidence:** MEDIUM-HIGH (stack HIGH from installed packages + Next.js docs; market data MEDIUM from training knowledge, web search unavailable)

## Executive Summary

Lambre-Bull is a small brand site for a sole importer selling handbuilt Lambretta scooters from Spain to the Australian market. The product is 1-5 bikes at a time, each priced AUD 20,000-35,000+. The site has one job: convert a curious scooter enthusiast into a qualified inquiry. It does this through three content areas: high-quality per-bike showcases (photography + provenance + specs), a multi-step build configurator that ends in a direct inquiry submission, and transparent information about the import and registration process. No e-commerce, no CMS, no database. The entire architecture is a static-first Next.js 16 App Router site with one interactive island.

The recommended approach is to build data-first (TypeScript files for bikes and parts), then listings, then the brand shell, then the configurator, then the inquiry wiring. This sequence produces visible, testable output at every step. The stack already installed in the repo (Next.js 16.2.3, React 19.2.4, Tailwind CSS v4, shadcn/ui) covers 95% of the build. Only three packages need adding: `sharp` for image optimization, `resend` for email delivery, and optionally `@vercel/analytics`. Deploy to Vercel free tier. No other services required at launch.

The dominant risk is not technical, it is commercial credibility. A new brand with no Australian presence selling AU$20K+ vehicles must work significantly harder than a known dealer to earn inquiry intent. The three conversion killers to avoid from day one are: (1) no price anchor on listings, (2) no explanation of the import and registration pathway, and (3) a configurator that produces a summary but has no integrated path to submit it as an inquiry. These are not optional additions to phase later. They are launch requirements.

---

## Key Findings

### Recommended Stack

The repo already runs the right stack. No migrations or replacements are needed. The critical constraint is that this is Next.js 16 with React 19, which has breaking changes from earlier versions. Read `node_modules/next/dist/docs/` before writing any component.

**Core technologies:**

- **Next.js 16.2.3 (installed):** App Router, SSG, Server Actions. `'use cache'` on bike data pages for build-time prerendering. Server Actions handle form submission. No separate API layer needed.
- **React 19.2.4 (installed):** `useActionState` and `useFormStatus` handle form pending state and validation natively. No react-hook-form.
- **Tailwind CSS v4 (installed):** CSS-first config via `@theme` in globals.css. Brand tokens (black/white/Union Jack red) added there directly. No tailwind.config.js.
- **shadcn/ui 4.2.0 (installed):** Buttons, inputs, select, dialog, toast. Fully customizable. Use for all UI primitives.
- **Zod 4.3.6 (installed):** Server-side validation of contact form and configurator inquiry inside Server Actions.
- **sharp (to install):** Required by `next/image` for build-time image optimization. `npm install sharp`.
- **Resend (to install):** Transactional email, free tier 3,000/month, clean Server Action integration. `npm install resend`.

Do not install: react-hook-form, framer-motion, Zustand, any CMS, any database, any image CDN. The scope does not warrant them and several actively fight the architecture.

### Expected Features

**Must have (table stakes):**
- Per-bike gallery with 8-12 photos minimum (multiple angles, close-up detail shots) and full spec sheet
- Inquiry/contact mechanism per bike and standalone, with response time commitment stated
- Mobile-responsive layout (majority of discovery traffic is mobile via Instagram and Facebook)
- Price anchor per listing, minimum "from AU$XX,XXX" — "POA" without any anchor kills inquiry rates
- About / craftsman story page with photos of Bulbena, the workshop, and the build process
- Brand design applied consistently: the Mod/2Tone aesthetic is the product differentiator, not decoration

**Should have (differentiators):**
- Build configurator: chassis selection, parts by category, summary, and direct inquiry submission with full configuration attached
- Import and registration transparency page ("How it gets to you in Sydney") — no AU competitor does this
- Certificate of authenticity or build sheet per bike (frame number, engine number, parts list, builder)
- Waitlist email capture ("notify me when new stock arrives")
- Cultural signals: references to Lambretta Club AU, Mod/2Tone subculture, the Malaga-to-Sydney story

**Defer to Phase 2+:**
- Craftsman video embed (when content exists)
- Sold/archive listing state
- Full shipping cost calculator

**Defer indefinitely:**
- Online payment or checkout
- Visual/3D configurator
- CMS or admin panel
- Filtering, search, or pagination

### Architecture Approach

The site is statically renderable with one interactive island. Server Components everywhere except the configurator subtree. Product data lives in TypeScript files (`lib/data/bikes.ts`, `lib/data/parts.ts`) — no database, no fetch at runtime.

**Major components:**

1. `lib/data/bikes.ts` + `lib/data/parts.ts` — Single source of truth for all product content
2. `app/bikes/[id]/page.tsx` — Per-bike gallery, spec sheet, CTA linking to configurator pre-seeded with that chassis
3. `app/configurator/page.tsx` (Server shell) + `configurator-shell.tsx` (Client) — Multi-step flow: chassis → parts → summary + inquiry submission
4. `lib/actions/inquiry.ts` (Server Action) — Zod validation, Resend email dispatch, full configuration summary in the email body
5. `app/about/page.tsx` — Craftsman story, workshop photos, trust infrastructure

### Critical Pitfalls

1. **No price anchor** — "Contact for pricing" with zero signal reads as evasive. Publish "from AU$XX,XXX" per listing before launch.
2. **Credibility vacuum** — New brand, no AU presence, high ticket price. Needs: manufacturer identity, build process photos, seller name, one completed-sale reference. Cannot be retrofitted.
3. **No import/registration explanation** — Publish a "How it gets to you" page covering the pre-1989 ADR exemption, 5% duty + 10% GST, Blue Slip, and historic rego. Mark regulatory details as requiring live verification.
4. **Configurator dead end** — Step 3 must submit the configuration directly as a structured inquiry. A separate generic contact form discards the highest-intent buyers.
5. **Single listing, no framing** — Launching with one bike and no narrative reads as an unfinished test site. Write "single piece, built by design" framing before the first public URL is shared.

---

## Implications for Roadmap

### Phase 1: Foundation — Data, Listings, and Brand
Delivers: data model, bike listing pages (gallery + specs), About/craftsman page, brand design system, standalone contact form. Every other component depends on this. Addresses credibility vacuum and price anchor before any public URL is shared.

### Phase 2: Configurator and Inquiry Integration
Delivers: multi-step configurator (chassis, parts, summary), configurator-to-inquiry Server Action, pre-seeded URL from bike detail pages. Depends on Phase 1 data model and listing pages existing.

### Phase 3: Trust and Conversion Infrastructure
Delivers: "How it gets to you" import/registration page, Vercel Analytics, JSON-LD Product schema, Google Search Console, waitlist email capture. Regulatory content requires live verification before publishing.

### Phase 4: Post-Launch Content Expansion
Delivers: sold listing state, craftsman video embed, certificate/build sheet per bike, "coming soon" next build teaser. Blocked on content production — cannot build before content exists.

---

## Open Questions (Require Live Verification Before Publishing)

| Question | Urgency | Where to verify |
|----------|---------|-----------------|
| SEVS vs. RAW vs. pre-1989 ADR exemption for a modern-built Lambretta on a 1960s chassis | Before Phase 3 ships | DITRDCA (infrastructure.gov.au), licensed AU customs broker, compliance workshop |
| Current AU Lambretta asking prices (Gumtree, bikesales.com.au, Facebook) | Before Phase 1 ships | Live search |
| Current HS 8711 motorcycle import duty rate | Before Phase 3 ships | abf.gov.au |
| NSW historic vehicle rego fees | Before Phase 3 ships | service.nsw.gov.au |
| Asbestos documentation for Bulbena-sourced parts | Before Phase 3 ships | Written confirmation from Bulbena |
| Active AU Lambretta V-Special distributor presence in 2026 | Before Phase 1 ships | Live search |
| Resend free tier current limits | Before Phase 2 ships | resend.com |
| lambretta.org.au status and partnership potential | Before Phase 3 ships | Live check |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against installed packages and bundled Next.js 16 docs |
| Features | MEDIUM | Feature taxonomy HIGH; AU pricing and competitor landscape MEDIUM (training data only) |
| Architecture | HIGH | Verified against bundled Next.js 16 App Router docs |
| Pitfalls (technical/UX) | HIGH | Standard web product and CRO patterns |
| Pitfalls (regulatory) | MEDIUM | Broad AU import framework stable; SEVS/RAW pathway for this specific build type needs validation |

---
*Research completed: 2026-05-13*
*Ready for roadmap: yes*

# Technology Stack

**Project:** Lambre-Bull
**Researched:** 2026-05-13
**Confidence:** HIGH (verified against installed packages and Next.js 16 docs)

---

## Context

The repo already runs Next.js 16.2.3 with React 19.2.4, Tailwind CSS v4, and shadcn/ui configured. This stack recommendation works within that baseline rather than replacing it. The product is a small, content-light showcase (1-5 listings) plus a multi-step configurator and contact form. No backend beyond email delivery in v1.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Next.js | 16.2.3 (installed) | App Router, SSG, Server Actions | Already installed. App Router gives static prerendering by default for product pages, Server Actions handle the contact form and configurator inquiry without a separate API route. Use `'use cache'` on bike listing data so pages are prerendered at build time. |
| React | 19.2.4 (installed) | UI runtime | Installed. `useActionState` and `useFormStatus` (React 19 stable) handle form state without a form library for a contact form this simple. |
| TypeScript | ^5 (installed) | Type safety | Installed. Use strict mode. Bike configuration data typed as discriminated unions. |

### Styling

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Tailwind CSS | ^4 (installed) | Utility-first CSS | Installed. v4 uses CSS-first config via `@theme` in globals.css, which already exists. No tailwind.config.js needed. |
| tw-animate-css | 1.4.0 (installed) | Animation utilities | Installed. v4-compatible drop-in for `tailwindcss-animate`. Covers entrance/exit transitions for configurator steps. |
| CSS custom properties | native | Brand tokens | Define the 60s Mod color palette (black, white, a single accent like Union Jack red) as `@theme` CSS variables in globals.css. No third-party token library needed. |

### UI Components

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| shadcn/ui | 4.2.0 (installed) | Headless-style component primitives | Already configured with base-nova style and neutral base color. Use for: buttons, form inputs, select, dialog/modal for configurator steps, toast/notification after form submission. shadcn/ui components are copied into the repo and fully customizable. |
| Base UI | ^1.4.0 (installed) | Unstyled accessible primitives | Already installed (shadcn/ui depends on it in this setup). Use directly only if you need primitives shadcn does not expose. |
| Lucide React | ^1.8.0 (installed) | Icons | Installed. Use sparingly. The brand is typographic, not icon-heavy. Reserve for functional cues (close, chevron, check). |

### Forms

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| React `useActionState` | built-in (React 19) | Form state + Server Action wiring | The contact form is simple: name, email, subject, message. `useActionState` handles pending state, validation errors, and success feedback natively in Next.js 16 + React 19. No external form library needed for this scope. |
| Zod | 4.3.6 (installed) | Server-side validation | Installed. Validate the contact form payload and configurator inquiry inside Server Actions. Schema lives in `lib/validations.ts`. |
| HTML5 attributes | native | Client-side baseline | `required`, `type="email"`, `maxLength` for instant feedback before submission. Progressive enhancement pattern recommended in the Next.js forms guide. |

**Do not install react-hook-form.** It adds ~25 kB, requires a client boundary, and creates friction with Server Actions. The forms in this project do not warrant it.

### Animations

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| CSS animations via tw-animate-css | installed | Entrance and exit transitions | Sufficient for fade-in/slide-up on page load, configurator step transitions. Zero JS cost. |
| `next/dynamic` + CSS | built-in | Deferred loading of heavier UI | If you add any heavier interactive element (lightbox, carousel), wrap it in `next/dynamic({ ssr: false })` to keep the initial bundle light. |

**Do not install framer-motion for v1.** It adds significant bundle weight and introduces a mandatory Client Component boundary on everything it touches. The brand does not call for complex choreography. tw-animate-css keyframes with Tailwind utility classes cover the transitions needed. If phase 2 adds a visual 3D configurator, reconsider.

### Image Handling

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| `next/image` | built-in | Optimized bike photos | Use for all product imagery. Provides WebP/AVIF conversion, responsive sizes, lazy loading, and blur placeholder with zero config. Set `sizes` prop per breakpoint. For the 1-5 bikes at launch, use static local imports so images are processed at build time with no runtime server cost. |
| `sharp` | install as dep | Image optimization dependency | Required by `next/image` when self-hosting (and on Vercel). Install explicitly: `npm install sharp`. |

**Do not use Cloudinary, Imgix, or any image CDN in v1.** The inventory is tiny. Local static images processed by `next/image` are simpler, faster to set up, and avoid an external account dependency. Revisit if inventory scales.

### Email Delivery (Contact Form + Configurator Inquiry)

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Resend | latest | Transactional email | Simple REST API, generous free tier (3,000 emails/month), official Next.js integration with Server Actions. Install: `npm install resend`. Call from the Server Action handling the contact/inquiry form. No SMTP config needed. |

**Alternatives considered and rejected:**
- Nodemailer + SMTP: more setup, requires managing credentials and a mail server.
- SendGrid: overkill for a small brand site, more complex onboarding.
- Formspree/Netlify Forms: hides the submission flow, harder to customise confirmation email.

### Deployment

| Platform | Plan | Rationale |
|----------|------|-----------|
| Vercel | Hobby (free) | Zero-config Next.js deployment. Handles Server Actions, image optimization (sharp), and streaming out of the box. CI/CD from main branch on every push. No Docker, no YAML. Custom domain via the dashboard. For a solo developer with no hard deadline, Vercel is the fastest path to production. |

**Do not deploy to Cloudflare Pages or Netlify for v1.** Both require additional adapter configuration to support Next.js Server Actions and the `'use cache'` directive. Vercel is the verified adapter path and eliminates this risk entirely.

### Analytics (optional, lightweight)

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Vercel Analytics | free tier | Page views, Web Vitals | One-line install, no cookie banner needed in most jurisdictions for privacy-preserving analytics. Add only when deployed. `npm install @vercel/analytics`. |

---

## What NOT to Use

| Category | Avoid | Reason |
|----------|-------|--------|
| Forms | react-hook-form | Unnecessary weight for simple forms. `useActionState` + Zod is native to this stack. |
| Animation | framer-motion | 40 kB+ bundle cost, forces client boundaries. CSS animations cover v1 scope. |
| Animation | GSAP | Same weight concern. Fine arts showcase quality is achievable with CSS. |
| Image CDN | Cloudinary, Imgix | Not needed for 1-5 bikes managed in code. Adds an external account dependency. |
| State management | Zustand, Redux, Jotai | The configurator state is local form state. `useState` in a Client Component is sufficient. |
| CMS | Sanity, Contentful, Prismic | Explicitly out of scope. Developer manages content in code. No headless CMS needed. |
| Database | Supabase, Prisma, Drizzle | No persistence in v1. Everything is static content. |
| CSS-in-JS | styled-components, emotion | Not compatible with React Server Components without wrapper overhead. Tailwind covers all styling needs. |
| UI kit | Chakra UI, MUI, Ant Design | Heavy bundle, opinionated theming that fights a custom brand identity. shadcn/ui is already installed and compose-friendly. |
| Deployment | Netlify, Cloudflare Pages | Require adapter setup for Server Actions + `'use cache'`. Additional friction with no benefit for this scale. |

---

## Installation

Everything below is what needs to be added to the existing setup. The rest is already installed.

```bash
# Image optimization (required by next/image on self-hosted or Vercel)
npm install sharp

# Email delivery
npm install resend

# Analytics (add after first deployment)
npm install @vercel/analytics
```

Vercel CLI for local deployment preview:
```bash
npm install -g vercel
vercel link
```

---

## Configuration Notes

### Tailwind v4 custom brand tokens
Add to `app/globals.css` inside the existing `@theme inline` block:

```css
/* Lambre-Bull brand palette */
--color-brand-black: #0a0a0a;
--color-brand-white: #f5f5f0;
--color-brand-red: #cc2200;       /* Union Jack red accent */
--color-brand-checker: #1a1a1a;   /* checkerboard dark square */
```

No `tailwind.config.js` is needed. v4 reads all tokens from CSS.

### Next.js Image remote patterns (if photos hosted externally later)
In `next.config.ts`, add `images.remotePatterns` if linking to an external bucket. Not needed while images are local.

### Server Action for email
Create `app/actions/send-inquiry.ts` with `'use server'` directive. Call `resend.emails.send()` inside. Wire to the contact form and configurator summary page via `useActionState`.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Core framework (Next.js 16 / React 19) | HIGH | Verified against installed packages and bundled docs |
| Tailwind v4 + shadcn/ui | HIGH | Verified against installed packages and globals.css |
| Forms pattern (useActionState + Zod) | HIGH | Documented in Next.js 16 forms guide (node_modules/next/dist/docs) |
| Image handling (next/image) | HIGH | Documented in Next.js 16 Image component reference |
| Email (Resend) | MEDIUM | Not independently verifiable without web access; widely used in Next.js community and aligned with Server Action pattern. Verify current pricing/free tier before use. |
| Animation (CSS only, no framer-motion) | HIGH | Based on installed tw-animate-css and bundle-size reasoning |
| Deployment (Vercel) | HIGH | Vercel is the verified adapter for Next.js 16 per deployment docs |

---

## Sources

- Next.js 16.2.3 forms guide: `node_modules/next/dist/docs/01-app/02-guides/forms.md`
- Next.js 16.2.3 image component: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`
- Next.js 16.2.3 deployment guide: `node_modules/next/dist/docs/01-app/02-guides/deploying-to-platforms.md`
- Next.js 16.2.3 public pages / caching: `node_modules/next/dist/docs/01-app/02-guides/public-static-pages.md`
- Next.js 16.2.3 CSS-in-JS guide: `node_modules/next/dist/docs/01-app/02-guides/css-in-js.md`
- Installed package versions: `package.json` and `node_modules/*/package.json`
- shadcn/ui config: `components.json`
- Tailwind v4 config: `app/globals.css`

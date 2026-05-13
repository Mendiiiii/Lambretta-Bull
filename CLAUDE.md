@AGENTS.md

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Lambre-Bull**

Lambre-Bull is a showcase and custom configurator website for selling handcrafted Lambrettas manufactured by Bulbena in Spain and sold to the Australian market. Buyers can browse available bikes, build their own custom Lambretta by selecting chassis and parts, and contact the seller to move forward. The brand identity is rooted in 60s Mod culture, 2 Tone ska, and British subculture — Fred Perry, The Who, Studio One, checkerboard black and white.

**Core Value:** A buyer in Australia can discover a Lambre-Bull scooter, configure it to their taste, and get in touch with the person who will have it built for them.

### Constraints

- **Geography:** Manufacturing in Spain, shipping from Malaga, primary market is Australia
- **Inventory size:** Very small (1-5 bikes) — no need for filtering, search, or pagination at launch
- **Tech stack:** Existing repo is Next.js — likely to continue with that
- **Timeline:** No hard deadline
- **Content:** Developer-managed, no third-party CMS
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Context
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
### Animations
| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| CSS animations via tw-animate-css | installed | Entrance and exit transitions | Sufficient for fade-in/slide-up on page load, configurator step transitions. Zero JS cost. |
| `next/dynamic` + CSS | built-in | Deferred loading of heavier UI | If you add any heavier interactive element (lightbox, carousel), wrap it in `next/dynamic({ ssr: false })` to keep the initial bundle light. |
### Image Handling
| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| `next/image` | built-in | Optimized bike photos | Use for all product imagery. Provides WebP/AVIF conversion, responsive sizes, lazy loading, and blur placeholder with zero config. Set `sizes` prop per breakpoint. For the 1-5 bikes at launch, use static local imports so images are processed at build time with no runtime server cost. |
| `sharp` | install as dep | Image optimization dependency | Required by `next/image` when self-hosting (and on Vercel). Install explicitly: `npm install sharp`. |
### Email Delivery (Contact Form + Configurator Inquiry)
| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Resend | latest | Transactional email | Simple REST API, generous free tier (3,000 emails/month), official Next.js integration with Server Actions. Install: `npm install resend`. Call from the Server Action handling the contact/inquiry form. No SMTP config needed. |
- Nodemailer + SMTP: more setup, requires managing credentials and a mail server.
- SendGrid: overkill for a small brand site, more complex onboarding.
- Formspree/Netlify Forms: hides the submission flow, harder to customise confirmation email.
### Deployment
| Platform | Plan | Rationale |
|----------|------|-----------|
| Vercel | Hobby (free) | Zero-config Next.js deployment. Handles Server Actions, image optimization (sharp), and streaming out of the box. CI/CD from main branch on every push. No Docker, no YAML. Custom domain via the dashboard. For a solo developer with no hard deadline, Vercel is the fastest path to production. |
### Analytics (optional, lightweight)
| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Vercel Analytics | free tier | Page views, Web Vitals | One-line install, no cookie banner needed in most jurisdictions for privacy-preserving analytics. Add only when deployed. `npm install @vercel/analytics`. |
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
## Installation
# Image optimization (required by next/image on self-hosted or Vercel)
# Email delivery
# Analytics (add after first deployment)
## Configuration Notes
### Tailwind v4 custom brand tokens
### Next.js Image remote patterns (if photos hosted externally later)
### Server Action for email
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
## Sources
- Next.js 16.2.3 forms guide: `node_modules/next/dist/docs/01-app/02-guides/forms.md`
- Next.js 16.2.3 image component: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`
- Next.js 16.2.3 deployment guide: `node_modules/next/dist/docs/01-app/02-guides/deploying-to-platforms.md`
- Next.js 16.2.3 public pages / caching: `node_modules/next/dist/docs/01-app/02-guides/public-static-pages.md`
- Next.js 16.2.3 CSS-in-JS guide: `node_modules/next/dist/docs/01-app/02-guides/css-in-js.md`
- Installed package versions: `package.json` and `node_modules/*/package.json`
- shadcn/ui config: `components.json`
- Tailwind v4 config: `app/globals.css`
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

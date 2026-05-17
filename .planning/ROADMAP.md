# Roadmap: Lambre-Bull

## Overview

Lambre-Bull ships in three focused phases. Phase 1 builds the credible brand presence that earns inquiry intent: bike listings with photos, specs, price anchors, per-bike CTAs, the craftsman story, and the visual identity that makes the product feel real. Phase 2 delivers the configurator, the highest-intent conversion path, wired end-to-end so a configured build submits as a structured email with nothing lost. Phase 3 publishes the regulatory and content material that is gated on external verification: the import/registration explainer and build process video. Nothing ships before it is ready to earn a AU$20K+ inquiry.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Brand, Listings, and Contact** - A visitor can discover and evaluate a specific bike, understand the brand, and send an inquiry
- [ ] **Phase 2: Configurator and Inquiry Integration** - A buyer can build a custom Lambretta and submit the full specification as a structured inquiry
- [ ] **Phase 3: Gated Content and Trust Infrastructure** - Regulatory transparency and build process video publish once external verification is complete

## Phase Details

### Phase 1: Brand, Listings, and Contact
**Goal**: A visitor can discover a real Lambretta for sale, evaluate it fully, and contact the seller, before any public URL is shared
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: BIKE-01, BIKE-02, BIKE-03, BIKE-04, BRAND-01, BRAND-03, BRAND-04
**Success Criteria** (what must be TRUE):
  1. User can view a per-bike gallery of 8-12 photos (multiple angles, close-up details) on a bike listing page
  2. User can read the full spec sheet for a bike (chassis year/model, engine type, parts sourcing, disc type, handmade components)
  3. User can see a price anchor ("from AU$XX,XXX") on each bike listing, no "contact for pricing" anywhere
  4. User can click a per-bike inquiry CTA and reach a contact form pre-loaded with that bike as subject
  5. User can read the craftsman story (Bulbena, the workshop, the build process, the Malaga-to-Sydney journey) and submit a standalone contact form
  6. Site presents a consistent Mod/2 Tone brand design throughout (checkerboard black and white, Fred Perry/The Who/Studio One aesthetic applied to all pages)
**Plans:** 1/4 plans executed
Plans:

**Wave 1**
- [x] 01-01-PLAN.md, Walking Skeleton: cleanup, deps, brand tokens, layout, nav, footer, bike data, homepage listing

**Wave 2** *(blocked on Wave 1 completion)*
- [x] 01-02-PLAN.md, Bike detail page: gallery, spec sheet, price anchor, per-bike inquiry CTA, mobile menu, shadcn Textarea
- [x] 01-03-PLAN.md, About page: craftsman story (Bulbena, workshop, build, Malaga to Sydney journey), standalone CTA

**Wave 3** *(blocked on Wave 2 completion)*
- [x] 01-04-PLAN.md, Contact form: Zod schema, Server Action, Resend integration, contact page wired to per-bike pre-fill

**Cross-cutting constraints:**
- All pages: black background (#0a0a0a), no em dashes, Barlow Condensed headings, price anchor never "POA"
- All async pages: await params and searchParams before use (Next.js 16 breaking change)
**UI hint**: yes

### Phase 2: Configurator and Inquiry Integration
**Goal**: A buyer can specify a custom Lambretta build and submit the complete configuration as a structured inquiry, with no step dead-ending
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: CONF-01, CONF-02, CONF-03, CONF-04
**Success Criteria** (what must be TRUE):
  1. User can select a chassis (year + model) as the starting point of a custom build
  2. User can choose parts by category (engine, discs, sourcing, handmade vs. England-sourced) across all available categories
  3. User can review their complete configuration summary before submitting
  4. User can submit the full build specification as a structured inquiry and receive confirmation that it was sent, the email received by the seller includes the complete configuration with no data lost
**Plans:** 3 plans

**Wave 1** *(parallel — no file conflicts)*
- [x] 02-01-PLAN.md, Data foundation: lib/configurator.ts (types + placeholder options), configSchema in lib/validations.ts, Custom build nav link
- [x] 02-02-PLAN.md, Server Action: app/actions/configure.ts (submitInquiry with .bind() signature, Zod validation, Resend plain-text email)

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] 02-03-PLAN.md, Wizard UI: components/configurator-wizard.tsx (5-step wizard, ARIA cards, free nav, success state), app/configure/page.tsx — includes human verification checkpoint

### Phase 3: Gated Content and Trust Infrastructure
**Goal**: Regulatory transparency and build process video publish once the external verification they depend on is complete
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: BRAND-02, BIKE-05
**Success Criteria** (what must be TRUE):
  1. User can read a "How it gets to you" page covering the pre-1989 ADR exemption, import duty, Blue Slip, and historic rego pathway *(BRAND-02: regulatory content verified against DITRDCA, ABF, and Service NSW before publishing)*
  2. User can watch a build process video on the relevant bike listing page *(BIKE-05: content-gated, requires video to exist and be ready before this ships)*

**Flags:**
- BRAND-02: Import/registration regulatory content requires live verification against infrastructure.gov.au, abf.gov.au, service.nsw.gov.au, and written asbestos documentation from Bulbena. Do not publish until verified.
- BIKE-05: Content-gated. Cannot ship until build process video exists and is ready to embed. Phase 3 may be split or reordered depending on which content is available first.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Brand, Listings, and Contact | 1/4 | In Progress|  |
| 2. Configurator and Inquiry Integration | 0/3 | Not started | - |
| 3. Gated Content and Trust Infrastructure | 0/TBD | Not started | - |

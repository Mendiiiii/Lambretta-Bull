# Lambre-Bull — v1 Requirements

## v1 Requirements

### Bike Listings

- [ ] **BIKE-01**: User can view a gallery of 8-12 photos per bike (multiple angles, close-up details)
- [ ] **BIKE-02**: User can view a full spec sheet per bike (chassis year/model, engine type, parts sourcing, disc type, handmade components)
- [x] **BIKE-03**: User can see a price anchor ("from AU$XX,XXX") on each listing
- [ ] **BIKE-04**: User can click a per-bike inquiry CTA to contact the seller about that specific bike
- [ ] **BIKE-05**: User can watch a build process video per bike *(content-gated — requires video to exist before this ships)*

### Configurator

- [ ] **CONF-01**: User can select a chassis (year + model) as the starting point of their custom build
- [ ] **CONF-02**: User can choose parts by category (engine, discs, sourcing — handmade vs. England parts, etc.)
- [ ] **CONF-03**: User can review their full configuration summary before submitting
- [ ] **CONF-04**: User can submit their complete build specification directly as a structured inquiry (full config included in the email — no data lost)

### Trust & Brand

- [ ] **BRAND-01**: User can read the craftsman story (About page: Bulbena, the workshop, the build process, the Malaga-to-Sydney journey)
- [ ] **BRAND-02**: User can read how import and registration works in Australia ("How it gets to you" page: pre-1989 ADR exemption, duty, Blue Slip, historic rego) *(regulatory content requires live verification before publishing)*
- [ ] **BRAND-03**: User can submit a standalone contact form (email, subject, CTA)
- [x] **BRAND-04**: Site presents a consistent Mod/2 Tone brand design throughout (Fred Perry, The Who, Studio One, checkerboard black and white)

---

## v2 Requirements

*(Table stakes deferred — users expect these eventually)*

- Waitlist email capture ("notify me when new stock arrives")
- Sold/archive listing state (currently available bikes only at launch)
- Certificate of authenticity / build sheet per bike (frame number, engine number, full parts list)
- Craftsman video embed on About page (when video content exists)

---

## Out of Scope

- Online payment / checkout — starting as showcase; foundation left for future growth
- Visual or 3D bike configurator — validate demand first with the simple text version
- Admin panel / CMS — developer manages content directly in code
- Filtering, search, or pagination — 1-5 bikes have nothing to filter
- Australian phone contact — number exists but not currently active
- react-hook-form, framer-motion, Zustand, any database, any image CDN — stack does not warrant them

---

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| BIKE-01 | Phase 1 | Pending |
| BIKE-02 | Phase 1 | Pending |
| BIKE-03 | Phase 1 | Complete |
| BIKE-04 | Phase 1 | Pending |
| BIKE-05 | Phase 3 | Pending |
| CONF-01 | Phase 2 | Pending |
| CONF-02 | Phase 2 | Pending |
| CONF-03 | Phase 2 | Pending |
| CONF-04 | Phase 2 | Pending |
| BRAND-01 | Phase 1 | Pending |
| BRAND-02 | Phase 3 | Pending |
| BRAND-03 | Phase 1 | Pending |
| BRAND-04 | Phase 1 | Complete |

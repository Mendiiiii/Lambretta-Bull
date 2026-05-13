# Lambre-Bull

## What This Is

Lambre-Bull is a showcase and custom configurator website for selling handcrafted Lambrettas manufactured by Bulbena in Spain and sold to the Australian market. Buyers can browse available bikes, build their own custom Lambretta by selecting chassis and parts, and contact the seller to move forward. The brand identity is rooted in 60s Mod culture, 2 Tone ska, and British subculture — Fred Perry, The Who, Studio One, checkerboard black and white.

## Core Value

A buyer in Australia can discover a Lambre-Bull scooter, configure it to their taste, and get in touch with the person who will have it built for them.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Showcase of available Lambrettas with chassis info (year, model), parts detail, and photos
- [ ] Simple "build your own" configurator: select chassis → choose parts by category (engine, discs, sourcing, etc.) → review configuration summary → send inquiry
- [ ] Contact form with email, subject, and a clear CTA
- [ ] Brand design rooted in 60s Mod + 2 Tone aesthetic (The Who, Studio One, Fred Perry, black and white)

### Out of Scope

- Full e-commerce / online payment — start as showcase, foundation left for future growth
- Admin panel / CMS — developer manages content directly in code
- Visual or 3D configurator — simple structured selection first, build toward visual later
- Australian phone contact — not currently active

## Context

- **Manufacturer:** Bulbena, based in Madrid/Malaga (Spain). Bikes are handbuilt with handmade parts, handmade engines, curated discs, and sourced parts from England. Each bike is a unique piece.
- **Seller:** The user, currently based in Madrid, selling to the Australian market.
- **Logistics:** Transport from Malaga to Australia already in motion.
- **Inventory:** Small and curated — 1 to 5 bikes available at a time. Each listing is distinct.
- **Content management:** The developer (user) updates listings directly. No CMS or admin panel needed.
- **Contact:** Email-based for now. Australian phone number exists but is not currently active.
- **Market research needed:** Australian government regulations on classic vehicle imports and registration, cost in Spain vs. selling price in Australia, competitor landscape in AU (who sells Lambrettas, new or old, and at what price in Sydney).

## Constraints

- **Geography:** Manufacturing in Spain, shipping from Malaga, primary market is Australia
- **Inventory size:** Very small (1-5 bikes) — no need for filtering, search, or pagination at launch
- **Tech stack:** Existing repo is Next.js — likely to continue with that
- **Timeline:** No hard deadline
- **Content:** Developer-managed, no third-party CMS

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Showcase + configurator, not e-commerce | Start simple, leave room to grow | — Pending |
| Simple text-based configurator (not visual/3D) | Visual configurator is significant effort — validate demand first | — Pending |
| No admin panel | User is the developer, manages content directly | — Pending |
| Brand rooted in 60s Mod / 2 Tone / skinhead subculture | Distinctive identity — Fred Perry, The Who, Studio One, checkerboard B&W | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-13 after initialization*

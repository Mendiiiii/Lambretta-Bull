---
phase: 01-brand-listings-and-contact
plan: 02
subsystem: bike-detail-vertical-slice
tags:
  - nextjs-16
  - app-router
  - dynamic-route
  - next-image
  - shadcn
  - mobile-nav
dependency_graph:
  requires:
    - 01-brand-listings-and-contact/01
  provides:
    - Bike detail page at /bikes/[id] (prerendered, generateStaticParams)
    - BikeGallery client component with thumbnail-swap interaction
    - SpecSheet server component rendering BikeSpec
    - PriceAnchor server component with AU dollar formatting or Price TBA fallback
    - MobileMenu client component (full-screen overlay)
    - Inquiry CTA linking to /contact?subject=Inquiry%3A%20[bike-name]
    - public/bikes/placeholder/hero.jpg for next/image compatibility
    - components/ui/textarea.tsx confirmed present for plan 04
  affects:
    - 01-brand-listings-and-contact/04 (contact page receives inquiry href contract)
tech_stack:
  added: []
  patterns:
    - BikeGallery with useState active index (Client Component)
    - next/image with fill and sizes prop for gallery primary and thumbnails
    - generateStaticParams + use cache + cacheLife(max) for static prerender
    - params as Promise and await params (Next.js 16 breaking change)
    - notFound() from next/navigation for unknown ids
    - encodeURIComponent for inquiry href construction
    - Full-screen fixed overlay mobile menu (Client Component)
key_files:
  created:
    - components/bike-gallery.tsx
    - components/spec-sheet.tsx
    - components/price-anchor.tsx
    - components/mobile-menu.tsx
    - app/bikes/[id]/page.tsx
    - public/bikes/placeholder/hero.jpg
    - public/bikes/placeholder/.gitkeep
  modified:
    - components/nav.tsx
decisions:
  - "use cache + generateStaticParams produces Partial Prerender in Next.js 16 -- this is the correct static prerender designation, not a sign of dynamic rendering"
  - "Inquiry href: /contact?subject=Inquiry%3A%20[name] via encodeURIComponent -- plan 04 reads via async searchParams"
  - "Placeholder hero.jpg via Python fallback (ImageMagick not available)"
  - "textarea.tsx already present from plan 01"
metrics:
  duration: "18 minutes"
  completed: "2026-05-14"
  tasks_completed: 3
  tasks_total: 3
  files_created: 7
  files_modified: 1
---

# Phase 01 Plan 02: Bike Detail Vertical Slice Summary

Bike detail page with gallery, spec sheet, price anchor, inquiry CTA, and mobile menu overlay. The conversion-critical page where an Australian buyer evaluates a real bike and clicks to inquire.

## What Was Built

**Task 1: Gallery, spec sheet, price anchor, placeholder image** (commit 1a23829)

- components/price-anchor.tsx (Server Component): "from AU$XX,XXX" via toLocaleString('en-AU') in #cc2200, or "Price TBA" when priceAUD <= 0
- components/spec-sheet.tsx (Server Component): chassis year+model, engine, discs, partsSourcing (human-readable label), handmadeComponents comma-joined or "None"
- components/bike-gallery.tsx (Client Component): useState active index, next/image fill + priority + sizes prop, ring-2 ring-[#cc2200] active thumbnail, no thumbnails when photos.length < 2
- public/bikes/placeholder/hero.jpg: minimal valid JPEG (331 bytes, Python fallback)

**Task 2: Bike detail dynamic route** (commit 21cb988)

- app/bikes/[id]/page.tsx: async Server Component, params as Promise, await params, generateStaticParams, 'use cache' + cacheLife('max'), notFound() for unknown ids
- Two-column layout: BikeGallery left, spec + price + CTA right, stacks on mobile
- Inquiry CTA: encodeURIComponent produces /contact?subject=Inquiry%3A%20[name]
- CTA copy: "Inquire About This Bike" (UI-SPEC.md Copywriting Contract)
- min-h-[44px] on CTA for 44px touch target

**Task 3: Mobile menu overlay and shadcn Textarea** (commit dc6445b)

- components/mobile-menu.tsx (Client Component): useState, Menu button md:hidden, full-screen overlay role="dialog" aria-modal="true", X close button, nav links Barlow Condensed Black 900
- components/nav.tsx: MobileMenu import + render, desktop links changed to hidden md:flex
- components/ui/textarea.tsx: confirmed present (from plan 01)

## Build Output

```
Route (app)                        Revalidate  Expire
┌ ○ /                                     30d      1y
├ ○ /_not-found
└ ◐ /bikes/[id]                           30d      1y
  ├ /bikes/[id]                           30d      1y
  └ /bikes/placeholder-1966-tv200         30d      1y

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

## Inquiry Href Contract (for plan 04)

Format: /contact?subject=Inquiry%3A%20[URL-encoded bike name]

Example for "1966 TV 200": /contact?subject=Inquiry%3A%201966%20TV%20200

Plan 04 reads this via async searchParams Promise and passes as defaultSubject to ContactForm. The colon is %3A, spaces are %20 (from encodeURIComponent).

## Deviations from Plan

**1. [Rule 0 - Context] Partial Prerender symbol, not Static**
- Next.js 16 with 'use cache' + generateStaticParams outputs partial prerender. Correct behavior -- page is prerendered at build, not per-request dynamic.

**2. [Rule 0 - Context] ImageMagick not available**
- Python 3 wrote 331-byte 1x1 JPEG. next/image accepts it without error.

**3. [Rule 0 - Context] Textarea already installed**
- shadcn skipped (file identical to plan 01 install). No action needed.

## Known Stubs

| File | Stub | Reason |
|------|------|--------|
| public/bikes/placeholder/hero.jpg | 1x1 black JPEG | Real photos added by developer before launch |

## Threat Flags

None. T-02-01 (notFound), T-02-03 (encodeURIComponent), T-02-06 (no dangerouslySetInnerHTML) all implemented.

## Self-Check: PASSED

All 7 created files and 1 modified file confirmed in worktree.
Commits 1a23829, 21cb988, dc6445b confirmed in git log.

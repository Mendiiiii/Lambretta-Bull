# Phase 3: Gated Content and Trust Infrastructure - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 3 publishes two externally-gated pieces of content once ready:

1. **BRAND-02** — `/import` page: orientative import and registration explainer for the Australian buyer (pre-1989 ADR exemption, duty, Blue Slip, historic rego). Builds trust for a AU$20K+ purchase. Content requires live verification against DITRDCA, ABF, and Service NSW before publishing.

2. **BIKE-05** — Optional build process video component: conditional embed (renders only when `videoUrl` is set in bike data). Brand storytelling — Alfonso working, the workshop, finished bikes. Zero footprint until the video exists.

Phase 3 delivers the infrastructure (routes, components, nav wiring) with placeholder/stub content so the site is structurally complete. Real content drops in when externally verified/available.

</domain>

<decisions>
## Implementation Decisions

### /import page (BRAND-02)

- **D-01:** Route is `/import` (`app/import/page.tsx`).
- **D-02:** Page structure: short editorial intro (the Malaga-to-Sydney journey framing) + numbered process steps (ADR exemption, import/customs, Blue Slip, historic registration) + FAQ section with accordion at the end.
- **D-03:** Tone is orientative and reassuring, not technical. Goal is "we handle this, here is what happens" — not a DIY guide for the buyer. No exact cost figures that could become outdated; focus on the process and that Bulbena has done it before.
- **D-04:** No interactive elements beyond the FAQ accordion. No forms, no CTAs other than the site-wide Contact link.
- **D-05:** Phase 3 builds the page with provisional placeholder text. The page is navigable in dev. It is wired into the nav but can be toggled off in prod until content is verified. Real regulatory text replaces placeholders before the page goes live.

### Build process video (BIKE-05)

- **D-06:** Implemented as an optional conditional component (`components/build-video.tsx`). Renders nothing if no `videoUrl` is provided. No dedicated route, no placeholder visible to end users.
- **D-07:** Default placement: About page (`app/about/page.tsx`). Can be moved to homepage or a dedicated route once the video exists and the user sees it in context.
- **D-08:** Video platform TBD (Alfonso has not created the video yet). Component accepts a generic `src` URL — platform-agnostic embed. YouTube and Vimeo are both compatible with this approach.
- **D-09:** To activate: add `videoUrl` to the About page data or wherever the component is placed. One-line activation.

### Navigation

- **D-10:** "How it gets to you" link added to the primary nav header (`components/nav.tsx` and `components/mobile-menu.tsx`), alongside About and Contact.
- **D-11:** Nav label: "How it gets to you" (matches brand voice, answers the buyer's implicit question).

### Claude's Discretion

- Exact accordion component choice: shadcn/ui Accordion is already available in the project — use it.
- Placeholder content depth for /import: write enough to validate structure (3-5 sentences per step, 3-5 FAQ entries), not production-quality text.
- Whether to use `generateStaticParams` or static render for /import: static page with no dynamic data, use `'use cache'` or default static render.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — BRAND-02 and BIKE-05 are the two requirements for this phase
- `.planning/ROADMAP.md` — Phase 3 goal, success criteria, and gating flags

### Existing code — patterns to follow
- `app/about/page.tsx` — Server Component page pattern to follow for /import
- `components/nav.tsx` — add "How it gets to you" link here (alongside existing About/Contact links)
- `components/mobile-menu.tsx` — add "How it gets to you" link here (mobile nav parity)
- `components/ui/accordion.tsx` — shadcn Accordion component, already installed, use for FAQ section
- `app/layout.tsx` — root layout (no changes expected, for reference only)

### Brand and style constraints
- `app/globals.css` — brand tokens: #0a0a0a background, Barlow Condensed headings, checkerboard accent
- `app/about/page.tsx` — editorial prose style reference for the intro section of /import

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ui/accordion.tsx` — shadcn Accordion, already installed. Use for the FAQ section of /import.
- `components/nav.tsx` / `components/mobile-menu.tsx` — nav already has About and Contact entries; "How it gets to you" follows the same pattern.
- `app/about/page.tsx` — editorial Server Component structure to replicate for /import intro section.

### Established Patterns
- Server Components by default — both /import page and build-video component are Server Components (no client state needed for /import; video component is a simple conditional render).
- No CMS — content lives directly in the component/page file. Placeholder text in Phase 3 gets replaced in-file when real content is ready.
- Brand constraints carried forward: black background (#0a0a0a), Barlow Condensed for headings, no em dashes, checkerboard/red accent palette.

### Integration Points
- `app/bikes/[id]/page.tsx` — If the video is later moved to bike listings, it connects here. Not in scope for Phase 3.
- Nav links: `components/nav.tsx` desktop links array + `components/mobile-menu.tsx` mobile links array — both need the new entry.

</code_context>

<specifics>
## Specific Ideas

- /import page is framed around the Malaga-to-Sydney journey — same narrative thread as About. Not a government document, a conversation with the buyer.
- FAQ accordion is the last section of /import — not a standalone page.
- The video component's conditional logic: `{videoUrl && <BuildVideo src={videoUrl} />}` — simplest possible gate.

</specifics>

<deferred>
## Deferred Ideas

- **Multilingual support (ES + EN):** User asked about difficulty of adding Spanish/English versions of the site. Estimated 6/10 difficulty with Next.js App Router i18n routing. Worth revisiting once site is validated and final text exists in both languages. Belongs in a future phase.

</deferred>

---

*Phase: 3-gated-content-and-trust-infrastructure*
*Context gathered: 2026-05-19*

---
phase: 03-gated-content-and-trust-infrastructure
reviewed: 2026-05-19T00:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - app/about/page.tsx
  - app/import/page.tsx
  - components/build-video.tsx
  - components/mobile-menu.tsx
  - components/nav.tsx
  - components/ui/accordion.tsx
  - lib/__tests__/build-video.test.ts
  - vitest.config.ts
findings:
  critical: 3
  warning: 2
  info: 1
  total: 6
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-05-19
**Depth:** standard
**Files Reviewed:** 8
**Status:** issues_found

## Summary

Eight files were reviewed: two static pages (`about`, `import`), three components (`BuildVideo`, `MobileMenu`, `Nav`), one shared UI primitive (`Accordion`), a unit test file, and the Vitest config. The pages and Nav are clean. Three blockers were found: an unmitigated iframe origin in `BuildVideo`, a broken accordion animation caused by a CSS variable mismatch between Base UI and `tw-animate-css`, and a vitest configuration that prevents the tests from running at all. Two warnings cover a missing focus trap in the mobile menu overlay and a type-coercion edge case in `BuildVideo`. One info item covers duplicated nav link data.

---

## Critical Issues

### CR-01: iframe lacks sandbox attribute - untrusted third-party JS executes in page origin

**File:** `components/build-video.tsx:10-17`

**Issue:** The `<iframe>` renders a caller-supplied URL with no `sandbox` attribute. An iframe without `sandbox` runs in the same security context as the parent page: it can call `window.parent.location`, execute scripts, and interact with the embedding document. The `src` value is currently hardcoded to `undefined` and gated, but the component API accepts any string. A YouTube or Vimeo embed URL is the intended use, but if the value is ever set to anything other than a known-safe embed endpoint (misconfiguration, future CMS integration, etc.) the page has no defence. Even for legitimate YouTube/Vimeo embeds, `sandbox` with a minimal allowlist is the correct posture.

**Fix:**
```tsx
<iframe
  src={src}
  title="Build process video"
  sandbox="allow-scripts allow-same-origin allow-presentation"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  loading="lazy"
  className="absolute inset-0 w-full h-full"
/>
```

`allow-same-origin` is required for the embed player controls to function. `allow-presentation` is required for fullscreen on some browsers. Scripts are sandboxed to the iframe origin, not the parent.

---

### CR-02: Accordion open/close animation silently broken - CSS variable mismatch between Base UI and tw-animate-css

**File:** `components/ui/accordion.tsx:57`

**Issue:** The `AccordionPanel` applies `data-open:animate-accordion-down` and `data-closed:animate-accordion-up`. These animation names are defined in `tw-animate-css`. However, the `accordion-down` and `accordion-up` keyframes in `tw-animate-css` animate `height` from/to `var(--radix-accordion-content-height, ...)`. The fallback chain is: `--radix-accordion-content-height`, `--bits-accordion-content-height`, `--reka-accordion-content-height`, `--kb-accordion-content-height`, `--ngp-accordion-content-height`, then `auto`.

Base UI exposes the panel height via `--accordion-panel-height` (confirmed in `node_modules/@base-ui/react/esm/accordion/panel/AccordionPanelCssVars.js`). This variable name is absent from every fallback in the keyframe definition. The animation will always fall back to `auto`, meaning the height transition animates from `0` to `auto` (or vice versa). Most browsers cannot interpolate to/from `auto`, so the open and close animations produce no visible motion - the panel jumps open and closed without transition.

The inner `div` at line 62 applies `h-(--accordion-panel-height)` which correctly reads the Base UI variable for layout, but the outer Panel animation does not.

**Fix:** Override the keyframes in `globals.css` to use the Base UI variable name:

```css
@keyframes accordion-down {
  from { height: 0; }
  to   { height: var(--accordion-panel-height); }
}
@keyframes accordion-up {
  from { height: var(--accordion-panel-height); }
  to   { height: 0; }
}
```

Add `overflow: hidden` to the `AccordionPrimitive.Panel` element (already present via the `overflow-hidden` class) and confirm no conflicting `height` rules exist on the wrapper div.

---

### CR-03: vitest.config.ts missing test environment - JSX component tests cannot execute

**File:** `vitest.config.ts:1-10`

**Issue:** The vitest config defines only a path alias. It does not configure a `test` block, which means:

1. No `environment` is set - Vitest defaults to `node`. The test file imports `BuildVideo` which returns JSX. Under the `node` environment there is no DOM global (`document`, `window`). While the specific tests in `build-video.test.ts` only inspect the returned JSX object shape (no DOM mounting), `jsdom` or `happy-dom` is still required because `react/jsx-runtime` may reference browser globals at import time depending on the React 19 build target.
2. No `globals: true` - the test file uses `describe`, `it`, and `expect` without importing them. Under the default config these are not globals and the test file will throw `ReferenceError: describe is not defined` at parse time.

Neither of these is caught at config-file level - the failure surfaces only when `vitest` is invoked.

**Fix:**
```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom', // or 'jsdom' — install the corresponding package
  },
})
```

Install the environment package: `npm install -D @vitest/browser` or `npm install -D happy-dom` (preferred lightweight option for this stack).

---

## Warnings

### WR-01: Mobile menu overlay has no focus trap - keyboard users can interact with content behind it

**File:** `components/mobile-menu.tsx:29-59`

**Issue:** When `open` is true, the overlay renders as a `role="dialog"` with `aria-modal="true"`. However, `aria-modal` alone does not implement a focus trap in all browsers and assistive technologies. A keyboard user pressing Tab can cycle focus through the entire document behind the overlay, including the hidden desktop nav. The ARIA spec requires that `aria-modal` dialogs contain focus within their boundary, but this is only enforced by screen readers that respect the attribute - it is not enforced by the browser's native focus management.

The overlay also has no `onKeyDown` handler for Escape to close, which is a required pattern for modal dialogs per WCAG 2.1 SC 2.1.2.

**Fix:**
```tsx
// Add Escape key handler to the dialog div
<div
  role="dialog"
  aria-modal="true"
  aria-label="Site navigation"
  onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
  className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center gap-8"
>
```

For a full focus trap without adding framer-motion or another heavy lib, use the native `inert` attribute on sibling elements when the dialog is open, or use the lightweight `focus-trap-react` package (6 kB gzipped). The `inert` attribute approach requires no dependency:

```tsx
// In the Nav or layout, mark non-dialog content inert when menu is open
// (requires lifting state or a context)
```

At minimum, add the Escape key handler shown above.

---

### WR-02: BuildVideo accepts any string as src but performs no URL validation - falsy check is insufficient

**File:** `components/build-video.tsx:6`

**Issue:** The guard `if (!src) return null` catches empty string but not other invalid values. The `src` prop types as `string`, so a caller can pass `"javascript:alert(1)"`, a relative path, or a non-embed URL (e.g. `https://www.youtube.com/watch?v=abc` instead of the embed form `https://www.youtube.com/embed/abc`). The non-embed YouTube URL will render a broken iframe with no visible error; the `javascript:` URI is an XSS vector (blocked by CSP in production but not enforced at the component level).

The test suite at line 10 also passes `https://www.youtube.com/embed/abc123` directly without verifying that non-embed watch URLs are handled.

**Fix:** Add an allowlist origin check before rendering:

```tsx
const ALLOWED_ORIGINS = ['https://www.youtube.com', 'https://player.vimeo.com']

export function BuildVideo({ src }: BuildVideoProps) {
  if (!src) return null

  let parsed: URL
  try {
    parsed = new URL(src)
  } catch {
    return null
  }

  if (!ALLOWED_ORIGINS.some((o) => parsed.origin === o)) return null

  return ( /* existing JSX */ )
}
```

This prevents protocol-relative and non-HTTPS URLs from rendering and limits embeds to known-safe origins.

---

## Info

### IN-01: Nav link list duplicated between nav.tsx and mobile-menu.tsx

**File:** `components/nav.tsx:4-10` and `components/mobile-menu.tsx:7-13`

**Issue:** The `links` array is defined identically in both files. Adding, removing, or renaming a route requires updating two places. This is a maintainability concern, not a bug today, but the two arrays will drift as routes change.

**Fix:** Extract to a shared module:

```ts
// lib/nav-links.ts
export const navLinks = [
  { href: '/', label: 'Bikes' },
  { href: '/configure', label: 'Custom build' },
  { href: '/about', label: 'About' },
  { href: '/import', label: 'How it gets to you' },
  { href: '/contact', label: 'Contact' },
]
```

Import in both `nav.tsx` and `mobile-menu.tsx`.

---

_Reviewed: 2026-05-19_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_

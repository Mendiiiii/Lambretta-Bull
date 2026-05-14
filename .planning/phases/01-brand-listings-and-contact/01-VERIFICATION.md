---
phase: 01-brand-listings-and-contact
verified: 2026-05-14T10:45:00Z
status: human_needed
score: 5/6 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Galeria de fotos con 8-12 imagenes reales por moto"
    expected: "El usuario puede ver una galeria de 8-12 fotos (angulos, detalles) en la pagina de detalle de cada moto"
    why_human: "El componente BikeGallery soporta multiples fotos y thumbnail-swap, pero el unico bike registrado en lib/bikes.ts tiene exactamente 1 foto placeholder. El SC1 del roadmap dice 'User can view a per-bike gallery of 8-12 photos'. La infraestructura esta lista, pero ningun bike real con 8-12 fotos existe todavia. El desarrollador debe confirmar si esto se considera cumplido con fotos reales antes del lanzamiento, o si el SC fue intencionalmente diferido a cuando se carguen datos reales."
  - test: "Envio de formulario de contacto con RESEND_API_KEY configurada"
    expected: "Con RESEND_API_KEY valida en .env.local, enviar el formulario con datos validos produce el mensaje 'Message sent. We will be in touch within 2 business days.' y el email llega a imendifp@gmail.com"
    why_human: "La accion del servidor llama a resend.emails.send() correctamente, pero la entrega real del email no puede verificarse sin credenciales Resend activas. La ausencia de la clave fue documentada en el SUMMARY 04. Requiere verificacion manual."
  - test: "Pre-fill de subject desde CTA de moto a formulario de contacto"
    expected: "Clicar 'Inquire About This Bike' en /bikes/placeholder-1966-tv200 lleva a /contact con el campo Subject pre-relleno como 'Inquiry: 1966 TV 200'"
    why_human: "El href usa encodeURIComponent y la pagina de contacto lee searchParams via connection()+Suspense. El enlazado es correcto en el codigo, pero el round-trip completo (renderizado del formulario con el subject decodificado) requiere verificacion en el navegador."
gaps: []
deferred: []
---

# Phase 1: Brand, Listings and Contact — Verification Report

**Phase Goal:** A visitor can discover a real Lambretta for sale, evaluate it fully, and contact the seller, before any public URL is shared.
**Verified:** 2026-05-14T10:45:00Z
**Status:** human_needed
**Re-verification:** No — verificacion inicial

---

## Goal Achievement

### Observable Truths (derivadas del ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Usuario puede ver galeria de 8-12 fotos por moto (angulos multiples, detalles) | ? UNCERTAIN | BikeGallery soporta N fotos con thumbnail-swap y next/image, pero el unico bike tiene 1 foto placeholder. La infraestructura existe, los datos reales no. |
| 2 | Usuario puede leer el spec sheet completo (chassis, motor, sourcing, discos, componentes) | VERIFIED | SpecSheet renderiza los 5 campos de BikeSpec. Wired: BikePage pasa `bike.spec` a `<SpecSheet spec={bike.spec} />` |
| 3 | Usuario puede ver price anchor ("from AU$XX,XXX") en cada moto, nunca "POA" | VERIFIED | PriceAnchor usa `toLocaleString('en-AU')` o "Price TBA" cuando priceAUD <= 0. Wired en BikePage y homepage. |
| 4 | Usuario puede clicar CTA por moto y llegar al formulario de contacto con subject pre-cargado | VERIFIED (codigo) | `encodeURIComponent` en bike detail page, `connection()+Suspense+await searchParams` en contact page, `defaultValue={defaultSubject}` en ContactForm. Round-trip funcional pendiente de verificacion humana. |
| 5 | Usuario puede leer la historia del artesano (Bulbena, taller, proceso, viaje a Sydney) y enviar formulario independiente | VERIFIED | about/page.tsx: cuatro secciones (The maker, The workshop, The build, The journey to Sydney). CTA "Ask About a Build" wired a /contact. contactSchema + submitContact implementados. |
| 6 | Sitio presenta marca Mod/2 Tone consistente en todas las paginas (checkerboard, fondo negro, Barlow Condensed) | VERIFIED | Brand tokens en globals.css, Barlow_Condensed en layout.tsx, CheckerboardStripe en layout, nav sticky con 3 links, mobile menu con overlay. |

**Score:** 5/6 truths verified (1 UNCERTAIN, requiere decision humana)

---

### Deferred Items

No hay items diferidos a fases posteriores.

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `next.config.ts` | cacheComponents enabled | VERIFIED | Linea 4: `cacheComponents: true` |
| `lib/bikes.ts` | Bike type, bikes array, getBike helper | VERIFIED | Exports: `type Bike`, `type BikeSpec`, `const bikes`, `function getBike` |
| `app/layout.tsx` | Root layout con Inter + Barlow Condensed, nav, footer, checkerboard | VERIFIED | Barlow_Condensed importado, Nav + CheckerboardStripe + SiteFooter wired |
| `app/globals.css` | Brand tokens de Lambre-Bull | VERIFIED | `--color-brand-red: #cc2200` en linea 36; no hay bloque `.dark` |
| `app/page.tsx` | Homepage bike listing o empty state | VERIFIED | Importa `bikes` de `@/lib/bikes`, `'use cache'`, `cacheLife('max')`, renderiza grid o empty state |
| `components/nav.tsx` | Nav con 3 links, responsive | VERIFIED | Links Bikes/About/Contact, `hidden md:flex`, `<MobileMenu />` wired |
| `components/site-footer.tsx` | Footer minimo | VERIFIED | Contiene "Lambre-Bull" |
| `components/checkerboard-stripe.tsx` | Banda checkerboard | VERIFIED | `repeating-conic-gradient` en estilo inline |
| `app/bikes/[id]/page.tsx` | Bike detail Server Component | VERIFIED | `generateStaticParams`, `await params`, `'use cache'`, `notFound()`, BikeGallery+SpecSheet+PriceAnchor wired |
| `components/bike-gallery.tsx` | Client gallery con useState | VERIFIED | `'use client'`, `useState`, `ring-2 ring-[#cc2200]` activo, `sizes="(max-width: 768px) 100vw, 50vw"` |
| `components/spec-sheet.tsx` | Server component BikeSpec | VERIFIED | Renderiza 5 campos: Chassis, Engine, Discs, Parts sourcing, Handmade components |
| `components/price-anchor.tsx` | Server component precio | VERIFIED | `toLocaleString('en-AU')`, "Price TBA", "from AU$" |
| `components/mobile-menu.tsx` | Client component overlay mobile | VERIFIED | `'use client'`, `useState`, `role="dialog"`, `aria-modal="true"`, `md:hidden` |
| `app/about/page.tsx` | Pagina craftsman story | VERIFIED | `'use cache'`, Bulbena + Malaga + Sydney, CTA "Ask About a Build", `encodeURIComponent` |
| `lib/validations.ts` | Zod schema contacto | VERIFIED | `contactSchema` con 4 campos, errores literales exactos |
| `app/actions/contact.ts` | Server Action submitContact | VERIFIED | `'use server'`, Resend SDK, `process.env.RESEND_API_KEY`, log prefix `[contact-action]` |
| `app/contact/page.tsx` | Contact page Server Component | VERIFIED | `connection()+Suspense`, `await searchParams`, `<ContactForm defaultSubject={subject} />`, sin `'use cache'` |
| `components/contact-form.tsx` | Client Component formulario | VERIFIED | `'use client'`, `useActionState`, `useFormStatus`, `defaultValue={defaultSubject}`, `aria-live="polite"` |
| `.env.local.example` | Template env file en git | VERIFIED | Contiene `RESEND_API_KEY=`, `.gitignore` cubre `.env*` con negacion `!.env.local.example` |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/page.tsx` | `lib/bikes.ts` | `import { bikes }` | WIRED | Linea 3: `import { bikes } from '@/lib/bikes'` |
| `app/layout.tsx` | `components/nav.tsx` | `<Nav />` | WIRED | Import + uso en JSX |
| `app/layout.tsx` | `components/site-footer.tsx` | `<SiteFooter />` | WIRED | Import + uso en JSX |
| `app/layout.tsx` | `components/checkerboard-stripe.tsx` | `<CheckerboardStripe />` | WIRED | Dos instancias wired (encima del main y debajo) |
| `app/bikes/[id]/page.tsx` | `lib/bikes.ts` | `getBike, bikes, generateStaticParams` | WIRED | `from '@/lib/bikes'` con ambos exports |
| `app/bikes/[id]/page.tsx` | `components/bike-gallery.tsx` | `<BikeGallery photos={bike.photos} />` | WIRED | Prop real pasada |
| `app/bikes/[id]/page.tsx` | `components/spec-sheet.tsx` | `<SpecSheet spec={bike.spec} />` | WIRED | Prop real pasada |
| `app/bikes/[id]/page.tsx` | `components/price-anchor.tsx` | `<PriceAnchor priceAUD={bike.priceAUD} />` | WIRED | Prop real pasada |
| `app/bikes/[id]/page.tsx` | `/contact` | `encodeURIComponent` en href | WIRED | `inquiryHref = /contact?subject=...` |
| `components/nav.tsx` | `components/mobile-menu.tsx` | `<MobileMenu />` | WIRED | Import + render con `hidden md:flex` en desktop links |
| `components/contact-form.tsx` | `app/actions/contact.ts` | `useActionState(submitContact, ...)` | WIRED | `submitContact` importado y usado |
| `app/actions/contact.ts` | `lib/validations.ts` | `contactSchema.safeParse` | WIRED | Import en linea 4 |
| `app/actions/contact.ts` | Resend SDK | `resend.emails.send(...)` | WIRED | Instanciacion post env-check, llamada en try/catch |
| `app/contact/page.tsx` | `components/contact-form.tsx` | `<ContactForm defaultSubject={subject} />` | WIRED | Prop `defaultSubject` pasada desde searchParams |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produce datos reales | Status |
|----------|--------------|--------|----------------------|--------|
| `app/page.tsx` | `bikes` | `lib/bikes.ts` (array TypeScript) | Si, array tipado con 1 placeholder | VERIFIED (datos son developer-authored, no hay DB) |
| `app/bikes/[id]/page.tsx` | `bike` | `getBike(id)` de `lib/bikes.ts` | Si, busca en el array | VERIFIED |
| `components/bike-gallery.tsx` | `photos` | Prop desde BikePage | Si, `bike.photos` del array | VERIFIED — 1 foto placeholder, infraestructura lista para N |
| `components/contact-form.tsx` | `state` | `useActionState(submitContact, initialState)` | Si, el Server Action retorna `ContactFormState` real | VERIFIED (codigo correcto; email real requiere API key) |
| `app/contact/page.tsx` | `subject` | `await searchParams` via `connection()` | Si, lee query param real | VERIFIED |

---

### Behavioral Spot-Checks

| Behavior | Comprobado via | Resultado | Status |
|----------|----------------|-----------|--------|
| `lib/bikes.ts` exporta Bike, bikes, getBike | Inspeccion de archivo | Todos los exports presentes | PASS |
| `app/actions/contact.ts` abre con `'use server'` | Linea 1 del archivo | `'use server'` confirmado | PASS |
| RESEND_API_KEY no aparece en `components/` | `grep -rn` en components/ | 0 resultados | PASS |
| `.gitignore` cubre `.env.local` | grep `.env` en .gitignore | `.env*` con negacion `!.env.local.example` | PASS |
| `'use cache'` ausente en `app/contact/page.tsx` | grep en el archivo | 0 resultados | PASS |
| Commits documentados en SUMMARYs existen en git | `git log --oneline` | a5ddbe2, 8532908, e63d334, 1a23829, 21cb988, dc6445b, 3c542d2, 7280e6b, 5c232ba, eff8e22 — todos FOUND | PASS |

---

### Requirements Coverage

| Req ID | Plan fuente | Descripcion | Status | Evidencia |
|--------|------------|-------------|--------|-----------|
| BIKE-01 | 01-02 | Galeria 8-12 fotos por moto | UNCERTAIN | Componente BikeGallery implementado con thumbnail-swap, next/image, ring activo. Datos: 1 foto placeholder. SC requiere que el usuario *pueda ver* 8-12 fotos. |
| BIKE-02 | 01-02 | Spec sheet completo (chassis, motor, sourcing, discos, handmade) | VERIFIED | SpecSheet renderiza los 5 campos. Placeholder tiene todos los campos poblados con valores. |
| BIKE-03 | 01-01, 01-02 | Price anchor "from AU$XX,XXX" | VERIFIED | PriceAnchor + `formatPrice` en homepage. Actualmente muestra "Price TBA" (priceAUD=0), que es el comportamiento correcto para placeholder. |
| BIKE-04 | 01-02, 01-04 | CTA por moto lleva al formulario pre-cargado | VERIFIED (codigo) | `encodeURIComponent` en href, `defaultValue={defaultSubject}` en ContactForm. |
| BRAND-01 | 01-03 | Historia del artesano (Bulbena, taller, proceso, viaje) | VERIFIED | Las 4 secciones estan en about/page.tsx: "The maker", "The workshop", "The build", "The journey to Sydney". |
| BRAND-03 | 01-04 | Formulario de contacto standalone | VERIFIED (codigo) | Contact page + ContactForm + Server Action wired. Entrega email requiere API key (verificacion humana). |
| BRAND-04 | 01-01 al 01-04 | Marca Mod/2 Tone consistente en todas las paginas | VERIFIED | Tokens de marca en globals.css, Barlow Condensed en headings, checkerboard stripes en layout, nav con MobileMenu responsive. |

**Nota sobre BIKE-01:** REQUIREMENTS.md marca BIKE-01 como "Pending" y el ROADMAP SC1 establece "8-12 photos". El componente esta totalmente implementado para soportar N fotos, pero el contenido real de 8-12 fotos no existe todavia. Esto es un gap de datos, no de infraestructura.

---

### Anti-Patterns Found

| Archivo | Patron | Severidad | Impacto |
|---------|--------|-----------|---------|
| `lib/bikes.ts` | 1 foto placeholder, priceAUD=0, tagline "Placeholder entry..." | Info | Stubs intencionales y documentados en SUMMARYs. No bloquean el objetivo porque son datos de desarrollo, no codigo stub. La infraestructura es funcional. |
| `public/bikes/placeholder/hero.jpg` | JPEG de 331 bytes (1x1 pixel) | Info | Imagen placeholder minima para que next/image no falle en build. Documentado como intencional en SUMMARY 01-02. |

No se encontraron anti-patrones de codigo (return null, componentes sin implementacion, TODO/FIXME, handlers vacios, API keys hardcodeadas).

---

### Human Verification Required

#### 1. Galeria con fotos reales (8-12 por moto)

**Test:** Agregar un bike real a `lib/bikes.ts` con 8 o mas fotos en el array `photos[]`, correr `npm run build` y `npm run dev`, navegar a `/bikes/[id]`, verificar que la galeria muestra la imagen primaria con next/image y el grid de thumbnails con anillo rojo activo al clicar.

**Expected:** La galeria renderiza con la imagen grande (4:3), el grid de thumbnails debajo (solo cuando photos.length > 1), y clicar un thumbnail cambia la imagen principal. El anillo `ring-2 ring-[#cc2200]` aparece en el thumbnail activo.

**Why human:** Con 1 foto de placeholder, la ruta del codigo de thumbnails (`photos.length > 1`) no se ejercita. El SC1 del roadmap requiere 8-12 fotos reales. El verifier no puede crear contenido de producto real.

#### 2. Entrega de email via Resend

**Test:** Configurar `RESEND_API_KEY=<clave real>` en `.env.local`, correr `npm run dev`, ir a `/contact`, llenar Name/Email/Subject/Message con datos validos, clicar "Send Message".

**Expected:** El formulario muestra "Message sent. We'll be in touch within 2 business days." y el email llega a `imendifp@gmail.com` desde `onboarding@resend.dev`.

**Why human:** El Server Action llama a `resend.emails.send()` correctamente, pero la entrega real requiere credenciales Resend activas. El SUMMARY 04 documenta que la API key no estaba configurada durante la ejecucion.

#### 3. Round-trip CTA moto -> formulario pre-cargado

**Test:** En `npm run dev`, ir a `/bikes/placeholder-1966-tv200`, clicar "Inquire About This Bike", verificar que la URL es `/contact?subject=Inquiry%3A%201966%20TV%20200` y que el campo Subject del formulario muestra "Inquiry: 1966 TV 200" pre-cargado y editable.

**Expected:** El campo Subject esta pre-relleno con el nombre de la moto y el usuario puede editar el texto antes de enviar.

**Why human:** El enlazado de `connection()+Suspense+await searchParams` -> `defaultValue={defaultSubject}` es correcto en codigo, pero el flujo completo en el navegador (incluyendo la hidratacion del Client Component con el valor del servidor) requiere verificacion visual.

---

### Gaps Summary

No hay gaps bloqueantes. Todos los artifacts existen, estan implementados con sustancia real (no stubs de codigo), y estan wired correctamente. El unico punto incierto es el SC1 (galeria 8-12 fotos), que es una cuestion de datos de contenido real, no de infraestructura de codigo.

Los tres items de verificacion humana son: (1) confirmar que la galeria funciona con fotos reales, (2) verificar la entrega real de email con API key, y (3) confirmar el round-trip del pre-fill del formulario en el navegador.

---

_Verificado: 2026-05-14T10:45:00Z_
_Verifier: Claude (gsd-verifier)_

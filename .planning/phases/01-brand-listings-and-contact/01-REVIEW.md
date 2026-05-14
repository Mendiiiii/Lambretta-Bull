---
phase: 01-brand-listings-and-contact
reviewed: 2026-05-14T00:00:00Z
depth: standard
files_reviewed: 18
files_reviewed_list:
  - app/about/page.tsx
  - app/actions/contact.ts
  - app/bikes/[id]/page.tsx
  - app/contact/page.tsx
  - app/globals.css
  - app/layout.tsx
  - app/page.tsx
  - components/bike-gallery.tsx
  - components/checkerboard-stripe.tsx
  - components/contact-form.tsx
  - components/mobile-menu.tsx
  - components/nav.tsx
  - components/price-anchor.tsx
  - components/site-footer.tsx
  - components/spec-sheet.tsx
  - lib/bikes.ts
  - lib/validations.ts
  - next.config.ts
findings:
  critical: 4
  warning: 6
  info: 4
  total: 14
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-05-14
**Depth:** standard
**Files Reviewed:** 18
**Status:** issues_found

## Summary

Se revisaron 18 archivos que componen el primer ciclo de la implementacion: listado de motos, ficha de producto, formulario de contacto, Server Action de correo, validaciones y componentes de UI. La arquitectura general es correcta para Next.js 16 + React 19: params asincrono, `'use cache'` en las paginas estaticas, `useActionState` + `useFormStatus` para el formulario, y validacion Zod en el servidor. Sin embargo, se detectaron cuatro bloqueantes serios: ausencia total de limites de longitud en los campos del formulario (vector de spam y DoS), email del propietario expuesto como texto plano en el codigo fuente y en mensajes de error visibles al usuario, contenido placeholder con precio 0 y tagline explicita de "placeholder" que se mostraria en produccion tal cual, y un campo `available` definido en el tipo `Bike` que no se usa para filtrar la lista ni el detalle, lo que significa que una moto marcada `available: false` seguiria apareciendo en la homepage.

---

## Critical Issues

### CR-01: Sin limite de longitud en los campos del formulario de contacto

**File:** `lib/validations.ts:4-12`
**Issue:** El schema Zod no define `.max()` en ninguno de los cuatro campos. Un atacante puede enviar payloads de varios megabytes por envio, saturar el procesamiento del Server Action, agotar la cuota de la API de Resend y provocar emails enormes en el buzon del propietario. El campo `message` especialmente no tiene cota superior.
**Fix:**
```ts
export const contactSchema = z.object({
  name:    z.string().trim().min(1, 'This field is required.').max(100, 'Max 100 characters.'),
  email:   z.string().trim().min(1, 'This field is required.').email('Please enter a valid email address.').max(254, 'Max 254 characters.'),
  subject: z.string().trim().min(1, 'This field is required.').max(200, 'Max 200 characters.'),
  message: z.string().trim().min(10, 'This field is required.').max(5000, 'Max 5000 characters.'),
})
```
Tambien agregar `maxLength` en los `<Input>` y `<Textarea>` del cliente como primera linea de defensa:
```tsx
<Input name="name" maxLength={100} ... />
<Input name="subject" maxLength={200} ... />
<Textarea name="message" maxLength={5000} ... />
```

---

### CR-02: Email personal del propietario expuesto en codigo fuente y en UI

**File:** `app/actions/contact.ts:7,44,69`
**Issue:** `imendifp@gmail.com` aparece tres veces: como constante hardcoded `RESEND_TO_DEFAULT`, y dentro de las cadenas de error que se devuelven al cliente (`"Try again or email us directly at imendifp@gmail.com."`). Estos mensajes de error se renderizan en el componente `ContactForm` en el DOM visible al usuario. El email personal queda expuesto publicamente en el HTML de produccion, y cualquier scraper de contactos lo recogera.
**Fix:**
```ts
// app/actions/contact.ts

// 1. Quitar el fallback hardcoded: si RESEND_TO_EMAIL no esta definido, fallar
const to = process.env.RESEND_TO_EMAIL
if (!to) {
  console.error('[contact-action] RESEND_TO_EMAIL missing')
  return { status: 'error', message: 'Something went wrong. Please try again later.' }
}

// 2. Reemplazar los mensajes de error que exponen el email
return {
  status: 'error',
  message: 'Something went wrong. Please try again later.',
}
```
La constante `RESEND_TO_DEFAULT` debe eliminarse completamente. El email de destino solo debe venir de la variable de entorno.

---

### CR-03: El campo `available` de Bike no se usa para filtrar la lista ni el detalle

**File:** `lib/bikes.ts:16,35` / `app/page.tsx:28-49` / `app/bikes/[id]/page.tsx:22-23`
**Issue:** El tipo `Bike` define un campo `available: boolean` y la moto placeholder lo tiene en `true`. Sin embargo, `app/page.tsx` itera sobre `bikes` sin filtrar por `available`, y `app/bikes/[id]/page.tsx` llama `getBike(id)` y muestra la moto independientemente de ese campo. Si en el futuro se marca una moto como `available: false` (por ejemplo, ya vendida), seguira apareciendo en la homepage y siendo accesible por URL directa. El campo esta declarado pero es letra muerta, lo que es una trampa de mantenimiento de alta consecuencia.
**Fix:**
```ts
// lib/bikes.ts - exportar solo las disponibles
export function getAvailableBikes(): Bike[] {
  return bikes.filter((b) => b.available)
}
```
```tsx
// app/page.tsx
import { getAvailableBikes } from '@/lib/bikes'
const availableBikes = getAvailableBikes()
// usar availableBikes en lugar de bikes
```
```tsx
// app/bikes/[id]/page.tsx
// Verificar available ademas de existencia
const bike = getBike(id)
if (!bike || !bike.available) notFound()
```
```ts
// generateStaticParams debe generar solo las rutas disponibles
export async function generateStaticParams() {
  return getAvailableBikes().map((b) => ({ id: b.id }))
}
```

---

### CR-04: Contenido placeholder visible en produccion

**File:** `lib/bikes.ts:21-36`
**Issue:** La unica moto en el catalogo tiene `id: 'placeholder-1966-tv200'`, `tagline: 'Placeholder entry. Photos and price to be replaced before launch.'`, `priceAUD: 0`, y la foto apunta a `/bikes/placeholder/hero.jpg`. Con `'use cache'` y `cacheLife('max')`, estas cadenas quedaran congeladas en la cache del servidor y distribuidas en la CDN. Un despliegue a produccion en este estado mostraria el texto "Placeholder entry..." al publico y serviria imagenes rotas. El riesgo no es solo cosmético: con `priceAUD: 0`, el componente `PriceAnchor` muestra "Price TBA" y `formatPrice` en la homepage tambien, lo que podria interpretarse como error de sistema.
**Fix:** El archivo de datos debe tener contenido real antes del primer despliegue a produccion, o la moto placeholder debe marcarse `available: false` (que junto con CR-03 la filtraria del listado). Una solucion minima inmediata:
```ts
// lib/bikes.ts
available: false,  // ocultar el placeholder hasta tener datos reales
```
Esto requiere que CR-03 este corregido primero para que el filtro tenga efecto.

---

## Warnings

### WR-01: Sin rate limiting en el Server Action de contacto

**File:** `app/actions/contact.ts:20-72`
**Issue:** El Server Action `submitContact` no tiene ninguna proteccion contra envios repetidos. Cualquier script puede llamar al endpoint continuamente, agotar la cuota gratuita de Resend (3,000 emails/mes) y llenar el buzon del propietario en segundos. Los Server Actions de Next.js 16 son endpoints HTTP POST con CSRF implicito del framework, pero no tienen throttling por defecto.
**Fix:** Implementar rate limiting basado en IP usando `next/headers` para leer la IP, con una libreria como `@upstash/ratelimit` (compatible con Vercel Edge) o un mapa en memoria para desarrollo. Ejemplo minimo:
```ts
import { headers } from 'next/headers'

const ip = (await headers()).get('x-forwarded-for') ?? 'unknown'
// Comprobar limite antes de llamar a Resend
```
Para un sitio pequeno, un limite de 3 envios por IP por hora es razonable.

---

### WR-02: `subject` del formulario acepta URLs y contenido arbitrario sin sanitizar

**File:** `app/actions/contact.ts:57` / `lib/validations.ts:10`
**Issue:** El campo `subject` se usa directamente como asunto del email sin ninguna restriccion de contenido mas alla de `min(1)`. Dado que el asunto en `/contact?subject=...` puede ser inyectado via URL desde cualquier pagina que enlace al formulario (por ejemplo `/about`, `/bikes/[id]`), un enlace malicioso podria pre-rellenar el asunto con contenido engannoso, phishing o encabezados de email si el cliente de email procesa encabezados especiales. El campo `subject` en Resend se envia como encabezado SMTP `Subject:`; aunque Resend lo sanitiza, el codigo no lo hace explicitamente.
**Fix:** Ademas de `.max()` (cubierto en CR-01), agregar un `.regex()` o `.refine()` que rechace saltos de linea, ya que los saltos de linea en encabezados de email son el vector clasico de header injection:
```ts
subject: z.string().trim()
  .min(1, 'This field is required.')
  .max(200, 'Max 200 characters.')
  .refine((v) => !/[\r\n]/.test(v), 'Subject cannot contain line breaks.'),
```

---

### WR-03: El menu movil no atrapa el foco ni responde a la tecla Escape

**File:** `components/mobile-menu.tsx:28-55`
**Issue:** El elemento con `role="dialog"` y `aria-modal="true"` se abre sobre toda la pantalla, pero el foco no se mueve al dialogo al abrirse, no se atrapa dentro de el mientras esta abierto, y no se cierra al pulsar Escape. Segun la especificacion ARIA y WCAG 2.1 (2.1.1), un dialogo modal debe: (1) mover el foco a un elemento dentro del dialogo al abrirse, (2) mantener el foco dentro del dialogo con Tab/Shift+Tab, y (3) cerrarse con Escape.
**Fix:**
```tsx
import { useEffect, useRef } from 'react'

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false)
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  // ... pasar ref={closeRef} al boton de cierre
}
```
Para el focus trap completo considerar la libreria `focus-trap-react` o implementar la logica de Tab/Shift+Tab manualmente.

---

### WR-04: `aria-expanded` en el boton del menu no refleja el estado correctamente fuera del modal

**File:** `components/mobile-menu.tsx:22`
**Issue:** El boton de apertura tiene `aria-expanded={open}`, lo cual es correcto en principio. Sin embargo, cuando `open` es `true`, el dialogo reemplaza visualmente todo el contenido pero el boton sigue existiendo en el DOM (aunque no sea visible detras del overlay). Los lectores de pantalla pueden anunciar el boton como "expanded" pero no tener una referencia `aria-controls` que apunte al dialogo, lo que rompe la semantica esperada. Ademas, `aria-expanded` acepta `boolean` en JSX pero la especificacion ARIA espera el string `"true"` o `"false"`.
**Fix:**
```tsx
// Agregar aria-controls apuntando al id del dialogo
<button
  aria-expanded={open}
  aria-controls="mobile-nav-dialog"
  ...
>

<div id="mobile-nav-dialog" role="dialog" ...>
```

---

### WR-05: La imagen principal en la galeria siempre tiene `priority` basada en el estado local, no en si es la imagen inicial

**File:** `components/bike-gallery.tsx:22-23`
**Issue:** `priority={active === 0}` es correcto solo en la carga inicial. Una vez que el usuario cambia la imagen activa, la nueva imagen activa recibe `priority={false}` y la primera imagen (que ya se cargo) vuelve a tener `priority={true}`. Esto no causa un error visible pero emite una senal erronea a Next.js Image sobre que imagenes precargar, y la imagen grande actualmente seleccionada puede cargarse mas lento de lo necesario despues de la primera seleccion.
**Fix:**
```tsx
// Usar un ref para recordar si es la primera imagen, independientemente del estado activo
<Image
  priority={i === 0 && active === 0}  // solo la primera imagen en la carga inicial
  // ...
/>
// O mas correctamente, pasar una prop "isAboveTheFold" desde el padre
```

---

### WR-06: `nav` anidada dentro de `article` en la pagina de detalle de moto

**File:** `app/bikes/[id]/page.tsx:29-33`
**Issue:** El elemento `<nav aria-label="Breadcrumb">` que contiene el enlace "Back to bikes" esta anidado dentro del `<article>`. El elemento `<article>` representa contenido autocontenido; un `<nav>` de migas de pan es navegacion de pagina, no parte del articulo en si. Lectores de pantalla que enumeran landmarks encontraran un `<nav>` dentro de un `<article>`, lo que es semanticamente incorrecto segun HTML5 y puede confundir a usuarios de tecnologias asistivas.
**Fix:** Mover el `<nav>` de migas de pan fuera del `<article>`, o bien cambiar el elemento raiz de `article` a `div`/`section` si el contenido no es autocontenido:
```tsx
export default async function BikePage(...) {
  // ...
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <Link href="/">Back to bikes</Link>
      </nav>
      <article>
        {/* contenido de la moto */}
      </article>
    </div>
  )
}
```

---

## Info

### IN-01: La homepage usa `bikes` directamente en lugar de una funcion exportada del modulo

**File:** `app/page.tsx:3,28`
**Issue:** La homepage importa y usa el array `bikes` directamente. Esto crea un acoplamiento implicito: si en el futuro `lib/bikes.ts` necesita hacer la lista dinamica (leer de un archivo JSON, base de datos, o CMS), habra que actualizar cada consumidor del array. Ya existe `getBike()` como funcion; seria consistente tener `getAvailableBikes()` (sugerida en CR-03) como el punto de acceso canónico.

---

### IN-02: Mensaje de error de validacion inconsistente para `message`

**File:** `lib/validations.ts:11`
**Issue:** El campo `message` con `min(10)` usa el mensaje `'This field is required.'` en lugar de un mensaje que refleje el minimo real, por ejemplo `'Message must be at least 10 characters.'`. Un usuario que escriba 5 caracteres vera "This field is required." lo cual es inexacto.
**Fix:**
```ts
message: z.string().trim().min(10, 'Please write at least 10 characters.').max(5000, 'Max 5,000 characters.'),
```

---

### IN-03: El `lang` del documento es `"en"` pero el mercado objetivo es australiano

**File:** `app/layout.tsx:30`
**Issue:** `lang="en"` es correcto para ingles en general. Para mejorar la experiencia con lectores de pantalla y herramientas de accesibilidad australianas, `lang="en-AU"` seria mas preciso. Esto afecta principalmente a la pronunciacion de algunos terminos por lectores de pantalla TTS.
**Fix:**
```tsx
<html lang="en-AU" ...>
```

---

### IN-04: Falta `aria-label` o `title` en el logo de navegacion

**File:** `components/nav.tsx:14-20`
**Issue:** El enlace del logo "LAMBRE-BULL" apunta a `/` pero su contenido es solo texto visible. No hay ningun problema de accesibilidad si el texto es descriptivo, sin embargo, el texto en mayusculas `LAMBRE-BULL` puede ser anunciado letra por letra por algunos lectores de pantalla. Agregar `aria-label` aclararia la funcion del enlace.
**Fix:**
```tsx
<Link href="/" aria-label="Lambre-Bull, ir a la pagina de inicio" ...>
  LAMBRE-BULL
</Link>
```

---

_Reviewed: 2026-05-14_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_

# Phase 2: Configurator and Inquiry Integration - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Un comprador puede especificar una Lambretta a medida (chassis, motor, discos, sourcing) mediante un wizard paso a paso, revisar el resumen completo, y enviar la configuracion como consulta estructurada al vendedor. El vendedor recibe un email con todos los datos sin perder ninguno.

</domain>

<decisions>
## Implementation Decisions

### Estructura del configurador

- **D-01:** Wizard paso a paso, NO pagina unica con scroll. Cada categoria de eleccion ocupa su propia pantalla.
- **D-02:** Progreso visible — numeracion de pasos (ej. "Paso 2 de 5 — Motor") con Barlow Condensed, coherente con la identidad de marca.
- **D-03:** Navegacion libre entre pasos — el usuario puede volver a cualquier paso anterior para cambiar su seleccion sin reiniciar.
- **D-04:** 5 pasos totales: 1) Chassis, 2) Motor, 3) Discos, 4) Sourcing, 5) Contacto + Resumen.

### Datos configurables

- **D-05:** Placeholders ahora, datos reales de Alfonso despues. La estructura de `lib/configurator.ts` se construye con opciones de ejemplo que el usuario reemplazara con datos reales antes del lanzamiento.
- **D-06:** 4 categorias de eleccion (segun ROADMAP CONF-01/CONF-02): Chassis (year + model), Motor, Discos, Sourcing (handmade vs. England-sourced).
- **D-07:** Sin precio dinamico por opcion. El configurador muestra el rango AU$18.000-25.000 como referencia fija. Los precios por categoria no estan definidos y no se calculan en tiempo real.

### Punto de entrada y navegacion

- **D-08:** Link "Custom build" en la navegacion principal (nav.tsx y mobile-menu.tsx). Es el CTA principal del sitio junto con Contact.
- **D-09:** Ruta: `/configure` → `app/configure/page.tsx`.

### Formato del email de consulta

- **D-10:** Server Action separada: `app/actions/configure.ts`. No reutiliza `submitContact` — flujo independiente con schema Zod propio.
- **D-11:** Email en texto plano estructurado, una linea por categoria. Ej:
  ```
  Custom Build Inquiry from [Name]

  Chassis: 1966 TV 200
  Motor: Handbuilt 200cc (placeholder)
  Discos: Front disc, drum rear (placeholder)
  Sourcing: Handbuilt
  
  Message: [mensaje opcional]
  
  Contact: [name] <[email]>
  ```
- **D-12:** El paso 5 del wizard incluye formulario de contacto minimo: nombre (required), email (required), mensaje (opcional). La configuracion completa se incluye en el email automaticamente.
- **D-13:** Tras el envio exitoso, confirmacion en la misma pagina (sin redireccion). Mismo patron que el contact form existente. Wizard muestra estado de exito con resumen de configuracion enviada.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — CONF-01, CONF-02, CONF-03, CONF-04 son los 4 requisitos de esta phase
- `.planning/ROADMAP.md` — Phase 2 goal, success criteria, y constraints

### Existing code — patterns to follow
- `app/actions/contact.ts` — patron de Server Action a replicar para configure.ts
- `lib/validations.ts` — contactSchema como base para configSchema
- `lib/bikes.ts` — BikeSpec type como referencia para el modelo de datos del configurador
- `components/contact-form.tsx` — patron useActionState a replicar en el wizard
- `components/nav.tsx` — anadir "Custom build" link aqui
- `components/mobile-menu.tsx` — anadir "Custom build" link aqui

### Market research
- `.planning/research/market-research.md` — Seccion 6 "Implicaciones para el sitio web": lo que los compradores esperan del proceso de configuracion y contacto

### Next.js 16 constraints
- `node_modules/next/dist/docs/01-app/02-guides/forms.md` — useActionState + Server Actions pattern (Next.js 16)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ui/button.tsx` — CTA de cada paso del wizard (Next, Back, Submit)
- `components/ui/card.tsx` — contenedor de cada opcion seleccionable en el wizard
- `components/ui/badge.tsx` — indicar opcion seleccionada
- `components/ui/input.tsx` — campos nombre y email en paso 5
- `components/ui/textarea.tsx` — campo mensaje opcional en paso 5
- `components/ui/label.tsx` — labels de los campos de contacto
- `components/ui/separator.tsx` — separador entre secciones del resumen

### Established Patterns
- **Server Action + useActionState + Zod:** establecido en contact form. El wizard sigue exactamente el mismo patron para el submit final.
- **Estado local con useState:** REQUIREMENTS.md prohibe Zustand/Redux. El estado del wizard (paso actual + selecciones) vive en useState dentro del componente cliente del configurador.
- **'use client' para interactividad:** el wizard completo es un Client Component dado que gestiona estado multi-paso.
- **Tailwind v4 CSS-first:** tokens de marca ya definidos en globals.css. No crear nuevos tokens.
- **Barlow Condensed:** tipografia de headings ya cargada. Usar para el indicador de progreso.

### Integration Points
- `app/layout.tsx` → importa `components/nav.tsx` — anadir link "Custom build" a `/configure`
- `components/mobile-menu.tsx` → anadir el mismo link para mobile
- Nueva ruta: `app/configure/page.tsx` (Server Component que wrappea el Client Component del wizard)
- Nueva accion: `app/actions/configure.ts` (Server Action, mismo patron que contact.ts)
- Nuevo schema: `lib/validations.ts` — anadir configSchema (o nuevo archivo `lib/configurator.ts`)
- Nuevo data file: `lib/configurator.ts` — opciones disponibles por categoria (placeholders)

</code_context>

<specifics>
## Specific Ideas

- El indicador de progreso debe usar el lenguaje de marca: Barlow Condensed, blanco sobre negro, coherente con checkerboard. No usar progress bars de color — numeracion textual es suficiente y mas on-brand.
- Las opciones de cada paso se presentan como tarjetas seleccionables (Card component), no dropdowns. El usuario ve todas las opciones a la vez en cada paso.
- El paso de resumen (antes del formulario de contacto) muestra toda la configuracion en formato lista, permitiendo al usuario confirmar antes de dar sus datos.
- El email subject debe identificar claramente que es una consulta de configurador, no del contact form: "Custom Build Inquiry: [Chassis seleccionado]".

</specifics>

<deferred>
## Deferred Ideas

- Precio dinamico por opcion de configuracion — requiere precios definidos por Alfonso. Fuera de scope v1.
- Compartir URL de configuracion (link permanente con config en query params) — nice-to-have, no necesario para CONF-04.
- Pagina /configure/success separada — descartada en favor de confirmacion en la misma pagina.
- Actualizaciones durante fabricacion (fotos del proceso) — identificado en market research como deseo del comprador. Pertenece a una fase futura de confianza/posventa, no al configurador.
- Plazos de pago / deposito — identificado en market research. Fuera de scope tecnico del sitio web v1.

</deferred>

---

*Phase: 2-configurator-and-inquiry-integration*
*Context gathered: 2026-05-15*

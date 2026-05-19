# Phase 3: Gated Content and Trust Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-19
**Phase:** 3-gated-content-and-trust-infrastructure
**Areas discussed:** Formato de la página regulatoria, Ubicación del video, Estrategia para contenido pendiente, Integración en la navegación

---

## Formato de la página regulatoria (BRAND-02)

| Option | Description | Selected |
|--------|-------------|----------|
| Pasos numerados | Proceso secuencial: 1. Exención ADR, 2. Importación/Aduanas, 3. Blue Slip, 4. Registro | |
| Prosa editorial | Mismo estilo que About — narrativa fluida, emocional | |
| FAQ | Preguntas y respuestas sobre dudas comunes del comprador | |
| Híbrido: intro + pasos | Apertura editorial corta seguida de los 4 pasos numerados | |

**User's choice:** Híbrido + FAQ (intro editorial + pasos numerados + FAQ con accordion al final)

**Notes:** FAQ accordion dentro de la misma página `/import`, no separado. Tono orientativo e informativo — "nosotros lo gestionamos, esto es lo que pasa" — sin cifras exactas que puedan quedar desactualizadas.

---

## Ubicación del video (BIKE-05)

| Option | Description | Selected |
|--------|-------------|----------|
| En cada listing de bike | Video específico por bike en /bikes/[id] | |
| Una vez en About | Un solo video del proceso general en /about | ✓ (default) |
| Página dedicada /build | Nueva ruta solo para el video | |
| Componente condicional | Render solo si hay videoUrl en datos de bike | |

**User's choice:** El video es storytelling de marca (Alfonso en el taller, motos terminadas), no documentación técnica por bike. No sabe con certeza si usará video. Quiere que sea fácil de activar cuando/si decide usarlo.

**Notes:** El usuario aclaró que el video no es parte del configurador, es contenido de marca. Decisión final: componente opcional condicional — renderiza solo cuando hay `videoUrl` definido. Placement default: About page. Puede moverse al homepage o ruta dedicada una vez visto en contexto. Plataforma TBD (Alfonso aún no ha grabado el video).

---

## Estrategia para contenido pendiente

| Option | Description | Selected |
|--------|-------------|----------|
| Páginas completas con placeholders | Estructura lista, texto de relleno, navegable desde ya | |
| Solo rutas stub mínimas | "Coming soon", mínimo esfuerzo, máxima flexibilidad | ✓ |
| Nada hasta que haya contenido | Phase 3 no se ejecuta hasta tener texto + video | |

**User's choice:** Stubs mínimos para /import + componente condicional para video.

**Notes:** /import era siempre un sí, sin dudas. El video es la incógnita. La solución es: construir /import con placeholder text (estructura completa), y el video como componente de 5 líneas que no aparece hasta que haya URL. Activación del video: una línea de código.

Pregunta sobre visibilidad en producción reencauzada: /import se construye como página completa con placeholder, visible en dev, linkada en nav cuando esté lista para publicar con contenido real verificado.

---

## Integración en la navegación

| Option | Description | Selected |
|--------|-------------|----------|
| Nav principal (header) | Visible en todas las páginas junto a About y Contact | ✓ |
| Footer solamente | Presente pero no prominente | |
| Ambos: header + footer | Máxima visibilidad | |

**User's choice:** Nav principal (header). Label: "How it gets to you".

**Notes:** Primera respuesta fue "footer" pero fue un error — el usuario confirmó que quería nav header. Label elegido: "How it gets to you" (voz de marca, responde la pregunta implícita del comprador).

---

## Claude's Discretion

- Acordeón para FAQ: usar shadcn/ui Accordion (ya instalado)
- Profundidad del placeholder content para /import: suficiente para validar estructura (3-5 frases por paso, 3-5 entradas FAQ)
- Render strategy para /import: static page con default static render

## Deferred Ideas

- **Multilingual (ES + EN):** El usuario preguntó sobre la dificultad de añadir versiones en español e inglés. Estimación: 6/10 con Next.js App Router i18n. Pendiente para una fase futura cuando el sitio esté validado y el contenido final exista en ambos idiomas.

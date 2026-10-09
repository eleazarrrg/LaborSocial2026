# Decisiones de arquitectura (ADR)

Una decisión por archivo, con la alternativa que se descartó y el motivo. Si un ADR no dice
claramente qué se descartó, no sirve.

Estos documentos explican **por qué** el proyecto está hecho así. Lo que el sistema tiene que hacer
está en [`../01-srs.md`](../01-srs.md); las reglas que no se negocian, en
[`../../CLAUDE.md`](../../CLAUDE.md); la evidencia con precios y fuentes, en
[`../anexos/investigacion-tecnica-2026-09-06.md`](../anexos/investigacion-tecnica-2026-09-06.md).

## Las decisiones

| # | Decisión | Qué decide | Estado |
|---|---|---|---|
| 0001 | [Framework: Next.js 16 con App Router](./0001-framework-nextjs.md) | Un solo framework para el sitio público, el panel y los endpoints de servidor, en lugar de Astro, una SPA sin SSR o WordPress. | Aceptada |
| 0002 | [n8n como capa de automatización](./0002-n8n-como-capa-de-automatizacion.md) | El dato se escribe en PostgreSQL de forma síncrona y la automatización reacciona después: n8n nunca es el backend de petición-respuesta. | Aceptada |
| 0003 | [Feed de Instagram](./0003-feed-instagram.md) | Behold.so gratuito, leído desde el servidor y cacheado, con interruptor por publicación en el panel, en lugar de la API de Meta a mano o un widget embebido. | Aceptada |
| 0004 | [Agendamiento por solicitud](./0004-agendamiento-por-solicitud.md) | v1 recibe solicitudes de cita, no reservas: sin calendario de disponibilidad y sin bloqueo de doble reserva. | Aceptada |
| 0005 | [Donaciones sin pasarela en v1](./0005-donaciones-sin-pasarela-en-v1.md) | Alias y QR de Yappy Comercial más datos de transferencia copiables; el sitio nunca toca datos de tarjeta. | Aceptada |
| 0006 | [Contenido en base de datos](./0006-contenido-en-base-de-datos.md) | El contenido vive en PostgreSQL y se consulta en tiempo de ejecución, no en Markdown dentro del repositorio; a cambio, el respaldo periódico deja de ser opcional. | Aceptada |
| 0007 | [Payload CMS y DigitalOcean](./0007-payload-y-digitalocean.md) | El CMS es Payload dentro de la misma app Next.js, con segundo factor obligatorio; el hosting, la base y las imágenes van en DigitalOcean, con Cloudflare delante. Reemplaza a Supabase, Vercel y el papel de n8n en los avisos. | Aceptada |

## Cómo se leen entre ellas

La decisión central es la **0002**. Las demás dependen de que exista un servidor propio donde escribir
antes de automatizar: por eso la **0001** elige un framework con endpoints, y por eso la **0006** puede
poner el contenido en la misma base sin duplicar infraestructura. La **0004** y la **0005** son la
misma idea aplicada al alcance: no construir en v1 las dos piezas más caras de mantener —un motor de
reservas y una pasarela de pago— cuando nadie va a quedarse a mantenerlas.

## Formato

```
# ADR-000X: <título>
Estado: Aceptada | Fecha: <fecha> | Decide: <quién>
## Contexto
## Decisión
## Alternativas consideradas   (tabla: opción, a favor, en contra, por qué se descartó)
## Consecuencias               (separadas en «lo que ganamos» y «lo que aceptamos»)
## Cuándo reconsiderar esta decisión
```

## Reglas

- **Un ADR no se edita para cambiar de opinión.** Se escribe uno nuevo que lo sustituya y el viejo
  pasa a `Estado: Sustituida por ADR-000Y`. El registro de por qué se pensó distinto vale tanto como
  la decisión vigente.
- **Toda decisión cita su origen** con el código del hecho o del requisito: O-04, P-02, S-01, R-09,
  C-06, X-01, RF-07, HU-13.
- **Lo que no se sabe se marca**, con los mismos estados que
  [`../00-fuentes/hechos-verificados.md`](../00-fuentes/hechos-verificados.md): ✅ Confirmado,
  🟡 Inferido, 🔴 Pendiente.
- **Un dato, un lugar.** Los precios viven en [`../05-stack-y-presupuesto.md`](../05-stack-y-presupuesto.md),
  el esquema en [`../07-modelo-datos.md`](../07-modelo-datos.md) y las fechas en
  [`../08-plan-de-trabajo.md`](../08-plan-de-trabajo.md). Aquí se enlaza; no se copian cifras, salvo
  la comparación que **es** el argumento de la decisión.

# ADR-0001: Next.js 16 con App Router como framework

Estado: Aceptada | Fecha: 6 de septiembre de 2026 | Decide: equipo de desarrollo

## Contexto

Esto no es un sitio de contenido. Son **dos aplicaciones sobre la misma base de datos**
([`../01-srs.md`](../01-srs.md) §2.3): un sitio público que Google tiene que indexar (RF-14) y un
panel administrativo con sesión, segundo factor, editor de texto enriquecido, subida de imágenes y
seis bandejas de solicitudes (módulos 3.2.1 a 3.2.8). El panel es una aplicación React completa, no
un formulario de configuración.

Hacen falta endpoints de servidor de verdad. RF-02 exige validar la solicitud de cita y escribirla en
Postgres de forma síncrona **antes** de disparar cualquier correo. La clave de servicio de Supabase
solo puede vivir en el servidor (SRS §6.1). Y si algún día entra el Botón de Pago Yappy V2, hace
falta un endpoint IPN que valide HMAC-SHA256 (ver [`0005-donaciones-sin-pasarela-en-v1.md`](./0005-donaciones-sin-pasarela-en-v1.md)).

El equipo sabe React y se retira después de la entrega (X-01). Un stack que el equipo domina hoy vale
más que uno teóricamente mejor que nadie domina.

La investigación técnica recomendó otra cosa: Astro 6 para el sitio público, con el contenido en
Markdown dentro del repositorio ([`../anexos/investigacion-tecnica-2026-09-06.md`](../anexos/investigacion-tecnica-2026-09-06.md),
frente `stack-cms`). Esa recomendación se descarta aquí y en
[`0006-contenido-en-base-de-datos.md`](./0006-contenido-en-base-de-datos.md), y se explica por qué.

## Decisión

**Next.js 16 con App Router y TypeScript estricto**, para el sitio público, el panel y los endpoints,
en un solo repositorio y un solo despliegue.

Server Components por defecto. `'use client'` solo donde hay estado o eventos, y lo más abajo posible
en el árbol ([`../../CLAUDE.md`](../../CLAUDE.md) §6). Esa disciplina no es una recomendación: es lo
que compensa la desventaja de arranque frente a Astro y lo que hace alcanzable el AC-08.

## Alternativas consideradas

| Opción | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Astro 6** | Comparativas de 2026 miden ~9 KB de JS frente a ~463 KB de Next.js en sitios de documentación equivalentes. Mejores Core Web Vitals sin trabajo extra, y eso es señal de ranking. Compila a HTML estático: no hay servidor Node que parchear. | Optimiza el caso que aquí es minoritario. El panel sigue necesitando una aplicación React con estado, sesión y formularios complejos. Los endpoints se resuelven con Astro Actions o Workers, pero es infraestructura aparte. | El sitio público es la mitad del trabajo, no el todo. Astro gana en la mitad y no resuelve la otra. |
| **Astro para el público + aplicación React aparte para el panel** | Cada mitad con la herramienta ideal. El público queda estático y rapidísimo. | Dos paradigmas, dos configuraciones, dos despliegues, dos formas de leer Supabase y dos lugares donde vive el esquema de validación de Zod. Cuatro estudiantes con plazo de servicio social sosteniendo dos bases de código. | El costo de coordinación se paga durante todo el proyecto para ganar milisegundos en la mitad pública. |
| **React + Vite sin SSR (SPA)** | Lo más familiar para el equipo. Un solo modelo mental, sin servidor. | El contenido se renderiza después de cargar JavaScript: indexación de segunda pasada, lenta e inconsistente, y los metadatos por página hay que inyectarlos en cliente. | Es la peor opción posible para el objetivo del proyecto. El sitio existe para que alguien que busca «ayuda psicológica» en Panamá encuentre a REFUVA (R-01, RF-14). Descartada sin discusión. |
| **WordPress** | Edwin podría editar el día uno. Ecosistema enorme, cualquiera lo mantiene. | Cerca del 90% de los ataques a WordPress entran por plugins o temas desactualizados; el mantenimiento profesional en 2026-2027 se cotiza entre 50 y 170 EUR al mes. El panel de solicitudes de cita seguiría siendo desarrollo a medida. | Un WordPress sin nadie que aplique parches es un sitio comprometido, y ese es exactamente el escenario post-entrega (X-01). Además es la opción más cara a tres años. |

## Consecuencias

**Lo que ganamos**

- Un modelo mental, un `npm run dev`, un `npm run build`, un despliegue.
- Server Actions y Route Handlers en el mismo proyecto: el orden síncrono que exige RF-02 y la regla
  de [`0002-n8n-como-capa-de-automatizacion.md`](./0002-n8n-como-capa-de-automatizacion.md) se
  implementan sin infraestructura adicional.
- El mismo esquema de Zod validando en cliente y en servidor, escrito una sola vez.
- `next/image` con `width` y `height` obligatorios: el sitio va lleno de fotos de evidencia y el CLS
  es el riesgo obvio (CLAUDE.md §5.4).
- SEO por Server Components sin trabajo especial: metadatos por página, `sitemap.xml`, datos
  estructurados y URLs legibles en español (RF-14).

**Lo que aceptamos**

- **Más JavaScript de base que Astro.** El AC-08 (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 en el
  percentil 75) deja de ser gratis y pasa a ser trabajo explícito de cada pantalla.
- Un runtime de servidor que se actualiza, en vez de HTML estático que no se rompe nunca.
- Next.js 16 salió el 22 de octubre de 2025 y su fin de soporte de seguridad está proyectado al
  **22 de octubre de 2027**. Dentro de la vida útil del sitio, alguien tendrá que actualizarlo. Eso
  va al calendario de [`../09-operacion-y-traspaso.md`](../09-operacion-y-traspaso.md), no a la
  buena voluntad.
- `middleware.ts` se renombró a `proxy.ts` en la 16. Cualquier tutorial anterior induce a error.
- La disciplina de Server Components hay que sostenerla en revisión de código. Si se relaja, el
  argumento de rendimiento de Astro se vuelve cierto y esta decisión queda mal.

## Cuándo reconsiderar esta decisión

- **Si el panel administrativo deja de existir** o se sustituye por una herramienta de terceros.
  Desaparecido el panel, desaparece el argumento principal y Astro pasa a ser la mejor opción.
- **Si el informe de campo de Core Web Vitals de Search Console muestra LCP > 2.5 s en el percentil
  75 en móvil** después de haber aplicado las optimizaciones de rigor. Entonces el problema es el
  framework y no la implementación.
- **El 22 de octubre de 2027**, cuando termine el soporte de seguridad proyectado de la rama 16. Esa
  fecha se revisa, no se espera a que llegue.

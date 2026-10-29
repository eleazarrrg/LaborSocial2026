# Plan: panel más usable, SEO/AEO con zona de evaluación y medición de visitas

> Escrito el 28 de octubre de 2026 con mediciones reales del sitio desplegado en
> `https://refuva.netlify.app`. «CEO» en la petición original se entendió como **SEO**. La medición
> de visitas está autorizada por `CLAUDE.md` §5.2 («Medición de visitas»), con sus límites.

## 1. Lo que se midió (estado de hoy)

| Área | Resultado | Cómo se midió |
|---|---|---|
| Accesibilidad | **100** | Lighthouse móvil, producción |
| Buenas prácticas | **96** | Lighthouse móvil, producción |
| SEO (Lighthouse) | **63** | Falla **solo** `is-crawlable`: el sitio lleva `noindex` a propósito |
| Consola del navegador | **1 error**: React #418 (hidratación) en todas las páginas de Netlify | Lighthouse + consola. **No se reproduce en local**; causa sin determinar (ver §2) |
| `robots.txt`, `sitemap.xml`, `llms.txt` | **404** los tres | `curl` |
| Imagen para compartir (Open Graph) | **404**, y no hay etiquetas `og:*` | `curl` |
| Datos estructurados (JSON-LD) | **0** | HTML de la portada |
| Etiqueta `canonical` | **no hay** | HTML de la portada |
| Títulos y descripciones | **bien**: únicos por página, `lang="es-PA"`, 1 `h1`, sin `<img>` sin `alt` | HTML de 7 páginas |
| Medición de visitas | **ninguna instalada** | Código y `/privacidad` |
| Panel: organización | 3 grupos (Contenido, Solicitudes, Sistema), 2 bloques de bienvenida, sin marca propia | Código en `src/payload/` |
| Rendimiento en producción | **No medido** (la prueba de Lighthouse excluyó Rendimiento). Solo se vio la respuesta del servidor: 0.5 a 3.4 s en frío, 14 a 300 ms en caliente | `curl` y registros de la función |

**No medido y que hay que medir:** Core Web Vitals reales (LCP, INP, CLS) de visitantes; el aspecto del panel con
una sesión real (el segundo factor lo activa una persona de la fundación); si Cloudflare Web Analytics
usa cookies o guarda IP (la documentación consultada no lo dice).

## 2. Pendientes de operación (la Fase 0 original se retiró)

Hecho el 28-10-2026: entrada a `/admin` y segundo factor activo.

1. Rotar lo que pasó por el chat: contraseña de la base, llaves de Storage, clave de Resend, `PAYLOAD_SECRET`.
2. Decidir cómo evitar que Supabase Free se pause a los 7 días sin actividad (plan de pago o consulta
   diaria desde el hosting, nunca GitHub Actions).
3. **Error de hidratación #418 en producción (abierto).** Aparece en todas las páginas de Netlify, incluida
   `/privacidad` (casi solo texto), y en ninguna prueba local. Descartado el 28-10:
   - Un componente concreto: no aparece en `next dev` con la base conectada ni en `next start` sin base.
   - El comentario `<!-- This site is hosted on Netlify… -->` que Netlify inyecta en el `<head>`: reproducido
     con un proxy local, no provoca el error.
   - El script `/.netlify/scripts/hud` (y su `iframe#nl-badge-frame`) del plan gratuito: reproducido con
     un proxy local, no provoca el error.

   **Impacto:** React recupera la página renderizándola en el cliente; el sitio funciona y Lighthouse da
   accesibilidad 100. Es un costo de rendimiento, no un fallo visible.
   **Siguiente intento:** (a) probar el mismo despliegue en DigitalOcean o con `next start` contra la base
   (distingue si es Netlify o los datos); (b) revisar la respuesta de Netlify con transferencia
   fragmentada (`Transfer-Encoding: chunked`) frente al servidor local.
   *Aceptación:* 0 errores en consola en Lighthouse.

## 3. Fase 1 — Panel más usable (UX medio)

> **Estado (29-10-2026): hecho lo que no dependía de nadie, y verificado con el panel abierto** (base local,
> cuenta de prueba, segundo factor incluido; tema claro y oscuro).
> - **Hecho:** menú por tareas (Bandeja → Publicar → Sistema); inicio con saludo, cuatro acciones y «Primeros
>   pasos» para cuentas de menos de 30 días; logo de la fundación en la entrada y el menú; ayudas en lenguaje
>   llano (proyectos, convocatorias, usuarios, preguntas); botón de vista previa en proyectos y noticias
>   (solo si están visibles/publicadas); columna «Visible / Oculta» en lugar de «verdadero»; tarjeta «Salud del sitio».
> - **Medido:** contraste mínimo 10.45:1 en oscuro y 7.23:1 en claro (exigido 4.5:1); botones de 44 px o más;
>   texto de ayuda de 13 px o más (la base del panel es de 13 px); títulos al mismo tamaño que los de Payload.
> - **Pendiente:** la **prueba con tres personas** (publicar y ocultar una noticia en menos de 3 minutos, sin ayuda).
>   Es lo único que confirma si el panel es de verdad más fácil; sin ella la mejora es una apuesta informada.
> - **Limitación conocida:** a 390 px aparece un desborde de 17 px que viene del menú lateral oculto de Payload,
>   no de los componentes propios.

El panel es de Payload (React y estilos propios, no Tailwind): se personaliza con variables CSS, textos,
agrupación y componentes propios. No se rehace desde cero.

| Cambio | Tamaño | Detalle |
|---|---|---|
| **Menú por tareas, no por tablas** | S | Grupos: «Bandeja» (citas, voluntariado, padrinos, mensajes, cuarentena), «Publicar» (proyectos, noticias, eventos, imágenes, convocatorias), «Medición y SEO», «Sistema». |
| **Inicio del panel con tarjetas de acción** | M | «Pendientes por atender», «Publicar algo nuevo», «Salud del sitio» (ver Fase 2). Reutiliza `resumen-bandeja` y `aviso-fotos`. |
| **Marca de la fundación** | S | Logo, ícono y colores por variables CSS en una hoja `admin.css`. Contraste AA en ambos temas. |
| **Formularios de contenido en lenguaje llano** | M | Una ayuda por campo, ejemplos, límites de caracteres visibles, campos técnicos ocultos al rol de edición. |
| **Botón «Ver en el sitio»** en proyectos y noticias | S | Para comprobar lo publicado sin salir del panel. |
| **Vista reducida para el rol de edición** | S | Solo «Publicar»; nunca ve la bandeja (ya se cumple en permisos; falta ocultarlo del menú). |
| **Tarjeta «Primeros pasos» por rol** | S | Tres pasos: activar el segundo factor, cambiar contraseña, publicar una noticia de prueba. |

*Aceptación:* una persona que nunca vio el panel **publica y luego oculta una noticia en menos de 3 minutos, sin
ayuda**, y encuentra una solicitud pendiente en menos de 1 minuto. Se prueba con 3 personas. Criterios de
`ui-ux-pro-max`: contraste 4.5:1, foco visible, objetivos táctiles de 24 px o más.

## 4. Fase 2 — SEO y AEO con zona de evaluación

> **Estado (28-10-2026):** hecho `robots`, `sitemap`, interruptor `INDEXAR`, `canonical`, Open Graph/Twitter con
> imagen de la fundación, JSON-LD (`NGO`, `WebSite`, `BreadcrumbList`) y la tarjeta «Salud del sitio».
> Con `INDEXAR=true` Lighthouse móvil da **SEO 100** en local. **Pendiente:** `FAQPage` (necesita las preguntas
> de Edwin), `Event` y `DonateAction` (donar no tiene una dirección de pago propia: es Yappy o transferencia),
> y Search Console / Bing (cuentas de la fundación).

**AEO** (que los asistentes y buscadores con respuestas directas citen bien a la fundación): datos
estructurados, nombre y datos consistentes en todo el sitio, y respuestas cortas y verificables en las
páginas clave. `llms.txt` se puede añadir, pero **no hay evidencia sólida** de que alguien lo use; no es prioridad.

### En el código
| Entrega | Tamaño |
|---|---|
| `robots.ts` y `sitemap.ts` (el segundo se arma solo con el catálogo y las noticias publicadas) | S |
| Interruptor `INDEXAR=true` (variable de entorno) que quita el `noindex` el día del lanzamiento, sin cambiar código | S |
| Metadatos por página: `canonical`, Open Graph y tarjeta de Twitter, con imagen generada (`opengraph-image`) | M |
| JSON-LD: `NGO`/`Organization` y `WebSite` (portada), `BreadcrumbList` (proyectos), `Event` (eventos), `DonateAction` (donar) | M |
| `FAQPage` en citas, donar y voluntariado, con preguntas reales (las aporta Edwin) | S |

### En el panel: «Salud del sitio»
Una tarjeta en el inicio, calculada con la base (sin servicios externos), que muestra:
- si el sitio está indexable o en `noindex`;
- proyectos y noticias sin descripción, sin foto o con descripción de más de 160 caracteres;
- fotos sin texto alternativo;
- enlaces para corregir cada cosa.

Dentro de cada proyecto y noticia, campos opcionales «Título para buscadores», «Descripción» e «Imagen al compartir».

### Fuera del código (a nombre de la fundación)
Google Search Console y Bing Webmaster (verificación por DNS y envío del sitemap) y Google Business Profile.
Los programas de donación de publicidad solo si se aprueban (`CLAUDE.md` §3).

*Aceptación (después de quitar `noindex`):* Lighthouse SEO **95 o más**; `sitemap.xml` con el mismo número de
URL que páginas públicas; JSON-LD sin errores en la Prueba de resultados enriquecidos de Google; todas las
páginas con `canonical` y vista previa al compartir.

## 5. Fase 3 — Medición de visitas

Reglas en `CLAUDE.md` §5.2: se mide la visita, no a la persona; nada se vende; sin IP en claro; detalle
crudo máximo 90 días; el texto de `/privacidad` se actualiza **antes** de activarla.

1. Crear la cuenta de **Cloudflare Web Analytics** con el correo de la fundación y segundo factor. Añadir el
   sitio y copiar el *token* del script (no es secreto).
2. Conectarlo en el layout público con `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`: apagado si no hay token y **nunca en `/admin`**.
3. Actualizar «Cookies y medición» en `/privacidad` con lo que se mide, el motivo y los plazos. Revisión de un asesor legal antes de publicar.
4. **Verificar antes de activar** si usa cookies o guarda IP, y reflejarlo en el texto.
5. Rutina mensual: exportar las cifras a una hoja (el panel de Cloudflare conserva 6 meses).
6. En el panel, tarjeta «Solicitudes por mes y por tipo»: sale de datos que ya existen, sin nuevo seguimiento.

*Qué responderá:* visitas por día y mes, páginas más vistas, origen (Instagram, Google, WhatsApp), país y
dispositivo, y Core Web Vitals de visitantes reales.
*Un registro propio de visitas dentro del panel* queda **fuera** hasta que haga falta; si se pide, debe cumplir §5.2.

## 6. Fase 4 — Traspaso

Todo lo anterior se documenta en `docs/09-operacion-y-traspaso.md` con responsable con nombre: quién revisa
«Salud del sitio» cada mes, quién exporta las cifras, quién renueva el dominio y quién atiende la bandeja.

## 7. Orden recomendado y decisiones pendientes

**Orden:** pendientes de operación → Fase 2 (código; es lo que más rinde y no depende de nadie) → Fase 3 (en cuanto exista la
cuenta de Cloudflare) → Fase 1 → Fase 4.

| Decisión | Quién | Para cuándo |
|---|---|---|
| Fecha del lanzamiento (día de quitar `noindex`) | Edwin | Antes de Fase 2 |
| Cuenta de Cloudflare y Search Console a nombre de la fundación | Edwin / quien administre | Antes de Fase 3 |
| Compra del dominio `refuva.org` | Edwin | Antes del lanzamiento |
| Tres personas para la prueba de usabilidad del panel | Edwin | **Ya** (Fase 1 construida) |
| Revisar las 18 preguntas frecuentes que se sembraron por defecto (son un punto de partida) | Edwin | Antes del lanzamiento |
| Asesor legal que revise `/privacidad` | Fundación | Antes de activar la medición |

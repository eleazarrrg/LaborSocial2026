# ADR-0007: Payload CMS dentro de Next.js, alojado en DigitalOcean

Estado: Aceptada | Fecha: 8 de octubre de 2026 | Decide: equipo de desarrollo, con la fundación

Reemplaza: la parte de Supabase de [`0006-contenido-en-base-de-datos.md`](./0006-contenido-en-base-de-datos.md)
y el papel de n8n en los avisos de [`0002-n8n-como-capa-de-automatizacion.md`](./0002-n8n-como-capa-de-automatizacion.md).

## Contexto

En octubre de 2026 cambiaron cuatro cosas:

1. **La fundación pidió «todo en un solo lugar»**: un proveedor, una factura, que Edwin pueda
   administrar sin depender de nosotros.
2. **Pidió un CMS «tipo Wix»**: cambiar textos, imágenes, proyectos y noticias, con el diseño
   bloqueado para que no se rompan la marca ni la accesibilidad.
3. **El plan gratuito de Vercel prohíbe pedir donaciones** (las trata como uso comercial), y el plan
   gratuito de Supabase se pausa a los 7 días y no da respaldos recuperables. El «costo cero» de
   [`../05-stack-y-presupuesto.md`](../05-stack-y-presupuesto.md) no se sostenía.
4. **Se pidió acceso por MCP de Claude** para configurar el hosting y el contenido.

El esquema de Supabase (migraciones con RLS, panel hecho a mano) nunca llegó a aplicarse en un
proyecto real, así que cambiar no costaba datos.

## Decisión

- **Payload CMS 3** dentro de la misma aplicación Next.js. El panel vive en `/admin`; el sitio
  público en el grupo de rutas `(sitio)`. Un repositorio, un despliegue.
- **Segundo factor obligatorio** con `payload-totp` (`forceSetup`): sin el código del teléfono no se
  lee ninguna solicitud, ni por el panel ni por la API.
- **Hosting en DigitalOcean**: App Platform (servidor gestionado), Managed PostgreSQL en red privada y,
  para el CMS completo, Spaces para las imágenes. Cloudflare delante (WAF, DDoS, límite de intentos).
- **Avisos por correo desde la propia aplicación** (ganchos de Payload + Resend). n8n sale del
  camino crítico: deja de ser necesario para la v1.

## Por qué, frente a las alternativas

| Alternativa | Por qué no |
|---|---|
| Seguir con Supabase + Vercel y un CMS hecho a mano | Dos proveedores; Vercel Pro obligatorio por las donaciones; y el CMS había que construirlo entero. Además la base queda expuesta por la API pública y toda la seguridad depende de que cada política RLS esté perfecta. |
| Payload en Railway | Funciona y tiene MCP, pero su modelo de seguridad y de respaldos es menos maduro para datos de salud mental. |
| Un VPS propio (servidor «como tal») con Coolify | Más barato, pero alguien tiene que parcharlo cada semana. El equipo se va (CLAUDE.md §5.3) y la fundación no tiene a nadie técnico: es la forma más común de que hackeen el sitio de una ONG. |
| Wix de verdad | Edwin lo manejaría solo, pero se perderían los formularios con datos sensibles bajo control propio, las reglas de crisis y el trabajo de accesibilidad. |

## Consecuencias

**Mejora la seguridad:**
- La base de datos **no tiene API pública**: solo la aplicación se conecta, por red privada y con SSL
  verificado contra el CA de DigitalOcean.
- Los permisos viven en código revisable (`src/payload/acceso.ts`). Las solicitudes no se pueden crear
  por la API, solo leer y cambiar de estado por administración con segundo factor; lo que escribió la
  persona es inmutable; la bitácora no se puede editar ni borrar. Todo probado en local el 8-10-2026.
- RLS queda activo y sin políticas en todas las tablas como segunda defensa: la aplicación es dueña de
  las tablas; cualquier otro rol que se cree en el futuro no ve nada.

**Cambia el costo:** de casi B/.0.00 a unos B/.20.15–32.15 al mes. Ver
[`../12-presupuesto-hosting.md`](../12-presupuesto-hosting.md).

**Cambia la forma de trabajar:**
- Las migraciones viven en `src/migrations/` y las genera Payload (`npx payload migrate:create`). Una
  migración aplicada no se edita. Las que creen tablas repiten el bloque que activa RLS.
- En local, `npm run db:local` levanta un Postgres real sin Docker.
- `payload-totp` es un plugin de la comunidad, no oficial. Está fijado a una versión; si algún día se
  abandona, el reemplazo es un segundo paso propio con `otpauth`, la misma librería que usa.

**Queda pendiente (fase 2):** el CMS completo (páginas por bloques, proyectos, noticias, imágenes),
Spaces y el respaldo semanal propio con `pg_dump` hacia Spaces.

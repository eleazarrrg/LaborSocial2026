# Demo temporal sobre Supabase + Vercel

> **Es un andamio para presentar, no la entrega.** La entrega sigue siendo DigitalOcean
> (`docs/09` §5.0, `docs/12`). Cuentas del demo: se borran cuando se pase a DigitalOcean.
> **Ningún secreto va en este archivo ni en el chat.** Los valores se escriben en `.env.demo`
> (ignorado por git) y en el panel de Vercel.

## Qué hace cada pieza

| Pieza | Dónde vive en el demo | Dónde vivirá en la entrega |
|---|---|---|
| Aplicación (Next.js + panel) | **Vercel** (Hobby, gratis; solo para demo, no uso comercial) | DigitalOcean App Platform |
| Base de datos | **Supabase** Postgres | DigitalOcean Managed PostgreSQL |
| Fotos | **Supabase Storage** (compatible con S3) | DigitalOcean Spaces |

Supabase no ejecuta Next.js: por eso la app va en Vercel. El código es el mismo; solo cambian variables.

## 1. Supabase (una vez)

1. Proyecto nuevo, región **East US (North Virginia)**, con una contraseña de base larga (guárdala en un gestor).
2. **Storage → New bucket:** nombre `refuva-medios`, marcado **Public**.
3. **Storage → S3 Configuration → New access key:** copia el *Access key ID* y el *Secret* (se muestran una sola vez).
4. **Project Settings → Database → SSL Configuration → Download certificate:** guarda el archivo `.crt`.
5. **Connect** (botón arriba): copia dos cadenas del **Shared pooler**:
   - **Session mode** (puerto 5432), para migrar y sembrar desde tu computador.
   - **Transaction mode** (puerto 6543), para Vercel.

## 2. `.env.demo` en la raíz del repo (ignorado por git)

```
DATABASE_URL="<cadena Session pooler, puerto 5432, ...?sslmode=require>"
PAYLOAD_SECRET="<texto aleatorio de 40+ caracteres>"
NEXT_PUBLIC_SERVER_URL="https://<nombre-del-proyecto-vercel>.vercel.app"
SPACES_BUCKET="refuva-medios"
SPACES_REGION="us-east-1"
SPACES_ENDPOINT="https://<project-ref>.storage.supabase.co/storage/v1/s3"
SPACES_KEY="<Access key ID>"
SPACES_SECRET="<Secret>"
SPACES_PUBLIC_URL="https://<project-ref>.supabase.co/storage/v1/object/public/refuva-medios"
```

## 3. Cargar la base desde tu computador (una vez)

```bash
npm run demo:migrar     # crea las tablas, con RLS activo en todas
npm run demo:sembrar    # catálogo oficial + 15 fotos de referencia (suben a Supabase Storage)
npm run demo:admin      # tu cuenta de administración; pide contraseña en la consola
```

## 4. Vercel

Importar el repositorio `eleazarrrg/LaborSocial2026`. Variables de entorno (todas en *Production*):

| Variable | Valor |
|---|---|
| `DATABASE_URL` | cadena **Transaction mode** (puerto 6543) |
| `DATABASE_POOL_MAX` | `1` |
| `DATABASE_CA_CERT` | el contenido completo del `.crt` de Supabase |
| `PAYLOAD_SECRET` | el mismo que en `.env.demo` |
| `NEXT_PUBLIC_SERVER_URL` | `https://<nombre-del-proyecto>.vercel.app` |
| `SPACES_BUCKET`, `SPACES_REGION`, `SPACES_ENDPOINT`, `SPACES_KEY`, `SPACES_SECRET`, `SPACES_PUBLIC_URL` | los mismos que en `.env.demo` |
| `AVISOS_CORREO` | un correo real que controles (el demo no lo usa para nada más) |
| `RESEND_API_KEY` | una llave de Resend, o cualquier texto en el demo: los correos fallarán a la vista en el registro y las solicitudes quedarán con «aviso no enviado», que es justo el comportamiento diseñado |
| `CORREO_REMITENTE` | `avisos@refuva.org` (no se usa sin Resend) |

Después de desplegar: entra a `/admin`, inicia sesión con la cuenta de `demo:admin` y activa el segundo factor
con una app de autenticación (obligatorio, no se puede saltar).

## Para recordar el día de la presentación

- Las fotos son **de referencia**: el panel muestra el aviso. Es parte de la historia («Edwin las cambia en el panel»).
- Vercel Hobby duerme las funciones: la primera visita puede tardar unos segundos. Ábrelo antes de presentar.
- Nada de esto reemplaza el paso a DigitalOcean: cuentas a nombre de la fundación, dominio `refuva.org`, Spaces, Resend.

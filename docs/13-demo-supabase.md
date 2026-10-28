# Demo local sobre Supabase

> **Es un andamio para presentar, no la entrega.** La entrega sigue siendo DigitalOcean
> (`docs/09` §5.0, `docs/12`). **Ningún secreto va en este archivo ni en el chat**: los valores
> van solo en `.env.demo`, que git ignora.

## Qué hace cada pieza

| Pieza | En el demo | En la entrega |
|---|---|---|
| Aplicación (Next.js + panel) | **Tu computador** (`npm run demo:dev`, http://localhost:3000) | DigitalOcean App Platform |
| Base de datos | **Supabase** Postgres | DigitalOcean Managed PostgreSQL |
| Fotos | **Supabase Storage** (compatible con S3) | DigitalOcean Spaces |

El código es el mismo; cambian solo las variables. Referencia del proyecto: `xdkkdpambibfptuwqdhz`.

## 1. En Supabase (una vez)

1. **Storage → New bucket:** nombre `refuva-medios`, marcado **Public**.
2. **Storage → S3 Configuration → New access key:** copia el *Access key ID* y el *Secret* (se muestran una sola vez).
3. **Connect → Shared pooler → Session mode** (puerto 5432): copia la cadena de conexión y reemplaza la contraseña
   por la de la base. Si no la recuerdas: Project Settings → Database → Reset database password.

## 2. `.env.demo` en la raíz del repo (git lo ignora)

```
DATABASE_URL="<cadena Session pooler, puerto 5432>?sslmode=require"
PAYLOAD_PUSH="false"
PAYLOAD_SECRET="<texto aleatorio de 40+ caracteres>"
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
SPACES_BUCKET="refuva-medios"
SPACES_REGION="us-east-1"
SPACES_ENDPOINT="https://xdkkdpambibfptuwqdhz.storage.supabase.co/storage/v1/s3"
SPACES_KEY="<Access key ID>"
SPACES_SECRET="<Secret>"
SPACES_PUBLIC_URL="https://xdkkdpambibfptuwqdhz.supabase.co/storage/v1/object/public/refuva-medios"
```

`PAYLOAD_PUSH="false"` es obligatorio: sin él, el modo de desarrollo crearía tablas sin RLS y
Supabase las expondría por su API pública. Las tablas se crean **solo** con las migraciones.

## 3. Cargar la base (una vez, en este orden)

```bash
npm run demo:migrar     # crea las tablas, con RLS activo en todas
npm run demo:sembrar    # catálogo oficial + 15 fotos de referencia (suben a Supabase Storage)
npm run demo:admin      # tu cuenta de administración; pide la contraseña en la consola
```

## 4. Presentar

```bash
npm run demo:dev        # sitio en http://localhost:3000 y panel en /admin
```

Detén antes cualquier otro `npm run dev` (solo se permite uno por carpeta). Entra a `/admin` y activa el segundo
factor con una app de autenticación (obligatorio). Los correos se escriben en la consola (sin `RESEND_API_KEY`).

## Para recordar

- Las fotos son **de referencia**: el panel lo avisa. Es parte de la historia: «Edwin las cambia desde aquí».
- Para volver a tu base local de siempre: `npm run dev` (usa `.env.local`).
- Al pasar a DigitalOcean no se migra nada de aquí: se corre `npm run sembrar` en la base nueva.

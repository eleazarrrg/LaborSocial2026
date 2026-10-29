# Despliegue en Netlify + Supabase (híbrido)

> Estado: primera prueba (octubre de 2026). Sustituye a DigitalOcean **solo mientras dure la prueba**;
> el plan de DigitalOcean (`docs/12`, `.do/app.yaml`) sigue vigente como alternativa si Payload no cabe
> o arranca lento en Netlify.

## Qué corre dónde

| Pieza | Dónde |
|---|---|
| App Next.js + panel Payload (`/admin`) | Netlify (Next.js Runtime, funciones) |
| Base de datos | Supabase Postgres, por el **Transaction pooler** (puerto 6543) |
| Fotos | Supabase Storage (S3), bucket público `refuva-medios` |
| Correo transaccional | Resend (prueba: remitente `onboarding@resend.dev`, entrega solo a la cuenta) |

## Variables de entorno (Netlify → Site configuration → Environment variables)

Los valores los pone una persona de la fundación en el panel. **Nunca en el repo ni por chat.**

| Variable | De dónde sale |
|---|---|
| `DATABASE_URL` | Supabase → Connect → Transaction pooler (`:6543`) |
| `DATABASE_POOL_MAX` | `1` (cada función usa una sola conexión) |
| `DATABASE_CA_CERT` | Supabase → Database → SSL Configuration → certificado completo |
| `PAYLOAD_SECRET` | Texto aleatorio de 32+ caracteres, generado por la fundación |
| `NEXT_PUBLIC_SERVER_URL` | La dirección pública del sitio (`https://…`) |
| `PAYLOAD_MIGRAR_AL_ARRANCAR` | `false`: las migraciones se aplican a mano, no al arrancar cada función |
| `SPACES_BUCKET` / `_REGION` / `_ENDPOINT` / `_PUBLIC_URL` | Supabase → Storage → S3 Connection |
| `SPACES_KEY` / `SPACES_SECRET` | Supabase → Storage → New access key (se muestra una vez) |
| `AVISOS_CORREO` | Buzón de la fundación que recibe los avisos |
| `RESEND_API_KEY` / `CORREO_REMITENTE` | Resend → API Keys; remitente verificado |

## Secretos: reglas aprendidas

- Si una clave pasa por un chat, un correo o una captura, **se rota**: contraseña de la base, llaves de
  Storage, clave de Resend y `PAYLOAD_SECRET`.
- El escáner de secretos de Netlify falla el build si el **valor** de una variable aparece en el repo.
  `netlify.toml` excluye solo `SPACES_BUCKET`, `_REGION`, `_ENDPOINT` y `_PUBLIC_URL`, que no son
  secretos. Las demás siguen vigiladas.
- `.env.*` está en `.gitignore`. Una plantilla con valores reales se borra después de importarla.

## Antes del primer despliegue y de cada cambio de esquema

1. `npm run demo:migrar` (o `npx payload migrate`) desde una máquina con `DATABASE_URL` de sesión (5432).
2. Desplegar. Comprobar `/`, `/proyectos` y `/admin` (debe pedir el segundo factor).

## Pendiente

- Confirmar si el plan gratuito de Netlify permite uso comercial/ONG y vigilar los créditos del mes.
- Medir arranque en frío de `/admin` y tamaño de la función antes de comprometerse con Netlify.
- Dominio `refuva.org` + verificación en Resend; Cloudflare delante con rate limiting.
- La caché del CMS expira al guardar en el panel; falta probarlo de extremo a extremo con una sesión real.

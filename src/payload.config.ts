import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { s3Storage } from "@payloadcms/storage-s3";
import { es } from "@payloadcms/translations/languages/es";
import { buildConfig } from "payload";
import sharp from "sharp";
import { payloadTotp } from "payload-totp";
import { Bitacora } from "./payload/colecciones/bitacora";
import { Convocatorias } from "./payload/colecciones/convocatorias";
import { Cuarentena } from "./payload/colecciones/cuarentena";
import { Medios } from "./payload/colecciones/medios";
import { Eventos, Noticias } from "./payload/colecciones/publicaciones";
import { Proyectos } from "./payload/colecciones/proyectos";
import { Fondos } from "./payload/globales/fondos";
import {
  InscripcionesPadrinos,
  InscripcionesVoluntariado,
  MensajesContacto,
  SolicitudesCita,
} from "./payload/colecciones/solicitudes";
import { migrations } from "./migrations";
import { ErrorSeguro } from "./payload/errores";
import { Usuarios } from "./payload/colecciones/usuarios";
import { revalidarAlGuardar } from "./payload/revalidar";
import { sembrarConvocatoria2026 } from "./payload/semillas";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Conexión a Postgres. En DigitalOcean la base exige SSL con un certificado propio: se VERIFICA
 * con su CA (variable DATABASE_CA_CERT = ${db.CA_CERT}), nunca se desactiva la verificación.
 * Se quita `sslmode` de la URL porque, en `pg`, el de la URL reemplazaría al objeto `ssl` y
 * dejaría fuera el CA. En local (sin CA) la conexión va tal cual.
 */
function conexion() {
  const url = process.env.DATABASE_URL ?? "";
  const ca = process.env.DATABASE_CA_CERT;
  // Sin URL (el build de Next, que no toca la base) no hay nada que configurar.
  if (!url || !esProduccion()) return { connectionString: url };
  const sinModo = new URL(url);
  sinModo.searchParams.delete("sslmode");
  // En producción, TLS siempre. Sin el CA, igual se exige un certificado válido: la conexión
  // falla a la vista en lugar de viajar sin cifrar.
  return {
    connectionString: sinModo.toString(),
    ssl: ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: true },
    // En serverless (Vercel) cada instancia usa una sola conexión, para no agotar el pooler.
    ...(process.env.DATABASE_POOL_MAX ? { max: Number(process.env.DATABASE_POOL_MAX) } : {}),
  };
}

const hayAlmacenamiento = () => Boolean(process.env.SPACES_BUCKET && process.env.SPACES_KEY);

/** `next build` también corre con NODE_ENV=production; el servidor real tiene DATABASE_URL. */
const esProduccion = () => process.env.NODE_ENV === "production" && !!process.env.DATABASE_URL;

/**
 * Lo que tiene que estar bien configurado antes de recibir la primera solicitud. Corre al arrancar
 * el servidor (no en el build): si algo falta, el despliegue falla a la vista en DigitalOcean en vez
 * de perder avisos en silencio (CLAUDE.md §6).
 */
function comprobarConfiguracion(): void {
  if (!esProduccion()) return;
  const faltas: string[] = [];
  if ((process.env.PAYLOAD_SECRET ?? "").length < 32) faltas.push("PAYLOAD_SECRET (32+ caracteres)");
  if (!process.env.DATABASE_CA_CERT) faltas.push("DATABASE_CA_CERT");
  if (!/^https:\/\//.test(process.env.NEXT_PUBLIC_SERVER_URL ?? "")) faltas.push("NEXT_PUBLIC_SERVER_URL (https)");
  const avisos = process.env.AVISOS_CORREO ?? "";
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(avisos) || /CAMBIAR/i.test(avisos)) {
    faltas.push("AVISOS_CORREO (el buzón real de la fundación)");
  }
  if (!process.env.RESEND_API_KEY) faltas.push("RESEND_API_KEY");
  // Sin Spaces, una foto subida se perdería en el siguiente despliegue.
  for (const v of ["SPACES_BUCKET", "SPACES_KEY", "SPACES_SECRET", "SPACES_REGION", "SPACES_PUBLIC_URL"]) {
    if (!process.env[v]) faltas.push(v);
  }
  // ErrorSeguro: el mensaje solo nombra variables, nunca valores, y quien despliega necesita verlo.
  if (faltas.length) throw new ErrorSeguro(`Configuración incompleta en producción: ${faltas.join(", ")}.`);
}

/**
 * Payload vive dentro de esta misma aplicación Next.js: el panel está en /admin y la base de datos
 * nunca se expone a internet (solo la aplicación se conecta, por red privada en DigitalOcean).
 * Ver docs/adr y docs/12-presupuesto-hosting.md.
 */
export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? "",
  secret: process.env.PAYLOAD_SECRET ?? "",
  admin: {
    user: Usuarios.slug,
    meta: { titleSuffix: " · Panel REFUVA" },
    components: {
      beforeDashboard: [
        "/payload/componentes/aviso-fotos#AvisoFotos",
        "/payload/componentes/resumen-bandeja#ResumenBandeja",
      ],
    },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { supportedLanguages: { es }, fallbackLanguage: "es" },
  // Español como base. El inglés queda en blanco hasta que la fundación entregue la traducción, y
  // mientras tanto el sitio muestra el español (fallback): nunca una página vacía.
  localization: {
    locales: [
      { code: "es", label: "Español" },
      { code: "en", label: "English" },
    ],
    defaultLocale: "es",
    fallback: true,
  },
  sharp,
  // Solo el propio dominio puede usar la API con la sesión (además de la cookie SameSite=Strict).
  csrf: process.env.NEXT_PUBLIC_SERVER_URL ? [process.env.NEXT_PUBLIC_SERVER_URL] : [],
  cors: process.env.NEXT_PUBLIC_SERVER_URL ? [process.env.NEXT_PUBLIC_SERVER_URL] : [],
  // Menos superficie de ataque: el sitio no usa GraphQL.
  graphQL: { disable: true },
  collections: [
    Noticias,
    Eventos,
    Proyectos,
    Medios,
    SolicitudesCita,
    InscripcionesVoluntariado,
    InscripcionesPadrinos,
    MensajesContacto,
    Cuarentena,
    Convocatorias,
    Usuarios,
    Bitacora,
  ],
  globals: [Fondos],
  db: postgresAdapter({
    pool: conexion(),
    // El modo push (esquema automático de desarrollo) SOLO corre contra una base local. Contra una
    // remota (Supabase, DigitalOcean) el esquema lo crean únicamente las migraciones, que activan
    // RLS: el push iguala la base al código y APAGA el RLS. Ya pasó una vez en el demo (28 oct):
    // por eso no depende de que alguien recuerde poner PAYLOAD_PUSH=false.
    push:
      process.env.PAYLOAD_PUSH !== "false" &&
      (!process.env.DATABASE_URL || /@(127\.0\.0\.1|localhost)[:/]/.test(process.env.DATABASE_URL)),
    // En producción el esquema lo crean las migraciones (src/migrations), nunca el modo push de
    // desarrollo. Corren solas al arrancar el servidor.
    // En una plataforma serverless (Netlify) varias instancias arrancan a la vez y no deben migrar
    // todas a la vez: allí PAYLOAD_MIGRAR_AL_ARRANCAR=false y se migra a mano antes de desplegar
    // (`npx payload migrate`). En un servidor único (DigitalOcean) corren solas al arrancar.
    prodMigrations: process.env.PAYLOAD_MIGRAR_AL_ARRANCAR === "false" ? undefined : migrations,
  }),
  // Sin clave de Resend (en desarrollo), Payload escribe los correos en el registro.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.CORREO_REMITENTE ?? "avisos@refuva.org",
        defaultFromName: "Fundación REFUVA",
      })
    : undefined,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  onInit: async (payload) => {
    comprobarConfiguracion();
    await sembrarConvocatoria2026(payload);
  },
  plugins: [
    // Cuando Edwin guarda algo, el sitio expira su caché y lo muestra al instante (ver revalidar.ts).
    revalidarAlGuardar,
    // Las imágenes viven en DigitalOcean Spaces: el disco del servidor se borra en cada despliegue.
    // Sin las variables (desarrollo local), se guardan en .medios-local.
    s3Storage({
      enabled: hayAlmacenamiento(),
      // En otro S3 (Supabase Storage, vía SPACES_ENDPOINT) el bucket ya es público y no se envía ACL.
      acl: process.env.SPACES_ENDPOINT ? undefined : "public-read",
      bucket: process.env.SPACES_BUCKET ?? "",
      collections: {
        medios: {
          // Sin `prefix`: ese campo agrega una columna `prefix` que las migraciones no crean.
          // El bucket es solo de imágenes.
          generateFileURL: ({ filename, prefix }) =>
            `${process.env.SPACES_PUBLIC_URL}/${prefix ? `${prefix}/` : ""}${filename}`,
        },
      },
      config: {
        endpoint: process.env.SPACES_ENDPOINT ?? `https://${process.env.SPACES_REGION ?? "nyc3"}.digitaloceanspaces.com`,
        // Supabase Storage exige direcciones con el bucket en la ruta, no en el subdominio.
        forcePathStyle: Boolean(process.env.SPACES_ENDPOINT),
        region: process.env.SPACES_REGION ?? "nyc3",
        credentials: {
          accessKeyId: process.env.SPACES_KEY ?? "",
          secretAccessKey: process.env.SPACES_SECRET ?? "",
        },
      },
    }),
    // Último a propósito: envuelve los permisos de todas las colecciones (ver su README).
    payloadTotp({
      collection: "usuarios",
      forceSetup: true,
      forceWhiteBackgroundOnQrCode: true,
      totp: { issuer: "Panel REFUVA" },
    }),
  ],
});

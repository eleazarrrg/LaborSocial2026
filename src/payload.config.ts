import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { es } from "@payloadcms/translations/languages/es";
import { buildConfig } from "payload";
import { payloadTotp } from "payload-totp";
import { Bitacora } from "./payload/colecciones/bitacora";
import { Convocatorias } from "./payload/colecciones/convocatorias";
import { Cuarentena } from "./payload/colecciones/cuarentena";
import {
  InscripcionesPadrinos,
  InscripcionesVoluntariado,
  MensajesContacto,
  SolicitudesCita,
} from "./payload/colecciones/solicitudes";
import { migrations } from "./migrations";
import { Usuarios } from "./payload/colecciones/usuarios";
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
  return { connectionString: sinModo.toString(), ssl: ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: true } };
}

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
  if (faltas.length) throw new Error(`Configuración incompleta en producción: ${faltas.join(", ")}.`);
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
      beforeDashboard: ["/payload/componentes/resumen-bandeja#ResumenBandeja"],
    },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { supportedLanguages: { es }, fallbackLanguage: "es" },
  // Solo el propio dominio puede usar la API con la sesión (además de la cookie SameSite=Strict).
  csrf: process.env.NEXT_PUBLIC_SERVER_URL ? [process.env.NEXT_PUBLIC_SERVER_URL] : [],
  cors: process.env.NEXT_PUBLIC_SERVER_URL ? [process.env.NEXT_PUBLIC_SERVER_URL] : [],
  // Menos superficie de ataque: el sitio no usa GraphQL.
  graphQL: { disable: true },
  collections: [
    SolicitudesCita,
    InscripcionesVoluntariado,
    InscripcionesPadrinos,
    MensajesContacto,
    Cuarentena,
    Convocatorias,
    Usuarios,
    Bitacora,
  ],
  db: postgresAdapter({
    pool: conexion(),
    // En producción el esquema lo crean las migraciones (src/migrations), nunca el modo push de
    // desarrollo. Corren solas al arrancar el servidor.
    prodMigrations: migrations,
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
    // Último a propósito: envuelve los permisos de todas las colecciones (ver su README).
    payloadTotp({
      collection: "usuarios",
      forceSetup: true,
      forceWhiteBackgroundOnQrCode: true,
      totp: { issuer: "Panel REFUVA" },
    }),
  ],
});

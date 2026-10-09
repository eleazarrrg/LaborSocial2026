/**
 * Postgres de desarrollo, sin Docker: descarga un Postgres real (embedded-postgres) y lo deja
 * corriendo en el puerto 5433, con los datos en .db-local/ (fuera de git).
 *
 *   npm run db:local          (en una terminal aparte; Ctrl+C lo apaga)
 *
 * En .env.local:
 *   DATABASE_URL=postgres://postgres:local@127.0.0.1:5433/refuva
 *
 * Solo para desarrollo. En producción la base es la gestionada de DigitalOcean.
 */
import { existsSync } from "node:fs";
import EmbeddedPostgres from "embedded-postgres";

const DIRECTORIO = "./.db-local";
const BASE = "refuva";

const pg = new EmbeddedPostgres({
  databaseDir: DIRECTORIO,
  user: "postgres",
  password: "local",
  port: 5433,
  persistent: true,
  // UTF-8 explícito: en Windows, initdb usa WIN1252 por defecto y rechaza «→» o emojis.
  // La base de DigitalOcean ya es UTF-8; esto solo iguala el entorno local.
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
});

if (!existsSync(DIRECTORIO)) await pg.initialise();
await pg.start();
try {
  await pg.createDatabase(BASE);
} catch {
  // Ya existe: es lo normal desde la segunda vez.
}
console.log(`Postgres local listo: postgres://postgres:local@127.0.0.1:5433/${BASE}`);

const apagar = async () => {
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", apagar);
process.on("SIGTERM", apagar);

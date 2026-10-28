// Levanta el sitio local leyendo `.env.demo` (demo contra Supabase, docs/13).
// No sirve `node --env-file` ni `-r`: Next reenvía las opciones de node a su proceso hijo y node las
// rechaza dentro de NODE_OPTIONS. Aquí se cargan las variables y Next arranca como proceso aparte.
import { spawn } from "node:child_process";

process.loadEnvFile(".env.demo");
const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev"], {
  stdio: "inherit",
  env: process.env,
});
next.on("exit", (codigo) => process.exit(codigo ?? 0));

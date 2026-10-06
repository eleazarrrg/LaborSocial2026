/**
 * Prueba la RLS por la API real, como lo haría cualquier visitante: solo con la clave
 * publicable (la que viaja al navegador). Cada tabla con datos de personas tiene que negar
 * la lectura y la escritura. Lo único que se puede leer es `convocatorias`.
 *
 *   npm run probar-rls        (lee NEXT_PUBLIC_SUPABASE_URL y la clave de .env.local)
 *
 * Sale con código 1 si algo queda expuesto.
 */
import { createClient } from "@supabase/supabase-js";

try {
  process.loadEnvFile(".env.local");
} catch {
  // Sin .env.local se usan las variables del entorno, si las hay.
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const clave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !clave) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (.env.local).");
  process.exit(1);
}

const supabase = createClient(url, clave, { auth: { persistSession: false } });

const PRIVADAS = [
  "solicitudes_cita",
  "inscripciones_voluntariado",
  "inscripciones_padrinos",
  "mensajes_contacto",
  "envios_en_cuarentena",
  "bitacora",
  "perfiles",
];

let fallas = 0;
const fallo = (texto) => {
  fallas++;
  console.error(`✗ ${texto}`);
};

for (const tabla of PRIVADAS) {
  const lectura = await supabase.from(tabla).select("*").limit(1);
  // Sin permiso, PostgREST responde con error. Un `data: []` sin error significaría que la
  // tabla está expuesta y solo la RLS la protege: también se cuenta como falla.
  if (!lectura.error) fallo(`${tabla}: se pudo consultar (${lectura.data.length} filas)`);
  else console.log(`✓ ${tabla}: lectura negada (${lectura.error.code})`);

  // Fila vacía a propósito: el permiso se comprueba antes que las columnas y los CHECK.
  const escritura = await supabase.from(tabla).insert({});
  if (!escritura.error) fallo(`${tabla}: se pudo insertar`);
  else if (escritura.error.code !== "42501") {
    fallo(`${tabla}: el insert falló, pero no por permisos (${escritura.error.code} ${escritura.error.message})`);
  } else console.log(`✓ ${tabla}: escritura negada (42501)`);
}

const publica = await supabase.from("convocatorias").select("id, titulo, abre_en, cierra_en");
if (publica.error) fallo(`convocatorias: debía ser legible (${publica.error.message})`);
else console.log(`✓ convocatorias: legible (${publica.data.length} filas)`);

if (fallas) {
  console.error(`\n${fallas} falla(s). Hay datos expuestos: no publiques hasta corregirlo.`);
  process.exit(1);
}
console.log("\nTodo en orden: con la clave pública no se lee ni se escribe nada privado.");

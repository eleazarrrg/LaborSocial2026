import "server-only";
import { createClient } from "@supabase/supabase-js";
import { urlSupabase } from "./entorno";

/**
 * Cliente con la clave SECRET: el rol `service_role`, que se SALTA TODA LA RLS.
 *
 * Se usa solo para lo que el público envía: los formularios y la cuarentena. Además lee
 * `convocatorias`, que es pública. En las tablas con datos de personas la base solo le
 * concede INSERT (supabase/migrations/*_formularios.sql y *_cuarentena.sql), así
 * que aunque alguien cometa un error aquí, con esta clave no se puede leer ninguna solicitud.
 * Por eso cada inserción va SIN `.select()`: pedir la fila de vuelta exigiría un permiso de
 * lectura que no tiene, y que no debe tener.
 *
 * La bandeja del panel NUNCA usa este cliente: usa `clienteServidor()`, con la sesión de quien
 * navega, para que la RLS decida.
 *
 * `server-only` hace fallar el build si un componente de cliente lo importa.
 */
export function clienteServicio() {
  const clave = process.env.SUPABASE_SECRET_KEY;
  if (!clave) {
    throw new Error("Falta la variable de entorno SUPABASE_SECRET_KEY. Ver .env.example.");
  }
  return createClient(urlSupabase(), clave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

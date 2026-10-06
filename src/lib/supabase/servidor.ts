import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { clavePublicable, urlSupabase } from "./entorno";

/**
 * Cliente con la sesión de quien navega, leída de sus cookies. Usa la clave publicable: la RLS
 * se aplica, y una administradora sin el segundo factor verificado no ve nada.
 *
 * Uno nuevo por petición (lo exige @supabase/ssr para entregar bien las cabeceras de caché).
 */
export async function clienteServidor() {
  const almacen = await cookies();

  return createServerClient(urlSupabase(), clavePublicable(), {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (aPoner) => {
        try {
          aPoner.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          // Un Server Component no puede escribir cookies; las Server Actions sí. No se pierde
          // nada: src/proxy.ts ya refrescó la sesión antes de que la página se renderizara.
          // (Es el patrón documentado de Supabase para Next.js, no un error tragado.)
        }
      },
    },
  });
}

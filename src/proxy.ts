import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { clavePublicable, urlSupabase } from "@/lib/supabase/entorno";

/**
 * Proxy (en Next.js 16 ya no se llama middleware). Solo corre en /panel.
 *
 * Su único trabajo es REFRESCAR la sesión: los Server Components no pueden escribir cookies,
 * así que el token renovado se escribe aquí. NO decide quién entra: eso lo hace
 * `exigirAdmin()` en cada página y en cada Server Action del panel, porque una Server Action
 * fuera de este matcher no pasaría por aquí (node_modules/next/dist/docs, proxy.md).
 */
export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient(urlSupabase(), clavePublicable(), {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (aPoner, cabeceras) => {
        aPoner.forEach(({ name, value }) => request.cookies.set(name, value));
        respuesta = NextResponse.next({ request });
        aPoner.forEach(({ name, value, options }) =>
          respuesta.cookies.set(name, value, options),
        );
        // Cache-Control: no-store. Sin esto, un CDN podría servir el token de una persona
        // a otra (advertencia de @supabase/ssr).
        Object.entries(cabeceras).forEach(([clave, valor]) =>
          respuesta.headers.set(clave, valor),
        );
      },
    },
  });

  // Verifica la firma y renueva el token si hace falta. Se llama antes de devolver nada.
  await supabase.auth.getClaims();

  return respuesta;
}

export const config = {
  matcher: ["/panel/:path*"],
};
